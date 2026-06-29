module.exports = {
  name: "messageCreate",

  async execute(client, message) {
    if (message.author.bot) return;

    const prefix = ">";

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    try {
      await cmd.execute(message, args);
    } catch (err) {
      console.error(err);
      message.reply({
        content: "There was an error while executing that command!",
        ephemeral: true,
      });
    }
  },
};
