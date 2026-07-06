module.exports = {
  name: "support",
  description: "Opens the support tickets desk.",
  async execute(message) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return;
    }

    await message.channel.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521157487745699870/Screenshot_2026-06-28_125651.png?ex=6a43cfce&is=6a427e4e&hm=0d05cb4694e8b4eaef4ca013feb4bdd40966515d52f93c20c2a7ac85cf8f4156&format=webp&quality=lossless&width=747&height=121&",
                  },
                },
              ],
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content: "## Support Desk\n\n",
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content:
                "🎫 Do you need help that does not require our Management team or higher? General ticket is here! Here are some things that you can open a general ticket for:\n\n - **General Inquiries**\n - **Minor assistance**\n - **Minor designer/staff report**\n\n<:Internal:1521249680208433253> If you need assistance that requires immediate attention and higher staff response, then that would be  High Ranking. Here are some of the things that you can open an HR ticket for:\n\n - **Major designer/staff report**\n - **Giveaway redeeming**\n - **Major assistance**\n - **Major inquiries**\n\n-# Side note: Trolling in a ticket will result in punishment ranging from a warning to possibly a ban depending on the severity.",
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  options: [
                    {
                      label: "General Support",
                      value: "general_support",
                      description:
                        "A general support ticket for things stated above",
                      emoji: {
                        name: "🎫",
                      },
                    },
                    {
                      label: "High Rank Support",
                      value: "high_rank",
                      description: "High Rank Support for things stated above",
                      emoji: {
                        id: "1521249680208433253",
                        name: "Internal",
                        animated: false,
                      },
                    },
                  ],
                  placeholder: "Make a support ticket here",
                  flows: {},
                  custom_id: "supportDesk",
                  min_values: 1,
                  max_values: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    await message.delete();
  },
};
