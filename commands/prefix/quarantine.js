const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "q",
  description: "Quarantine a user.",

  async execute(message, args) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    const userId = args[0];
    const reason = args.slice(1).join(" ");

    if (!userId) {
      return message.reply("Please provide a user ID.");
    }

    if (!reason) {
      return message.reply("Please provide a reason.");
    }

    const user = await message.client.users.fetch(userId);

    if (!user) {
      return message.reply("User not found.");
    }

    await user.send({
      flags: 64,
      content: `You have been quarantined in **Northside Customs.**\nReason: ${reason}`,
    });

    const hasRoles =
      user.roles.cache.size > 0 &&
      user.roles.cache.forEach((role) => role.delete());

    await user.roles.add("1524619612078084127");

    const botOwner = await message.client.users.fetch("1062166609931804702");

    const embed = new EmbedBuilder()
      .setTitle("User Quarantined")
      .setColor(0xff0000)
      .setDescription(
        `User <@${userId}> has been quarantined in **Northside Customs.**\nReason: ${reason}\n**Issuing user:** <@${message.author.id}>`,
      )
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel("Revoke")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("revoke");

    const row = new ActionRowBuilder().addComponents(button);

    await botOwner.send({
      embeds: [embed],
      components: [row],
    });
  },
};
