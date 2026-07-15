const { EmbedBuilder } = require("discord.js");
const db = require("../../db");

const QUARANTINE_ROLE = "1524619612078084127";
const BOT_OWNER = "1062166609931804702";

module.exports = {
  name: "q",
  description: "Quarantine a user.",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("You do not have permission to use this command.");
    }

    const userId = args[0];
    const reason = args.slice(1).join(" ");

    if (!userId) {
      return message.reply("Please provide a user ID.");
    }

    if (!reason) {
      return message.reply("Please provide a reason.");
    }

    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      return message.reply("User not found.");
    }

    if (member.id === message.author.id) {
      return message.reply("You cannot quarantine yourself.");
    }

    if (member.id === message.client.user.id) {
      return message.reply("You cannot quarantine the bot.");
    }

    if (
      member.roles.highest.position >=
      message.guild.members.me.roles.highest.position
    ) {
      return message.reply(
        "I cannot quarantine this user because their highest role is above mine.",
      );
    }

    if (member.roles.cache.has(QUARANTINE_ROLE)) {
      return message.reply("This user is already quarantined.");
    }

    const roles = member.roles.cache
      .filter(
        (role) =>
          role.id !== message.guild.id &&
          role.id !== QUARANTINE_ROLE &&
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
        role.position < message.guild.members.me.roles.highest.position,
    );

    if (rolesToRemove.size > 0) {
      await member.roles.remove(rolesToRemove);
    }

    await member.roles.add(QUARANTINE_ROLE);

    await member
      .send(
        `You have been quarantined in **Northside Customs**.\n\nReason: ${reason}`,
      )
      .catch(() => {});

    const botOwner = await message.client.users
      .fetch(BOT_OWNER)
      .catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle("User Quarantined")
      .setColor(0xff0000)
      .setDescription(
        `User: <@${member.id}>\nReason: ${reason}\nIssued By: <@${message.author.id}>`,
      )
      .addFields({
        name: "Roles Removed",
        value: `${roles.length}`,
      })
      .setTimestamp();

    if (botOwner) {
      await botOwner.send({ embeds: [embed] }).catch(() => {});
    }

    await message.reply({
      embeds: [embed],
    });
  },
};
