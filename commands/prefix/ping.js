module.exports = {
  name: "ping",
  description: "Ping the bot",
  async execute(client, message) {
    await message.reply("Pong!");
  },
};
