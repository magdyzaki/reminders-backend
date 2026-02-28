# تفعيل التنبيه مع الشاشة مطفية (VAPID)

لكي تعمل التنبيهات حتى عند إغلاق التطبيق أو إطفاء الشاشة، يجب ضبط **مفاتيح VAPID** في بيئة التشغيل (Environment Variables).

---

## الخطوة 1: توليد المفاتيح

شغّل هذا الأمر مرة واحدة على جهازك:

```bash
cd D:\programs\reminders-backend
node -e "const w=require('web-push'); const k=w.generateVAPIDKeys(); console.log('VAPID_PUBLIC_KEY='+k.publicKey); console.log('VAPID_PRIVATE_KEY='+k.privateKey);"
```

انسخ الناتج (سطرين).

---

## الخطوة 2: ضبط المفاتيح حسب منصة النشر

### على Replit
1. **Tools** → **Secrets**
2. أضف:
   - `VAPID_PUBLIC_KEY` = القيمة الأولى
   - `VAPID_PRIVATE_KEY` = القيمة الثانية
3. أعد تشغيل المشروع (Run)

### على Koyeb / Render / أي منصة
1. **Settings** → **Environment Variables**
2. أضف نفس المتغيرين كما فوق
3. احفظ ثم **Redeploy**

### عند التشغيل المحلي (ngrok)
1. أنشئ ملف `.env` في مجلد المشروع (إن لم يكن موجوداً)
2. أضف:
   ```
   VAPID_PUBLIC_KEY=المفتاح_العام_الذي_نسخته
   VAPID_PRIVATE_KEY=المفتاح_الخاص_الذي_نسخته
   ```
3. شغّل: `npm start`

---

## الخطوة 3: التأكد

- عند بدء التشغيل، إن كان VAPID مضبوطاً بشكل صحيح ستظهر: **✓ التنبيه مع الشاشة مطفية مفعّل**
- تحقق عبر المتصفح أو Postman:
  - `GET /api/push/ready` → يجب أن يعيد `ready: true` و `vapidFromEnv: true`
  - `GET /api/push/vapid-public` → يعيد `publicKey` و `fromEnv: true`
- **مهم:** المفاتيح يجب أن تكون في `.env` أو Environment Variables **قبل** إقلاع السيرفر، وليس بعد التشغيل

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| رسالة "التنبيه مع الشاشة مطفية غير مفعّل" | أضف VAPID في `.env` أو Environment Variables وأعد تشغيل السيرفر |
| `ready: false` من `/api/push/ready` | المفاتيح غير مضبوطة أو السيرفر أُعيد تشغيله قبل قراءة `.env` |
| التنبيه يعمل أحياناً فقط | المفاتيح تتغيّر عند إعادة التشغيل — تأكد من ضبطها في env بشكل دائم |
| `VAPID_NOT_SET` من `/api/push/vapid-public` | لم يُضف VAPID_PUBLIC_KEY أو القيمة فارغة |

---

## ملاحظات

- **لا تشارك المفتاح الخاص (VAPID_PRIVATE_KEY)** أبداً
- المفتاح العام يُرسل للعميل (المتصفح) عند الاشتراك
- إن لم تضبط المفاتيح، السيرفر يولد مفاتيح مؤقتة عند كل إعادة تشغيل — والاشتراكات القديمة تصبح غير صالحة
