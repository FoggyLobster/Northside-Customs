module.exports = {
  name: "order_pricing",

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      flags: 32768,
      components: [
        {
          type: 14,
          spacing: 2,
        },
        {
          type: 17,
          components: [
            {
              type: 10,
              content:
                "You found our pricing tab! You can view our prices for everything below: \n\n## <:Northside:1520847420874031104> PRICING\n\n",
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content:
                "**Livery Pricing:\nLEO: <:robux:1521266814397714492> 110\nDOT: <:robux:1521266814397714492> 120\nFIRE: <:robux:1521266814397714492> 150 **\n\n**Uniform Pricing:\nShirt: <:robux:1521266814397714492> 70\nPants: <:robux:1521266814397714492> 55\nSet: <:robux:1521266814397714492> 110**\n\n**Photography Pricing:\nBanner: <:robux:1521266814397714492> 120 W/O Edit\nBanner: <:robux:1521266814397714492> 200 W/ Edit**\n\n**Graphic Pricing:\nLogo: <:robux:1521266814397714492> 200\nBanner: <:robux:1521266814397714492> 250\nFooter: <:robux:1521266814397714492> 150**\n\nPlease ensure you read our Order TOS which can be viewed in the services embed or below.",
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  style: 3,
                  type: 2,
                  label: "Order TOS",
                  flow: {
                    actions: [],
                  },
                  custom_id: "p_319960313795448834",
                },
              ],
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a47f087&is=6a469f07&hm=6fa6d4b3f17f6e758756955e1fd72dd76e10b9fb263e00bdcdd7ab2e34eb909f&",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
