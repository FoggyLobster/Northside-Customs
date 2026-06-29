module.exports = {
  name: "close",
  description: "Closes the ticket.",
  execute(message) {
    const hasRoles = message.member.roles.cache.has("1520836300461183169");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRoles && !isAdmin) {
      return message.reply("You do not have permission to close this ticket.");
    }

    const ticketChannel = channel.name.startsWith([
      "livery-",
      "uniform-",
      "photography-",
      "graphics-",
    ]);

    if (!ticketChannel) {
      return message.reply("This is not a ticket channel.");
    }

    message.reply("Closing the ticket...");
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    sleep(5000).then(() => {
      message.channel.delete();
    });
  },
};
