const { EmbedBuilder } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",

  async execute(message, args) {
    if (message.author.id !== "1062166609931804702") {
      return;
    }
    const startTime = Date.now();

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    sleep(3);

    const EndTime = Date.now();

    const responseTime = EndTime - startTime;

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Evaluation Result")
      .setDescription("```js\nEvaluating...\n```")
      .setFooter({
        text: `Response time: ${responseTime}ms`,
      });

    const evalMessage = await message.channel.send({
      embeds: [embed],
    });

    try {
      const code = args.join(" ");

      let evaled = await eval(code);

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
      embed
        .setColor("Red")
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${err}\n\`\`\``);

      await evalMessage.edit({
        embeds: [embed],
      });
    }
  },
};
