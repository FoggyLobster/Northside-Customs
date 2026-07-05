module.exports = {
  name: "guildMemberAdd",
  once: true,
  execute(client, member) {
    const embed = new client.EmbedBuilder()
      .setColor("Green")
      .setTitle("Member Joined")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**User:** ${member}
**ID:** ${member.id}
**Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>
**Created At:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>
`,
      )
      .setTimestamp();

    client.channels.cache.get(client.loggingChannel).send({ embeds: [embed] });
  },
};
