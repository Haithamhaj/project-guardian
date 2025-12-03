<div align="center">

# 🛡️ Project Guardian

### Your AI Agent's Memory System

**It discovers your project. It remembers everything. You never repeat yourself.**

*No Medals. Just Real Progress.*

[[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://imperfectsuccess.com)

---

</div>

## 😤 The Problem

You're building with AI agents (Cursor, Windsurf, Copilot...) and this keeps happening:

```
You: "Change the button color"
Agent: Creates 3 new files, refactors the component structure, adds a theme system

You: "Fix the login bug"  
Agent: Starts a new server on port 3000 (yours runs on 8765)

You: "Add a toast message"
Agent: Forgets your tech stack, suggests Vue (you use React)

You: "Continue from yesterday"
Agent: "I don't have access to previous conversations"
```

**Result:** Hours wasted re-explaining. Code breaks. Frustration builds.

---

## 💡 The Solution

**Guardian is a memory system for your AI agent.**

```
It does NOT force rules.
It does NOT impose structure.
It does NOT require configuration.

It DISCOVERS your project automatically.
It REMEMBERS everything for the agent.
It PROTECTS your code from agent mistakes.
```

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. DISCOVERY (Automatic)                               │
│     Agent scans your project:                           │
│     • Tech stack from package.json, requirements.txt    │
│     • File structure from actual folders                │
│     • Run commands from scripts                         │
│     • Connections between frontend ↔ backend            │
│                                                         │
│  2. MEMORY (guardian.mdc)                               │
│     Everything saved in one file:                       │
│     • How to run the project                            │
│     • What servers are running (ports)                  │
│     • Where files should go                             │
│     • What breaks easily                                │
│                                                         │
│  3. PROTECTION (Every Request)                          │
│     Before ANY change, agent must:                      │
│     • Read the memory file                              │
│     • Classify the change type                          │
│     • Show what it will/won't touch                     │
│     • Wait for your "ok"                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### The Magic Way (30 seconds)

Just tell your AI agent:

```
Install Project Guardian from: github.com/Haithamhaj/project-guardian
```

**That's it.** The agent:
1. Reads `AGENT_INSTALL.md`
2. Scans your project automatically
3. Creates a memory file with everything it discovered
4. Asks you to confirm

**You answer 1-2 questions max.** Everything else is auto-detected.

---

### Manual Installation

```bash
# 1. Clone
git clone https://github.com/Haithamhaj/project-guardian.git

# 2. Copy template to your project
cp project-guardian/templates/guardian.mdc /your/project/

# 3. Move to correct location based on your IDE:

# Cursor:
mkdir -p .cursor/rules && mv guardian.mdc .cursor/rules/

# Windsurf:
mkdir -p .windsurf/rules && mv guardian.mdc .windsurf/rules/guardian.md

# VS Code + Copilot:
mkdir -p .github && mv guardian.mdc .github/copilot-instructions.md

# Claude Code:
mv guardian.mdc CLAUDE.md
```

---

## 📁 What's Included

```
project-guardian/
├── AGENT_INSTALL.md              # Smart installer for AI agents
├── templates/
│   ├── guardian.mdc              # Memory template
│   └── developer-toolkit/        # Debug tools (React)
│       ├── diagnostics.js
│       ├── logger.js
│       ├── networkMonitor.js
│       └── ToolkitView.jsx
├── examples/
│   ├── hva-project-memory.mdc    # Real-world example (filled)
│   └── react-fastapi.mdc         # React + FastAPI example
└── docs/
    └── customization.md
```

---

## 🔄 Change Management

Guardian classifies every change before executing:

| Type | What It Is | Agent Rules |
|------|------------|-------------|
| **PURE_UI_STYLE** | Colors, spacing, text | Touch CSS only. No new files. |
| **UI_BEHAVIOUR_TWEAK** | Button logic, toasts | Edit existing files. No new routes. |
| **NEW_FEATURE_FLOW** | New screens, features | Confirm design first. Update memory after. |

### Example:

```
You: "Make the button bigger"

Agent Response:
┌────────────────────────────────────────────────┐
│ You want to increase the button size.          │
│                                                │
│ Classification: PURE_UI_STYLE                  │
│ Files to modify: src/components/Button.jsx     │
│ Will NOT change: logic, hooks, other files     │
│                                                │
│ Can I proceed?                                 │
└────────────────────────────────────────────────┘
```

**No more surprise refactors. No more broken code.**

---

## 📊 What Guardian Tracks

| Section | Purpose |
|---------|---------|
| **HOW TO RUN** | Exact commands to start the project |
| **RUNNING NOW** | Which servers are active on which ports |
| **TECH STACK** | Detected technologies (don't suggest alternatives) |
| **FILE MAP** | Where every type of file should go |
| **CONNECTIONS MAP** | How frontend ↔ backend ↔ database connect |
| **CHANGE MANAGEMENT** | Rules for different types of changes |
| **RECENT CHANGES** | What was modified and when |
| **KNOWN ISSUES** | Current bugs to be aware of |
| **THINGS THAT BREAK** | Critical files/configs to protect |

---

## 🤝 Works With

| IDE/Tool | Config Location |
|----------|-----------------|
| Cursor | `.cursor/rules/guardian.mdc` |
| Windsurf | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |
| Aider | `CONVENTIONS.md` |

---

## 📈 Results

| Before Guardian | After Guardian |
|-----------------|----------------|
| Re-explain context every session | Explain once, remembered forever |
| Agent suggests wrong tech | Agent knows your stack |
| Surprise file creation | Agent asks before creating |
| Servers on wrong ports | Ports tracked and checked |
| "It's fixed!" (it's not) | Agent verifies before claiming done |
| 12 hours debugging agent mistakes | Minutes to implement features |

---

## 🗺️ Roadmap

- [x] Memory system (guardian.mdc)
- [x] Auto-discovery installation
- [x] Change Management classification
- [x] Developer Toolkit (diagnostics)
- [ ] Web configurator (guardian.dev)
- [ ] CLI tool (`npx create-guardian`)
- [ ] VS Code extension
- [ ] Multi-project support
- [ ] Team sync features

---

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

MIT - Use it, modify it, ship it.

---

<div align="center">

**🛡️ Project Guardian**

*Discover. Remember. Protect.*

[⭐ Star this repo](../../) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues)

---

**A Product by [Imperfect Success](https://imperfectsuccess.com)**

*No Medals. Just Real Progress.*

</div>
