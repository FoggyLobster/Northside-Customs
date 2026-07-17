const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watermark")
    .setDescription("Adds a watermark to an uploaded image.")
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("The image to watermark")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const attachment = interaction.options.getAttachment("image");

      if (!attachment.contentType?.startsWith("image/")) {
        return interaction.editReply({
          content: "Please upload a valid image.",
        });
      }

      const imageBuffer = (
        await axios.get(attachment.url, {
          responseType: "arraybuffer",
        })
      ).data;

      const watermarkPath = path.join(process.cwd(), "assets", "watermark.png");

      if (!fs.existsSync(watermarkPath)) {
        return interaction.editReply({
          content: "Could not find `assets/watermark.png`.",
        });
      }

      const watermarkBuffer = fs.readFileSync(watermarkPath);

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        return interaction.editReply({
          content: "Unable to read the uploaded image.",
        });
      }

      const watermarkWidth = Math.round(metadata.width * 0.2);

      const resizedWatermark = await sharp(watermarkBuffer)
        .resize({
          width: watermarkWidth,
        })
        .ensureAlpha(0.35)
        .png()
        .toBuffer();

      const watermarkMeta = await sharp(resizedWatermark).metadata();

      const margin = 20;

      const output = await image
        .composite([
          {
            input: resizedWatermark,
            left: metadata.width - watermarkMeta.width - margin,
            top: metadata.height - watermarkMeta.height - margin,
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
    } catch (err) {
      console.error(err);

      await interaction.editReply({
        content: "An error occurred while processing the image.",
      });
    }
  },
};
