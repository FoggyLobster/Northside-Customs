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

    const wantsSync = args[0];

    if (wantsSync === "sync") {
      const msg = await message.reply(
        "Restarting & Syncing **Northside** with **<:github:1501630356346896594> Github.**",
      );

      setTimeout(() => {
        exec("git pull && pm2 restart Northside", (error) => {
          if (error) {
            console.error("PM2 sync failed:", error);
          }
        });
      }, 1000);

      msg.edit(
        "Restarted & Synced **Northside** with **<:github:1501630356346896594> Github.**",
      );
    }
  },
};
