const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("designer")
    .setDescription("Add a note to a designer.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("note")
        .setDescription("Add a note to a designer.")
        .addUserOption((option) =>
          option
            .setName("designer")
            .setDescription("The designer to add a note to.")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("note")
            .setDescription("The note to add.")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "note") {
      const designer = interaction.options.getUser("designer");
      const note = interaction.options.getString("note");

      const isManager = interaction.member.roles.cache.has(
        "1520794786758660266",
      );
      const isAdmin = interaction.member.permissions.has("Administrator");

      if (!isManager && !isAdmin) {
        return interaction.reply(
          "You do not have permission to use this command.",
        );
      }

      const designerUser = interaction.options.getUser("designer");

      const designerMember = await interaction.guild.members.fetch(
        designerUser.id,
      );

      const isDesigner = designerMember.roles.cache.has("1520836300461183169");

      if (!isDesigner) {
        return interaction.reply("This user is not a designer.");
      }

      const logChannel = await interaction.guild.channels.fetch(
        "1526073715417153556",
      );

      const designerId = designer.id;

      const msg = await interaction.reply({
        content: "Adding note...",
        ephemeral: true,
      });

      await logChannel.send({
        embeds: [
          {
            title: "New Designer Note",
            description: `**Designer:** ${designer}\n**Note:** ${note}`,
            color: 0xff0000,
            timestamp: new Date(),
          },
        ],
      });

      await msg.edit({
        content: `Note added to <@${designer.id}>.`,
      });
    }
  },
};
