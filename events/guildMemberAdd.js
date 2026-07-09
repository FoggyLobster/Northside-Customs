const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(client, member) {
    console.log({
      joinedUser: member.user.tag,
      id: member.id,
      bot: member.user.bot,
    });

    const channel = await member.guild.channels.fetch("1520788467351552190");

    const memberCount = member.guild.memberCount;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("members")
        .setLabel(`${member.guild.memberCount}`),
    );

    if (channel) {
      await channel.send({
        content: `Welcome, <@${member.id}> to **<:Northside:1520847420874031104> Northside Customs**! You are member \`#${memberCount}\`.`,
      });
    }
  },
};
