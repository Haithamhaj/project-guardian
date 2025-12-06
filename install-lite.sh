#!/bin/bash
# 🛡️ Guardian-H Lite Installer
# Works on Mac/Linux without Node.js or Python
# Usage: curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install-lite.sh | bash

set -e

echo ""
echo "🛡️ Guardian-H Lite Installer"
echo "   ✅ No Node.js or Python required!"
echo ""

PROJECT_DIR="$(pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Check if this looks like a project
if [ ! -d ".git" ] && [ ! -f "package.json" ] && [ ! -f "requirements.txt" ]; then
    echo "⚠️  Warning: This doesn't look like a project folder."
    echo "   Make sure you're in your project's root directory."
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔍 Scanning: $PROJECT_DIR"

# Detect Tech Stack
TECH_STACK=""

# Check package.json
if [ -f "package.json" ]; then
    if grep -q '"react"' package.json 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  frontend: React"
    elif grep -q '"vue"' package.json 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  frontend: Vue"
    elif grep -q '"svelte"' package.json 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  frontend: Svelte"
    fi
    if grep -q '"next"' package.json 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  framework: Next.js"
    fi
    if grep -q '"tailwindcss"' package.json 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  styling: Tailwind CSS"
    fi
fi

# Check requirements.txt
if [ -f "requirements.txt" ]; then
    if grep -qi 'fastapi' requirements.txt 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  backend: FastAPI"
    elif grep -qi 'django' requirements.txt 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  backend: Django"
    elif grep -qi 'flask' requirements.txt 2>/dev/null; then
        TECH_STACK="$TECH_STACK\n  backend: Flask"
    fi
fi

# Check for database
if find . -name "*.db" -o -name "*.sqlite" 2>/dev/null | grep -q .; then
    TECH_STACK="$TECH_STACK\n  database: SQLite"
fi

if [ -z "$TECH_STACK" ]; then
    TECH_STACK="  # Not detected - please fill in"
fi

# Count files
echo "📂 Scanning files..."
FILE_COUNT=0
FILES_SECTION=""

# Scan code files
for ext in py js jsx ts tsx vue svelte go rs rb php java kt swift; do
    while IFS= read -r -d '' file; do
        REL_PATH="${file#./}"
        BASENAME=$(basename "$REL_PATH" | cut -d. -f1)
        FILES_SECTION="$FILES_SECTION\n  $REL_PATH: $BASENAME"
        ((FILE_COUNT++)) || true
    done < <(find . -name "*.$ext" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/__pycache__/*" -not -path "*/venv/*" -not -path "*/.venv/*" -print0 2>/dev/null)
done

# Scan config files
for file in package.json requirements.txt pyproject.toml tsconfig.json; do
    if [ -f "$file" ]; then
        FILES_SECTION="$FILES_SECTION\n  $file: config"
        ((FILE_COUNT++)) || true
    fi
done

if [ -z "$FILES_SECTION" ]; then
    FILES_SECTION="  # No files detected"
fi

echo "   ✅ Found $FILE_COUNT files"

# Create guardian.mdc
cat > guardian.mdc << EOF
---
description: 🛡️ GUARDIAN - Read BEFORE any action
globs: **/*
alwaysApply: true
---

# 🛡️ $PROJECT_NAME GUARDIAN
> Auto-synced: $TIMESTAMP

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
$(echo -e "$TECH_STACK")
\`\`\`

---

## 📂 FILES
\`\`\`yaml
# CHECK before creating
$(echo -e "$FILES_SECTION")
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
- $TIMESTAMP: Initial Guardian scan
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

if_confused: ASK "هل تقصد X أم Y؟"
\`\`\`
EOF

# Detect IDE and move file
DEST_PATH="guardian.mdc"
DEST_NAME="guardian.mdc"

if [ -d ".cursor" ]; then
    echo "📁 Detected: Cursor IDE"
    mkdir -p .cursor/rules
    mv guardian.mdc .cursor/rules/guardian.mdc
    DEST_NAME=".cursor/rules/guardian.mdc"
elif [ -d ".windsurf" ]; then
    echo "📁 Detected: Windsurf"
    mkdir -p .windsurf/rules
    mv guardian.mdc .windsurf/rules/guardian.md
    DEST_NAME=".windsurf/rules/guardian.md"
elif [ -d ".vscode" ]; then
    echo "📁 Detected: VS Code / Copilot"
    mkdir -p .github
    mv guardian.mdc .github/copilot-instructions.md
    DEST_NAME=".github/copilot-instructions.md"
fi

echo ""
echo "✅ Guardian installed to: $DEST_NAME"
echo "   📂 Files scanned: $FILE_COUNT"
echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Open your project in your IDE"
echo "  2. Start a new chat with your AI agent"
echo "  3. The agent will automatically read Guardian"
echo ""
