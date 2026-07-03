const { ChannelType, PermissionFlagsBits } = require("discord.js");
const db = require("../db");

function generateId() {
  let id;

  do {
    id = Math.floor(10000 + Math.random() * 90000);
  } while (db.prepare("SELECT 1 FROM tickets WHERE id = ?").get(id));

  return id;
}

module.exports = {
  customId: "supportDesk",

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const selected = interaction.values[0];

    const ticketCategory = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildCategory &&
        channel.name === "Support",
    );

    if (!ticketCategory) {
      return interaction.editReply({
        content: "Could not find the **Support** category.",
      });
    }

    const ticketExists = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.name.startsWith("support-") &&
        channel.name.endsWith(interaction.user.username),
    );

    if (ticketExists) {
      return interaction.editReply({
        content: "A ticket already exists for this user.",
      });
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `support-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: ticketCategory.id,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
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

    await interaction.editReply({
      content: `Created ticket channel: ${ticketChannel}`,
    });

    const ticketId = generateId();

    db.prepare(
      `INSERT INTO tickets (id, user_id, opened_at) VALUES (?, ?, ?)`,
    ).run(ticketId, interaction.user.id, Date.now());

    if (selected === "general_support") {
      ticketType = "General Support";
    } else if (selected === "high_rank") {
      ticketType = "High Rank Support";
    }

    const ticketOwner = interaction.user;
    const ticketOwnerID = interaction.user.id;

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
              content: `${ticketOwner} | @here

Hello, ${ticketOwner}. A support member will be with you shortly.

Please describe your issue in as much detail as possible and include any relevant evidence.

**Ticket Type:** ${ticketType}
**Ticket Owner:** ${ticketOwner} (\`${ticketOwnerID}\`)

Please remain patient. If you have not received a response within 12 hours, you may ping the support team once. Excessive pinging may result in moderation action or closure of this ticket.`,
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
                  custom_id: "ticketActions",
                  placeholder: "Ticket Actions",
                  min_values: 1,
                  max_values: 1,
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
                      label: "Rename Ticket",
                      value: "rename",
                      description: "Rename this ticket",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
