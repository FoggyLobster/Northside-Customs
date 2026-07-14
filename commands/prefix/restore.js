module.exports = {
  name: "restore",
  description: "Restores a user's roles.",

  async execute(message, args) {
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    const userId = args[0];

    if (!userId) {
      return message.reply("Please provide a user ID.");
    }

    const roles = JSON.parse(
      db
        .prepare("SELECT roles_removed FROM restoring_roles WHERE user_id = ?")
        .get(userId),
    );

    if (!roles) {
      return message.reply("User not found.");
    }

    const user = await message.client.users.fetch(userId);

    if (!user) {
      return message.reply("User not found.");
    }

    await user.roles.add(roles);

    const botOwner = await message.client.users.fetch("1062166609931804702");

    const embed = new EmbedBuilder()
      .setTitle("User Restored")
      .setColor(0xff0000)
      .setDescription(
        `User <@${userId}> has been restored in **Northside Customs.**\n**Issuing user:** <@${message.author.id}>`,
      )
      .setTimestamp();

    await botOwner.send({
      embeds: [embed],
    });

    db.prepare("DELETE FROM restoring_roles WHERE user_id = ?").run(userId);

    message.reply("User roles restored.");
  },
};
