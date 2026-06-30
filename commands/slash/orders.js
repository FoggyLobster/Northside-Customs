const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db");

function generateId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return id;
}

function generateOrderId() {
  let id;

  do {
    id = generateId(6);
  } while (db.prepare("SELECT 1 FROM order_logs WHERE id = ?").get(id));

  return id;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("order")
    .setDescription("Manage orders.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("log")
        .setDescription("Make a new order log.")
        .addUserOption((option) =>
          option
            .setName("customer")
            .setDescription("The customer.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of order.")
            .setRequired(true)
            .addChoices(
              { name: "Livery", value: "livery" },
              { name: "Uniform", value: "uniform" },
              { name: "Photography", value: "photography" },
              { name: "Graphics", value: "graphics" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("payout")
            .setDescription("The payout of the order.")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("View information about an order.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the order to view.")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "log") {
      const hasRole = interaction.member.roles.cache.has("1520836300461183169");
      const isAdmin = interaction.memmber.permissions.has("Administrator");

      if (!isAdmin && !hasRole) {
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const customer = interaction.options.getUser("customer");
      const orderType = interaction.options.getString("type");
      const payout = interaction.options.getString("payout");

      const orderId = generateOrderId();

      db.prepare(
        `INSERT INTO order_logs
          (id, designer, designer_id, customer, customer_id, order_type, timestamp, payout)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        orderId,
        interaction.user.username,
        interaction.user.id,
        customer.username,
        customer.id,
        orderType,
        Date.now(),
        payout,
      );

      await interaction.editReply({
        content: `Successfully made an order log. View it in https://discord.com/channels/1520779863064055848/1520789676326125608.`,
      });

      const channel = await interaction.guild.channels.fetch(
        "1520789676326125608",
      );

      if (channel?.isTextBased()) {
        await channel.send({
          flags: 32768,
          components: [
            {
              type: 17,
              components: [
                {
                  type: 10,
                  content: `# <:ClipBoard:1521521831880818909> Order Log\n**Designer:** ${interaction.user}\n**Customer:** ${customer}\n**Order:** ${orderType}\n**Payout:** <:robux:1521266814397714492> \`${payout}\`R$`,
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
                        url: "https://cdn.discordapp.com/attachments/1518405789503721592/1521534653222097016/image.png?ex=6a452f12&is=6a43dd92&hm=eb0c892bdc23ae40c5e895fcd12b351a770d0c846a87b0b73122554877295d0b&",
                      },
                    },
                  ],
                },
              ],
              accent_color: 1513240,
            },
          ],
        });
      }
    }

    if (subcommand === "info") {
      const hasRole = interaction.member.roles.cache.has("1520836300461183169");
      const isAdmin = interaction.memmber.permissions.has("Administrator");

      if (!isAdmin && !hasRole) {
        return;
      }

      const orderId = interaction.options.getString("id");

      const order = db
        .prepare("SELECT * FROM order_logs WHERE id = ?")
        .get(orderId);

      if (!order) {
        return interaction.reply({
          content: "No order with that ID exists.",
          ephemeral: true,
        });
      }

      return interaction.reply({
        embeds: [
          {
            color: 0x2b2d31,
            title: `Order #${orderId}`,
            description: `**Designer:** ${order.designer}\n**Customer:** ${order.customer}\n**Order:** ${order.order}\n**Payout:** <:robux:1521266814397714492> \`${order.payout}\`R$`,
            timestamp: new Date(order.timestamp),
          },
        ],
        ephemeral: true,
      });
    }
  },
};
