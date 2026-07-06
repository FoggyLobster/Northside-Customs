module.exports = {
  name: "kick",
  description: "Kicks a user from the server.",
  usage: "kick <user_mention / user_id> <reason>",
  args: true,
  guildOnly: true,
  permissions: ["KICK_MEMBERS"],

  async execute(client, message, args) {
    const user =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!user) return message.reply("Please provide a user to kick.");
    if (!reason) return message.reply("Please provide a reason.");
    if (user.id === message.author.id)
      return message.reply("You can't kick yourself.");
    if (user.id === client.user.id) return message.reply("You can't kick me.");

    try {
      await user.kick({ reason });
      message.reply(`Kicked ${user.user.tag} for reason: ${reason}`);
    } catch (err) {
      message.reply(`Failed to kick ${user.user.tag} for reason: ${reason}`);
      console.error(err);
    }
  },
};
