const { AuditLogEvent } = require("discord.js");
const antiNuke = require("../utils/antiNuke");

module.exports = {
  name: "guildMemberUpdate",

  async execute(member, oldMember) {
    const logs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberUpdate,

      limit: 1,
    });

    const entry = logs.entries.first();

    if (!entry) return;

    const executor = entry.executor;

    const nuking = antiNuke.addAction(executor.id, "memberUpdate");

    if (nuking) {
      const oldMemberObj = await member.guild.members.fetch(executor.id);

      await antiNuke.punish(oldMemberObj, "Mass member update");
    }
  },
};
