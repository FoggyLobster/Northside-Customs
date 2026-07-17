const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const sharp = require("sharp");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watermark")
    .setDescription("Adds a watermark to an image.")
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("Image to watermark")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const attachment = interaction.options.getAttachment("image");

    const watermarkURL =
      "https://cdn.discordapp.com/attachments/1520826464948322334/1527726832999206952/Dripzels_2D_Showcase_10_4.png";

    // Download images
    const imageBuffer = (
      await axios.get(attachment.url, {
        responseType: "arraybuffer",
      })
    ).data;

    const watermarkBuffer = (
      await axios.get(watermarkURL, {
        responseType: "arraybuffer",
      })
    ).data;

    // Get original image size
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Resize watermark to 20% of image width
    const resizedWatermark = await sharp(watermarkBuffer)
      .resize({
        width: Math.round(metadata.width * 0.2),
      })
      .png()
      .toBuffer();

    // Composite watermark
    const output = await image
      .composite([
        {
          input: resizedWatermark,
          gravity: "southeast",
        },
      ])
      .png()
      .toBuffer();

    const file = new AttachmentBuilder(output, {
      name: "watermarked.png",
    });

    await interaction.editReply({
      files: [file],
    });
  },
};
