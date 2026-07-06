const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mycredits")
    .setDescription("View your credits"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const myCredits = db
      .prepare("SELECT * FROM credits WHERE user_id = ?")
      .get(interaction.user.id);

    if (!myCredits) {
      return interaction.editReply("You do not have any credits.");
    }

    const myCreditsEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("My Credits")
      .setDescription(`You have **${myCredits.credits}** credits.`)
      .setTimestamp()
      .setFooter({ text: "Northside Customs Credits System" });
  },
};
