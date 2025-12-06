#!/usr/bin/env node

/**
 * 🛡️ Guardian CLI
 * Creates a Guardian snapshot for your project
 * ✅ Pure JavaScript - No Python required!
 * 
 * Usage: npx guardian-h
 */

const fs = require('fs');
const path = require('path');

// Import the JS scanner
const { GuardianScanner } = require('../src/scanner.js');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

async function main() {
  log('\n🛡️ Guardian-H - Project Memory System\n', 'cyan');
  log('   ✅ Pure JavaScript - No Python required!\n', 'green');

  const projectPath = process.cwd();

  // Check if this looks like a project
  const hasPackageJson = fs.existsSync(path.join(projectPath, 'package.json'));
  const hasRequirements = fs.existsSync(path.join(projectPath, 'requirements.txt'));
  const hasGit = fs.existsSync(path.join(projectPath, '.git'));
  const hasPyproject = fs.existsSync(path.join(projectPath, 'pyproject.toml'));

  if (!hasPackageJson && !hasRequirements && !hasGit && !hasPyproject) {
    log('⚠️  Warning: This doesn\'t look like a project folder.', 'yellow');
    log('   Make sure you\'re in your project\'s root directory.\n', 'yellow');
  }

  log('🔍 Scanning your project...', 'blue');

  // Run the scanner
  const scanner = new GuardianScanner(projectPath);
  const snapshot = scanner.scan();

  // Generate and save the MDC file
  const guardianContent = scanner.generateMdc();
  const guardianFile = path.join(projectPath, 'guardian.mdc');

  // Detect IDE and determine destination
  let destPath = guardianFile;
  let destName = 'guardian.mdc';

  if (fs.existsSync(path.join(projectPath, '.cursor'))) {
    const rulesDir = path.join(projectPath, '.cursor', 'rules');
    if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });
    destPath = path.join(rulesDir, 'guardian.mdc');
    destName = '.cursor/rules/guardian.mdc';
    log('📁 Detected: Cursor IDE', 'blue');
  } else if (fs.existsSync(path.join(projectPath, '.windsurf'))) {
    const rulesDir = path.join(projectPath, '.windsurf', 'rules');
    if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });
    destPath = path.join(rulesDir, 'guardian.md');
    destName = '.windsurf/rules/guardian.md';
    log('📁 Detected: Windsurf', 'blue');
  } else if (fs.existsSync(path.join(projectPath, '.vscode'))) {
    const githubDir = path.join(projectPath, '.github');
    if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
    destPath = path.join(githubDir, 'copilot-instructions.md');
    destName = '.github/copilot-instructions.md';
    log('📁 Detected: VS Code / Copilot', 'blue');
  } else if (fs.existsSync(path.join(projectPath, 'CLAUDE.md')) ||
    fs.existsSync(path.join(projectPath, '.claude'))) {
    destPath = path.join(projectPath, 'CLAUDE.md');
    destName = 'CLAUDE.md';
    log('📁 Detected: Claude Code', 'blue');
  }

  // Write the file
  fs.writeFileSync(destPath, guardianContent, 'utf8');

  // Show summary
  const fileCount = Object.keys(snapshot.files).length;
  const techCount = Object.keys(snapshot.tech_stack).length;

  log(`\n✅ Guardian installed to: ${destName}`, 'green');
  log(`   📂 Files scanned: ${fileCount}`, 'reset');
  log(`   🏗️  Tech detected: ${techCount > 0 ? Object.values(snapshot.tech_stack).join(', ') : 'None'}`, 'reset');

  log('\n🎉 Installation complete!\n', 'green');
  log('Next steps:', 'cyan');
  log('  1. Open your project in your IDE');
  log('  2. Start a new chat with your AI agent');
  log('  3. The agent will automatically read Guardian\n');

  log('📚 Documentation:', 'cyan');
  log('   https://github.com/Haithamhaj/guardian-h\n');
}

main().catch((err) => {
  log(`\n❌ Error: ${err.message}`, 'red');
  log('\n💡 If this problem persists:', 'yellow');
  log('   - Make sure you\'re in a project directory');
  log('   - Check: https://github.com/Haithamhaj/guardian-h/issues\n');
  process.exit(1);
});
