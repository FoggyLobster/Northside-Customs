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
    product TEXT NOT NULL,
    product_image_url TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
  `,
).run();

module.exports = db;
