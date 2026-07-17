const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watermark")
    .setDescription("Add a watermark to an image.")
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("The image to add the watermark to.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const image = interaction.options.getString("image");
    const WATERMARK_URL =
      "https://cdn.discordapp.com/attachments/1520826464948322334/1527726832999206952/Dripzels_2D_Showcase_10_4.png?ex=6a5bb5fc&is=6a5a647c&hm=a0985ab305eaf5a22d3d4b941f1113c044e82ca4045fb877b652a44d3d7447ac&";

    const finishedImage = `${image}?watermark=${WATERMARK_URL}`;

    await interaction.reply({
      content: finishedImage,
    });
  },
};
