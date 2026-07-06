const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your or another user's rank")
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("User to check rank for")
        .setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const data = db
      .prepare("SELECT * FROM message_xp WHERE user_id = ?")
      .get(user.id);

    if (!data) {
      return interaction.reply({
        content: "This user has no XP yet.",
        ephemeral: true,
      });
    }

    const xp = data.xp || 0;
    const level = data.level || 0;

    // simple XP needed formula
    const needed = (level + 1) * 100;

    // progress bar
    const percent = Math.floor((xp / needed) * 10);
    const bar = "█".repeat(percent) + "░".repeat(10 - percent);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`${user.username}'s Rank`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Level", value: `${level}`, inline: true },
        { name: "XP", value: `${xp} / ${needed}`, inline: true },
        { name: "Progress", value: `${bar}` },
      )
      .setFooter({ text: "Northside Customs" });

    return interaction.reply({ embeds: [embed] });
  },
};
