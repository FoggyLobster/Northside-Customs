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
          { name: "5", value: "5" },
          { name: "10", value: "10" },
          { name: "15", value: "15" },
          { name: "20", value: "20" },
          { name: "25", value: "25" },
          { name: "Indefinite", value: "6" },
        ),
    ),

  async execute(interaction) {
    const isOwner = interaction.user.id === "1062166609931804702";

    if (!isOwner) {
      return interaction.reply("You are not the owner of this bot.");
    }
    const amount = interaction.options.get("amount").value;
    const message = interaction.options.get("message").value;

    if (amount === "6") {
      Amount = "Indefinitely";
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
