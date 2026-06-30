const { SlashCommandBuilder } = require("discord.js");
const db = require("../../db");

function generateId() {
  let id;

  do {
    id = Math.floor(10000 + Math.random() * 90000);
  } while (db.prepare("SELECT 1 FROM infractions WHERE id = ?").get(id));

  return id;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("infraction")
    .setDescription("Manage infractions.")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("issue")
        .setDescription("Add an infraction.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add an infraction for.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("The type of infraction.")
            .setRequired(true)
            .addChoices(
              { name: "Notice", value: "Notice" },
              { name: "Warning", value: "Warning" },
              { name: "Strike", value: "Strike" },
              { name: "Termination", value: "Termination" },
              { name: "Other", value: "Other" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the infraction.")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View a user's infractions.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view.")
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Remove an infraction from a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove an infraction from.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the infraction to remove.")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "issue") {
      const hasRole = interaction.member.roles.cache.has("1520836300461183169");
      const isAdmin = interaction.member.permissions.has("Administrator");

      if (!isAdmin && !hasRole) {
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const issuer = interaction.user;
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");
      const infractionType = interaction.options.getString("type");

      const infractionId = generateId();

      db.prepare(
        `
            INSERT INTO infractions (
                id,
                issuer,
                issuer_id,
                user,
                user_id,
                infraction_reason,
                infraction_type,
                timestamp
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).run(
        infractionId,
        issuer.tag ?? issuer.username,
        issuer.id,
        user.tag ?? user.username,
        user.id,
        reason,
        infractionType,
        Date.now(),
      );

      await interaction.editReply({
        content: `Successfully added an infraction for ${user}.`,
        ephemeral: true,
      });

      const channel = await interaction.guild.channels.fetch(
        "1521570995968938095",
      );
      const type =
        infractionType.charAt(0).toUpperCase() + infractionType.slice(1);

      if (channel?.isTextBased()) {
        await channel.send({
          flags: 32768,
          components: [
            {
              type: 17,
              components: [
                {
                  type: 10,
                  content: `## <:red_shield:1521566583149826089> Infraction Issued\n\n### Details:\n\n**Issuer:** ${interaction.user}\n**Staff Member:** <@${user.id}>\n**Type:** ${type}\n**Reason:** ${reason}\n\n-# **ID:** \`${infractionId}\``,
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
                        url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a454d87&is=6a43fc07&hm=a14461763b04455d356292857b21bdefe8393025d79f612b3ede5d12abb3fdbe&",
                      },
                      spoiler: false,
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      try {
        await user.send({
          flags: 32768,
          components: [
            {
              type: 10,
              content: "",
            },
            {
              type: 17,
              components: [
                {
                  type: 10,
                  content: `## <:red_shield:1521566583149826089> Infraction Issued

You have been issued an infraction in **Northside Customs.** Details can be found below.

### Details:

**Issuer:** ${interaction.user}
**Recipient:** <@${user.id}>
**Type:** ${type}
**Reason:** ${reason}

**ID:** \`${infractionId}\``,
                },
                {
                  type: 14,
                },
                {
                  type: 12,
                  items: [
                    {
                      media: {
                        url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a454d87&is=6a43fc07&hm=a14461763b04455d356292857b21bdefe8393025d79f612b3ede5d12abb3fdbe&",
                      },
                      spoiler: false,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } catch (err) {
        console.error("Failed to DM user:", err);
      }

      if (subcommand === "list") {
        await interaction.deferReply({ ephemeral: true });

        const infractions = db
          .prepare("SELECT * FROM infractions ORDER BY timestamp DESC")
          .all();

        if (!infractions.length) {
          return interaction.reply({
            content: "No infractions have been issued.",
            ephemeral: true,
          });
        }

        const infractionList = infractions
          .slice(0, 10)
          .map(
            (i) =>
              `**ID:** \`${i.id}\`\n**Issuer:** <@${i.issuer_id}>\n**Staff Member:** <@${i.user_id}>\n**Type:** ${i.infraction_reason}\n**Reason:** ${i.reason}`,
          )
          .join("\n\n");

        return interaction.editReply({
          embeds: [
            {
              color: 0x2b2d31,
              title: `Infractions`,
              description: infractionList,
            },
          ],
          ephemeral: true,
        });
      }

      if (subcommand === "void") {
        const infractionId = interaction.options.getInteger("id");
        const issuer = interaction.user;

        const infraction = db
          .prepare("SELECT * FROM infractions WHERE id = ?")
          .get(infractionId);

        if (!infraction) {
          return interaction.reply({
            content: "No infraction with that ID exists.",
            ephemeral: true,
          });
        }

        db.prepare("DELETE FROM infractions WHERE id = ?").run(infractionId);

        return interaction.reply({
          content: `Successfully voided infraction #${infractionId}.`,
          ephemeral: true,
        });
      }
    }
  },
};
