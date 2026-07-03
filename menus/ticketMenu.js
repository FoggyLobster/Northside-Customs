const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const db = require("../db");

module.exports = {
  customId: "ticketActions",

  async execute(interaction) {
    const selected = interaction.values[0];

    if (selected === "claim") {
      await interaction.reply(`${interaction.user} has claimed the ticket.`);
    }

    if (selected === "closeSelect") {
      const ticket = db
        .prepare("SELECT * FROM tickets WHERE id = ?")
        .all(ticketId);

      await interaction.reply(`Closing the ticket...`);

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(5000);

      await interaction.channel.delete();

      const ticketOwner = tickets.user_id;
      const ticketId = tickets.id;

      await ticketOwner.send({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content:
                  "# <:BellwithNotification:1522593207672635463> Ticket Closed",
              },
              {
                type: 14,
                spacing: 1,
              },
              {
                type: 10,
                content: `The ticket with the ID  **${ticketId}** has been closed in **<:Northside:1520847420874031104> Northside Customs.** Need further assistance? Create a support ticket! Our support team will always be here to help you with any questions you may have.`,
              },
              {
                type: 14,
                spacing: 2,
              },
              {
                type: 12,
                items: [
                  {
                    media: {
                      url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a489947&is=6a4747c7&hm=4688120a4c27ea95dbd599b3ab8f28047b0e27c66d16526a6f8a9b01374ce3d8&",
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
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
