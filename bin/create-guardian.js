#!/usr/bin/env node

/**
 * 🛡️ Guardian CLI
 * Creates a Guardian snapshot for your project
 * 
 * Usage: npx create-guardian
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function main() {
  log('\n🛡️ Guardian - Project Memory System\n', 'blue');
  
  const projectPath = process.cwd();
  const tempDir = path.join(projectPath, '.guardian-temp');
  
  // Check if this looks like a project
  const hasPackageJson = fs.existsSync(path.join(projectPath, 'package.json'));
  const hasRequirements = fs.existsSync(path.join(projectPath, 'requirements.txt'));
  const hasGit = fs.existsSync(path.join(projectPath, '.git'));
  
  if (!hasPackageJson && !hasRequirements && !hasGit) {
    log('⚠️  Warning: This doesn\'t look like a project folder.', 'yellow');
    log('   Make sure you\'re in your project\'s root directory.\n', 'yellow');
  }
  
  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  log('📥 Downloading Guardian scanner...', 'blue');
  
  const scannerUrl = 'https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/src/guardian_scanner.py';
  const scannerPath = path.join(tempDir, 'scanner.py');
  
  try {
    await downloadFile(scannerUrl, scannerPath);
  } catch (err) {
    log('❌ Failed to download scanner. Check your internet connection.', 'red');
    process.exit(1);
  }
  
  log('🔍 Scanning your project...', 'blue');
  
  // Check for Python
  let pythonCmd = 'python3';
  try {
    execSync('python3 --version', { stdio: 'ignore' });
  } catch {
    try {
      execSync('python --version', { stdio: 'ignore' });
      pythonCmd = 'python';
    } catch {
      log('❌ Python is not installed. Please install Python first.', 'red');
      log('   Visit: https://www.python.org/downloads/', 'yellow');
      process.exit(1);
    }
  }
  
  // Run scanner
  try {
    execSync(`${pythonCmd} "${scannerPath}" "${projectPath}"`, { 
      stdio: 'inherit',
      cwd: projectPath 
    });
  } catch (err) {
    log('❌ Failed to scan project.', 'red');
    process.exit(1);
  }
  
  // Detect IDE and move file
  const guardianFile = path.join(projectPath, 'guardian.mdc');
  
  if (fs.existsSync(guardianFile)) {
    let destPath = guardianFile;
    let destName = 'guardian.mdc';
    
    if (fs.existsSync(path.join(projectPath, '.cursor'))) {
      const rulesDir = path.join(projectPath, '.cursor', 'rules');
      if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });
      destPath = path.join(rulesDir, 'guardian.mdc');
      fs.renameSync(guardianFile, destPath);
      destName = '.cursor/rules/guardian.mdc';
    } else if (fs.existsSync(path.join(projectPath, '.windsurf'))) {
      const rulesDir = path.join(projectPath, '.windsurf', 'rules');
      if (!fs.existsSync(rulesDir)) fs.mkdirSync(rulesDir, { recursive: true });
      destPath = path.join(rulesDir, 'guardian.md');
      fs.renameSync(guardianFile, destPath);
      destName = '.windsurf/rules/guardian.md';
    } else if (fs.existsSync(path.join(projectPath, '.vscode'))) {
      const githubDir = path.join(projectPath, '.github');
      if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
      destPath = path.join(githubDir, 'copilot-instructions.md');
      fs.renameSync(guardianFile, destPath);
      destName = '.github/copilot-instructions.md';
    }
    
    log(`\n✅ Guardian installed to: ${destName}`, 'green');
  }
  
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  log('\n🎉 Installation complete!\n', 'green');
  log('Next steps:', 'blue');
  log('  1. Open your project in your IDE');
  log('  2. Start a new chat with your AI agent');
  log('  3. The agent will automatically read Guardian\n');
}

main().catch(console.error);
