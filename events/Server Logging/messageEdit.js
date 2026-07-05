module.exports = {
  name: "messageEdit",
  once: true,
  execute(client, oldMessage, newMessage) {
    const embed = new client.EmbedBuilder()
      .setColor("Green")
      .setTitle("Message Edited")
      .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**User:** ${newMessage.author}
**ID:** ${newMessage.author.id}
**Channel:** ${newMessage.channel}
**Message:** ${newMessage.content}
**Old Message:** ${oldMessage.content}
`,
      )
      .setTimestamp();

    client.channels.cache.get(client.loggingChannel).send({ embeds: [embed] });
  },
};
