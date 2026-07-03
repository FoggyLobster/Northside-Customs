const { ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "add",
  description: "Add someone to the ticket",

  async execute(message, args) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) return;

    const user_id = message.split(" ")[1];

    if (!user_id) {
      return message.reply("Please provide a user ID.");
    }

    const user = await message.guild.members.fetch(user_id);

    if (!user) {
      return message.reply("User not found.");
    }

    permissionOverwrites = [
      {
        id: message.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: message.guild.members.me.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels,
        ],
      },
    ];
  },
};
