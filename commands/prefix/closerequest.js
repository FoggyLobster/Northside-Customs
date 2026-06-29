module.exports = {
  name: "cr",

  async execute(message) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");
    if (!hasRole && !isAdmin) {
      return;
    }
    if (
      !message.channel.topic ||
      !/^\d+(\|\d+)?$/.test(message.channel.topic)
    ) {
      return;
    }

    const [ticketOwner] = message.channel.name.split("-");
    const userId = message.guild.members.cache.get(ticketOwner).user.id;
    await message.delete();
    await message.channel.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: `# Close Request\n<@${userId}>`,
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content:
                "Our team feels you do not need further assistance. If you do not need further assistance, please click the 'Close' button promptly. If you still need further assistance, feel free to click the 'Keep Open' button, and our team will assist you as soon as possible.",
            },
            {
              type: 14,
              divider: false,
            },
            {
              type: 1,
              components: [
                {
                  style: 4,
                  type: 2,
                  label: "Close",
                  custom_id: "crclose",
                },
                {
                  style: 3,
                  type: 2,
                  custom_id: "keep_open",
                  flow: {
                    actions: [],
                  },
                  label: "Keep Open",
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
