const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    const channel = member.guild.channels.cache.get("1520788467351552190");

    if (!channel) return;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("members")
        .setLabel(member.guild.memberCount.toString())
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    try {
      await channel.send({
        content: `Welcome, ${member} to **<:Northside:1520847420874031104> Northside Customs**! You are member \`#${member.guild.memberCount}\`.`,
        components: [row],
      });
    } catch (err) {
      console.error(err);
    }
  },
};
