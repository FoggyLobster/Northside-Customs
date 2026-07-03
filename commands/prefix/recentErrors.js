const { EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "logs",
  description: "Shows the last 15 PM2 error log entries.",

  async execute(message) {
    exec(
      "pm2 logs Northside --err --lines 15 --nostream",
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
