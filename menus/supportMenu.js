module.exports = {
  customId: "supportDesk",
  async execute(interaction) {
    const selected = interaction.values[0];

    if (selected === "general_support") {
      const ticketCategory = interaction.guild.channels.cache.find(
        (channel) => channel.type === 0 && channel.name === "Support",
      );

      if (!ticketCategory) {
        return interaction.reply({
          content: "Could not find the **Support** category.",
          ephemeral: true,
        });
      }

      const ticketExists = await interaction.guild.channels.cache.find(
        (channel) =>
          channel.type === 0 &&
          channel.name.startsWith("support-") &&
          channel.name.endsWith(interaction.user.username),
      );

      if (ticketExists) {
        return interaction.reply({
          content: "A ticket already exists for this user.",
          ephemeral: true,
        });
      }

      const ticketChannel = await interaction.guild.channels.create({
        name: `support-${interaction.user.username}`,
        type: 0,
        parent: ticketCategory.id,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
          },
          {
            id: interaction.guild.members.me.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_CHANNELS"],
          },
        ],
      });

      await interaction.reply({
        content: `Created ticket channel: ${ticketChannel}`,
        ephemeral: true,
      });

      await ticketChannel.send({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
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
              {
                type: 14,
                spacing: 2,
              },
              {
                type: 10,
                content:
                  "${interaction.user} | @here\n\nHello, ${interaction.user}. A support member will be with you shortly. In the mean time, please state your issue clearly along with anything that may help you and us. This could be the reason for the ticket, any evidence if applicable, etc. For staff, here is some information about this user and ticket.\n\n**Ticket Type:** ${ticketType}\n**Ticket Owner:** ${ticketOwner} ({ticketOwnerID})\n\nPlease remain patient and allow up to 12 hours before ping our staff team if there in no response in that timeframe. Ping excessively may lead to moderation and the closure of this ticket.",
              },
              {
                type: 14,
                spacing: 2,
              },
              {
                type: 1,
                components: [
                  {
                    type: 3,
                    options: [
                      {
                        label: "Claim Ticket",
                        value: "claim",
                        description: "Claim the current ticket",
                      },
                      {
                        label: "Close Ticket",
                        value: "closeSelect",
                        description: "Close the current ticket",
                      },
                      {
                        label: "Rename the current ticket",
                        value: "rename",
                      },
                    ],
                    placeholder: "Ticket Actions",
                    flows: {},
                    custom_id: "ticketActions",
                    min_values: 1,
                    max_values: 1,
                  },
                ],
              },
            ],
          },
        ],
      });
    }
  },
};
