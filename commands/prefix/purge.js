module.exports = {
  name: "purge",
  description: "Purge messages",
  execute(message, args) {
    const amount = parseInt(args[0]);
    if (isNaN(amount)) {
      return message.reply(
        "Please provide a valid amount of messages to purge.",
      );
    }
    message.channel.bulkDelete(amount, true);

    message.reply(`Successfully purged \`${amount}\` messages.`);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    sleep(5000).then(() => {
      message.delete();
    });
  },
};
