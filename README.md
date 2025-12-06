<div align="center">

# 🛡️ Guardian-H

### Your AI Agent's Memory System | نظام ذاكرة الوكيل الذكي

<img src="assets/logo.png" alt="Guardian-H Logo" width="200"/>

**It discovers your project. It remembers everything. You never repeat yourself.**

**يكتشف مشروعك. يتذكر كل شيء. لا تكرر نفسك أبداً.**

[![npm version](https://img.shields.io/npm/v/guardian-h.svg)](https://www.npmjs.com/package/guardian-h)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[🌐 Web Generator](https://haithamhaj.github.io/guardian-h/) | [📚 Docs](docs/) | [🇸🇦 العربية](#arabic)

</div>

---

## 🌟 What's New in v6.1

| Feature | Description |
|---------|-------------|
| ✅ **No Python Required** | Pure JavaScript scanner - works anywhere Node.js runs |
| 🌐 **3 Installation Methods** | npx, Bash script, or Web generator |
| 🧠 **AI Thinking Rules** | Built-in guidelines for better agent decisions |
| 📐 **Code Principles** | 18+ principles for Performance, Extensibility, Simplicity |
| 🗺️ **Navigability Rules** | File structure guidelines for AI agents |
| 🔌 **MCP Server** | Model Context Protocol integration |

---

## 😤 The Problem

You're building with AI agents (Cursor, Windsurf, Copilot, Claude) and this keeps happening:

```
You: "Change the button color"
Agent: Creates 3 new files, refactors everything

You: "Fix the login bug"  
Agent: Uses port 3000 (yours is 8765)

You: "Add a toast message"
Agent: Suggests Vue (you use React)
```

**Result:** Hours wasted. Code breaks. Frustration builds.

---

## 💡 The Solution

**Guardian creates a project snapshot that any AI agent can understand.**

```
✅ Discovers your tech stack automatically
✅ Maps all files and their functions
✅ Tracks connections between services
✅ Remembers locked decisions
✅ Prevents duplicate files
✅ Guides agent thinking and code quality
```

---

## 🚀 Installation (Choose Your Method)

### ⚡ Method 1: npx (Recommended)
```bash
npx guardian-h
```
**Requirements:** Node.js

---

### 🐧 Method 2: Bash Script (No Node.js needed!)
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```
**Requirements:** Terminal only (Mac/Linux)

---

### 🌐 Method 3: Web Generator (No installation!)

**[👉 Open Web Generator](https://haithamhaj.github.io/guardian-h/)**

1. Fill in your project info
2. Download the file
3. Place it in your IDE's rules folder

**Requirements:** Just a browser!

---

## 📁 What It Creates

Guardian generates a compact, AI-optimized snapshot:

```yaml
# 🛡️ my-project GUARDIAN

## 📋 RULES (Decision Table)
| Action | Check | Do |
|--------|-------|-----|
| Create file | FILES has similar? | → ASK user first |
| Modify file | In DANGER? | → WARN before proceed |
| Change config | In LOCKED? | → STOP, ask approval |

## 🏗️ TECH_STACK
frontend: React
backend: FastAPI
database: SQLite

## 📂 FILES
src/App.jsx: main-app
api/main.py: server-entry

## 🧠 THINKING
problem_solving:
  1: Read error → Trace flow → Find root cause
  2: One change → Test → Confirm → Show proof
```

---

## 🤖 IDE Support

| IDE | File Location | Auto-detected |
|-----|---------------|---------------|
| **Cursor** | `.cursor/rules/guardian.mdc` | ✅ |
| **Windsurf** | `.windsurf/rules/guardian.md` | ✅ |
| **VS Code + Copilot** | `.github/copilot-instructions.md` | ✅ |
| **Claude Code** | `CLAUDE.md` | ✅ |
| **Other** | `guardian.mdc` (root) | - |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [WORKFLOW.md](docs/WORKFLOW.md) | 5-phase problem-solving workflow |
| [CODE_PRINCIPLES.md](docs/CODE_PRINCIPLES.md) | 18+ code quality principles |
| [THINKING_PATTERNS.md](docs/THINKING_PATTERNS.md) | 12 thinking patterns for debugging |
| [INSTALL.md](INSTALL.md) | Detailed installation guide |
| [FAQ.md](docs/FAQ.md) | Frequently asked questions |

---

## 🔌 MCP Server (Advanced)

Guardian includes a Model Context Protocol server for deep integration:

```json
{
  "guardian": {
    "command": "python3",
    "args": ["/path/to/src/guardian_mcp.py"]
  }
}
```

**Available Tools:**
- `guardian_read_memory` - Read project context
- `guardian_classify_change` - Classify change type
- `guardian_get_tech_stack` - Get tech stack
- `guardian_get_file_map` - Get file structure
- `guardian_log_change` - Log changes

---

## 🔄 Updating

Re-scan your project after major changes:

```bash
# Using npx
npx guardian-h

# Using Bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```

---

<a name="arabic"></a>
# 🇸🇦 التوثيق العربي

## 🌟 الجديد في الإصدار 6.1

| الميزة | الوصف |
|--------|-------|
| ✅ **لا يحتاج Python** | ماسح JavaScript نقي - يعمل في أي مكان |
| 🌐 **3 طرق للتثبيت** | npx أو Bash أو صفحة ويب |
| 🧠 **قواعد تفكير الوكيل** | إرشادات مدمجة لقرارات أفضل |
| 📐 **مبادئ الكود** | 18+ مبدأ للأداء والتطوير والبساطة |
| 🔌 **خادم MCP** | تكامل مع Model Context Protocol |

---

## 🚀 التثبيت

### ⚡ الطريقة 1: npx (الموصى بها)
```bash
npx guardian-h
```

### 🐧 الطريقة 2: سكربت Bash (لا يحتاج Node.js!)
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```

### 🌐 الطريقة 3: مولد الويب (لا يحتاج تثبيت!)

**[👉 افتح مولد الويب](https://haithamhaj.github.io/guardian-h/)**

---

## 📚 التوثيق

| الملف | الوصف |
|-------|-------|
| [WORKFLOW.md](docs/WORKFLOW.md) | سير عمل حل المشكلات |
| [CODE_PRINCIPLES.md](docs/CODE_PRINCIPLES.md) | مبادئ جودة الكود |
| [THINKING_PATTERNS.md](docs/THINKING_PATTERNS.md) | أنماط التفكير للتصحيح |
| [INSTALL.md](INSTALL.md) | دليل التثبيت التفصيلي |

---

<div align="center">

## 🤝 Contributing | المساهمة

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License | الرخصة

MIT - Use it, modify it, ship it.

---

## ⭐ Star History

If Guardian-H helps you, give it a ⭐!

إذا ساعدك Guardian-H، أعطه ⭐!

---

**🛡️ Guardian-H v6.1**

*Discover. Remember. Protect.*

*اكتشف. تذكّر. احمِ.*

---

<img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="Made with love"/>

**A Product by [Imperfect Success](https://imperfectsuccess.com)**

</div>
