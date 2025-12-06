# 🎯 Guardian Code Principles

> **الأهداف الثلاثة الأساسية لكتابة الكود:**
> 1. ⚡ **الأداء** - سريع وفعّال
> 2. 🔧 **قابل للتطوير** - سهل التغيير والبناء عليه
> 3. 📐 **بسيط ومباشر** - أسهل حل يعمل

---

## ⚡ PERFORMANCE (الأداء)

### P1: Measure First, Optimize Later
```
❌ WRONG: "هذا الكود بطيء، سأستخدم خوارزمية معقدة"
✅ RIGHT: "سأقيس الأداء أولاً، ثم أُحسّن إذا لزم"
```

### P2: Avoid Premature Optimization
```
❌ WRONG: تحسين كل سطر من البداية
✅ RIGHT: اجعله يعمل → قِس → حسّن الـ bottleneck فقط
```

### P3: Big O Awareness
```
O(1) > O(log n) > O(n) > O(n log n) > O(n²) > O(2ⁿ)

❌ WRONG: Loop داخل Loop بدون سبب
✅ RIGHT: استخدم HashMap للبحث السريع O(1)
```

### P4: Database Efficiency
```
❌ WRONG: Query داخل Loop = N queries
✅ RIGHT: Query واحد → Process في الذاكرة
```

### P5: Lazy Loading
```
❌ WRONG: تحميل كل البيانات مرة واحدة
✅ RIGHT: تحميل عند الحاجة فقط (pagination, lazy)
```

### P6: Caching
```
❌ WRONG: حساب نفس الشيء كل مرة
✅ RIGHT: احفظ النتيجة، أعد استخدامها
```

---

## 🔧 EXTENSIBILITY (قابلية التطوير)

### E1: Single Responsibility
```
❌ WRONG: دالة تفعل 10 أشياء
✅ RIGHT: كل دالة تفعل شيء واحد فقط

❌ WRONG: def process_and_save_and_notify_and_log():
✅ RIGHT: def process(): + def save(): + def notify():
```

### E2: Open/Closed Principle
```
❌ WRONG: تعديل الكود الموجود لإضافة feature
✅ RIGHT: Extension بدون تعديل الأصلي

# مثال: استخدم Strategy Pattern
class PaymentProcessor:
    def __init__(self, strategy):
        self.strategy = strategy  # يمكن تغييرها بدون تعديل الكلاس
```

### E3: Dependency Injection
```
❌ WRONG: الكلاس يُنشئ dependencies بنفسه
✅ RIGHT: يستقبلها من الخارج (Injection)

# ❌ BAD
class UserService:
    def __init__(self):
        self.db = Database()  # مقيّد

# ✅ GOOD
class UserService:
    def __init__(self, db):
        self.db = db  # مرن - يمكن استخدام Mock للاختبار
```

### E4: Interface Segregation
```
❌ WRONG: Interface ضخم بـ 50 method
✅ RIGHT: Interfaces صغيرة ومحددة

# ❌ BAD: الكل مجبر على implement كل شيء
class IAnimal:
    def fly(): pass
    def swim(): pass
    def walk(): pass

# ✅ GOOD: كل interface لغرض محدد
class IFlyable: def fly(): pass
class ISwimmable: def swim(): pass
```

### E5: Composition Over Inheritance
```
❌ WRONG: سلسلة وراثة عميقة (5+ levels)
✅ RIGHT: تركيب objects معاً

# ❌ BAD: Animal → Mammal → Canine → Dog → Bulldog
# ✅ GOOD: Dog has: Legs, Tail, Bark behavior
```

### E6: Configuration Over Hardcoding
```
❌ WRONG: قيم ثابتة في الكود
✅ RIGHT: قيم في config/env

# ❌ BAD
API_URL = "https://api.example.com"

# ✅ GOOD
API_URL = os.getenv("API_URL")
```

---

## 📐 SIMPLICITY (البساطة)

### S1: KISS (Keep It Simple, Stupid)
```
❌ WRONG: حل معقد لمشكلة بسيطة
✅ RIGHT: أبسط حل يعمل

# ❌ BAD: Factory + Abstract + Strategy لـ Hello World
# ✅ GOOD: print("Hello World")
```

### S2: YAGNI (You Aren't Gonna Need It)
```
❌ WRONG: "قد نحتاجه مستقبلاً، سأضيفه الآن"
✅ RIGHT: أضف فقط ما تحتاجه الآن
```

### S3: DRY (Don't Repeat Yourself)
```
❌ WRONG: نفس الكود في 5 أماكن
✅ RIGHT: دالة واحدة، استدعاء من كل مكان

# ❌ BAD
if user.role == "admin": log("admin action")
if user.role == "admin": check_permissions()
if user.role == "admin": notify_security()

# ✅ GOOD
def handle_admin_action(user):
    log("admin action")
    check_permissions()
    notify_security()
```

### S4: Explicit Over Implicit
```
❌ WRONG: magic numbers, hidden behavior
✅ RIGHT: أسماء واضحة، سلوك صريح

# ❌ BAD
if status == 3:  # ما هو 3؟

# ✅ GOOD
STATUS_APPROVED = 3
if status == STATUS_APPROVED:
```

### S5: Flat Is Better Than Nested
```
❌ WRONG: 5 levels من if/else
✅ RIGHT: Early return, guard clauses

# ❌ BAD
def process(user):
    if user:
        if user.active:
            if user.verified:
                return do_something()

# ✅ GOOD
def process(user):
    if not user: return
    if not user.active: return
    if not user.verified: return
    return do_something()
```

### S6: Meaningful Names
```
❌ WRONG: x, temp, data, info, manager
✅ RIGHT: user_count, active_sessions, pending_orders

# ❌ BAD
def calc(a, b, c):
    return a * b - c

# ✅ GOOD
def calculate_discount(price, discount_rate, tax):
    return price * discount_rate - tax
```

---

## 🗺️ NAVIGABILITY & STRUCTURE (قابلية الملاحة)

> **كيف تجعل الكود سهلاً للوكلاء (AI Agents) والبشر؟**

### N1: Modularization (التقسيم)
```
❌ WRONG: ملف واحد بـ 1000 سطر
✅ RIGHT: ملفات صغيرة (< 300 سطر) بمسؤولية واحدة

# قاعدة:
- إذا الملف > 300 سطر → قسّمه
- إذا الدالة > 50 سطر → قسّمها
```

### N2: Code Anchors (العلامات المرجعية)
```
❌ WRONG: كود صامت بدون سياق
✅ RIGHT: استخدم Docstrings و Regions لتوضيح الهيكل

# ✅ GOOD
def calculate_tax(amount):
    """
    @purpose: حساب الضريبة المضافة
    @context: يُستخدم في الفواتير النهائية فقط
    """
    #region --- Validation ---
    if amount < 0: return 0
    #endregion
```

### N3: Descriptive Naming (التسمية الوصفية)
```
❌ WRONG: utils.py, helpers.py, common.py (غامض)
✅ RIGHT: pdf_generator.py, date_formatter.py, auth_middleware.py

# قاعدة:
- اسم الملف يجب أن يصف محتواه بدقة
- الوكيل يبحث بالاسم أولاً
```

### N4: The Map (الخريطة)
```
❌ WRONG: هيكلية عشوائية (flat folder)
✅ RIGHT: هيكلية شجرية منطقية

src/
  auth/         # حي المصادقة
    login.py    # مبنى الدخول
    register.py # مبنى التسجيل
  payment/      # حي الدفع
    stripe.py
```

---

## 🎯 THE GOLDEN RULE

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  "Make it work, make it right, make it fast"       │
│                                                     │
│  1. اجعله يعمل (Working)                           │
│  2. اجعله صحيحاً (Clean & Readable)                │
│  3. اجعله سريعاً (Performant) - إذا لزم            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Quick Checklist

Before writing code:
```
[ ] هل الحل بسيط ومباشر؟
[ ] هل يمكن تغييره لاحقاً بسهولة؟
[ ] هل هناك performance bottleneck متوقع؟
```

After writing code:
```
[ ] هل الأسماء واضحة؟
[ ] هل الدوال قصيرة (< 20 سطر)؟
[ ] هل هناك تكرار يمكن إزالته؟
[ ] هل الـ dependencies قابلة للحقن؟
```
