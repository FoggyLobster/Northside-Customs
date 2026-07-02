const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "rename",

  async execute(message) {
    const isAdmin = message.member.permissions.has(
      PermissionsBitField.Flags.Administrator,
    );
    const hasRole = message.member.roles.cache.has([
      "1520794786758660266",
      "1520817120433406023",
      "1520836300461183169",
    ]);

    if (!isAdmin && !hasRole) {
      return;
    }

    const parent = message.channel.parent;

    if (
      !parent ||
      parent.type !== ChannelType.GuildCategory ||
      (parent.name !== "Support" && parent.name !== "Orders")
    ) {
      return message.reply(
        "You must be in a ticket channel under the Support or Orders category to use this command.",
      );
    }

    const args = message.content.trim().split(/\s+/).slice(1);
    const newName = args.join(" ");

    if (!newName) {
      return message.reply("Please provide a new channel name.");
    }

    try {
      await message.channel.setName(newName);

      return message.reply(`Successfully renamed channel to ${newName}`);
    } catch (err) {
      console.error(err);

      return message.reply("There was an error while renaming this channel.");
    }
  },
};
