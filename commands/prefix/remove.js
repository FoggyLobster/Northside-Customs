const { ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove someone from the ticket",

  async execute(message, args) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) return;

    const user_id = args[0];

    if (!user_id) {
      return message.reply("Please provide a user ID.");
    }

    const user = await message.guild.members.fetch(user_id);

    if (!user) {
      return message.reply("User not found.");
    }

    const isTicketChannel =
      message.channel.parent.name === "Support" ||
      message.channel.parent.name === "Orders";

    if (!isTicketChannel) {
      return message.reply("This is not a ticket channel.");
    }

    await message.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: false,
      SendMessages: false,
      ReadMessageHistory: false,
    });

    return message.reply(`Removed ${user} from this ticket.`);
  },
};
