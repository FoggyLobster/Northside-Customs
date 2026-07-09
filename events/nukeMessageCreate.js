const antiNuke = require("../utils/antiNuke");

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.mentions.everyone) {
      const triggered = antiNuke.addAction(message.author.id, "everyonePing");

      await message.delete().catch(() => {});

      if (triggered) {
        const member = await message.guild.members
          .fetch(message.author.id)
          .catch(() => null);

        if (member) {
          await antiNuke.punish(member, "Mass @everyone/@here pinging");
        }
      }
    }
  },
};
