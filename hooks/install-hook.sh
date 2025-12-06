#!/bin/bash
# 🛡️ Guardian Hook Installer
# Installs the pre-commit hook in your project

echo "🛡️ Installing Guardian Git Hook..."

# Check if in a git repo
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Run this from your project root."
    exit 1
fi

# Create hooks directory if needed
mkdir -p .git/hooks

# Download the pre-commit hook
HOOK_URL="https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/hooks/pre-commit"
curl -sL "$HOOK_URL" -o .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

echo "✅ Guardian hook installed!"
echo ""
echo "Now guardian.mdc will update automatically before each commit."
echo ""
