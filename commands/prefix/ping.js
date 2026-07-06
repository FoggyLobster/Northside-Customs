module.exports = {
  name: "ping",
  description: "Ping the bot",
  async execute(message) {
    await message.reply("Pong!");
  },
};
