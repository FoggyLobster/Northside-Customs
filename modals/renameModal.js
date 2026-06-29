module.exports = {
  customId: "ticketRename",
  async execute(interaction) {
    const name = interaction.fields.getTextInputValue("ticketName");

    await interaction.channel.setName(name);

    const msg = interaction.reply(`Renamed ticket to ${name}`);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(5000);
    await msg.delete();
  },
};
