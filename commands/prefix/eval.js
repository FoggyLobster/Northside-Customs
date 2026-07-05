const { EmbedBuilder } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",

  async execute(message, args) {
    if (message.author.id !== "1062166609931804702") return;

    const code = args.join(" ");

    let evalMessage = null;
    let embed = null;
    let firstSend = true;

    const originalSend = message.channel.send.bind(message.channel);

    // Hook channel.send
    message.channel.send = async (...sendArgs) => {
      // First send from the eval
      if (firstSend) {
        firstSend = false;

        // Send the user's first message
        const sent = await originalSend(...sendArgs);

        // Measure how long it took
        const responseTime = Date.now() - startTime;

        // Create the eval embed
        embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Evaluation Result")
          .setDescription("```js\nEvaluating...\n```")
          .setFooter({
            text: `Response time: ${responseTime}ms`,
          });

        evalMessage = await originalSend({
          embeds: [embed],
        });

        return sent;
      }

      // Every other send behaves normally
      return originalSend(...sendArgs);
    };

    const startTime = Date.now();

    try {
      let evaled = await eval(code);

      if (!evalMessage) {
        // Nothing was sent during eval, so create the embed now.
        const responseTime = Date.now() - startTime;

        embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Evaluation Result")
          .setDescription("```js\nEvaluating...\n```")
          .setFooter({
            text: `Response time: ${responseTime}ms`,
          });

        evalMessage = await originalSend({
          embeds: [embed],
        });
      }

      if (typeof evaled !== "string") {
        evaled = util.inspect(evaled, {
          depth: 1,
          maxArrayLength: 25,
        });
      }

      if (process.env.TOKEN) {
        evaled = evaled.replaceAll(process.env.TOKEN, "[TOKEN REDACTED]");
      }

      if (evaled.length > 1990) {
        evaled = evaled.slice(0, 1990) + "...";
      }

      embed
        .setColor("Green")
        .setTitle("Evaluation Result")
        .setDescription(`\`\`\`js\n${evaled}\n\`\`\``);

      await evalMessage.edit({
        embeds: [embed],
      });
    } catch (err) {
      if (!evalMessage) {
        const responseTime = Date.now() - startTime;

        embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Evaluation Error")
          .setFooter({
            text: `Response time: ${responseTime}ms`,
          });

        evalMessage = await originalSend({
          embeds: [embed],
        });
      }

      embed
        .setColor("Red")
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${err.stack || err}\n\`\`\``);

      await evalMessage.edit({
        embeds: [embed],
      });
    } finally {
      // Always restore send()
      message.channel.send = originalSend;
    }
  },
};
