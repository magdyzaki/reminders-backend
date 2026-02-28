# استكشاف خطأ الاتصال بـ MongoDB على Render

---

## 1) Network Access — السماح لـ Render بالاتصال

Render له عناوين IP متغيرة. Atlas لازم يقبل الاتصال من **أي مكان**.

### الخطوات:
1. ادخل **cloud.mongodb.com** → سجّل الدخول
2. اختر مشروع **Reminders**
3. من اليسار: **Network Access**
4. اضغط **Add IP Address**
5. اختر **Allow Access from Anywhere** (0.0.0.0/0)
6. اضغط **Confirm**
7. انتظر 1–2 دقيقة حتى يصبح **Active**

---

## 2) كلمة المرور — ترميز الرموز الخاصة

لو كلمة المرور فيها رموز مثل `#` أو `@` أو `:` أو `%`، لازم ترمّزها:

| الرمز | استبدل بـ |
|-------|-----------|
| `#`   | `%23`     |
| `@`   | `%40`     |
| `:`   | `%3A`     |
| `%`   | `%25`     |
| `/`   | `%2F`     |
| `+`   | `%2B`     |

**مثال:** كلمة المرور `Abc#123` → في الرابط اكتب `Abc%23123`

---

## 3) التحقق من MONGODB_URI على Render

1. Render → **reminders-api** → **Environment**
2. تأكد أن **MONGODB_URI** موجود وقيمته صحيحة
3. الشكل الصحيح:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. استبدل `USERNAME` و `PASSWORD` بالقيم الفعلية
5. **Save** ثم **Manual Deploy**

---

## 4) مراجعة Logs على Render

1. Render → reminders-api → **Logs**
2. ابحث عن رسائل خطأ مثل:
   - `MongoServerError`
   - `authentication failed`
   - `connection refused`
3. انسخ رسالة الخطأ كاملة للمساعدة

---

## 5) إعادة توليد كلمة مرور بسيطة (لو استمر الخطأ)

لو كلمة المرور فيها رموز كثيرة:

1. Atlas → **Database Access** → المستخدم
2. **Edit** → **Edit Password**
3. اختر **Autogenerate** أو اختر كلمة مرور **بدون رموز خاصة** (حروف وأرقام فقط)
4. انسخها وضعها في MONGODB_URI على Render
5. Redeploy
