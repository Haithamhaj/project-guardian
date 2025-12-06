# 🛡️ Guardian v4 - Quick Start

## Installation

```bash
# Clone the repository
git clone https://github.com/Haithamhaj/project-guardian.git

# Navigate to your project
cd /your/project

# Run the scanner
python /path/to/project-guardian/src/guardian_scanner.py .
```

## Usage

### 1. Scan Your Project

```bash
python guardian_scanner.py /path/to/your/project
```

This creates a `guardian.mdc` file with:
- 📋 Project identity
- 🔧 Tech stack
- 📦 Dependencies
- 🔐 Environment variables
- 📂 File registry with functions
- 🔗 Connections and ports
- ⚡ Run commands

### 2. Move to IDE Location

```bash
# Cursor
mkdir -p .cursor/rules && mv guardian.mdc .cursor/rules/

# Windsurf
mkdir -p .windsurf/rules && mv guardian.mdc .windsurf/rules/guardian.md

# VS Code + Copilot
mkdir -p .github && mv guardian.mdc .github/copilot-instructions.md

# Claude Code
mv guardian.mdc CLAUDE.md
```

### 3. Agent Rules

The agent automatically:
- ✅ Reads the snapshot before any action
- ✅ Checks for existing files before creating
- ✅ Respects locked decisions
- ✅ Updates the snapshot after changes

## MCP Integration

```python
from guardian_mcp import classify_change, get_project_memory

# Classify a user request
result = classify_change("غير لون الزر للأزرق")
# Returns: {'classification': 'PURE_UI_STYLE', 'rules': [...]}

# Get project memory
memory = get_project_memory("/path/to/project")
# Returns: {'tech_stack': {...}, 'files': {...}, 'locked': [...]}
```

## Auto-Sync

The scanner can be run:
- **Manually**: `python guardian_scanner.py .`
- **Git Hook**: Add to `.git/hooks/pre-commit`
- **File Watcher**: Use with nodemon/watchdog
