<div align="center">

# 🛡️ Project Guardian

### Your AI Agent's Memory System | نظام ذاكرة الوكيل الذكي

**It discovers your project. It remembers everything. You never repeat yourself.**

**يكتشف مشروعك. يتذكر كل شيء. لا تكرر نفسك أبداً.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[English](#english) | [العربية](#arabic)

</div>

---

<a name="english"></a>
# 🇬🇧 English Documentation

## 😤 The Problem

You're building with AI agents (Cursor, Windsurf, Copilot...) and this keeps happening:

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
```

---

## 🚀 Installation

### Option 1: One Command
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/project-guardian/main/install.sh | bash
```

### Option 2: npx (after npm publish)
```bash
npx create-guardian
```

### Option 3: Tell Your Agent
```
Install Project Guardian from: github.com/Haithamhaj/project-guardian
```

---

## 📁 What It Creates

Guardian scans your project and creates a snapshot with:

| Section | Purpose |
|---------|---------|
| **IDENTITY** | Project name and purpose |
| **TECH_STACK** | Technologies used (don't suggest alternatives) |
| **DEPENDENCIES** | Package versions |
| **ENV_VARS** | Required environment variables |
| **FILES** | All files with their purposes and functions |
| **CONNECTIONS** | How services talk to each other |
| **RUN** | Exact commands to run the project |
| **LOCKED** | Decisions that cannot change |
| **DANGER** | Files that break easily |

---

## 🤖 How The Agent Uses It

Before ANY action, the agent:

1. ✅ Reads the Guardian snapshot
2. ✅ Checks if similar file exists
3. ✅ Respects locked decisions
4. ✅ Warns about danger zones
5. ✅ Updates snapshot after changes

---

## 📂 File Locations

| IDE | Location |
|-----|----------|
| Cursor | `.cursor/rules/guardian.mdc` |
| Windsurf | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |

---

## 🔄 Updating

Re-scan your project anytime:
```bash
python src/guardian_scanner.py .
```

Or tell your agent:
```
Update Guardian snapshot
```

---

<a name="arabic"></a>
# 🇸🇦 التوثيق العربي

## 😤 المشكلة

عندما تعمل مع وكلاء الذكاء الاصطناعي (Cursor, Windsurf, Copilot...)، هذا يحدث باستمرار:

```
أنت: "غيّر لون الزر"
الوكيل: ينشئ 3 ملفات جديدة ويعيد هيكلة كل شيء

أنت: "أصلح مشكلة تسجيل الدخول"
الوكيل: يستخدم port 3000 (مشروعك يستخدم 8765)

أنت: "أضف رسالة toast"
الوكيل: يقترح Vue (أنت تستخدم React)
```

**النتيجة:** ساعات ضائعة. الكود يتكسر. الإحباط يتراكم.

---

## 💡 الحل

**Guardian ينشئ صورة كاملة للمشروع يفهمها أي وكيل ذكاء اصطناعي.**

```
✅ يكتشف التقنيات المستخدمة تلقائياً
✅ يرسم خريطة لكل الملفات ووظائفها
✅ يتتبع الاتصالات بين الخدمات
✅ يتذكر القرارات المُقفلة
✅ يمنع تكرار الملفات
```

---

## 🚀 التثبيت

### الخيار 1: أمر واحد
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/project-guardian/main/install.sh | bash
```

### الخيار 2: npx (بعد النشر على npm)
```bash
npx create-guardian
```

### الخيار 3: قل للوكيل
```
Install Project Guardian from: github.com/Haithamhaj/project-guardian
```

---

## 📁 ماذا يُنشئ؟

Guardian يفحص مشروعك ويُنشئ snapshot يحتوي على:

| القسم | الغرض |
|-------|-------|
| **IDENTITY** | اسم المشروع والغرض منه |
| **TECH_STACK** | التقنيات المستخدمة (لا تقترح بدائل) |
| **DEPENDENCIES** | إصدارات الحزم |
| **ENV_VARS** | متغيرات البيئة المطلوبة |
| **FILES** | كل الملفات مع أغراضها ودوالها |
| **CONNECTIONS** | كيف تتواصل الخدمات مع بعضها |
| **RUN** | أوامر تشغيل المشروع بالضبط |
| **LOCKED** | قرارات لا يمكن تغييرها |
| **DANGER** | ملفات تتكسر بسهولة |

---

## 🤖 كيف يستخدمه الوكيل؟

قبل أي عمل، الوكيل:

1. ✅ يقرأ Guardian snapshot
2. ✅ يتحقق إذا كان ملف مشابه موجود
3. ✅ يحترم القرارات المُقفلة
4. ✅ يحذر من المناطق الخطرة
5. ✅ يُحدّث الـ snapshot بعد التغييرات

---

## 📂 مواقع الملفات

| IDE | المكان |
|-----|--------|
| Cursor | `.cursor/rules/guardian.mdc` |
| Windsurf | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |

---

## 🔄 التحديث

أعد فحص مشروعك في أي وقت:
```bash
python src/guardian_scanner.py .
```

أو أخبر الوكيل:
```
حدّث Guardian snapshot
```

---

<div align="center">

## 🤝 Contributing | المساهمة

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License | الرخصة

MIT - Use it, modify it, ship it.

---

**🛡️ Project Guardian**

*Discover. Remember. Protect.*

*اكتشف. تذكّر. احمِ.*

---

**A Product by [Imperfect Success](https://imperfectsuccess.com)**

</div>
