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

    if (selected === "unclaim") {
      await interaction.reply(`${interaction.user} has unclaimed the ticket.`);
    }

    if (selected === "closeSelect") {
      const isTicketChannel =
        interaction.channel.parent.name === "Support" ||
        interaction.channel.parent.name === "Orders";

      if (!isTicketChannel) {
        return interaction.reply("This is not a ticket channel.");
      }

      const ticket = db
        .prepare("SELECT * FROM tickets WHERE channel_id = ?")
        .get(interaction.channel.id);

      if (!ticket) {
        return interaction.reply("Ticket not found in the database.");
      }

      const ticketId = ticket.id;

      let ticketOwner;
      try {
        ticketOwner = await interaction.client.users.fetch(ticket.user_id);
      } catch (err) {
        return interaction.reply("Ticket owner could not be found.");
      }

      await interaction.reply("Closing the ticket...");

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await interaction.channel.delete();

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
                content: `Your ticket in **Northside Customs** has been closed. If you have any questions, please, do not hesitate to open another ticket!\n\n-# Ticket ID: ${ticketId} | Today at ${new Date().toLocaleTimeString()}`,
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
                      url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png",
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
