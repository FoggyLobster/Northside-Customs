const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence({
      status: PresenceUpdateStatus.Idle,
      activities: [
        {
          name: "Northside Customs",
          type: ActivityType.Watching,
        },
      ],
    });
  },
};
