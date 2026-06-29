const {
  ContainerBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "services",

  execute(client, message) {
    const isAdmin = message.member.permissions.has("ADMINISTRATOR");
  },
};
