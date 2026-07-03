const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qc")
    .setDescription("Create a quality control entry")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("submit")
        .setDescription("Submit a quality control entry")
        .addUserOption((option) =>
          option
            .setName("customer")
            .setDescription("The customer")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("product")
            .setDescription("The product")
            .setRequired(true)
            .addChoices(
              { name: "Livieries", value: "Livieries" },
              { name: "Uniforms", value: "Uniforms" },
              { name: "Photography", value: "Photography" },
              { name: "Graphic Design", value: "Graphic Design" },
            ),
        )
        .addAttachmentOption((option) =>
          option
            .setName("product")
            .setDescription("The product image")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const customer = interaction.options.getUser("customer");
    const product = interaction.options.getString("product");
    const productImage = interaction.options.getAttachment("product");

    const channel = interaction.guild.channels.cache.fetch(
      "1520789853925544067",
    );

    await channel.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: `## <:ShieldWork:1522427022863765625> Quality Control Submission\n\n### Details can be found below:\n\n**Designer:** ${interaction.user}\n**Customer:** ${customer}\n**Design Type:** ${product}\n\n**An image can be found below if it was provided.**`,
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
                    url: `${productImage.url}`,
                  },
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
          accent_color: 1644825,
        },
      ],
    });
  },
};
