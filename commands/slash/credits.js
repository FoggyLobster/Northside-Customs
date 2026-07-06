const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Slash commands relating to credits")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give credits to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to give credits to")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of credits to give")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Take credits from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to take credits from")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of credits to take")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top")
        .setDescription("Get the top 10 users with the most credits"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a user's credits")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view credits for")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("history")
        .setDescription("View a user's credits history")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view credits history for")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "give") {
      const isAdmin = interaction.member.permissions.has("Administrator");
      if (!isAdmin) {
        return interaction.reply(
          "You do not have permission to use this command.",
        );
      }

      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      const giveCredits = db
        .prepare(
          "INSERT INTO credits_history (user_id, credits_given, given_by, given_at) VALUES (?, ?, ?, ?)",
        )
        .run(user.id, amount, interaction.user.id, Date.now());

      db.prepare(
        "INSERT INTO credits (user_id, credits) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET credits = credits + ?",
      ).run(user.id, amount, amount);

      if (giveCredits) {
        return interaction.editReply(
          `Successfully gave **${amount}** credits to **${user}**.`,
        );
      }
    }

    if (subcommand === "remove") {
      const isAdmin = interaction.member.permissions.has("Administrator");
      if (!isAdmin) {
        return interaction.reply(
          "You do not have permission to use this command.",
        );
      }

      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      const removeCredits = db
        .prepare(
          "INSERT INTO credits_history (user_id, credits_taken, taken_by, taken_at) VALUES (?, ?, ?, ?)",
        )
        .run(user.id, amount, interaction.user.id, Date.now());

      db.prepare(
        "UPDATE credits SET credits = credits - ? WHERE user_id = ?",
      ).run(amount, user.id);

      if (removeCredits) {
        return interaction.editReply(
          `Successfully removed **${amount}** credits from **${user}**.`,
        );
      }
    }

    if (subcommand === "top") {
      await interaction.deferReply();

      const topCredits = db
        .prepare("SELECT * FROM credits ORDER BY credits DESC LIMIT 10")
        .all();

      const yourCredits = db
        .prepare("SELECT * FROM credits WHERE user_id = ?")
        .get(interaction.user.id).credits;

      const yourPlace = topCredits.findIndex((u) => u.credits === yourCredits);

      const topCreditsEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Top Credits")
        .setDescription("The top 10 users with the most credits in the server.")
        .setFooter({ text: `Your position: ${yourPlace}` });

      topCredits.forEach((user) => {
        topCreditsEmbed.addFields({
          name: `<@${user.user_id}>`,
          value: `**Credits:** ${user.credits}`,
          inline: true,
        });
      });

      return interaction.editReply({ embeds: [topCreditsEmbed] });
    }

    if (subcommand === "view") {
      const isAdmin = interaction.member.permissions.has("Administrator");
      if (!isAdmin) {
        return interaction.reply(
          "You do not have permission to use this command.",
        );
      }

      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");

      const credits = db
        .prepare("SELECT * FROM credits WHERE user_id = ?")
        .get(user.id);

      if (!credits) {
        return interaction.editReply("User not found.");
      }

      const viewCreditsEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Credits")
        .setDescription(
          `The user **${user}** has **${credits.credits}** credits.`,
        )
        .setFooter({ text: "Northside Customs" });

      return interaction.editReply({ embeds: [viewCreditsEmbed] });
    }

    if (subcommand === "history") {
      const isAdmin = interaction.member.permissions.has("Administrator");
      if (!isAdmin) {
        return interaction.reply(
          "You do not have permission to use this command.",
        );
      }

      await interaction.deferReply({ ephemeral: true });

      const user = interaction.options.getUser("user");

      const creditsHistory = db
        .prepare("SELECT * FROM credits_history WHERE user_id = ?")
        .all(user.id);

      if (!creditsHistory) {
        return interaction.editReply("User not found.");
      }

      const historyEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Credits History")
        .setDescription(
          creditsHistory
            .map((h) => {
              return `• ${h.credits_given || -h.credits_taken} - <@${h.given_by || h.taken_by}>`;
            })
            .join("\n"),
        )
        .setFooter({ text: "Northside Customs" });

      return interaction.editReply({ embeds: [historyEmbed] });
    }
  },
};
