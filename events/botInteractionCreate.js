const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(client, interaction) {
    const loggingChannel = client.channels.cache.get(client.loggingChannel);
    if (!loggingChannel) return;

    const baseEmbed = new EmbedBuilder()
      .setColor("Green")
      .setFooter({ text: "Northside Customs" })
      .setTimestamp();

    // ================= CHAT COMMAND =================
    if (interaction.isChatInputCommand()) {
      const embed = baseEmbed.setTitle("Chat Input Command").setDescription(
        `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Command:** /${interaction.commandName}`,
      );

      return loggingChannel.send({ embeds: [embed] });
    }

    // ================= BUTTON =================
    if (interaction.isButton()) {
      const embed = baseEmbed.setTitle("Button Interaction").setDescription(
        `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Button:** ${interaction.customId}`,
      );

      return loggingChannel.send({ embeds: [embed] });
    }

    // ================= SELECT MENU =================
    if (interaction.isStringSelectMenu()) {
      const embed = baseEmbed
        .setTitle("Select Menu Interaction")
        .setDescription(
          `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Select Menu:** ${interaction.customId}
**Values:** ${interaction.values?.join(", ") || "None"}`,
        );

      return loggingChannel.send({ embeds: [embed] });
    }

    // ================= MODAL =================
    if (interaction.isModalSubmit()) {
      const embed = baseEmbed.setTitle("Modal Submit").setDescription(
        `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Modal:** ${interaction.customId}`,
      );

      return loggingChannel.send({ embeds: [embed] });
    }
  },
};
