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
  name: "closerequest",

  async execute(message) {
    const hasRole = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) return;

    await message.delete().catch(() => {});

    // Safer ticket owner extraction (expects: userId-xxx OR similar)
    const ticketOwnerId = message.channel.name.split("-")[0];

    let userMention = `<@${ticketOwnerId}>`;

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`# Close Request\n${userMention}`),
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Our team feels you may no longer need assistance.\n\n" +
            "If your issue is resolved, click **Close**.\n" +
            "If you still need help, click **Keep Open** and a staff member will respond shortly.",
        ),
      )
      .addActionRowComponents(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("crclose")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
            .setCustomId("keep_open")
            .setLabel("Keep Open")
            .setStyle(ButtonStyle.Success),
        ),
      );

    await message.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
};
