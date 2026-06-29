const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const db = new Database(path.join(dataPath, "services.sqlite"));

db.prepare(
  ```
    CREATE TABLE IF NOT EXISTS services (
    message_id TEXT PRIMARY KEY,
    chann_id TEXT,
    liveries TEXT,
    uniforms TEXT,
    photography TEXT,
    graphics TEXT,
)
    ```,
).run();

module.exports = db;
