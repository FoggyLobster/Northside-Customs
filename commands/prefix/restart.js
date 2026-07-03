const { exec } = require("child_process");

module.exports = {
  name: "restart",

  async execute(message) {
    if (!message.member.permissions.has("Administrator")) return;

    const msg = await message.reply(
      "Restarting & Syncing **Northside** with **<:gittihub:1522693027989028884> Github.**",
    );

    setTimeout(() => {
      exec("git pull && pm2 restart Northside", (error) => {
        if (error) {
          console.error("PM2 sync failed:", error);
        }
      });
    }, 1000);

    msg.edit(
      "Restarted & Synced **Northside** with **<:gittihub:1522693027989028884> Github.**",
    );
  },
};
