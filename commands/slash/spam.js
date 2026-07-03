const { SlashCommandBuilder } = require("discord.js");

let spamInterval = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Spam a message")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start spamming messages")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to spam")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("amount")
            .setDescription("Number of messages")
            .setRequired(true)
            .addChoices(
              { name: "5", value: "5" },
              { name: "10", value: "10" },
              { name: "15", value: "15" },
              { name: "20", value: "20" },
              { name: "25", value: "25" },
              { name: "Indefinite", value: "10000" },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("Stop spamming messages"),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const isOwner = interaction.user.id === "1062166609931804702";

    if (!isOwner) {
      return interaction.reply({
        content: "You are not the owner of this bot.",
        ephemeral: true,
      });
    }

    if (subcommand === "stop") {
      if (!spamInterval) {
        return interaction.reply({
          content: "Nothing is currently being spammed.",
          ephemeral: true,
        });
      }

      clearInterval(spamInterval);
      spamInterval = null;

      return interaction.reply({
        content: "Stopped spamming.",
        ephemeral: true,
      });
    }

    const message = interaction.options.getString("message");
    const amount = parseInt(interaction.options.getString("amount"));

    if (amount === 10000) {
      if (spamInterval) {
        clearInterval(spamInterval);
      }

      spamInterval = setInterval(() => {
        interaction.channel.send(message).catch(() => {});
      }, 1500);

      return interaction.reply({
        content: "Started spamming indefinitely.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `Sending ${amount} messages...`,
      ephemeral: true,
    });

    for (let i = 0; i < amount; i++) {
      await interaction.channel.send(message);
    }
  },
};
