# 🛡️ Project Guardian - Smart Installation Protocol

> **FOR AI AGENTS ONLY** - Follow these steps precisely.
> This creates a self-enforcing system that keeps you aligned with the project.

---

## 🎯 INSTALLATION GOAL

Create a `guardian.mdc` file that:
1. You will read on EVERY user request
2. Auto-updates when you make changes
3. Prevents mistakes and forgotten context

---

## 📋 STEP 1: AUTO-DETECT ENVIRONMENT

### 1.1 Detect IDE (check in order):

```bash
# Check which IDE/tool is being used:
if [ -d ".cursor" ]; then
    IDE="cursor"
    RULES_PATH=".cursor/rules/guardian.mdc"
elif [ -d ".windsurf" ]; then
    IDE="windsurf"  
    RULES_PATH=".windsurf/rules/guardian.md"
elif [ -d ".vscode" ]; then
    IDE="vscode"
    RULES_PATH=".github/copilot-instructions.md"
else
    IDE="unknown"
    RULES_PATH="CLAUDE.md"  # Default for Claude Code/other
fi
```

**If auto-detect fails, ask:**
> Which IDE are you using?
> 1. Cursor
> 2. Windsurf
> 3. VS Code + Copilot
> 4. Claude Code
> 5. Other (specify)

### 1.2 Detect Project Type (check files):

```bash
# Frontend detection:
if [ -f "package.json" ]; then
    # Check for framework
    grep -q "react" package.json && FRONTEND="React"
    grep -q "vue" package.json && FRONTEND="Vue"
    grep -q "angular" package.json && FRONTEND="Angular"
    grep -q "next" package.json && FRONTEND="Next.js"
    grep -q "svelte" package.json && FRONTEND="Svelte"
fi

# Backend detection:
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    grep -q "fastapi" requirements.txt && BACKEND="FastAPI"
    grep -q "django" requirements.txt && BACKEND="Django"
    grep -q "flask" requirements.txt && BACKEND="Flask"
fi

if [ -f "package.json" ]; then
    grep -q "express" package.json && BACKEND="Express.js"
fi
```

**After detection, CONFIRM with user:**
> I detected:
> - Frontend: [detected or "Not detected"]
> - Backend: [detected or "Not detected"]
> - Database: [detected or "Not detected"]
> 
> Is this correct? Any additions?

---

## 📋 STEP 2: SCAN PROJECT STRUCTURE

### 2.1 Build File Tree Automatically:

```bash
# Generate current structure (exclude node_modules, .git, etc.)
find . -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/__pycache__/*" \
    -not -path "*/venv/*" \
    -not -path "*/.next/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    | head -50
```

### 2.2 Identify Key Folders:

Look for and categorize:

| Pattern | Category | Example |
|---------|----------|---------|
| `src/components/` or `components/` | Components | React/Vue components |
| `src/pages/` or `pages/` or `views/` | Pages | Route pages |
| `api/` or `server/` or `backend/` | Backend | API code |
| `src/utils/` or `lib/` or `helpers/` | Utilities | Helper functions |
| `public/` or `static/` or `assets/` | Static | Images, fonts |
| `tests/` or `__tests__/` or `spec/` | Tests | Test files |

### 2.3 Ask for Clarification ONLY if needed:

> I found these main folders:
> - `src/` - Frontend code
> - `api/` - Backend code
> - `public/` - Static files
>
> Are there any other important folders I should know about?

---

## 📋 STEP 3: GATHER CRITICAL DECISIONS

Ask these questions (only if not auto-detected):

### 3.1 Technology Decisions:

> What technologies should I NEVER suggest changing? 
> (These will be locked permanently)
>
> Example answer: "React, FastAPI, PostgreSQL"

### 3.2 Forbidden Technologies:

> Any technologies you specifically DON'T want me to suggest?
>
> Example answer: "No Vue, no Django, no MongoDB"

### 3.3 Run Commands:

> How do I run this project?
>
> Example: "npm run dev" or "python main.py"

---

## 📋 STEP 4: CREATE GUARDIAN FILE

### 4.1 Create Rules Directory:

```bash
# Based on detected IDE:
mkdir -p [RULES_PATH_DIRECTORY]
```

### 4.2 Generate guardian.mdc:

**Use the template from `/templates/guardian.mdc` and fill in:**

| Placeholder | Replace With |
|-------------|--------------|
| `{{FRONTEND}}` | Detected/confirmed frontend |
| `{{BACKEND}}` | Detected/confirmed backend |
| `{{DATABASE}}` | Detected/confirmed database |
| `{{PROJECT_ROOT}}` | Current directory name |
| `{{FOLDER_1}}`, etc. | Detected folders |
| `{{RUN_COMMAND}}` | User-provided run command |
| `{{TIMESTAMP}}` | Current ISO timestamp |
| `{{FORBIDDEN_TECH}}` | User-specified forbidden tech |

### 4.3 File Tree Format:

Generate a clean, readable tree:

```
project-name/
│
├── 📂 src/                    # Frontend source
│   ├── 📂 components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   ├── 📂 pages/              # Page components
│   │   ├── Home.jsx
│   │   └── ...
│   └── 📂 utils/              # Helper functions
│       └── api.js
│
├── 📂 api/                    # Backend source
│   ├── main.py
│   └── routes/
│       └── ...
│
└── 📄 Configuration
    ├── package.json
    ├── requirements.txt
    └── ...
```

---

## 📋 STEP 5: CREATE REPORTS DIRECTORY

```bash
# Create reports folder (Desktop for macOS permissions)
mkdir -p ~/Desktop/guardian-reports
```

---

## 📋 STEP 6: VERIFY INSTALLATION

### Checklist before completing:

```
□ guardian.mdc created in correct location?
□ All placeholders replaced with real values?
□ File tree matches actual project structure?
□ Technology stack confirmed with user?
□ Reports directory created?
□ Run command is correct?
```

---

## 📋 STEP 7: FINAL MESSAGE TO USER

After successful installation, tell the user:

```
✅ Project Guardian installed successfully!

📁 Configuration: [path to guardian.mdc]
📊 Reports folder: ~/Desktop/guardian-reports/

🔒 Locked technologies:
   • Frontend: [tech]
   • Backend: [tech]
   • Database: [tech]

🎯 What this means for you:
   • I'll remember your project structure
   • I won't suggest changing your tech stack
   • I'll check before creating new files
   • I'll be honest when I'm not sure something works

💡 Pro tip: If something breaks, run diagnostics and tell me:
   "Read the debug report and fix what you find"
```

---

## 🔧 TROUBLESHOOTING

### "Permission denied" on macOS:
```bash
# Reports go to Desktop (has write permissions)
mkdir -p ~/Desktop/guardian-reports
chmod 755 ~/Desktop/guardian-reports
```

### "File not being read by IDE":
- Cursor: Must be in `.cursor/rules/`
- Windsurf: Must be `.md` not `.mdc`
- VS Code: Must be `.github/copilot-instructions.md`

### "User wants to update Guardian":
```bash
# Re-run installation, keeping existing decisions
# Ask: "Keep existing locked technologies? (Y/n)"
```

---

## 📊 INSTALLATION SUMMARY

| Step | Action | Automated? |
|------|--------|------------|
| 1 | Detect IDE | ✅ Yes |
| 2 | Detect tech stack | ✅ Yes (confirm with user) |
| 3 | Scan file structure | ✅ Yes |
| 4 | Get decisions | ❓ Ask only if needed |
| 5 | Create guardian.mdc | ✅ Yes |
| 6 | Create reports dir | ✅ Yes |
| 7 | Verify & confirm | ✅ Yes |

**Total user questions: 2-4 maximum**
(Only what can't be auto-detected)

---

*🛡️ Project Guardian - Smart Installation*
*A Product by Imperfect Success*
