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

module.exports = db;
