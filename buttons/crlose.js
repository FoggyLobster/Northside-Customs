module.exports = {
  customId: "crclose",

  async execute(interaction) {
    await interaction.reply({
      content: "Closing ticket...",
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(5000);

    await interaction.channel.delete();
  },
};
