const db = require("../db");

module.exports = {
  name: "messageCreate",

  async execute(client, message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const cmd = client.prefixCommands.get(cmdName);
    if (!cmd) return;

    try {
      await cmd.execute(message, args);
    } catch (err) {
      console.error(err);
    }

    const row = db
      .prepare("SELECT * FROM message_xp WHERE user_id = ?")
      .get(message.author.id);

    let xp = row?.xp || 0;
    let level = row?.level || 0;

    xp += 5; // XP per message

    let needed = (level + 1) * 100;

    if (xp >= needed) {
      xp -= needed;
      level++;
    }

    db.prepare(
      `
  INSERT INTO message_xp (user_id, xp, level)
  VALUES (?, ?, ?)
  ON CONFLICT(user_id)
  DO UPDATE SET xp = ?, level = ?
`,
    ).run(message.author.id, xp, level, xp, level);
  },
};
