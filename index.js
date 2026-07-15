const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();
const db = require("./db");

const messageTracker = new Map();

client.db = db;

client.prefix = "$";
client.loggingChannel = "1523439975645974619";
client.credigsLoggingChannel = "1523725736848920808";

require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/modalHandler")(client);
require("./handlers/menuHandler")(client);
require("./handlers/buttonHandler")(client);
require("./handlers/antiNukeHandler")(client);

client.login(process.env.DISCORD_TOKEN);
