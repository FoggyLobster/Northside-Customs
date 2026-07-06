const { EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "logs",
  description: "Shows the last 15 PM2 error log entries.",

  async execute(client, message, args) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    const lastErrors = args[0];
    exec(
      `pm2 logs Northside --err --lines ${lastErrors} --nostream`,
      (error, stdout, stderr) => {
        if (error) {
          return message.reply(
            `Failed to get logs:\n\`\`\`\n${error.message}\n\`\`\``,
          );
        }

        const output = (stdout || stderr).trim();

        if (!output) {
          return message.reply("No recent error logs found.");
        }
        const embed = new EmbedBuilder()
          .setTitle("Recent Errors")
          .setColor(0xff0000)
          .setDescription("```" + output.substring(0, 4000) + "```");

        message.channel.send({ embeds: [embed] });
      },
    );
  },
};
