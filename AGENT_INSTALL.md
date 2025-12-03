# 🛡️ Guardian Installation - Smart Discovery

> **Your job:** Discover the project, build its memory, stay out of the way.
> **Not your job:** Force rules, impose structure, ask many questions.

---

## 🎯 PHILOSOPHY

```
Guardian is NOT a rulebook.
Guardian IS a memory system.

You don't tell the project what to be.
You discover what it is and remember it.
```

---

## 📋 INSTALLATION STEPS

### STEP 1: Discover IDE & Set Target File

```bash
# Check automatically, don't ask unless all fail:

.cursor/         → Cursor       → TARGET: .cursor/rules/guardian.mdc
.windsurf/       → Windsurf     → TARGET: .windsurf/rules/guardian.md  # Note: .md not .mdc
.vscode/         → VS Code      → TARGET: .github/copilot-instructions.md
none             → Claude/Other → TARGET: CLAUDE.md (root)
```

> **Important:** Save the TARGET path - you'll use it in STEP 6.
> Windsurf uses `.md` extension, others use `.mdc` or `.md` as shown.

---

### STEP 2: Discover Tech Stack (Silent)

> **Note:** Use these detection methods conceptually. If you can't run shell commands directly, replicate their behavior by reading the actual files.

```bash
# Frontend - check package.json:
"react" in dependencies      → React
"vue" in dependencies        → Vue
"angular" in dependencies    → Angular
"next" in dependencies       → Next.js
"svelte" in dependencies     → Svelte

# Backend - check requirements.txt OR package.json:
"fastapi" in requirements    → FastAPI
"django" in requirements     → Django
"flask" in requirements      → Flask
"express" in dependencies    → Express

# Database - check config files or imports:
*.db files exist             → SQLite
DATABASE_URL with postgres   → PostgreSQL
DATABASE_URL with mysql      → MySQL
"mongodb" in config          → MongoDB

# Styling - check config files:
tailwind.config exists       → Tailwind
"styled-components" in pkg   → Styled Components
*.scss files exist           → SASS
```

---

### STEP 3: Discover File Structure (Silent)

> **Note:** If you can't run `find`, manually browse the project folders, skipping `node_modules`, `.git`, `venv`, `__pycache__`, `.next`, `dist`, `build`.

**Identify these folders:**
- Where are components?
- Where are pages/views?
- Where is the API/backend?
- Where are utilities/helpers?
- What are the entry points?

---

### STEP 4: Discover Run Commands

**Check these sources:**

```
package.json → "scripts" section:
  - "dev", "start", "serve" = frontend
  - "server", "api" = backend

Python projects:
  - uvicorn main:app / python main.py / flask run

Docker:
  - docker-compose.yml exists = docker-compose up

Makefile:
  - make run / make dev
```

**If not obvious, ask ONE question:**
> "How do you run this project? (e.g., 'npm run dev' for frontend)"

---

### STEP 5: Discover Connections

**Find ports and connections:**

```
Check .env files for PORT variables
Check config files for localhost:XXXX
Check API client files for baseURL
Check WebSocket connections
```

---

### STEP 6: Build the Memory File

Fill the **TARGET file you identified in STEP 1** with discovered information.

Use the template structure below. Make sure these **exact section names** exist:

```markdown
## ⚡ HOW TO RUN
## ⚠️ RUNNING NOW
## 🔧 TECH STACK (Detected)
## 🗺️ FILE MAP
## 🔗 CONNECTIONS MAP
## 🔄 CHANGE MANAGEMENT
## 📝 RECENT CHANGES
## ⚠️ KNOWN ISSUES
## 🚫 THINGS THAT BREAK EASILY
```

**Example filled content:**

```markdown
## ⚡ HOW TO RUN
# Frontend:
npm run dev  →  runs on localhost:5173

# Backend:
uvicorn main:app --reload  →  runs on localhost:8000

## ⚠️ RUNNING NOW
| Service | Port | Status |
|---------|------|--------|
| Frontend | 5173 | 🔴 Stopped |
| Backend | 8000 | 🔴 Stopped |

## 🔧 TECH STACK (Detected)
Frontend: React 18       # from package.json
Backend:  FastAPI        # from requirements.txt
Database: SQLite         # from .db file found
Styling:  Tailwind       # from tailwind.config.js

## 🗺️ FILE MAP
[Actual structure discovered]

## 🔗 CONNECTIONS MAP
Frontend (:5173) → Backend (:8000/api)
```

---

### STEP 7: Create Reports Directory

```bash
mkdir -p ~/Desktop/guardian-reports
```

This folder will store debug reports from the Developer Toolkit.

---

### STEP 8: Confirm with User (Brief)

> ✅ Guardian installed!
> 
> **Memory file:** [TARGET path from STEP 1]
> 
> I discovered:
> - **Stack:** React + FastAPI + SQLite
> - **Frontend:** `npm run dev` → localhost:5173
> - **Backend:** `uvicorn main:app` → localhost:8000
> - **Structure:** [X] components, [X] pages, [X] API routes
> 
> Does this look right? Anything to add?

---

## 🔄 AFTER INSTALLATION

### Your ongoing job:

```
BEFORE every response:
1. Re-read relevant sections of the memory file
2. Check RUNNING NOW - what servers are active?
3. Check FILE MAP - where do things go?
4. Check CONNECTIONS MAP - what depends on what?

AFTER every change:
1. Update RECENT CHANGES
2. Update FILE MAP if structure changed
3. Update RUNNING NOW if server started/stopped
4. Update KNOWN ISSUES if bug found/fixed
```

### When user asks you to do something:

```
1. Read the memory file
2. Understand current state
3. Plan your action
4. Verify it won't break connections
5. Do the work
6. Update the memory file
7. Tell user what you did
```

---

## 🔧 Optional: Developer Toolkit

If the project uses React, consider adding the debug toolkit:

```
1. Copy `templates/developer-toolkit/` into the frontend src folder
2. Mount `ToolkitView` component on a route like `/dev-tools`
3. Add a "Save for AI" button that exports debug reports
4. Reports save to ~/Desktop/guardian-reports/
```

**This connects:**
- `guardian.mdc` = Project memory (structure, decisions)
- `Debug Report` = Runtime snapshot (errors, network, state)

When debugging, tell the agent:
> "Read ~/Desktop/guardian-reports/latest.json and fix what you find"

---

## ❌ WHAT NOT TO DO

```
❌ Don't ask many questions - discover silently
❌ Don't impose structure - document what exists
❌ Don't suggest tech changes - remember what's used
❌ Don't start servers without checking RUNNING NOW
❌ Don't create files without checking FILE MAP
❌ Don't guess - ask when unsure
```

---

## 🧠 REMEMBER

```
You have no memory between sessions.
The memory file IS your memory.

The user is non-technical.
They can't re-explain everything each time.

Your job is to:
- Remember for them
- Prevent your own mistakes
- Keep the project consistent
```

---

## 📁 File Naming Reference

| IDE | Target File |
|-----|-------------|
| Cursor | `.cursor/rules/guardian.mdc` |
| Windsurf | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |
| Aider | `CONVENTIONS.md` |
| Other | `PROJECT_MEMORY.md` |

---

*🛡️ Guardian v3 - Discover, Remember, Protect*
