const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

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
      const customer = interaction.options.getUser("customer");
      const orderType = interaction.options.getString("type");
      const payout = interaction.options.getString("payout");

      const orderId = generateOrderId();

      db.prepare(
        `INSERT INTO order_logs
          (id, designer, designer_id, customer, customer_id, order, timestamp, payout)
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

      await interaction.reply({
        content: `Successfully made an order log. View it in https://discord.com/channels/1520779863064055848/1520789676326125608.`,
        ephemeral: true,
      });

      const channel = await interaction.guild.channels.fetch(
        "1520789676326125608",
      );

      if (channel?.isTextBased()) {
        await channel.send({
          embeds: [
            {
              color: 0x2b2d31,
              title: ` `,
              description: `# <:ClipBoard:1521521831880818909># Order Log\n\n**Designer:** ${interaction.user}\n**Customer:** ${customer}\n**Order:** ${orderType}\n**Payout:** <:robux:1521266814397714492> \`${payout}\`R$`,
              timestamp: new Date(),
              footer: {
                text: `ID: ${orderId}`,
              },
            },
          ],
        });
      }
    }

    if (subcommand === "info") {
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
