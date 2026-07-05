module.exports = {
  name: "guildMemberRemove",
  once: true,
  execute(client, member) {
    const roles = member.roles.cache.map((role) => role.toString()).join(", ");

    const embed = new client.EmbedBuilder()
      .setColor("Red")
      .setTitle("Member Left")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**User:** ${member}
**ID:** ${member.id}
**Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>
**Roles:** ${roles}
`,
      )
      .setTimestamp();

    client.channels.cache.get(client.loggingChannel).send({ embeds: [embed] });
  },
};
