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

    client.on("messageCreate", async (message) => {
      const loggingChannel = client.channels.cache.get(
        client.creditLoggingChannel,
      );
      if (message.author.bot) return;
      if (!message.guild) return;

      const userId = message.author.id;

      const data = messageTracker.get(userId) || { count: 0 };

      data.count++;

      const X = 10; // every 10 messages
      const REWARD = 15;

      if (data.count >= X) {
        data.count = 0;

        // add credits to DB
        db.prepare(
          `
      INSERT INTO credits (user_id, credits)
      VALUES (?, ?)
      ON CONFLICT(user_id)
      DO UPDATE SET credits = credits + ?
    `,
        ).run(userId, REWARD, REWARD);

        await loggingChannel.send({
          content: `<@${userId}> has been rewarded with **${REWARD}** credits.`,
        });
      }

      messageTracker.set(userId, data);
    });
  },
};
