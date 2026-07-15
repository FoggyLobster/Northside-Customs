const { EmbedBuilder } = require("discord.js");
const db = require("../../db");

const QUARANTINE_ROLE = "1524619612078084127";
const BOT_OWNER = "1062166609931804702";

module.exports = {
  name: "restore",
  description: "Restores a user's roles.",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("You do not have permission to use this command.");
    }

    const userId = args[0];

    if (!userId) {
      return message.reply("Please provide a user ID.");
    }

    const row = db
      .prepare("SELECT roles_removed FROM restoring_roles WHERE user_id = ?")
      .get(userId);

    if (!row) {
      return message.reply("No saved roles were found for this user.");
    }

    const roles = JSON.parse(row.roles_removed);

    const member = await message.guild.members.fetch(userId).catch(() => null);

    if (!member) {
      return message.reply("User not found.");
    }

    await member.roles.remove(QUARANTINE_ROLE).catch(() => {});

    if (roles.length > 0) {
      await member.roles.add(roles).catch(() => {});
    }

    db.prepare("DELETE FROM restoring_roles WHERE user_id = ?").run(userId);

    const botOwner = await message.client.users
      .fetch(BOT_OWNER)
      .catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle("User Restored")
      .setColor(0x00ff00)
      .setDescription(
        `User: <@${member.id}>\nIssued By: <@${message.author.id}>`,
      )
      .addFields({
        name: "Roles Restored",
        value: `${roles.length}`,
      })
      .setTimestamp();

    if (botOwner) {
      await botOwner
        .send({
          embeds: [embed],
        })
        .catch(() => {});
    }
  },
};
