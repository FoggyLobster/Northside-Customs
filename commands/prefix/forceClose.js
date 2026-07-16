const db = require("../../db");

module.exports = {
  name: "close",
  description: "Closes the ticket.",

  async execute(message) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) {
      return message.reply("You do not have permission to close this ticket.");
    }

    const isTicketChannel =
      message.channel.parent.name === "Support" ||
      message.channel.parent.name === "Orders";

    if (!isTicketChannel) {
      return message.reply("This is not a ticket channel.");
    }

    const ticket = db
      .prepare("SELECT * FROM tickets WHERE channel_id = ?")
      .get(message.channel.id);

    if (!ticket) {
      return message.reply("Ticket not found in the database.");
    }

    const ticketId = ticket.id;

    let ticketOwner;
    try {
      ticketOwner = await message.client.users.fetch(ticket.user_id);
    } catch (err) {
      return message.reply("Ticket owner could not be found.");
    }

    await message.reply("Closing the ticket...");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await message.channel.delete().catch(() => {});

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
  },
};
