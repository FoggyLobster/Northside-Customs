const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("review")
    .setDescription("Manage reviews.")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give a review to a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to review.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("rating")
            .setDescription("Rating from 1-5")
            .setRequired(true)
            .addChoices(
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("review")
            .setDescription("The review.")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a user's reviews.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view.")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a review from a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove a review from.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("review_id")
            .setDescription("The ID of the review to remove.")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "give") {
      const reviewedUser = interaction.options.getUser("user");
      const rating = interaction.options.getInteger("rating");
      const review = interaction.options.getString("review");

      db.prepare(
        `INSERT INTO reviews
        (user, user_id, given_by, given_by_id, review, rating, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        reviewedUser.username,
        reviewedUser.id,
        interaction.user.username,
        interaction.user.id,
        review,
        rating,
        Date.now(),
      );

      await interaction.reply({
        content: `Successfully added a ${rating}/5 review for ${reviewedUser.username}.`,
        ephemeral: true,
      });

      await interaction.guild.channels.cache.get(1520788052379959376).send({
        embeds: [
          {
            color: 0x2b2d31,
            title: `New Review from ${interaction.user.username}`,
            description: `**User:** ${reviewedUser.username}\n**Rating:** ${rating}/5\n**Review:** ${review}`,
            timestamp: new Date(),
          },
        ],
      });
    }

    if (subcommand === "view") {
      const reviewedUser = interaction.options.getUser("user");

      const reviews = db
        .prepare("SELECT * FROM reviews WHERE user_id = ? ORDER BY id DESC")
        .all(reviewedUser.id);

      if (!reviews.length) {
        return interaction.reply({
          content: "This user has no reviews.",
          ephemeral: true,
        });
      }

      const average = (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1);

      const reviewList = reviews
        .slice(0, 10)
        .map(
          (r) =>
            `**ID:** \`${r.id}\`\n**Rating:** \`${r.rating}/5\`\n**By:** <@${r.given_by_id}>\n**Review:** ${r.review}`,
        )
        .join("\n\n");

      return interaction.reply({
        embeds: [
          {
            color: 0x2b2d31,
            title: `Reviews for ${reviewedUser.username}`,
            description: reviewList,
            fields: [
              {
                name: "Average Rating",
                value: `${average}/5`,
                inline: true,
              },
              {
                name: "Total Reviews",
                value: `${reviews.length}`,
                inline: true,
              },
            ],
          },
        ],
      });
    }

    if (subcommand === "remove") {
      const reviewedUser = interaction.options.getUser("user");
      const reviewId = interaction.options.getInteger("review_id");

      const review = db
        .prepare("SELECT * FROM reviews WHERE id = ? AND user_id = ?")
        .get(reviewId, reviewedUser.id);

      if (!review) {
        return interaction.reply({
          content: "No review with that ID exists for that user.",
          ephemeral: true,
        });
      }

      db.prepare("DELETE FROM reviews WHERE id = ?").run(reviewId);

      return interaction.reply({
        content: `Removed review #${reviewId} from ${reviewedUser.username}.`,
        ephemeral: true,
      });
    }
  },
};
