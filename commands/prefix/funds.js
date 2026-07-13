const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "funds",
  description: "Shows the Roblox group's funds.",

  async execute(message) {
    if (message.author.bot) return;

    const GROUP_ID = "573074243";
    const ROBLOSECURITY = process.env.ROBLOX_COOKIE;

    console.log("Cookie loaded:", !!process.env.ROBLOX_COOKIE);
    console.log("Group ID:", GROUP_ID);

    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    if (!ROBLOSECURITY || !GROUP_ID) {
      return message.reply(
        "Missing Roblox cookie or group ID. Contact the bot developer.",
      );
    }

    const headers = {
      Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`,
      "User-Agent": "Mozilla/5.0",
    };

    try {
      const currentFundsRes = await axios.get(
        `https://economy.roblox.com/v1/groups/${GROUP_ID}/currency`,
        {
          headers,
        },
      );

      const currentFunds = currentFundsRes.data.robux ?? 0;

      const pendingFunds = 0;

      const totalFunds = currentFunds + pendingFunds;

      const embed = new EmbedBuilder()

        .setTitle("Roblox Group Funds")

        .setDescription(
          `
**Current Funds**
${currentFunds.toLocaleString()} Robux

**Pending Funds**
${pendingFunds.toLocaleString()} Robux

**Total**
${totalFunds.toLocaleString()} Robux
          `,
        )

        .setColor("Green")

        .setFooter({
          text: `Requested by ${message.author.tag}`,
        })

        .setTimestamp();

      await message.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.error("Roblox Funds Error:", err.response?.data || err);

      if (err.response?.status === 401) {
        return message.reply(
          "Roblox authentication failed. Check your ROBLOX_COOKIE.",
        );
      }

      if (err.response?.status === 403) {
        return message.reply(
          "This Roblox account does not have permission to view group funds.",
        );
      }

      message.reply("Something went wrong while getting group funds.");
    }
  },
};
