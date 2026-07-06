module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    console.log({
      joinedUser: member.user.tag,
      id: member.id,
      bot: member.user.bot,
    });

    const channel = await member.guild.channels.fetch("1520788467351552190");

    if (!channel?.isTextBased()) return;

    const memberCount = member.guild.memberCount;

    await channel.send({
      flags: 32768,
      components: [
        {
          type: 10,
          content: `Welcome, <@${member.id}> to **<:Northside:1520847420874031104> Northside Customs**! You are member \`#${memberCount}\`.`,
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: `${memberCount}`,
              disabled: true,
              emoji: {
                id: "1523695035076448457",
                name: "person",
                animated: false,
              },
            },
          ],
        },
      ],
    });
  },
};
