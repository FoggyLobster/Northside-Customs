const db = require("../db");

module.exports = {
  customId: "crclose",

  async execute(interaction) {
    const isTicketChannel =
      interaction.channel.name.startsWith("order-") ||
      interaction.channel.name.startsWith("support-");

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
              content: `The ticket with the ID **${ticketId}** has been closed in **Northside Customs.** Need further assistance? Create another support ticket anytime!`,
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
  },
};
