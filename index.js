const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.events = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();

require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/modalHandler")(client);
require("./handler/menuHandler")(client);
require("./handlers/buttonHandler")(client);

require("./deploy-commands");

setInterval(() => {
  member.client.user.setPresence({
    activities: [
      {
        name: `Looking over ${member.guild.memberCount.toLocalString()} members`,
        type: "WATCHING",
      },
    ],
    status: "idle",
  });
}, 30000);

client.login(process.env.DISCORD_TOKEN);
