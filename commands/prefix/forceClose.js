module.exports = {
  name: "close",
  description: "Closes the ticket.",
  async execute(message) {
    const hasRoles = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRoles && !isAdmin) {
      return message.reply("You do not have permission to close this ticket.");
    }

    const ticketChannel = message.guild.channels.cache.find((channel) =>
      channel.name.startsWith(["order-", "support-"]),
    );

    if (!ticketChannel) {
      return message.reply("This is not a ticket channel.");
    }

    const ticket = db
      .prepare("SELECT * FROM tickets WHERE id = ?")
      .get(ticketId);

    if (!ticket) {
      return message.reply("Ticket not found in the database.");
    }

    const ticketOwner = await interaction.client.users.fetch(ticket.user_id);

    if (!ticketOwner) {
      return message.reply("Ticket owner not found in the database.");
    }

    message.reply("Closing the ticket...");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(5000);

    await message.channel.delete();

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
  },
};
