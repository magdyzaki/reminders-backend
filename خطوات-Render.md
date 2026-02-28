# نشر reminders-backend على Render

دليل نشر سيرفر التنبيهات على Render (بدون فيزا، مجاني).

---

## ما تحتاجه مسبقاً

- حساب على **GitHub**
- حساب على **Render.com**
- **MongoDB Atlas** (مجاني) — قاعدة بيانات
- مفاتيح **VAPID** — للتنبيه مع الشاشة مطفية

---

## الخطوة 1: رفع المشروع على GitHub

```powershell
cd D:\programs\reminders-backend
git init
git add .
git commit -m "reminders backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/reminders-backend.git
git push -u origin main
```

استبدل `YOUR_USERNAME` بحسابك. لو المستودع موجود مسبقاً، ارسل التحديثات (`git push`).

---

## الخطوة 2: إنشاء Web Service على Render

1. ادخل **render.com** → **Dashboard**
2. **New +** → **Web Service**
3. **Connect repository** → اختر `reminders-backend`
4. Render سيكتشف `render.yaml` تلقائياً
5. أو عدّل يدوياً:
   - **Name:** `reminders-backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

---

## الخطوة 3: Environment Variables

في **Environment** أضف (أو عدّل):

| Key | القيمة | ملاحظة |
|-----|--------|--------|
| `MONGODB_URI` | رابط Atlas | من mongodb.com/atlas |
| `VAPID_PUBLIC_KEY` | من .env المحلي | نفس القيمة |
| `VAPID_PRIVATE_KEY` | من .env المحلي | نفس القيمة |

**توليد VAPID إن لم يكن لديك:**
```powershell
cd D:\programs\reminders-backend
node -e "const w=require('web-push'); const k=w.generateVAPIDKeys(); console.log('VAPID_PUBLIC_KEY='+k.publicKey); console.log('VAPID_PRIVATE_KEY='+k.privateKey);"
```

**MongoDB Atlas:** في Network Access أضف `0.0.0.0/0` للسماح من أي مكان.

---

## الخطوة 4: النشر

1. اضغط **Create Web Service**
2. انتظر حتى ينتهي الـ Build والـ Deploy
3. انسخ الرابط الظاهر، مثل:  
   `https://reminders-backend-xxxx.onrender.com`

---

## الخطوة 5: ربط الواجهة الأمامية (Vercel)

في **reminders-frontend** على Vercel:

1. **Settings** → **Environment Variables**
2. عدّل `VITE_API_URL` = رابط Render  
   مثلاً: `https://reminders-backend-xxxx.onrender.com`
3. **Redeploy**

---

## الخطوة 6: UptimeRobot (اختياري)

أضف Monitor:
- **URL:** `https://reminders-backend-xxxx.onrender.com/api/health`
- **Interval:** 5 دقائق

---

## ملاحظات

- الخطة المجانية على Render قد تنام بعد 15 دقيقة بدون زيارات — UptimeRobot يمنع ذلك
- الرابط: بدون فيزا، بدون تكلفة شهرية
