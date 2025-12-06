# 🛡️ Guardian - Easy Installation

## ⚡ الطريقة الأسهل (للمستخدم العادي)

### الخيار 1: أمر واحد فقط

افتح Terminal في مجلد مشروعك واكتب:

```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```

**هذا سيقوم بـ:**
1. تحميل Guardian
2. فحص مشروعك تلقائياً
3. إنشاء ملف guardian.mdc
4. وضعه في المكان الصحيح حسب IDE الخاص بك

---

### الخيار 2: قل للوكيل

افتح محادثة مع الوكيل (Cursor, Windsurf, إلخ) واكتب:

```
Install Guardian-H from: github.com/Haithamhaj/guardian-h
```

الوكيل سيقرأ AGENT_INSTALL.md ويثبت Guardian تلقائياً.

---

## 🔄 التحديث التلقائي

بعد التثبيت، لتحديث snapshot المشروع:

```bash
guardian-scan
```

أو أخبر الوكيل:
```
حدّث Guardian snapshot
```

---

## 📁 أين يوضع الملف؟

| IDE | المكان |
|-----|-------|
| Cursor | `.cursor/rules/guardian.mdc` |
| Windsurf | `.windsurf/rules/guardian.md` |
| VS Code + Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |

---

## ❓ مشاكل شائعة

### "Python غير موجود"
```bash
# Mac
brew install python3

# Windows
# حمّل من python.org
```

### "الملف لم يُنشأ"
تأكد أنك في مجلد المشروع الرئيسي (حيث يوجد package.json أو requirements.txt)

---

## 🎉 بعد التثبيت

1. افتح محادثة جديدة مع الوكيل
2. الوكيل سيقرأ Guardian تلقائياً
3. جرّب: "غير لون الزر" - سيُظهر لك التصنيف والملفات

---

*🛡️ Guardian - Discover. Remember. Protect.*
