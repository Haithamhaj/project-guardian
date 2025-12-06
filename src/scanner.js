#!/usr/bin/env node
/**
 * 🛡️ Guardian Scanner (JavaScript)
 * Pure JavaScript scanner - no Python required!
 * Scans a project and generates a guardian.mdc snapshot.
 */

const fs = require('fs');
const path = require('path');

class GuardianScanner {
    // Folders to skip
    static SKIP_DIRS = new Set([
        'node_modules', '__pycache__', '.git', '.venv', 'venv',
        'dist', 'build', '.next', '.cache', 'coverage', '.pytest_cache',
        '.cursor', '.windsurf', '.idea', '.vscode', '.guardian'
    ]);

    // Code files (analyzed for functions)
    static CODE_EXTENSIONS = new Set([
        '.py', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
        '.java', '.kt', '.swift', '.go', '.rs', '.rb', '.php',
        '.c', '.cpp', '.h', '.hpp', '.cs'
    ]);

    // Config files
    static CONFIG_EXTENSIONS = new Set([
        '.json', '.yaml', '.yml', '.toml', '.ini', '.cfg',
        '.env', '.gitignore', '.dockerignore', '.prettierrc', '.eslintrc'
    ]);

    // Documentation files
    static DOC_EXTENSIONS = new Set(['.md', '.mdx', '.txt', '.rst']);

    // Style files
    static STYLE_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less']);

    // Data files
    static DATA_EXTENSIONS = new Set(['.sql', '.csv', '.xml', '.html', '.svg']);

    // Binary files (skip content reading)
    static BINARY_EXTENSIONS = new Set([
        '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp',
        '.mp3', '.mp4', '.wav', '.avi', '.mov',
        '.pdf', '.zip', '.tar', '.gz', '.rar',
        '.exe', '.dll', '.so', '.dylib',
        '.woff', '.woff2', '.ttf', '.eot',
        '.db', '.sqlite', '.sqlite3'
    ]);

    constructor(projectPath, scanAll = true) {
        this.projectPath = path.resolve(projectPath);
        this.projectName = path.basename(this.projectPath);
        this.scanAll = scanAll;
        this.snapshot = {
            identity: {},
            tech_stack: {},
            dependencies: { frontend: {}, backend: {} },
            env_vars: { required: [], optional: [] },
            files: {},
            files_by_category: {
                code: {}, config: {}, docs: {}, styles: {}, data: {}, other: {}
            },
            connections: {},
            run: {},
            locked: [],
            danger: [],
            issues: [],
            changes: []
        };
    }

    scan() {
        console.log(`🔍 Scanning: ${this.projectPath}`);

        this._detectIdentity();
        this._detectTechStack();
        this._detectDependencies();
        this._detectEnvVars();
        this._scanFiles();
        this._detectConnections();
        this._detectRunCommands();

        return this.snapshot;
    }

    _detectIdentity() {
        this.snapshot.identity = {
            name: this.projectName,
            purpose: this._guessPurpose(),
            status: 'development'
        };
    }

    _guessPurpose() {
        const readmePath = path.join(this.projectPath, 'README.md');
        if (fs.existsSync(readmePath)) {
            try {
                const content = fs.readFileSync(readmePath, 'utf8').slice(0, 500);
                const lines = content.split('\n');
                for (const line of lines.slice(1)) {
                    if (line.trim() && !line.startsWith('#')) {
                        return line.trim().slice(0, 100);
                    }
                }
            } catch (e) { }
        }
        return '{{ONE_LINE_PURPOSE}}';
    }

    _detectTechStack() {
        const stack = {};

        // Check package.json for frontend (Node.js projects)
        const pkgPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };

                // Frontend framework
                if (deps.react) stack.frontend = `React ${deps.react.replace(/[\^~]/g, '')}`;
                else if (deps.vue) stack.frontend = `Vue ${deps.vue.replace(/[\^~]/g, '')}`;
                else if (deps.svelte) stack.frontend = 'Svelte';
                else if (deps.next) stack.frontend = 'Next.js';

                // Styling
                if (deps.tailwindcss) stack.styling = 'Tailwind CSS';
                else if (deps['styled-components']) stack.styling = 'Styled Components';

                // Electron
                if (deps.electron) {
                    stack.frontend = (stack.frontend || '') + ' + Electron';
                }
            } catch (e) { }
        }

        // ====================================
        // READ ALL DEPENDENCIES - NO FILTERING
        // Guardian-H = Memory layer, not opinions
        // ====================================

        // Python dependency files
        const pythonDepFiles = [
            'requirements.txt',
            'requirements-dev.txt',
            'requirements_dev.txt',
            'requirements.in',
            'dev-requirements.txt'
        ];

        const pythonDeps = [];
        for (const depFile of pythonDepFiles) {
            const depPath = path.join(this.projectPath, depFile);
            if (fs.existsSync(depPath)) {
                try {
                    const content = fs.readFileSync(depPath, 'utf8');
                    for (const line of content.split('\n')) {
                        const trimmed = line.trim();
                        // Skip comments and empty lines
                        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
                            pythonDeps.push(trimmed);
                        }
                    }
                    stack.source_file = depFile;
                } catch (e) { }
            }
        }

        // pyproject.toml
        const pyprojectPath = path.join(this.projectPath, 'pyproject.toml');
        if (fs.existsSync(pyprojectPath)) {
            try {
                const content = fs.readFileSync(pyprojectPath, 'utf8');
                // Extract dependencies from pyproject.toml
                const depMatch = content.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
                if (depMatch) {
                    const deps = depMatch[1].match(/"([^"]+)"/g);
                    if (deps) {
                        deps.forEach(d => pythonDeps.push(d.replace(/"/g, '')));
                    }
                }
                if (!stack.source_file) stack.source_file = 'pyproject.toml';
            } catch (e) { }
        }

        if (pythonDeps.length > 0) {
            stack.language = 'Python';
            stack.dependencies = pythonDeps.slice(0, 50); // Limit to 50
        }

        // Node.js dependencies (already in package.json detection above)
        // Just mark if it's a Node project
        if (Object.keys(stack).length === 0 || stack.frontend) {
            // Already detected from package.json
        }

        // Check for database files (just note they exist)
        const dbFiles = [
            ...this._findFiles(this.projectPath, '.db'),
            ...this._findFiles(this.projectPath, '.sqlite'),
            ...this._findFiles(this.projectPath, '.sqlite3')
        ];
        if (dbFiles.length > 0) {
            stack.has_database = true;
        }

        this.snapshot.tech_stack = stack;
    }

    _detectDependencies() {
        // Frontend deps
        const pkgPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const deps = pkg.dependencies || {};
                const important = ['react', 'vue', 'next', 'electron', 'tailwindcss',
                    'typescript', 'vite', 'webpack', 'express'];
                for (const dep of important) {
                    if (deps[dep]) {
                        this.snapshot.dependencies.frontend[dep] = deps[dep].replace(/[\^~]/g, '');
                    }
                }
            } catch (e) { }
        }

        // Backend deps
        const reqPath = path.join(this.projectPath, 'requirements.txt');
        if (fs.existsSync(reqPath)) {
            try {
                const content = fs.readFileSync(reqPath, 'utf8');
                for (const line of content.split('\n')) {
                    if (line.includes('==')) {
                        const [name, version] = line.split('==');
                        this.snapshot.dependencies.backend[name.trim()] = version.trim();
                    } else if (line.trim() && !line.startsWith('#')) {
                        this.snapshot.dependencies.backend[line.trim()] = 'latest';
                    }
                }
            } catch (e) { }
        }
    }

    _detectEnvVars() {
        const envFiles = ['.env.example', '.env.sample'];
        for (const envFile of envFiles) {
            const envPath = path.join(this.projectPath, envFile);
            if (fs.existsSync(envPath)) {
                try {
                    const content = fs.readFileSync(envPath, 'utf8');
                    for (const line of content.split('\n')) {
                        if (line.includes('=') && !line.startsWith('#')) {
                            const varName = line.split('=')[0].trim();
                            this.snapshot.env_vars.required.push({
                                name: varName,
                                description: 'TODO: add description'
                            });
                        }
                    }
                } catch (e) { }
                break;
            }
        }
    }

    _scanFiles() {
        console.log('📂 Phase 1: Scanning priority files...');

        const allFiles = this._getAllFiles(this.projectPath);

        for (const filePath of allFiles) {
            const relPath = path.relative(this.projectPath, filePath);
            const ext = path.extname(filePath).toLowerCase();

            let category = 'other';
            let purpose = 'other';
            let functions = [];

            if (GuardianScanner.CODE_EXTENSIONS.has(ext)) {
                category = 'code';
                purpose = this._inferPurpose(filePath);
                functions = this._extractFunctions(filePath);
            } else if (GuardianScanner.CONFIG_EXTENSIONS.has(ext)) {
                category = 'config';
                purpose = this._inferConfigPurpose(filePath);
            } else if (GuardianScanner.DOC_EXTENSIONS.has(ext)) {
                category = 'docs';
                purpose = 'documentation';
            } else if (GuardianScanner.STYLE_EXTENSIONS.has(ext)) {
                category = 'styles';
                purpose = 'styling';
            } else if (GuardianScanner.DATA_EXTENSIONS.has(ext)) {
                category = 'data';
                purpose = 'data';
            } else if (GuardianScanner.BINARY_EXTENSIONS.has(ext)) {
                category = 'other';
                purpose = `asset (${ext})`;
            }

            const fileInfo = { purpose, functions, category };
            this.snapshot.files[relPath] = fileInfo;
            this.snapshot.files_by_category[category][relPath] = fileInfo;
        }

        console.log(`   ✅ Total files scanned: ${Object.keys(this.snapshot.files).length}`);
    }

    _getAllFiles(dir, files = []) {
        try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                if (GuardianScanner.SKIP_DIRS.has(item)) continue;

                const fullPath = path.join(dir, item);
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        this._getAllFiles(fullPath, files);
                    } else if (stat.isFile()) {
                        files.push(fullPath);
                    }
                } catch (e) { }
            }
        } catch (e) { }
        return files;
    }

    _findFiles(dir, extension) {
        const results = [];
        const files = this._getAllFiles(dir);
        for (const f of files) {
            if (f.endsWith(extension)) results.push(f);
        }
        return results;
    }

    _inferPurpose(filePath) {
        const name = path.basename(filePath, path.extname(filePath)).toLowerCase();
        const parent = path.basename(path.dirname(filePath)).toLowerCase();

        const patterns = {
            components: '-ui', component: '-ui',
            hooks: '-logic', hook: '-logic',
            pages: '-page', views: '-page',
            routes: '-endpoints', api: '-endpoints',
            services: '-service', service: '-service',
            utils: '-utils', helpers: '-utils', lib: '-utils',
            models: '-model', model: '-model'
        };

        if (patterns[parent]) return `${name}${patterns[parent]}`;
        if (['main', 'app', 'index', 'server'].includes(name)) return 'entry-point';

        return name;
    }

    _inferConfigPurpose(filePath) {
        const name = path.basename(filePath).toLowerCase();

        if (name.includes('package.json')) return 'npm-config';
        if (name.includes('tsconfig')) return 'typescript-config';
        if (name.includes('eslint')) return 'linting-config';
        if (name.includes('prettier')) return 'formatting-config';
        if (name.includes('docker')) return 'docker-config';
        if (name.includes('env')) return 'environment-vars';
        if (name.includes('gitignore')) return 'git-ignore';
        if (name.includes('requirements')) return 'python-deps';
        if (name.includes('pyproject')) return 'python-project';

        return 'config';
    }

    _extractFunctions(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const functions = [];

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            if (ext === '.py') {
                // Python: regex for function definitions
                const patterns = [
                    /^def\s+(\w+)\s*\(/gm,
                    /^async\s+def\s+(\w+)\s*\(/gm
                ];
                for (const pattern of patterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        if (!match[1].startsWith('_')) {
                            functions.push(match[1]);
                        }
                    }
                }
            } else if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
                // JavaScript/TypeScript
                const patterns = [
                    /(?:function|const|let|var)\s+(\w+)\s*(?:=\s*(?:async\s*)?\(|=\s*(?:async\s*)?function|\()/g,
                    /(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/g,
                    /export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)/g
                ];
                const found = new Set();
                for (const pattern of patterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const name = match[1];
                        if (name && !name.startsWith('_') &&
                            !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
                            found.add(name);
                        }
                    }
                }
                functions.push(...found);
            }
        } catch (e) { }

        return functions.slice(0, 10); // Limit to 10
    }

    _detectConnections() {
        const connections = {};
        const portPatterns = [
            /port["']?\s*[=:]\s*(\d{4,5})/gi,
            /localhost:(\d{4,5})/gi,
            /127\.0\.0\.1:(\d{4,5})/gi,
            /PORT\s*=\s*(\d{4,5})/gi
        ];

        const files = this._getAllFiles(this.projectPath);
        for (const filePath of files) {
            const ext = path.extname(filePath).toLowerCase();
            if (!['.py', '.js', '.ts', '.env', '.json'].includes(ext)) continue;

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                for (const pattern of portPatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const port = parseInt(match[1]);
                        if (port >= 1000 && port <= 65535) {
                            connections[port] = path.relative(this.projectPath, filePath);
                        }
                    }
                }
            } catch (e) { }
        }

        this.snapshot.connections = connections;
    }

    _detectRunCommands() {
        const run = {};

        // Check package.json scripts
        const pkgPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const scripts = pkg.scripts || {};

                if (scripts.dev) run.frontend = 'npm run dev';
                else if (scripts.start) run.frontend = 'npm start';

                if (scripts.test) run.test_frontend = 'npm test';
            } catch (e) { }
        }

        // Check for Python backend
        const reqPath = path.join(this.projectPath, 'requirements.txt');
        if (fs.existsSync(reqPath)) {
            const mainPy = path.join(this.projectPath, 'main.py');
            const apiMain = path.join(this.projectPath, 'api', 'main.py');

            if (fs.existsSync(apiMain)) {
                run.backend = 'cd api && uvicorn main:app --reload';
            } else if (fs.existsSync(mainPy)) {
                run.backend = 'uvicorn main:app --reload';
            }
        }

        this.snapshot.run = run;
    }

    generateLiteMdc() {
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

        // Build tech stack
        const techStr = Object.entries(this.snapshot.tech_stack)
            .map(([k, v]) => `  ${k}: ${v}`)
            .join('\n') || '  # Not detected';

        // Build files (compact, limit to 50)
        const filesArr = Object.entries(this.snapshot.files).slice(0, 50);
        const filesStr = filesArr
            .map(([path, info]) => `  ${path}: ${info.purpose}`)
            .join('\n') || '  # No files detected';

        // Build connections
        const connStr = Object.entries(this.snapshot.connections)
            .map(([port, file]) => `  port_${port}: ${file}`)
            .join('\n') || '  # No connections detected';

        return `---
description: 🛡️ GUARDIAN - Read BEFORE any action
globs: **/*
alwaysApply: true
---

# 🛡️ ${this.snapshot.identity.name} GUARDIAN
> Auto-synced: ${timestamp}

---

## 📋 RULES (Decision Table)

| Action | Check | Do |
|--------|-------|-----|
| Create file | \`FILES\` has similar? | → ASK user first |
| Modify file | In \`DANGER\`? | → WARN before proceed |
| Change config | In \`LOCKED\`? | → STOP, ask approval |
| Any change | - | → TEST then UPDATE |

---

## ⚡ QUICK_RULES
\`\`\`yaml
before_action:
  1: Read this file
  2: Check FILES section
  3: Check DANGER section
  4: If unclear → ASK user

after_action:
  1: Test the change
  2: Update CHANGES section
  3: Show proof of success
\`\`\`

---

## 🏗️ TECH_STACK
\`\`\`yaml
# ❌ DO NOT SUGGEST ALTERNATIVES
${techStr}
\`\`\`

---

## 📂 FILES
\`\`\`yaml
# CHECK before creating
${filesStr}
\`\`\`

---

## 🔌 CONNECTIONS
\`\`\`yaml
${connStr}
\`\`\`

---

## 🔒 LOCKED
\`\`\`yaml
# CANNOT change without user approval
  # Add locked decisions here
\`\`\`

---

## ⚠️ DANGER
\`\`\`yaml
# WARN before touching
  # Add dangerous files here
\`\`\`

---

## 📝 CHANGES
\`\`\`yaml
- ${timestamp}: Initial Guardian scan
\`\`\`

---

## 🧠 THINKING
\`\`\`yaml
problem_solving:
  1: Read error → Trace flow → Find root cause
  2: Check FILES → Check DANGER → Design solution
  3: One change → Test → Confirm → Show proof

code_quality:
  performance: Measure first, optimize later
  extensibility: Small functions, DI
  simplicity: KISS, YAGNI, DRY
  structure:
    - Modularize: File < 300 lines, Func < 50 lines
    - Anchors: Use docstrings & regions
    - Naming: Descriptive filenames

if_confused: ASK "هل تقصد X أم Y؟"
\`\`\`
`;
    }

    save(outputPath = null) {
        if (!outputPath) {
            outputPath = path.join(this.projectPath, 'guardian.mdc');
        }

        const content = this.generateLiteMdc();
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log(`✅ Saved: ${outputPath}`);
        return outputPath;
    }
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    const projectPath = args[0] || '.';
    const outputPath = args[1] || null;

    const scanner = new GuardianScanner(projectPath);
    scanner.scan();
    const result = scanner.save(outputPath);
    console.log(`\n🛡️ Guardian snapshot generated: ${result}`);
}

module.exports = { GuardianScanner };
