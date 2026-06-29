const {
  PermissionFlagsBits,
  ActionRowBuilder,
  ContainerBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  id: "order_menu",

  async execute(interaction) {
    const selected = interaction.options.get[`order_menu`];
    const ticketCategory = interaction.guild.channels.cache.find(
      (channel) => channel.name === "tickets",
    );

    if (!ticketCategory) {
      return interaction.reply({
        content: "Could not find the tickets category.",
        ephemeral: true,
      });
    }

    const ticketChannel = client.channel.create(
      interaction.guild.id,
      {
        name: `${selected}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: ticketCategory.id,
      },
      await PermissionFlagsBits.has({
        member: interaction.member,
        permissions: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageChannels,
        ],
        inherited: true,
      }),
    );

    await interaction.reply({
      content: `Created ticket channel ${ticketChannel.name}`,
      ephemeral: true,
    });

    await ticketChannel.send({
      content: `Welcome to the ${selected} ticket channel, ${interaction.user.username}!`,
    });
  },
};
