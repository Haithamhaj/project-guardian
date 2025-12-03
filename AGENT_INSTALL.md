# 🛡️ Project Guardian - Agent Installation Guide

> **This file is for AI Agents (Cursor, Windsurf, Claude, Copilot, etc.)**
> 
> If you are an AI agent, follow these instructions precisely.

---

## 📋 Overview

**Project Guardian** helps you as an agent to:
- Understand projects quickly
- Remember past decisions
- Read diagnostic reports
- Avoid repeating mistakes

---

## 🚀 Installation Steps

### Step 1: Identify the Environment

Ask the user (if not specified):
```
What IDE are you using?
1. Cursor
2. Windsurf  
3. VS Code + Copilot
4. Claude Code
5. Other
```

### Step 2: Identify Project Path

```bash
# Identify project root
PROJECT_ROOT="/path/to/project"  # Ask user if unknown
```

### Step 3: Create Required Directories

```bash
# For reports (critical for macOS permissions)
mkdir -p ~/Desktop/guardian-reports

# Based on IDE:
# Cursor:
mkdir -p $PROJECT_ROOT/.cursor/rules

# Windsurf:
mkdir -p $PROJECT_ROOT/.windsurf/rules

# VS Code:
mkdir -p $PROJECT_ROOT/.github

# Claude Code:
# File goes in project root directly
```

### Step 4: Download and Install Files

**From GitHub:**
```bash
# Method 1: Full clone
git clone https://github.com/USERNAME/project-guardian.git /tmp/guardian
cp -r /tmp/guardian/templates/* $PROJECT_ROOT/

# Method 2: Specific files (if curl available)
curl -o guardian.mdc https://raw.githubusercontent.com/USERNAME/project-guardian/main/templates/guardian.mdc
```

**File Distribution:**

| File | Cursor | Windsurf | VS Code | Claude Code |
|------|--------|----------|---------|-------------|
| guardian.mdc | `.cursor/rules/` | `.windsurf/rules/guardian.md` | `.github/copilot-instructions.md` | `CLAUDE.md` |
| developer-toolkit/* | `src/developer-toolkit/` | `src/developer-toolkit/` | `src/developer-toolkit/` | `src/developer-toolkit/` |

### Step 5: Customize guardian.mdc

**Critical!** Modify the file for the specific project:

```markdown
# In "Technology Stack" section:
Frontend: [Ask user]
Backend: [Ask user]
Database: [Ask user]

# In "Project Structure" section:
[Analyze current project and document actual structure]

# In "Decision Log" section:
[Ask user about important past decisions]
```

### Step 6: Verify Installation

```bash
# Verify files exist
ls -la $PROJECT_ROOT/.cursor/rules/guardian.mdc  # or appropriate path
ls -la ~/Desktop/guardian-reports/

# Verify permissions
chmod 755 ~/Desktop/guardian-reports/
```

### Step 7: Notify User

After completion, tell the user:

```
✅ Project Guardian installed successfully!

📁 Installed Files:
   • [list files and locations]

📂 Reports Directory:
   • ~/Desktop/guardian-reports/

🎯 Next Steps:
   • Restart [IDE name]
   • Or start a new chat session

💡 For diagnostics:
   • Tell me "run diagnostics" and I'll check the project
```

---

## 📖 Using Guardian After Installation

### Reading Reports

When user asks for diagnosis or problem-solving:

```bash
# Read latest report
cat ~/Desktop/guardian-reports/latest-diagnostic.json

# Or the summary
cat ~/Desktop/guardian-reports/AGENT_SUMMARY.md
```

### Updating guardian.mdc

After every significant change, update:
- "Recent Changes" section
- "File Tree" section (if added/removed files)
- "Current Issues" section (if fixed a problem)

### Golden Rules

1. **Read guardian.mdc first** - Before any work
2. **Don't change locked technologies** - Never
3. **Read reports** - Before fixing problems
4. **Update the file** - After every change
5. **Ask before deleting** - Always

---

## 🔧 Developer Toolkit Integration

### For React/Electron Projects:

Add to `App.jsx` or `main.jsx`:

```javascript
// Import tools
import './developer-toolkit/diagnostics';
import './developer-toolkit/logger';
import './developer-toolkit/networkMonitor';

// Activate monitoring
if (window.networkMonitor) {
  window.networkMonitor.start();
}
```

### If User Wants UI:

Add route or tab for `ToolkitView.jsx`

---

## ❓ Troubleshooting for Agents

### "User says file not found"

```bash
# Check correct path
find $PROJECT_ROOT -name "guardian.mdc" 2>/dev/null
find $PROJECT_ROOT -name "guardian.md" 2>/dev/null
```

### "Reports not saving"

Usually macOS permissions issue:
```bash
# Ensure directory exists
mkdir -p ~/Desktop/guardian-reports
chmod 755 ~/Desktop/guardian-reports
```

### "User wants to update Guardian"

```bash
# Download latest version
curl -o /tmp/guardian.mdc https://raw.githubusercontent.com/USERNAME/project-guardian/main/templates/guardian.mdc

# Compare and show changes to user before updating
diff $PROJECT_ROOT/.cursor/rules/guardian.mdc /tmp/guardian.mdc
```

---

## 📊 Template Variables

When customizing guardian.mdc, replace these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name | MyApp |
| `{{FRONTEND_FRAMEWORK}}` | Frontend framework | React |
| `{{BACKEND_FRAMEWORK}}` | Backend framework | FastAPI |
| `{{DATABASE}}` | Database | PostgreSQL |
| `{{ENTRY_POINT}}` | Run command | `npm run dev` |
| `{{PROJECT_ROOT}}` | Project path | `/Users/john/myapp` |

---

## ✅ Agent Checklist

Before telling user installation is complete:

- [ ] guardian.mdc exists in correct location
- [ ] File is customized for project (not empty template)
- [ ] ~/Desktop/guardian-reports/ directory exists
- [ ] developer-toolkit copied (if requested)
- [ ] .gitignore includes guardian-reports/

---

## 🆘 If Everything Fails

Tell the user:

```
⚠️ Encountered difficulty with automatic installation.

Alternative solution:
1. Download files from: github.com/USERNAME/project-guardian
2. Copy them manually to your project
3. Come back and let me know

Or give me more permissions and I'll try again.
```

---

*🛡️ Project Guardian - Making AI Agents Remember*
*A Product by Imperfect Success | No Medals. Just Real Progress.*
