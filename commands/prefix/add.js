const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "add",
  description: "Add someone to the ticket",

  async execute(client, message, args) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) return;

    const userId = args[0];

    if (!userId) {
      return message.reply("Please provide a user ID.");
    }

    let user;
    try {
      user = await message.guild.members.fetch(userId);
    } catch {
      return message.reply("User not found.");
    }

    const isTicketChannel =
      message.channel.parent.name === "Support" ||
      message.channel.parent.name === "Orders";

    if (!isTicketChannel) {
      return message.reply("This is not a ticket channel.");
    }

    await message.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    return message.reply(`Added ${user} to this ticket.`);
  },
};
