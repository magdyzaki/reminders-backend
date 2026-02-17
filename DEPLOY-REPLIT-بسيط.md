# نشر reminders-backend على Replit — خطوات بسيطة جداً

---

## الخطوة 1: استيراد المشروع (دقيقة واحدة)

1. ادخل: **https://replit.com**
2. اضغط **Create** أو **+ Create**
3. اختَر **Import from GitHub**
4. اكتب: **magdyzaki/reminders-backend**
5. اضغط **Import** أو **Create Repl**
6. انتظر 1–2 دقيقة حتى ينجح الاستيراد والتثبيت

---

## الخطوة 2: تشغيل السيرفر

1. بعد فتح المشروع، اضغط زر **Run** (أعلى الصفحة)
2. أو من الأسفل في الـ Console اكتب: `npm start`
3. انتظر حتى تظهر رسالة: **سيرفر التنبيهات يعمل على المنفذ...**

---

## الخطوة 3: الحصول على الرابط

1. من القائمة الجانبية أو أعلى الصفحة، ابحث عن **"Webview"** أو **"Open site"** أو **"Share"**
2. اضغط عليه — سيفتح رابط مثل:
   ```
   https://reminders-backend-xxxxx.username.replit.app
   ```
3. **انسخ هذا الرابط كاملاً** (بدون `/` في النهاية)

---

## الخطوة 4: إضافة الرابط في Vercel

1. ادخل: **https://vercel.com** → سجّل الدخول
2. افتح مشروع **reminders-frontend**
3. **Settings** → **Environment Variables**
4. عدّل أو أضف:
   - **Name:** `VITE_API_URL`
   - **Value:** الرابط الذي نسخته من Replit (مثال: `https://reminders-backend-xxxxx.username.replit.app`)
5. احفظ (Save)

---

## الخطوة 5: إعادة النشر

1. في نفس المشروع على Vercel
2. **Deployments** → اضغط على آخر Deployment
3. من القائمة ⋮ اختر **Redeploy**
4. انتظر حتى يكتمل النشر (1–2 دقيقة)

---

## الخطوة 6: التجربة على الموبايل

1. افتح التطبيق من الموبايل (reminders-frontend.vercel.app أو الرابط الذي تستخدمه)
2. سجّل الدخول
3. المفروض يعمل بدون "Failed to fetch"

---

## ملاحظات

- **التخزين:** بدون MongoDB، قد تُفقد البيانات عند إعادة تشغيل Replit. للتخزين الدائم: أضف `MONGODB_URI` من MongoDB Atlas في **Tools** → **Secrets** داخل Replit.
- **Replit ينام:** على الخطة المجانية، المشروع قد يتوقف بعد فترة. أول طلب قد يأخذ بضع ثوانٍ.

---

## إذا واجهت مشكلة

- **لا أجد Import from GitHub:** تأكد أنك ربطت GitHub من **Account** → **Connections** → **GitHub**
- **Run لا يعمل:** تأكد أنك في المجلد الصحيح (الجذر فيه `package.json` و `index.js`)
- **الرابط لا يفتح:** من Replit اضغط **Share** ثم **Generate link** أو انظر لزر Webview

---

**بالتوفيق.**
