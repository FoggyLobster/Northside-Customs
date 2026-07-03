const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "recentErrors",
  description: "Shows the last 10 errors that have occured in the server",
  async execute(message) {
    const errors = message.client.recentErrors;
    if (!errors.length) return message.reply("No errors have occured yet.");
    const embed = new EmbedBuilder()
      .setTitle("Recent Errors")
      .setColor("#FF0000")
      .setDescription(errors.map((e, i) => `${i + 1}. ${e}`).join("\n"));
    await message.channel.send(embed);
  },
};
