const { ChannelType, PermissionFlagsBits } = require("discord.js");
const db = require("../db");

const Support_roles = ["1520836300461183169"];

function generateTicketId() {
  let id;

  do {
    id = Math.floor(10000 + Math.random() * 90000);
  } while (db.prepare("SELECT 1 FROM tickets WHERE id = ?").get(id));

  return id;
}

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

    const ticketExists = await interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.name.startsWith("order-") &&
        channel.name.endsWith(interaction.user.username),
    );

    if (ticketExists) {
      return interaction.reply({
        content: "A ticket already exists for this user.",
        ephemeral: true,
      });
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `order-${interaction.user.username}`,
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

    const ticketId = generateTicketId();

    db.prepare(`INSERT INTO tickets (id, user_id) VALUES (?, ?)`).run(
      ticketId,
      interaction.user.id,
    );

    if (selected === "livery") {
      Type = "<@&1521157913396383764>";
    } else if (selected === "uniform") {
      Type = "<@&1521157922321862656>";
    } else if (selected === "photography") {
      Type = "<@&1521157924771201185>";
    } else if (selected === "graphic") {
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
              content: `Welcome ${interaction.user} | @here \n\n Please standby as a **${Type} Designer** will be taking this order. Please follow the order format to give your designer details on what you'd like to receive.\n`,
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
              type: 14,
              spacing: 2,
            },
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a47f087&is=6a469f07&hm=6fa6d4b3f17f6e758756955e1fd72dd76e10b9fb263e00bdcdd7ab2e34eb909f&=&format=webp&quality=lossless&width=1135&height=116",
                  },
                },
              ],
            },
            {
              type: 14,
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  options: [
                    {
                      label: "Claim",
                      value: "claim",
                      description: "Claim this ticket",
                    },
                    {
                      label: "Close this ticket",
                      value: "closeSelect",
                      description: "Close this ticket",
                    },
                    {
                      label: "Rename ticket",
                      value: "rename",
                      description: "Rename this ticket",
                    },
                  ],
                  placeholder: "Select an action to take in this ticket",
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
  },
};
