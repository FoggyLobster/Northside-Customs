const { EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  name: "errors",
  description: "Shows the last 10 PM2 error log entries.",

  async execute(message) {
    exec(
      "pm2 logs Northside --err --lines 10 --nostream",
      (error, stdout, stderr) => {
        if (error) {
          return message.reply(
            `Failed to get PM2 logs:\n\`\`\`\n${error.message}\n\`\`\``,
          );
        }

        const output = (stdout || stderr).trim();

        if (!output) {
          return message.reply("No recent PM2 error logs found.");
        }

        const embed = new EmbedBuilder()
          .setTitle("Recent PM2 Errors")
          .setColor(0xff0000)
          .setDescription("```" + output.substring(0, 4000) + "```");

        message.channel.send({ embeds: [embed] });
      },
    );
  },
};
