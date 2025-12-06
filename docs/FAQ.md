# ❓ FAQ - Frequently Asked Questions
# الأسئلة الشائعة

[English](#english) | [العربية](#arabic)

---

<a name="english"></a>
## 🇬🇧 English

### Installation

**Q: How do I install Guardian?**
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/project-guardian/main/install.sh | bash
```

**Q: What if I don't have Python?**
- Mac: `brew install python3`
- Windows: Download from [python.org](https://python.org)

**Q: Where does the file go?**
- Cursor: `.cursor/rules/guardian.mdc`
- Windsurf: `.windsurf/rules/guardian.md`
- VS Code: `.github/copilot-instructions.md`

---

### Usage

**Q: How does the agent know to read it?**
The file location is automatically detected by your IDE. Start a new chat session after installation.

**Q: Do I need to update it manually?**
Run the scanner again when your project structure changes significantly:
```bash
python src/guardian_scanner.py .
```

**Q: What if the agent ignores it?**
1. Make sure the file is in the correct location
2. Start a new chat session
3. Check that `alwaysApply: true` is in the frontmatter

---

### Troubleshooting

**Q: Scanner didn't detect my tech stack**
Edit the guardian.mdc file manually and add your technologies.

**Q: Some files are missing from the registry**
The scanner only reads common code extensions (.py, .js, .jsx, .ts, .tsx). Add other files manually.

---

<a name="arabic"></a>
## 🇸🇦 العربية

### التثبيت

**س: كيف أثبّت Guardian؟**
```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/project-guardian/main/install.sh | bash
```

**س: ماذا لو لم يكن عندي Python؟**
- Mac: `brew install python3`
- Windows: حمّل من [python.org](https://python.org)

**س: أين يوضع الملف؟**
- Cursor: `.cursor/rules/guardian.mdc`
- Windsurf: `.windsurf/rules/guardian.md`
- VS Code: `.github/copilot-instructions.md`

---

### الاستخدام

**س: كيف يعرف الوكيل أن يقرأه؟**
موقع الملف يُكتشف تلقائياً من الـ IDE. ابدأ محادثة جديدة بعد التثبيت.

**س: هل أحتاج تحديثه يدوياً؟**
شغّل الماسح مرة أخرى عندما تتغير بنية مشروعك بشكل كبير:
```bash
python src/guardian_scanner.py .
```

**س: ماذا لو الوكيل تجاهله؟**
1. تأكد أن الملف في المكان الصحيح
2. ابدأ محادثة جديدة
3. تأكد أن `alwaysApply: true` موجودة

---

### حل المشاكل

**س: الماسح لم يكتشف التقنيات**
عدّل ملف guardian.mdc يدوياً وأضف التقنيات.

**س: بعض الملفات مفقودة من السجل**
الماسح يقرأ امتدادات الكود الشائعة فقط (.py, .js, .jsx, .ts, .tsx). أضف الملفات الأخرى يدوياً.

---

*🛡️ Guardian - More questions? Open an issue!*
*🛡️ Guardian - أسئلة أخرى؟ افتح issue!*
