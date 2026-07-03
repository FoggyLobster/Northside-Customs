const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Spam a message")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to spam")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to spam")
        .setRequired(true)
        .addChoices(
          { name: "5", value: "1" },
          { name: "10", value: "2" },
          { name: "15", value: "3" },
          { name: "20", value: "4" },
          { name: "25", value: "5" },
          { name: "Indefinite", value: "6" },
        ),
    ),

  async execute(interaction) {
    const amount = interaction.options.get("amount").value;
    const message = interaction.options.get("message").value;

    if (amount === "6") {
      Amount = Indefinitely;
    }

    await interaction.reply(`Spamming ${amount} messages...`, {
      ephemeral: true,
    });

    if (amount === ["1", "2", "3", "4", "5"].includes(amount)) {
      await interaction.channel.send(message);
    }

    if (amount === "6") {
      for (let i = 0; i < 100; i++) {
        await interaction.channel.send(message);
      }
    } else {
      for (let i = 0; i < amount; i++) {
        await interaction.channel.send(message);
      }
    }
  },
};
