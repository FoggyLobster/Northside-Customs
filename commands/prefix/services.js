const {
  ContainerBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "services",

  async execute(message) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
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
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521157487745699870/Screenshot_2026-06-28_125651.png?ex=6a43cfce&is=6a427e4e&hm=0d05cb4694e8b4eaef4ca013feb4bdd40966515d52f93c20c2a7ac85cf8f4156&=&format=webp&quality=lossless&width=747&height=121",
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
              content:
                "**Northside Customs**\n### Pricing\nLooking to order? Look at the prices that fit you!\nPriced may vairy depending on the designers work level. Robux is the primary payment.\n### Livery Prices\n**1x LEO Livery: <:robux:1521266814397714492> 75 Robux**\n**1x DOT Livery: <:robux:1521266814397714492> 60 Robux**\n**1x Fire Livery: <:robux:1521266814397714492> 105 Robux**\n**1x MED Livery: <:robux:1521266814397714492> 75 Robux**",
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
                    { label: "Graphic Designs", value: "graphic" },
                    { label: "Photography Designs", value: "photography" },
                    { label: "Uniform Designs", value: "uniform" },
                    { label: "Livery Designs", value: "livery" },
                  ],
                  placeholder: "Select a service to start an order",
                  flows: {},
                  custom_id: "order_menu",
                  min_values: 1,
                  max_values: 1,
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
