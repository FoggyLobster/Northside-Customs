const { EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "ticketRename",
  async execute(interaction) {
    const name = interaction.fields.getTextInputValue("ticketName");

    await interaction.channel.setName(name);

    const embed = new EmbedBuilder()
      .setTitle("Ticket Renamed")
      .setDescription(`Ticket has been renamed to \`${name}\``)
      .setFooter({
        text: `Renamed by ${interaction.user.tag} | Today at ${new Date().toLocaleTimeString()}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
