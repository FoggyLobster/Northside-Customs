module.exports = {
  name: "close",
  description: "Closes the ticket.",
  execute(interaction) {
    interaction.reply("Closing the ticket...");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    sleep(5000).then(() => {
      interaction.channel.delete();
    });
  },
};
