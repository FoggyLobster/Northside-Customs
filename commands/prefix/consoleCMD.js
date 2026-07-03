const { EmebdBuilder } = require("discord.js");
const { exec } = require("child_process");
const db = require("../../db");
module.exports = {
  name: "console",
  description: "Executes a console command.",
  async execute(message, args) {
    const isOwner = message.member.id === "1062166609931804702";
    if (!isOwner) {
      return message.reply("You do not have permission to use this command.");
    }
    const cmd = args.join(" ");
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return message.reply(
          `Failed to execute command:\n\`\`\`\n${error.message}\n\`\`\``,
        );
      }
      const output = (stdout || stderr).trim();
      if (!output) {
        return message.reply("No output found.");
      }
      const embed = new EmbedBuilder()
        .setTitle("Console Command Output")
        .setColor(0xff0000)
        .setDescription("```" + output.substring(0, 4000) + "```");
      message.channel.send({ embeds: [embed] });
    });
  },
};
