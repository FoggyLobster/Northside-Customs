const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "memberinfo",
  description: "Get info about a member",

  async execute(message, args) {
    const member_id = args[0];
    const member = await message.guild.members.fetch(member_id);

    if (!member) {
      return message.reply("Member not found.");
    }

    if (member_id === message.author.id) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Member Info")
        .setDescription(
          `**User:** ${member.user}\n**ID:** ${message.author.id}\n**Joined Server:** ${member.joinedAt}\n**Created At:** ${member.user.createdAt}\n**Roles:** ${member.roles.cache.map((role) => role.name).join(", ")}`,
        )
        .setTimestamp();
      message.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Member Info")
        .setDescription(
          `**User:** ${member.user}\n**ID:** ${member.user.id}\n**Joined Server:** ${member.joinedAt}\n**Created At:** ${member.user.createdAt}\n**Roles:** ${member.roles.cache.map((role) => role.name).join(", ")}`,
        )
        .setTimestamp();
      message.reply({ embeds: [embed] });
    }
  },
};
