const { EmbedBuilder } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",

  async execute(message, args) {
    if (message.author.id !== "1062166609931804702") {
      return;
    }

    const responseTime1 = Date.now();

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

      const responseTime = Date.now() - responseTime1;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Evaluation Result")
        .setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
        .setFooter({
          text: `Response time: ${responseTime}ms`,
        });

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      const responseTime = Date.now() - responseTime1;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        .setFooter({
          text: `Response time: ${responseTime}ms`,
        });

      await message.channel.send({ embeds: [embed] });
    }
  },
};
