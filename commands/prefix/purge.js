module.exports = {
  name: "purge",
  description: "Purge messages",
  async execute(client, message, args) {
    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.reply(
        "Please provide a valid amount of messages to purge.",
      );
    }

    await message.channel.bulkDelete(amount + 1, true);

    const botMessage = await message.channel.send(
      `Successfully purged \`${amount}\` messages.`,
    );

    setTimeout(async () => {
      try {
        await botMessage.delete();
      } catch {}
    }, 5000);
  },
};
