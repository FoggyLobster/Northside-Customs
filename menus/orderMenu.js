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

    if (selected === "livery") {
      Type = "<@&1521157922321862656>";
    } else if (selected === "uniform") {
      Type = "<@&1521157913396383764>";
    } else if (selected === "photography") {
      Type = "<@&1521157924771201185>";
    } else if (selected === "graphics") {
      Type = "<@&1521157927291846808>";
    }

    const type = selected.charAt(0).toUpperCase() + selected.slice(1);

    await ticketChannel.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: `Welcome ${interaction.user}, please standby as a **${Type} Designer** will be taking this order. Please follow the order format to give your designer details on what you'd like to receive.\n`,
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content: `## Format:\n\n\n\`\`\`Type of ${type}: \nQuantity: \nNotes: \nReference:\n\`\`\``,
            },
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521157487745699870/Screenshot_2026-06-28_125651.png?ex=6a43cfce&is=6a427e4e&hm=0d05cb4694e8b4eaef4ca013feb4bdd40966515d52f93c20c2a7ac85cf8f4156&=&format=webp&quality=lossless&width=747&height=121",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
