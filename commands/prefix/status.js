const { EmbedBuilder } = require("discord.js");

function formatUptime(uptime) {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor(((uptime % 86400) % 3600) / 60);
  const seconds = ((uptime % 86400) % 3600) % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

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
        `**Uptime:** ${formatUptime(process.uptime())}\n` +
          `**Response time:** ${responseTime}ms\n` +
          `**Memory usage:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        `**CPU usage:** ${Math.round(process.cpuUsage().system / 1000)} %`,
      )
      .setTimestamp()
      .setFooter({ text: `Response time: ${responseTime}ms` });

    await statusMessage.edit({
      embeds: [embed],
    });
  },
};
