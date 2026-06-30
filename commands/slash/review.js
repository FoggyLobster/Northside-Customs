const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db");

function generateReviewId() {
  let id;

  do {
    id = Math.floor(10000 + Math.random() * 90000);
  } while (db.prepare("SELECT 1 FROM reviews WHERE id = ?").get(id));

  return id;
}

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
        .setName("list")
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
        .setName("delete")
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
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("View information about a review.")
        .addIntegerOption((option) =>
          option
            .setName("review_id")
            .setDescription("The ID of the review to view.")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "give") {
      const reviewedUser = interaction.options.getUser("user");
      const rating = interaction.options.getInteger("rating");
      const review = interaction.options.getString("review");
      const reviewId = generateReviewId();

      db.prepare(
        `INSERT INTO reviews
        (id, user, user_id, given_by, given_by_id, review, rating, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        reviewId,
        reviewedUser.username,
        reviewedUser.id,
        interaction.user.username,
        interaction.user.id,
        review,
        rating,
        Date.now(),
      );

      await interaction.reply({
        content: `Successfully added a ${rating}/5 review for ${reviewedUser}.`,
        ephemeral: true,
      });

      const channel = await interaction.guild.channels.fetch(
        "1520788052379959376",
      );

      if (channel?.isTextBased()) {
        await channel.send({
          embeds: [
            {
              color: 0x2b2d31,
              title: ` `,
              description: `### New review from ${interaction.user}\n\n**User:** ${reviewedUser}\n**Rating:** \`${rating}/5\`\n**Review:** ${review}`,
              timestamp: new Date(),
              footer: {
                text: `ID: ${reviewId}`,
              },
            },
          ],
        });
      }
    }

    if (subcommand === "list") {
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
        ephemeral: true,
      });
    }

    if (subcommand === "delete") {
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
        content: `Removed review #${reviewId} from ${reviewedUser}.`,
        ephemeral: true,
      });
    }

    if (subcommand === "info") {
      const reviewId = interaction.options.getInteger("review_id");

      const review = db
        .prepare("SELECT * FROM reviews WHERE id = ?")
        .get(reviewId);

      if (!review) {
        return interaction.reply({
          content: "No review with that ID exists.",
          ephemeral: true,
        });
      }

      return interaction.reply({
        embeds: [
          {
            color: 0x2b2d31,
            title: `Review #${reviewId}`,
            description: `**User:** ${review.user}\n**Rating:** ${review.rating}/5\n**Review:** ${review.review}`,
            timestamp: new Date(review.timestamp),
          },
        ],
        ephemeral: true,
      });
    }
  },
};
