module.exports = {
  name: "status",
  description: "Check the status of the bot",
  execute(message, args) {
    const isOwner = message.author.id === "1062166609931804702";

    if (!isOwner) {
      return;
    }

    const responseTime = Math.round(
      message.createdTimestamp - message.editedTimestamp,
    );

    message.channel.send(`
        **Uptime:** ${Math.round(process.uptime())} seconds
        **Response time:** ${responseTime} milliseconds
        **Memory usage:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB
        `);
  },
};
