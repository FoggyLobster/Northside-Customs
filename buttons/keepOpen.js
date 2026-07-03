const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require("discord.js");

module.exports = {
  customId: "keep_open",

  async execute(interaction) {
    const userMention = `<@${interaction.user.id}>`;

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`# Close Request\n${userMention}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Our team feels you may no longer need assistance.\n\n" +
            "If your issue is resolved, click **Close**.\n" +
            "If you still need help, click **Keep Open**.",
        ),
      )
      .addActionRowComponents(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("crclose")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true),

          new ButtonBuilder()
            .setCustomId("keep_open")
            .setLabel("Keep Open")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
        ),
      );

    await interaction.update({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });

    await interaction.reply(
      `${interaction.user} has chosen to keep the ticket open.`,
    );
  },
};
