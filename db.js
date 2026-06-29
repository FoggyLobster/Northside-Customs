const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const db = new Database(path.join(dataPath, "services.sqlite"));

module.exports = db;
