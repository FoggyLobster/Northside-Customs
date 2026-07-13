const axios = require("axios");
const noblox = require("noblox.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "funds",
  description: `Shows the roblox groups funds`,

  async execute(message) {
    if (message.author.bot) return;

    const GROUP_ID = "573074243";
    const ROBLOSECURITY = process.env.ROBLOX_COOKIE;

    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.channel.send(
        "You do not have permission to use this command.",
      );
    }

    if (!ROBLOSECURITY && !GROUP_ID) {
      return message.channel.send(
        "Could not get group information. Please contact bot developer.",
      );
    }

    const headers = {
      Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`,
    };

    try {
      const currentFundsRes = await axios.get(
        `https://economy.roblox.com/v1/groups/${GROUP_ID}/currency`,
        { headers },
      );

      let pendingFunds = 0;

      try {
        pendingFundsRes = await axios.get(
          `https://economy.roblox.com/v1/groups/${GROUP_ID}/revenue/summary/Day`,
          { headers },
        );
      } catch (err) {
        console.log(err);
        message.reply("Something went wrong.");
      }
    } catch (err) {
      message.reply("Something went wrong.");
      console.log(err);
    }

    const currentFunds = currentFundsRes.data.robux ?? 0;
    const totalFunds = currentFunds + pendingFunds;

    const embed = new EmbedBuilder()
      .setTitle("Roblox Group Funds")
      .setDescription(
        `Current funds: ${currentFunds}\nPending funds: ${pendingFunds}\nTotal funds: ${totalFunds}`,
      )
      .setColor("Green");

    await message.reply({ embeds: [embed] });
  },
};
