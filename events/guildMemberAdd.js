const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  async execute(client, member) {
    const channel = client.channels.cache.get("1520788467351552190");

    if (!channel) return;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("members")
        .setLabel(member.guild.memberCount.toString())
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    );

    await channel.send({
      content: `Welcome, ${member} to **<:Northside:1520847420874031104> Northside Customs**! You are member \`#${member.guild.memberCount}\`.`,
      components: [row],
    });
    const role = member.roles.cache.get("1520817494724706324");
    if (role) {
      await member.roles.add(role);
    }
  },
};
