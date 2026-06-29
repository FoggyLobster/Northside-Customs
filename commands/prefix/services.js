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
              type: 10,
              content:
                "**Northside Customs**\n### Pricing\nLooking to order? Look at the prices that fit you!\nPriced may vairy depending on the designers work level. Robux is the primary payment.\n### Livery Prices\n**1x LEO Livery: 75 Robux**\n**1x DOT Livery: 60 Robux**\n**1x Fire Livery: 105 Robux**\n**1x MED Livery: 75 Robux**",
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
                    { label: "Graphic Designs", value: "0eYdywjTPO" },
                    { label: "Photography Designs", value: "p2Urmnfwhn" },
                    { label: "Uniform Designs", value: "v8RRBA0kYV" },
                    { label: "Livery Designs", value: "l6MuLWxYja" },
                  ],
                  placeholder: "Select a service to start an order",
                  flows: {},
                  custom_id: "p_318774671019347969",
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
