const { exec } = require("child_process");

module.exports = {
  name: "restart",

  async execute(message) {
    if (!message.member.permissions.has("Administrator")) return;

    await message.reply("Restarting **Northside**...");

    setTimeout(() => {
      exec("pm2 restart Northside", (error) => {
        if (error) {
          console.error("PM2 restart failed:", error);
        }
      });
    }, 1000);
  },
};
