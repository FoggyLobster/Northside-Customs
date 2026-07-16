const { EmbedBuilder } = require("discord.js");

function getPrefixCmds() {
  const cmds = [];
  client.prefixCommands.forEach((cmd) => {
    cmds.push(`\`${cmd.name}\``);
  });
  return cmds.join("\n");
}

function getSlashCmds() {
  const cmds = [];
  client.slashCommands.forEach((cmd) => {
    cmds.push(`\`${cmd.name}\``);
  });
  return cmds.join("\n");
}

module.exports = {
  customId: "helpmenu",

  async execute(interaction) {
    const selected = interaction.values[0];

    if (selected === "prefixcmds") {
      const embed = new EmbedBuilder()
        .setTitle("Prefix Commands")
        .setDescription(getPrefixCmds())
        .setColor("Blurple");

      await interaction.reply({
        embeds: [embed],
      });
    }

    if (selected === "slashcmds") {
      const embed = new EmbedBuilder()
        .setTitle("Slash Commands")
        .setDescription(getSlashCmds())
        .setColor("Blurple");

      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
