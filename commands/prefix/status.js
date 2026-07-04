module.exports = {
  name: "status",
  description: "Check the status of the bot",

  async execute(message) {
    const isOwner = message.author.id === "1062166609931804702";

    if (!isOwner) {
      return;
    }

    const statusMessage = await message.channel.send("Loading...");

    const responseTime =
      statusMessage.createdTimestamp - message.createdTimestamp;

    await statusMessage.edit(`
**Uptime:** ${Math.round(process.uptime())} seconds
**Response time:** ${responseTime} milliseconds
**Memory usage:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB
`);
  },
};
