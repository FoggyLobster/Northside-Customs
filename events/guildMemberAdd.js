module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    const channel = await member.guild.channels.fetch("1520788467351552190");
    const memberCount = await member.guild.members.cache.size;

    if (channel?.isTextBased()) {
      await channel.send({
        flags: 32768,
        components: [
          {
            type: 10,
            content: `Welcome, <@${member.id}> to **<:Northside:1520847420874031104> Northside Customs**! You are meber \`#${memberCount}\``,
          },
          {
            type: 1,
            components: [
              {
                style: 2,
                type: 2,
                label: `${memberCount}`,
                emoji: {
                  id: "1520847420874031104",
                  name: "Northside",
                  animated: false,
                },
                disabled: true,
                flow: {
                  actions: [],
                },
                custom_id: "member_count",
              },
            ],
          },
        ],
      });
    }
  },
};
