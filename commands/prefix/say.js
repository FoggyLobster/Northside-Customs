module.exports = {
  name: "say",

  async execute(args) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    const text = args.join(" ");

    if (!text) {
      return message.reply("Please provide a message to send.");
    }

    await message.delete();
    await message.channel.send(text);
  },
};
