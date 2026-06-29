const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("services")
    .setDescription("Toggle different order services.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set which services are open or closed.")

        .addStringOption((option) =>
          option
            .setName("liveries")
            .setDescription("Toggle liveries")
            .setRequired(true)
            .addChoices(
              { name: "Open", value: "open" },
              { name: "Closed", value: "closed" },
            ),
        )

        .addStringOption((option) =>
          option
            .setName("uniforms")
            .setDescription("Toggle uniforms")
            .setRequired(true)
            .addChoices(
              { name: "Open", value: "open" },
              { name: "Closed", value: "closed" },
            ),
        )

        .addStringOption((option) =>
          option
            .setName("photography")
            .setDescription("Toggle photography")
            .setRequired(true)
            .addChoices(
              { name: "Open", value: "open" },
              { name: "Closed", value: "closed" },
            ),
        )

        .addStringOption((option) =>
          option
            .setName("graphics")
            .setDescription("Toggle graphics")
            .setRequired(true)
            .addChoices(
              { name: "Open", value: "open" },
              { name: "Closed", value: "closed" },
            ),
        ),
    ),

  async execute(interaction) {
    const liveriesStatus = interaction.options.getString("liveries");
    const uniformsStatus = interaction.options.getString("uniforms");
    const photographyStatus = interaction.options.getString("photography");
    const graphicsStatus = interaction.options.getString("graphics");

    if (liveriesStatus === "open") {
      liveries =
        "<:Opened1:1521156303299416124><:Opened2:1521156343313072240><:Opened3:1521156379858174053>";
    } else {
      liveries =
        "<:Closed1:1521156851784224818><:Closed2:1521156880200896775><:Closed3:1521156908835274885>";
    }

    if (uniformsStatus === "open") {
      uniforms =
        "<:Opened1:1521156303299416124><:Opened2:1521156343313072240><:Opened3:1521156379858174053>";
    } else {
      uniforms =
        "<:Closed1:1521156851784224818><:Closed2:1521156880200896775><:Closed3:1521156908835274885>";
    }

    if (photographyStatus === "open") {
      photography =
        "<:Opened1:1521156303299416124><:Opened2:1521156343313072240><:Opened3:1521156379858174053>";
    } else {
      photography =
        "<:Closed1:1521156851784224818><:Closed2:1521156880200896775><:Closed3:1521156908835274885>";
    }

    if (graphicsStatus === "open") {
      graphics =
        "<:Opened1:1521156303299416124><:Opened2:1521156343313072240><:Opened3:1521156379858174053>";
    } else {
      graphics =
        "<:Closed1:1521156851784224818><:Closed2:1521156880200896775><:Closed3:1521156908835274885>";
    }

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `# Services Status

The available services have been updated. Check them out below!

### Current Order Status
• **Liveries:** ${liveries}
• **Uniforms:** ${uniforms}
• **Photography:** ${photography}
• **Graphics:** ${graphics}`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder());

    await interaction.reply({
      content: "Services status updated successfully.",
      ephemeral: true,
    });

    await interaction.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
};
