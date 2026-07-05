module.exports = {
  name: "messageDelete",
  once: true,
  execute(client, message) {
    const embed = new client.EmbedBuilder()
      .setColor("Red")
      .setTitle("Message Deleted")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**User:** ${message.author}
**ID:** ${message.author.id}
**Channel:** ${message.channel}
**Message:** ${message.content}
`,
      )
      .setTimestamp();

    client.channels.cache.get(client.loggingChannel).send({ embeds: [embed] });
  },
};
