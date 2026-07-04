const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "status",
  description: "Check the status of the bot",

  async execute(message) {
    const isOwner = message.author.id === "1062166609931804702";
    if (!isOwner) return;

    const start = Date.now();

    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("Bot Status")
      .setDescription("```diff\n+ Loading status...\n```");

    const statusMessage = await message.channel.send({
      embeds: [embed],
    });

    const responseTime = Date.now() - start;

    embed
      .setColor("Green")
      .setTitle("Bot Status")
      .setDescription(
        `**Uptime:** ${Math.round(process.uptime())} seconds\n` +
          `**Response time:** ${responseTime}ms\n` +
          `**Memory usage:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      );

    await statusMessage.edit({
      embeds: [embed],
    });
  },
};
