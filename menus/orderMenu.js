const { ChannelType, PermissionFlagsBits } = require("discord.js");

const Support_roles = ["1520836300461183169"];

module.exports = {
  customId: "order_menu",

  async execute(interaction) {
    const selected = interaction.values[0];

    const ticketCategory = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildCategory && channel.name === "Orders",
    );

    if (!ticketCategory) {
      return interaction.reply({
        content: "Could not find the **Orders** category.",
        ephemeral: true,
      });
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `${selected}-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: ticketCategory.id,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        ...Support_roles.map((role) => ({
          id: role,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        })),
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: interaction.guild.members.me.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels,
          ],
        },
      ],
    });

    await interaction.reply({
      content: `Created ticket channel: ${ticketChannel}`,
      ephemeral: true,
    });

    await ticketChannel.send({
      content: `Welcome ${interaction.user}! You selected **${selected}**. A staff member will assist you shortly.`,
    });
  },
};
