const db = require("../db");

const cooldown = new Set();

module.exports = {
  name: "messageCreate",

  async execute(client, message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    // ❌ Ignore prefix commands
    if (message.content.startsWith(client.prefix)) return;

    const userId = message.author.id;

    // ⏱️ 3-second cooldown (anti-farm)
    if (cooldown.has(userId)) return;

    cooldown.add(userId);
    setTimeout(() => cooldown.delete(userId), 3000);

    const X = 10; // messages needed
    const REWARD = 15;

    const row = db
      .prepare("SELECT count FROM message_xp WHERE user_id = ?")
      .get(userId);

    const count = row ? row.count + 1 : 1;

    if (!row) {
      db.prepare("INSERT INTO message_xp (user_id, count) VALUES (?, ?)").run(
        userId,
        count,
      );
    } else {
      db.prepare("UPDATE message_xp SET count = ? WHERE user_id = ?").run(
        count,
        userId,
      );
    }

    if (count >= X) {
      db.prepare("UPDATE message_xp SET count = 0 WHERE user_id = ?").run(
        userId,
      );

      db.prepare(
        `
        INSERT INTO credits (user_id, credits)
        VALUES (?, ?)
        ON CONFLICT(user_id)
        DO UPDATE SET credits = credits + ?
      `,
      ).run(userId, REWARD, REWARD);

      console.log(`💰 +${REWARD} credits -> ${message.author.tag}`);
    }
  },
};
