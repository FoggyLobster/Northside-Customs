const { Events, EmbedBuilder } = require("discord.js");
const db = require("../db");

const BOT_OWNER_ID = "1062166609931804702";
const QUARANTINE_ROLE = "1524619612078084127";

const IGNORE_CHANNELS = [
  "1521570523702755510",
  "1520789069230112933",
  "1520787312491892930",
];

const IGNORE_ROLES = ["1520794295823503441"];

const PING_LIMIT = 3;

const pingCache = new Map();

module.exports = {
  name: MessageCreate,

  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (IGNORE_CHANNELS.includes(message.channel.id)) return;

    const hasIgnoredRole = message.member.roles.cache.some((role) =>
      IGNORE_ROLES.includes(role.id),
    );

    if (hasIgnoredRole) return;

    if (!message.mentions.everyone) return;

    const userId = message.author.id;

    let data = pingCache.get(userId);

    if (!data) {
      data = {
        count: 0,
      };
    }

    data.count++;

    pingCache.set(userId, data);

    try {
      await message.delete();
    } catch {}

    if (data.count >= PING_LIMIT) {
      const member = message.member;

      if (member.id === message.guild.ownerId) {
        return;
      }

      if (
        member.roles.highest.position >=
        message.guild.members.me.roles.highest.position
      ) {
        return;
      }

      if (member.roles.cache.has(QUARANTINE_ROLE)) {
        return;
      }

      const quarantineRole = message.guild.roles.cache.get(QUARANTINE_ROLE);

      if (!quarantineRole) {
        return;
      }

      if (
        quarantineRole.position >=
        message.guild.members.me.roles.highest.position
      ) {
        return;
      }

      const roles = member.roles.cache
        .filter(
          (role) =>
            role.id !== message.guild.id &&
            role.id !== QUARANTINE_ROLE &&
            !role.managed &&
            role.position < message.guild.members.me.roles.highest.position,
        )
        .map((role) => role.id);

      db.prepare(
        "INSERT OR REPLACE INTO restoring_roles (user_id, roles_removed) VALUES (?, ?)",
      ).run(member.id, JSON.stringify(roles));

      const rolesToRemove = member.roles.cache.filter(
        (role) =>
          role.id !== message.guild.id &&
          role.id !== QUARANTINE_ROLE &&
          !role.managed &&
          role.position < message.guild.members.me.roles.highest.position,
      );

      try {
        if (rolesToRemove.size > 0) {
          await member.roles.remove(rolesToRemove);
        }

        await member.roles.add(QUARANTINE_ROLE);
      } catch (err) {
        console.error(err);
        return;
      }

      await member
        .send(
          `You have been quarantined in ${message.guild.name}.\n\nReason: Mass pinging`,
        )
        .catch(() => {});

      const owner = await message.client.users
        .fetch(BOT_OWNER_ID)
        .catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle("User Quarantined")
        .setColor(0xff0000)
        .setDescription(
          `User: <@${member.id}>\n` +
            `User ID: ${member.id}\n` +
            `Reason: Mass pinging\n` +
            `Channel: ${message.channel.name}`,
        )
        .addFields({
          name: "Roles Removed",
          value: `${roles.length}`,
        })
        .setTimestamp();

      if (owner) {
        await owner
          .send({
            embeds: [embed],
          })
          .catch(() => {});
      }

      pingCache.delete(userId);
    }
  },
};
