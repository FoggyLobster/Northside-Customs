module.exports = {
  name: "interactionCreate",
  once: true,

  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const loggingChannel = client.channels.cache.get(client.loggingChannel);
      if (loggingChannel) {
        loggingChannel.send({
          content: `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Command:** ${interaction.commandName}
`,
        });
      }
    }

    if (interaction.isButton()) {
      const loggingChannel = client.channels.cache.get(client.loggingChannel);
      if (loggingChannel) {
        loggingChannel.send({
          content: `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Button:** ${interaction.customId}
`,
        });
      }
    }

    if (interaction.isSelectMenu()) {
      const loggingChannel = client.channels.cache.get(client.loggingChannel);
      if (loggingChannel) {
        loggingChannel.send({
          content: `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Select Menu:** ${interaction.customId}
`,
        });
      }
    }

    if (interaction.isModalSubmit()) {
      const loggingChannel = client.channels.cache.get(client.loggingChannel);
      if (loggingChannel) {
        loggingChannel.send({
          content: `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Modal:** ${interaction.customId}
`,
        });
      }
    }

    if (interaction.isCommand()) {
      const loggingChannel = client.channels.cache.get(client.loggingChannel);
      if (loggingChannel) {
        loggingChannel.send({
          content: `**User:** ${interaction.user}
**ID:** ${interaction.user.id}
**Channel:** ${interaction.channel}
**Command:** ${interaction.commandName}
`,
        });
      }
    }
  },
};
