#!/bin/bash
# 🛡️ Guardian Installer
# Run this in your project folder to install Guardian

echo "🛡️ Installing Project Guardian..."

# Check if we're in a project directory
if [ ! -d ".git" ] && [ ! -f "package.json" ] && [ ! -f "requirements.txt" ]; then
    echo "⚠️  Warning: This doesn't look like a project folder."
    echo "   Make sure you're in your project's root directory."
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Download Guardian
GUARDIAN_URL="https://raw.githubusercontent.com/Haithamhaj/guardian-h/main"

echo "📥 Downloading Guardian scanner..."
mkdir -p .guardian
curl -sL "$GUARDIAN_URL/src/guardian_scanner.py" -o .guardian/scanner.py
curl -sL "$GUARDIAN_URL/templates/guardian.mdc" -o .guardian/template.mdc

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "❌ Python3 غير مثبت على جهازك"
    echo ""
    echo "💡 لتثبيت Python:"
    echo "   - Mac: brew install python3"
    echo "   - Windows: قم بتحميله من python.org"
    echo "   - Linux: sudo apt install python3"
    echo ""
    echo "بعد التثبيت، أعد تشغيل هذا الأمر."
    rm -rf .guardian
    exit 1
fi

# Run the scanner
echo "🔍 Scanning your project..."
python3 .guardian/scanner.py "$(pwd)"

# Detect IDE and move file
if [ -d ".cursor" ]; then
    echo "📁 Detected Cursor IDE"
    mkdir -p .cursor/rules
    mv guardian.mdc .cursor/rules/
    echo "✅ Installed to: .cursor/rules/guardian.mdc"
elif [ -d ".windsurf" ]; then
    echo "📁 Detected Windsurf"
    mkdir -p .windsurf/rules
    mv guardian.mdc .windsurf/rules/guardian.md
    echo "✅ Installed to: .windsurf/rules/guardian.md"
elif [ -d ".vscode" ]; then
    echo "📁 Detected VS Code"
    mkdir -p .github
    mv guardian.mdc .github/copilot-instructions.md
    echo "✅ Installed to: .github/copilot-instructions.md"
else
    echo "📁 No IDE detected, keeping guardian.mdc in root"
    echo "✅ Installed to: guardian.mdc"
fi

# Cleanup
rm -rf .guardian

echo ""
echo "🛡️ Guardian installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Open your project in your IDE"
echo "  2. Start a new chat with your AI agent"
echo "  3. The agent will automatically read the Guardian file"
echo ""
