const { EmbedBuilder, Collection } = require("discord.js");

function getPrefixCmds(client) {
  client.prefixCommands = new Collection();
  const cmds = [];

  client.prefixCommands.forEach((command) => {
    cmds.push(`\`${command.name}\``);
  });

  return cmds.length ? cmds.join("\n") : "No prefix commands found.";
}

function getSlashCmds(client) {
  client.slashCommands = new Collection();
  const cmds = [];

  client.slashCommands.forEach((command) => {
    cmds.push(`\`/${command.data?.name || command.name}\``);
  });

  return cmds.length ? cmds.join("\n") : "No slash commands found.";
}

module.exports = {
  customId: "helpmenu",

  async execute(interaction, client) {
    const selected = interaction.values[0];

    let embed;

    if (selected === "prefixcmds") {
      embed = new EmbedBuilder()
        .setTitle("📖 Prefix Commands")
        .setDescription(getPrefixCmds(client))
        .setColor("Blurple");
    }

    if (selected === "slashcmds") {
      embed = new EmbedBuilder()
        .setTitle("⚡ Slash Commands")
        .setDescription(getSlashCmds(client))
        .setColor("Blurple");
    }

    if (!embed) return;

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
