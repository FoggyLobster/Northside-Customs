function getCmds(client) {
  const cmds = [];
  client.commands.forEach((cmd) => {
    cmds.push(`\`${cmd.name}\``);
  });
}

function getCmdInfo(cmd) {
  return `**Name:** \`${cmd.name}\`\n**Description:** ${cmd.description}\n**Usage:** \`${client.prefix}${cmd.name}\``;
  parts.join("\n");
}

if (!cmd.description) {
  return (cmd.description = "No description provided.");
}

module.exports = {
  name: "help",
  description: "Displays a list of commands or info about a specific command.",

  async execute(message) {
    const cmds = [];

    const cmdInfo = getCmdInfo(cmd);
    cmds.push(cmdInfo);

    await message.reply({
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
              content:
                "***Want to see the commands I have? Select a type from the select menu below!***",
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  options: [
                    {
                      label: "Prefix Commands",
                      value: "prefixcmds",
                    },
                    {
                      label: "Slash Commands",
                      value: "slashcmds",
                    },
                  ],
                  flows: {},
                  custom_id: "helpmenu",
                  min_values: 1,
                  max_values: 1,
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
