const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();

require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/modalHandler")(client);
require("./handlers/menuHandler")(client);
require("./handlers/buttonHandler")(client);

client.login(process.env.DISCORD_TOKEN);
