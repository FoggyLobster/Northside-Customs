const { AuditLogEvent } = require("discord.js");
const antiNuke = require("../config/antiNuke");

module.exports = {
  name: "channelDelete",

  async execute(channel) {
    const logs = await channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,

      limit: 1,
    });

    const entry = logs.entries.first();

    if (!entry) return;

    const executor = entry.executor;

    const nuking = antiNuke.addAction(executor.id, "channelDelete");

    if (nuking) {
      const member = await channel.guild.members.fetch(executor.id);

      await antiNuke.punish(member, "Mass channel deletion");
    }
  },
};
