module.exports = {
  name: "restart",

  async execute(message) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return;
    }

    const { exec } = require("child_process");
    exec("pm2 restart Northside", (error, stdout, stderr) => {
      if (error) {
        return message.reply(
          `Failed to restart Northside:\n\`\`\`\n${error.message}\n\`\`\``,
        );
      }

      const output = (stdout || stderr).trim();

      if (!output) {
        return message.reply("Failed to restart Northside.");
      }

      message.reply(`Restarted Northside.\n\`\`\`\n${output}\n\`\`\``);
    });
  },
};
