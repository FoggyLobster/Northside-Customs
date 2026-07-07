const { SlashCommandBuilder } = require("discord.js");
const db = require("../db");

function generateBotId(length = 8) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  data: new SlashCommandBuilder()

    .setName("add")
    .setDescription("Adds a bot to the database to host it")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot")
        .setDescription("Adds a bot to the database to host it")
        .addStringOption((option) =>
          option
            .setName("repo_url")
            .setDescription("The url of the repo to copy")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("branch")
            .setDescription("The branch to copy")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand == "bot") {
      await interaction.deferReply({ ephemeral: true });

      const repo_url = interaction.options.getString("repo_url");
      const branch = interaction.options.getString("branch");

      const botId = generateBotId();

      await db
        .prepare(
          `
            INSERT INTO bot_hosting (bot_id, repo_url, branch, add_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            `,
        )
        .run(botId, repo_url, branch, Date.now(), Date.now());

      const embed = new EmbedBuilder();

      await interaction.editReply({
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: `### New bot added to hosting\n\n**Bot Id:** ${botId}\n**Branch:** ${branch}\n**Repo URL** ${repo_url}\n**Added by:** ${interaction.user}`,
              },
            ],
            accent_color: 3531776,
          },
        ],
      });
    }
  },
};
