const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const pushRoutes = require('./routes/push');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// إعداد مفاتيح VAPID لإشعارات الدفع (حتى تعمل مع الشاشة مطفية)
let vapidKeys = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  vapidKeys = webpush.generateVAPIDKeys();
  process.env.VAPID_PUBLIC_KEY = vapidKeys.publicKey;
  process.env.VAPID_PRIVATE_KEY = vapidKeys.privateKey;
  console.log('لتفعيل التنبيه مع الشاشة مطفية، ضع في Environment Variables:');
  console.log('VAPID_PUBLIC_KEY=', vapidKeys.publicKey);
  console.log('VAPID_PRIVATE_KEY=', vapidKeys.privateKey);
} else {
  webpush.setVapidDetails('mailto:reminders@local', vapidKeys.publicKey, vapidKeys.privateKey);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/push', pushRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// التحقق من التنبيهات المستحقة وإرسال Push
function runPushCheck() {
  if (!vapidKeys.publicKey || !vapidKeys.privateKey) return;
  const due = db.getDueRemindersNotNotified();
  due.forEach((r) => {
    const subs = db.getPushSubscriptionsByUserId(r.user_id);
    if (subs.length === 0) return;
    const payload = { title: r.title, body: r.body || '' };
    webpush.setVapidDetails('mailto:reminders@local', vapidKeys.publicKey, vapidKeys.privateKey);
    subs.forEach((sub) => {
      const pushSub = { endpoint: sub.endpoint, keys: sub.keys };
      webpush.sendNotification(pushSub, JSON.stringify(payload)).catch((err) => {
        console.error('Push failed:', err.message);
      });
    });
    db.markReminderNotified(r.id);
  });
}

runPushCheck(); // فور بدء السيرفر
const CHECK_PUSH_MS = 60 * 1000;
setInterval(runPushCheck, CHECK_PUSH_MS); // ثم كل دقيقة

app.listen(PORT, '0.0.0.0', () => {
  console.log('سيرفر التنبيهات يعمل على المنفذ', PORT);
});
