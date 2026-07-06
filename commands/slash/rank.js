const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View a user's rank")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User to check").setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const data = db
      .prepare("SELECT * FROM message_xp WHERE user_id = ?")
      .get(user.id);

    // if no data → default
    let xp = data?.xp || 0;
    let level = data?.level || 0;

    const needed = (level + 1) * 100;

    const progress = Math.min(xp / needed, 1);
    const barLength = 10;
    const filled = Math.round(progress * barLength);

    const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`${user.username}'s Rank`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Level", value: `${level}`, inline: true },
        { name: "XP", value: `${xp}/${needed}`, inline: true },
        { name: "Progress", value: bar },
      )
      .setFooter({ text: "Northside Customs" });

    return interaction.reply({ embeds: [embed] });
  },
};
