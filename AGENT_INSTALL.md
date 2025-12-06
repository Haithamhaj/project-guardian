# 🛡️ Guardian Installation - For AI Agents
# تثبيت Guardian - للوكلاء الذكيين

> **Your job:** Discover the project, build its memory, stay out of the way.
> 
> **مهمتك:** اكتشف المشروع، ابنِ ذاكرته، ابتعد عن الطريق.

---

## 📋 INSTALLATION STEPS | خطوات التثبيت

### STEP 1: Detect IDE | اكتشف الـ IDE

```bash
# Check which exists:
.cursor/         → TARGET: .cursor/rules/guardian.mdc
.windsurf/       → TARGET: .windsurf/rules/guardian.md
.vscode/         → TARGET: .github/copilot-instructions.md
none             → TARGET: CLAUDE.md (root)
```

---

### STEP 2: Download Scanner | حمّل الماسح

```bash
curl -sL https://raw.githubusercontent.com/Haithamhaj/project-guardian/main/src/guardian_scanner.py -o /tmp/guardian_scanner.py
```

Or use the embedded scanner below.
أو استخدم الماسح المضمّن أدناه.

---

### STEP 3: Run Scanner | شغّل الماسح

```bash
python3 /tmp/guardian_scanner.py "$(pwd)"
```

This creates `guardian.mdc` with:
- Project identity | هوية المشروع
- Tech stack | التقنيات
- File registry | سجل الملفات
- Connections | الاتصالات
- Run commands | أوامر التشغيل

---

### STEP 4: Move to Target | انقل للموقع

```bash
# Based on IDE detected in Step 1:
# Cursor:
mkdir -p .cursor/rules && mv guardian.mdc .cursor/rules/

# Windsurf:
mkdir -p .windsurf/rules && mv guardian.mdc .windsurf/rules/guardian.md

# VS Code:
mkdir -p .github && mv guardian.mdc .github/copilot-instructions.md

# Claude:
mv guardian.mdc CLAUDE.md
```

---

### STEP 5: Confirm | تأكيد

Tell the user:
أخبر المستخدم:

```
✅ Guardian installed!
✅ تم تثبيت Guardian!

📍 Location: [TARGET path]
📍 المكان: [مسار الملف]

🔍 Discovered:
   - Stack: [technologies]
   - Files: [X] code files indexed
   - Connections: [ports found]

🔍 اُكتشف:
   - التقنيات: [technologies]
   - الملفات: [X] ملف مفهرس
   - الاتصالات: [ports found]
```

---

## 🤖 AGENT RULES | قواعد الوكيل

### Before ANY Code Change | قبل أي تعديل:

```
1. READ Guardian snapshot | اقرأ الـ snapshot
2. CHECK FILES section - does similar exist? | هل يوجد ملف مشابه؟
3. CHECK LOCKED - am I violating any? | هل أخالف قرار مُقفل؟
4. CHECK DANGER - is this risky? | هل هذا خطر؟
```

### Before Creating File | قبل إنشاء ملف:

```
1. Search FILES section for same purpose
   ابحث في قسم FILES عن نفس الغرض

2. If found, ask: "تعديل الموجود أم إنشاء جديد؟"
   "Modify existing or create new?"

3. Use correct folder based on existing pattern
   استخدم المجلد الصحيح
```

### After ANY Change | بعد أي تعديل:

```
1. UPDATE FILES if new file created | حدّث FILES
2. UPDATE CHANGES section | حدّث CHANGES
3. UPDATE ISSUES if bug fixed | حدّث ISSUES
```

---

## ❌ WHAT NOT TO DO | ما لا يجب فعله

```
❌ Don't suggest alternative technologies
   لا تقترح تقنيات بديلة

❌ Don't change locked decisions
   لا تغير القرارات المُقفلة

❌ Don't create duplicate files
   لا تنشئ ملفات مكررة

❌ Don't modify DANGER files without warning
   لا تعدل ملفات DANGER بدون تحذير

❌ Don't start servers on different ports
   لا تشغّل سيرفرات على ports مختلفة
```

---

## 🔄 UPDATE SNAPSHOT | تحديث الـ Snapshot

When asked to update Guardian:

```bash
python3 /tmp/guardian_scanner.py "$(pwd)"
# Then move to correct location as in Step 4
```

---

## 📁 EMBEDDED SCANNER | الماسح المضمّن

If curl is not available, create this file:

```python
# Save as guardian_scanner.py and run with: python3 guardian_scanner.py .
# [Scanner code available at: src/guardian_scanner.py]
```

---

*🛡️ Guardian v4 - Discover. Remember. Protect.*
*🛡️ Guardian v4 - اكتشف. تذكّر. احمِ.*
