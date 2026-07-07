const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const db = new Database(path.join(dataPath, "database.sqlite"));

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    user TEXT NOT NULL,
    user_id TEXT NOT NULL,
    given_by TEXT NOT NULL,
    given_by_id TEXT NOT NULL,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  )
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS order_logs (
    id TEXT PRIMARY KEY,
    designer TEXT NOT NULL,
    designer_id TEXT NOT NULL,
    customer TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    order_type TEXT NOT NULL,
    payout INTEGER NOT NULL,
    timestamp INTEGER NOT NULL
  )
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS infractions (
    id INTEGER PRIMARY KEY,
    issuer TEXT NOT NULL,
    issuer_id TEXT NOT NULL,
    user TEXT NOT NULL,
    user_id TEXT NOT NULL,
    infraction_reason TEXT NOT NULL,
    infraction_type TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS quality_control (
    id INTEGER PRIMARY KEY,
    creator TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    customer TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    order_type TEXT NOT NULL,
    product_image_url TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
  `,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    user TEXT NOT NULL,
    user_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
  `,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS credits (
    user_id TEXT PRIMARY KEY,
    credits INTEGER NOT NULL DEFAULT 0
  )
  `,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS credits_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    credits_given INTEGER,
    credits_taken INTEGER,
    given_by TEXT,
    taken_by TEXT,
    given_at INTEGER,
    taken_at INTEGER
  )
  `,
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS message_xp (
  user_id TEXT PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  count INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 0
)
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS bot_hosting (
  bot_name TEXT PRIMARY KEY,
  bot_id TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  branch TEXT NOT NULL,
  add_at INTEGER NOT NULL
  updated_at INTEGER NOT NULL
  )
  `,
);

module.exports = db;
