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
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521157487745699870/Screenshot_2026-06-28_125651.png?ex=6a47c44e&is=6a4672ce&hm=4ce0c3b8927ad25158d83dc68f6af7bf36efd9ebb0996baa5f3725195a94ad47&format=webp&quality=lossless&width=747&height=121&",
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
                "Looking to order from us? You're in the right place! But before doing so, make sure to look at our order TOS and our prices which can be found by pressing the buttons marked below! You can also place an order by using the select menu that can also be found below.",
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  options: [
                    {
                      label: "Livery ",
                      value: "livery",
                    },
                    {
                      label: "Uniform",
                      value: "uniform",
                    },
                    {
                      label: "Photography",
                      value: "photography",
                    },
                    {
                      label: "Graphics",
                      value: "graphic",
                    },
                  ],
                  placeholder: "Select an option to place an order",
                  flows: {},
                  custom_id: "order_menu",
                  min_values: 1,
                  max_values: 1,
                },
              ],
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  style: 4,
                  type: 2,
                  label: "Pricing",
                  emoji: {
                    name: "💲",
                  },
                  flow: {
                    actions: [],
                  },
                  custom_id: "order_pricing",
                },
                {
                  style: 3,
                  type: 2,
                  label: "Order TOS",
                  emoji: {
                    name: "📑",
                  },
                  flow: {
                    actions: [],
                  },
                  custom_id: "order_tos",
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
                "-# All purchases are final. We do not do refunds of any kind nor will we every do them. Please do not ever ask for a refund.",
            },
          ],
        },
      ],
    });

    await message.delete();
  },
};
