const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my")
    .setDescription("Slash commands relating to your credits")
    .addSubcommand((subcommand) =>
      subcommand.setName("credits").setDescription("View your credits"),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "credits") {
      await interaction.deferReply({ ephemeral: true });

      const credits = db
        .prepare("SELECT * FROM credits WHERE user_id = ?")
        .get(interaction.user.id);

      if (!credits) {
        return interaction.editReply("User not found.");
      }

      const viewCreditsEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Credits")
        .setDescription(
          `The user **${interaction.user}** has **${credits.credits}** credits.`,
        )
        .setFooter({ text: "Northside Customs" });

      return interaction.editReply({ embeds: [viewCreditsEmbed] });
    }
  },
};
