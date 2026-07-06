const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "memberinfo",
  description: "Get info about a member",

  async execute(message, args) {
    let member;

    try {
      if (args[0]) {
        const memberId = args[0].replace(/[<@!>]/g, "");
        member = await message.guild.members.fetch(memberId);
      } else {
        member = message.member;
      }
    } catch {
      return message.reply("Member not found.");
    }

    const roles =
      member.roles.cache
        .filter((role) => role.id !== message.guild.id)
        .map((role) => role.toString())
        .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Member Info")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**User:** ${member}
**ID:** ${member.id}
**Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>
**Roles:** ${roles}`,
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  },
};
