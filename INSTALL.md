# 🛡️ Guardian-H Installation Guide

> **اختر الطريقة التي تناسبك!**
> Choose the method that works for you!

---

## ⚡ Method 1: Node.js (npx)
**المتطلبات:** Node.js فقط

```bash
npx guardian-h
```

✅ الأسرع والأكثر اكتمالاً
✅ يكتشف Tech Stack تلقائياً
✅ يستخرج الدوال من الكود

---

## 🐧 Method 2: Bash Script (Mac/Linux)
**المتطلبات:** Terminal فقط (لا Node.js، لا Python)

```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```

أو للتحميل أولاً:
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

✅ يعمل على أي Mac/Linux
✅ لا يحتاج أي تثبيت مسبق

---

## 🌐 Method 3: Web Generator
**المتطلبات:** متصفح فقط

1. افتح: **https://haithamhaj.github.io/guardian-h/**
2. أدخل معلومات مشروعك
3. حمّل الملف
4. انقله للمجلد الصحيح

✅ يعمل على أي جهاز
✅ لا يحتاج Terminal
✅ مثالي للمبتدئين

---

## 📁 Where to Put the File?

| IDE | المسار |
|-----|--------|
| **Cursor** | `.cursor/rules/guardian.mdc` |
| **Windsurf** | `.windsurf/rules/guardian.md` |
| **VS Code / Copilot** | `.github/copilot-instructions.md` |
| **Claude Code** | `CLAUDE.md` |
| **Other** | `guardian.mdc` (root) |

---

## 🔄 Updating

لتحديث الملف بعد تغييرات كبيرة:

```bash
# Node.js
npx guardian-h

# أو Bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/guardian-h/main/install.sh | bash
```

---

## 💡 Tips

1. **شغّل في مجلد المشروع الرئيسي** (حيث يوجد package.json أو requirements.txt)
2. **أضف للـ .gitignore** إذا لا تريد مشاركته:
   ```
   .cursor/rules/guardian.mdc
   ```
3. **حدّث بعد كل milestone** كبير في المشروع

---

## ❓ Problems?

- **"Command not found"** → تأكد أن Node.js مثبت: `node --version`
- **"Permission denied"** → استخدم `chmod +x` للسكربت
- **"Empty files"** → تأكد أنك في مجلد المشروع الصحيح

📚 المزيد: https://github.com/Haithamhaj/guardian-h
