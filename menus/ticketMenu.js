const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  customId: "ticketActions",

  async execute(interaction) {
    const selected = interaction.values[0];

    if (selected === "claim") {
      await interaction.reply(`${interaction.user} has claimed the ticket.`);
    }

    if (selected === "closeSelect") {
      await interaction.reply(`Closing the ticket...`);

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(5000);

      await interaction.channel.delete();
    }

    if (selected === "rename") {
      const modal = new ModalBuilder()
        .setCustomId("ticketRename")
        .setTitle("Rename Ticket")
        .setComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("ticketName")
              .setLabel("Ticket Name")
              .setStyle(TextInputStyle.Short)
              .setRequired(true),
          ),
        ]);

      await interaction.showModal(modal);
    }
  },
};
