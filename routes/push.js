const express = require('express');
const webpush = require('web-push');
const db = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

/** نقطة تحقق عامة — لا تحتاج مصادقة. لمعرفة إن كان التنبيه مع الشاشة مطفية مفعّل */
router.get('/ready', (req, res) => {
  const fromEnv = process.env.VAPID_FROM_ENV === '1';
  const hasKeys = !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  res.json({
    ready: fromEnv && hasKeys,
    vapidFromEnv: fromEnv,
    message: fromEnv ? 'التنبيه مع الشاشة مطفية مفعّل' : 'ضبط VAPID في Environment Variables مطلوب — اقرأ خطوات-VAPID-للتشغيل.md'
  });
});

router.get('/vapid-public', (req, res) => {
  const pub = (process.env.VAPID_PUBLIC_KEY || '').trim().replace(/\s/g, '');
  if (!pub) return res.status(503).json({ error: 'VAPID غير مضبوط', code: 'VAPID_NOT_SET' });
  res.json({
    publicKey: pub,
    fromEnv: process.env.VAPID_FROM_ENV === '1'
  });
});

router.post('/subscribe', auth, async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'صيغة الاشتراك غير صحيحة' });
    }
    await db.addPushSubscription(req.userId, subscription);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'خطأ في حفظ الاشتراك' });
  }
});

module.exports = router;
