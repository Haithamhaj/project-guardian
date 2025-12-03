<div align="center">

<img src="assets/logo.png" alt="Imperfect Success" width="300"/>

# 🛡️ Project Guardian

### Make Your AI Agent Actually Remember

**Stop repeating yourself. Start shipping faster.**

*No Medals. Just Real Progress.*

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://imperfectsuccess.com)

---

</div>

## 😤 The Problem

You're building with AI agents (Cursor, Windsurf, Copilot...) and this keeps happening:

| What You Say | What Happens |
|--------------|--------------|
| "We decided to use React" | Agent suggests Vue next session |
| "The server runs on port 8000" | Agent tries port 3000 |
| "Don't create new files there" | Agent creates files there |
| "It's working now" | It's not actually working |
| "Remember we discussed..." | Agent remembers nothing |

**You spend more time re-explaining than building.**

---

## ✨ The Solution

Project Guardian gives your AI agent:

| Feature | What It Does |
|---------|--------------|
| **Persistent Memory** | Locked decisions that never change |
| **Project Structure** | Always knows where files go |
| **Debug Vision** | Reads diagnostic reports, finds real problems |
| **Self-Updating Docs** | Documentation that stays current |

---

## 🚀 Quick Start

### The Magic Way (30 seconds)

Just tell your AI agent:

```
Install Project Guardian from: github.com/YOUR_USERNAME/project-guardian
```

**That's it.** The agent reads `AGENT_INSTALL.md` and does everything automatically.

---

### Manual Installation

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/project-guardian.git

# 2. Copy to your project
cp -r project-guardian/templates/* /your/project/

# 3. For Cursor: move the rules file
mkdir -p /your/project/.cursor/rules
mv /your/project/guardian.mdc /your/project/.cursor/rules/

# 4. Create reports folder (important for macOS)
mkdir -p ~/Desktop/guardian-reports
```

---

## 📁 What's Included

```
project-guardian/
├── AGENT_INSTALL.md          # Instructions for AI agents (the magic!)
├── templates/
│   ├── guardian.mdc          # The brain - rules & memory
│   └── developer-toolkit/    # Debug tools
│       ├── diagnostics.js    # System checker
│       ├── logger.js         # Event logger
│       ├── networkMonitor.js # API monitor
│       └── ToolkitView.jsx   # UI component (React)
├── docs/
│   └── customization.md      # How to customize
└── examples/
    └── react-fastapi.mdc     # Ready-to-use example
```

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   You: "Fix the login bug"                              │
│                          ↓                              │
│   ┌─────────────────────────────────────────────────┐   │
│   │            🛡️ Project Guardian                  │   │
│   │                                                 │   │
│   │   guardian.mdc:                                 │   │
│   │   • Tech stack: React + FastAPI ← locked        │   │
│   │   • File structure: defined                     │   │
│   │   • Past decisions: remembered                  │   │
│   │                                                 │   │
│   │   diagnostic report:                            │   │
│   │   • API endpoint failing ← found                │   │
│   │   • Suggested fix: check auth header            │   │
│   └─────────────────────────────────────────────────┘   │
│                          ↓                              │
│   Agent: *fixes the actual problem*                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Customization

Edit `guardian.mdc` to match your project:

```yaml
# Lock your tech stack
Frontend: 
  Framework: React        # Your choice
  UI: Tailwind            # Your choice

Backend:
  Framework: FastAPI      # Your choice
  Database: PostgreSQL    # Your choice
```

See [customization guide](docs/customization.md) for detailed instructions.

---

## 💡 Pro Tips

### 1. Run Diagnostics Before Asking for Fixes

```
"Read ~/Desktop/guardian-reports/latest-diagnostic.json 
 and fix what you find"
```

### 2. Lock Important Decisions

Add to guardian.mdc:
```markdown
| Date | Decision | Reason | Locked? |
|------|----------|--------|---------|
| 2024-12 | Use TypeScript | Type safety | 🔒 Yes |
```

### 3. Keep File Tree Updated

When the agent adds files, remind it:
```
"Update the file tree in guardian.mdc"
```

---

## 🤝 Works With

| IDE/Tool | Status | Config Location |
|----------|--------|-----------------|
| Cursor | ✅ Full Support | `.cursor/rules/guardian.mdc` |
| Windsurf | ✅ Full Support | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | ✅ Full Support | `.github/copilot-instructions.md` |
| Claude Code | ✅ Full Support | `CLAUDE.md` |
| Aider | ✅ Full Support | `CONVENTIONS.md` |

---

## 📊 Results

Users report:

| Metric | Before | After |
|--------|--------|-------|
| Re-explaining context | Every session | Once |
| Wrong tech suggestions | Frequent | Never |
| Debug time | Hours | Minutes |
| Agent "forgetting" | Always | Never |

---

## 🗺️ Roadmap

- [x] Core guardian.mdc template
- [x] Developer Toolkit (diagnostics)
- [x] Agent auto-installer
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

*Stop re-explaining. Start building.*

[⭐ Star this repo](../../) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues)

---

<img src="assets/logo.png" alt="Imperfect Success" width="150"/>

**A Product by [Imperfect Success](https://imperfectsuccess.com)**

*No Medals. Just Real Progress.*

</div>
