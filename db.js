const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const db = new Database(path.join(dataPath, "reviews.sqlite"));

db.prepare(
  `CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    user_id TEXT NOT NULL,
    given_by TEXT NOT NULL,
    review TEXT NOT NULL,
    rating INTEGER NOT NULL,
    timestamp TEXT NOT NULL
  )`,
).run();

module.exports = db;
