module.exports = {
  id: "keep_open",

  async execute(interaction) {
    return await interaction.reply(
      `${interaction.user} has chosen to keep the ticket open.`,
    );
  },
};
