const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const antiNukePath = path.join(__dirname, "../antiNuke");

  const files = fs
    .readdirSync(antiNukePath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const antiNukeFile = require(`../antiNuke/${file}`);

    if (typeof antiNukeFile === "function") {
      antiNukeFile(client);
    }
  }
};
