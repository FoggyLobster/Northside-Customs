module.exports = {
  name: "kick",
  description: "Kicks a user from the server.",
  usage: "kick <user_mention/user_id> <reason>",
  args: true,
  guildOnly: true,
  permissions: ["KickMembers"],

  async execute(client, message, args) {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.reply("Please provide a valid user to kick.");
    }

    const reason = args.slice(1).join(" ");

    if (!reason) {
      return message.reply("Please provide a reason.");
    }

    if (member.id === message.author.id) {
      return message.reply("You can't kick yourself.");
    }

    if (member.id === client.user.id) {
      return message.reply("You can't kick me.");
    }

    if (!member.kickable) {
      return message.reply(
        "I can't kick this member. They may have a higher role than me or I don't have permission.",
      );
    }

    try {
      await member.kick(reason);

      return message.reply(`Kicked **${member.user.tag}** for **${reason}**.`);
    } catch (err) {
      console.error(err);

      return message.reply(`Failed to kick **${member.user.tag}**.`);
    }
  },
};
