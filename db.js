const path = require('path');
const os = require('os');
const { LowSync } = require('lowdb');
const { JSONFileSync } = require('lowdb/node');

// على السحابة (Koyeb وغيرها) استخدم مجلد مؤقت قابل للكتابة
const dbPath = process.env.DB_PATH || (process.env.PORT ? path.join(os.tmpdir(), 'reminders-db.json') : path.join(__dirname, 'db.json'));
const adapter = new JSONFileSync(dbPath);
const low = new LowSync(adapter, { users: [], reminders: [] });
low.read();

function nextId(collection) {
  const arr = low.data[collection];
  if (!arr.length) return 1;
  return Math.max(...arr.map((x) => x.id)) + 1;
}

function now() {
  return new Date().toISOString();
}

const db = {
  // المستخدمون
  findUserByEmail(email) {
    low.read();
    return low.data.users.find((u) => u.email === email.toLowerCase());
  },
  findUserById(id) {
    low.read();
    return low.data.users.find((u) => u.id === Number(id));
  },
  addUser({ email, password_hash, name }) {
    low.read();
    const id = nextId('users');
    const row = {
      id,
      email: email.toLowerCase(),
      password_hash,
      name: name || '',
      created_at: now()
    };
    low.data.users.push(row);
    low.write();
    return row;
  },

  // التنبيهات
  getRemindersByUserId(userId) {
    low.read();
    return low.data.reminders
      .filter((r) => r.user_id === Number(userId))
      .sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at))
      .map(({ id, title, body, remind_at, repeat, created_at }) => ({
        id,
        title,
        body,
        remind_at,
        repeat,
        created_at
      }));
  },
  addReminder({ user_id, title, body, remind_at, repeat }) {
    low.read();
    const id = nextId('reminders');
    const row = {
      id,
      user_id: Number(user_id),
      title: String(title).trim(),
      body: String(body || '').trim(),
      remind_at,
      repeat: repeat || null,
      created_at: now()
    };
    low.data.reminders.push(row);
    low.write();
    return row;
  },
  getReminderByIdAndUser(id, userId) {
    low.read();
    return low.data.reminders.find(
      (r) => r.id === Number(id) && r.user_id === Number(userId)
    );
  },
  updateReminder(id, userId, { title, body, remind_at, repeat }) {
    low.read();
    const r = low.data.reminders.find(
      (x) => x.id === Number(id) && x.user_id === Number(userId)
    );
    if (!r) return null;
    if (title !== undefined) r.title = String(title).trim();
    if (body !== undefined) r.body = String(body || '').trim();
    if (remind_at !== undefined) r.remind_at = remind_at;
    if (repeat !== undefined) r.repeat = repeat || null;
    low.write();
    return r;
  },
  deleteReminder(id, userId) {
    low.read();
    const idx = low.data.reminders.findIndex(
      (r) => r.id === Number(id) && r.user_id === Number(userId)
    );
    if (idx === -1) return 0;
    low.data.reminders.splice(idx, 1);
    low.write();
    return 1;
  }
};

module.exports = db;
