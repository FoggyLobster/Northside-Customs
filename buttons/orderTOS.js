module.exports = {
  customId: "order_tos",

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      flags: 32768 || 64,
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
                "### Northside Customs Order Terms of Service\n-# By reading, you are agreeing to Northside's Order Terms of Service\n### Payment\n*Before the designer starts, you are* **REQUIRED** *To pay full payment, as well as the 30% tax.*\n\n### Order Information\n*Customers are required to share information in the format listed in the order; as well as all decals/assets.*\n\n### Conduct\n *Harassment, threats, or disrespect will not be tolerated; please respect your designer and others. Violations may result in cancellation with no refund or a blacklist. Also, do not spam ping your designer, and stay patient.*\n\n### Refund Policy\n*We have a strict* **NO-REFUND Policy**; *the only exceptions are if your designer leaves or gets terminated mid-order.*\n\n### Completed Orders\n*Once final completion is sent, you have 12 hours max to contact your designer if bugs are found. After those 12 hours, you must place a new order.*\n\n### Turnaround Time\n*Customers are required to send every piece of information to avoid delays within orders.*",
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
