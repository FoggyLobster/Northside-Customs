const { EmbedBuilder } = require("discord.js");
const quarantine = require("../utils/quarantine");

const BOT_OWNER_ID = "1062166609931804702";

const IGNORE_CHANNELS = [
  "1521570523702755510",
  "1520789069230112933",
  "1520787312491892930",
];

const IGNORE_ROLES = ["1520794295823503441"];

const PING_LIMIT = 3;

const pingCache = new Map();

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (IGNORE_CHANNELS.includes(message.channel.id)) return;

    const hasIgnoredRole = message.member.roles.cache.some((role) =>
      IGNORE_ROLES.includes(role.id),
    );

    if (hasIgnoredRole) return;

    if (!message.mentions.everyone) return;

    let data = pingCache.get(message.author.id);

    if (!data) {
      data = {
        count: 0,
      };
    }

    data.count++;

    pingCache.set(message.author.id, data);

    await message.delete().catch(() => {});

    if (data.count >= PING_LIMIT) {
      const member = message.member;

      await quarantine(member, "Mass @everyone/@here pinging");

      const owner = await client.users.fetch(BOT_OWNER_ID).catch(() => null);

      if (owner) {
        const embed = new EmbedBuilder()
          .setTitle("Anti-Nuke Triggered")
          .setColor(0xff0000)
          .setDescription(
            `User: <@${member.id}>\n` +
              `User ID: ${member.id}\n` +
              `Action: Quarantined\n` +
              `Reason: Mass @everyone/@here pinging\n` +
              `Ping Count: ${data.count}`,
          )
          .setTimestamp();

        await owner
          .send({
            embeds: [embed],
          })
          .catch(() => {});
      }

      pingCache.delete(message.author.id);
    }
  });
};
