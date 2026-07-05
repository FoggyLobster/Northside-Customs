const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventPath = path.join(__dirname, "../events");
  const eventFiles = fs.readdirSync(eventPath).filter((f) => f.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }

  for (const folder of fs.readdirSync(eventPath)) {
    const eventFolderPath = path.join(eventPath, folder);

    if (fs.statSync(eventFolderPath).isDirectory()) {
      const eventFiles = fs
        .readdirSync(eventFolderPath)
        .filter((f) => f.endsWith(".js"));

      for (const file of eventFiles) {
        const event = require(`../events/${folder}/${file}`);

        if (event.once) {
          client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
          client.on(event.name, (...args) => event.execute(client, ...args));
        }
      }
    }
  }
};
