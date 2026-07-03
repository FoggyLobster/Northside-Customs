const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db");

function generateId() {
  let id;

  do {
    id = Math.floor(10000 + Math.random() * 90000);
  } while (db.prepare("SELECT 1 FROM quality_control WHERE id = ?").get(id));

  return id;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qc")
    .setDescription("Create a quality control entry")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("submit")
        .setDescription("Submit a quality control entry")
        .addUserOption((option) =>
          option
            .setName("customer")
            .setDescription("The customer")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("order_type")
            .setDescription("The product")
            .setRequired(true)
            .addChoices(
              { name: "Livieries", value: "Livieries" },
              { name: "Uniforms", value: "Uniforms" },
              { name: "Photography", value: "Photography" },
              { name: "Graphic Design", value: "Graphic Design" },
            ),
        )
        .addAttachmentOption((option) =>
          option
            .setName("product")
            .setDescription("The product image")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View a user's quality control entries")
        .addUserOption((option) =>
          option
            .setName("designer")
            .setDescription("The designer")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Remove a quality control entry")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the quality control entry to remove")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the void")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "submit") {
      const customer = interaction.options.getUser("customer");
      const order_type = interaction.options.getString("order_type");
      const productImage = interaction.options.getAttachment("product");

      const QCId = generateId();

      const channel = await interaction.guild.channels.fetch(
        "1520789853925544067",
      );

      await channel.send({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: `## <:ShieldWork:1522427022863765625> Quality Control Submission\n\n### Details can be found below:\n\n**Designer:** ${interaction.user}\n**Customer:** ${customer}\n**Design Type:** ${order_type}\n\n**An image can be found below if it was provided.**`,
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
                      url: productImage.url,
                    },
                  },
                ],
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
                      url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a47f087&is=6a469f07&hm=6fa6d4b3f17f6e758756955e1fd72dd76e10b9fb263e00bdcdd7ab2e34eb909f&",
                    },
                  },
                ],
              },
              {
                type: 10,
                content: `**ID:** \`${QCId}\``,
              },
            ],
            accent_color: 1644825,
          },
        ],
      });

      await db
        .prepare(
          `INSERT INTO quality_control (
                id,
                creator,
                creator_id,
                customer,
                customer_id,
                product,
                product_image_url,
                timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          QCId,
          interaction.user.tag ?? interaction.user.username,
          interaction.user.id,
          customer.tag ?? customer.username,
          customer.id,
          order_type,
          productImage.url,
          Date.now(),
        );

      return interaction.reply(
        `Successfully submitted a quality control entry for ${customer}.`,
      );
    }

    if (subcommand === "list") {
      const designer = interaction.options.getUser("designer");

      const QC = db
        .prepare("SELECT * FROM quality_control WHERE id = ?")
        .all(creator_id);

      const formatted = QC.map(
        (QC) =>
          `**ID:** \`${QC.id}\`\n**Designer:** <@${QC.creator_id}>\n**Customer:** <@${QC.customer_id}>\n**Design Type:** ${QC.order_type}\n**Image:** ${QC.product_image_url}`,
      ).join("\n\n");

      return interaction.reply({
        embeds: [
          {
            color: 0x2b2d31,
            title: `Quality Control Entries`,
            description: formatted,
          },
        ],
        ephemeral: true,
      });
    }

    if (subcommand === "void") {
      const QCId = interaction.options.getInteger("id");
      const reason = interaction.options.getString("reason");

      const voidedQC = db
        .prepare("SELECT * FROM quality_control WHERE id = ?")
        .get(QCId);

      if (!voidedQC) {
        return interaction.reply({
          content: `No QC entry with ID #${QCId} exists.`,
          ephemeral: true,
        });
      }

      await voidedQC.creator_id.send({
        content: `The QC Submission with ID #${QCId} has been voided for the following reason: ${reason}`,
      });

      db.prepare("DELETE FROM quality_control WHERE id = ?").run(QCId);

      return interaction.reply({
        content: `Successfully voided QC entry #${QCId}.`,
        ephemeral: true,
      });
    }
  },
};
