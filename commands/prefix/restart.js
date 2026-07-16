const { exec } = require("child_process");

module.exports = {
  name: "restart",

  async execute(message) {
    const isOwner = message.member.id === "1062166609931804702";

    if (!isOwner) {
      return message.reploy("How bout no.");
    }

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
      "~~Restarting & Syncing **Northside** with **<:gittihub:1522693027989028884> Github.**~~\n" +
        "Restarted & Synced **Northside** with **<:gittihub:1522693027989028884> Github.**",
    );
  },
};
