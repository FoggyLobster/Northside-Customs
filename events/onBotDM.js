const { Events } = require("discord.js");

module.exports = {
  // when the bot receives a DM
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const logChannel = message.guild.channels.cache.get("1527120603478229163");
    if (!logChannel) {
      console.log("Could not find log channel. (Bot DMing)");
    }

    const userId = message.author.id;

    await logChannel.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://media.discordapp.net/attachments/1520826464948322334/1521157487745699870/Screenshot_2026-06-28_125651.png?ex=6a58e7ce&is=6a57964e&hm=14ccc35147471a4b9b2552a8aa451559729f565485e40bb39a1474ff0eb9bb93&=&format=webp&quality=lossless&width=747&height=121",
                  },
                },
              ],
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 10,
              content: `## <:BellwithNotification:1522593207672635463> DM Received\n\n***I have received a DM from <@${userId}>. Their DM content can be found below, and a button for if you'd like to respond.***\n\n\`\`\`${message}\`\`\``,
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  style: 2,
                  type: 2,
                  label: "Respond Here",
                  flow: {
                    actions: [],
                  },
                  custom_id: "respond",
                },
              ],
            },
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png?ex=6a591407&is=6a57c287&hm=fdfef6c25f3c0351a2247cb78bc1b82e76cb1612e36f33717d9735220eb5aa7b&",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
