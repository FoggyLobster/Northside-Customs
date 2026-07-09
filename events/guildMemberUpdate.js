const { AuditLogEvent } = require("discord.js");
const antiNuke = require("../config/antiNuke");

module.exports = {
  name: "guildMemberUpdate",

  async execute(oldMember, newMember) {
    // Only detect role changes
    if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

    const logs = await newMember.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberRoleUpdate,

      limit: 1,
    });

    const entry = logs.entries.first();

    if (!entry) return;

    const executor = entry.executor;

    if (!executor) return;

    // Ignore bot actions
    if (executor.bot) return;

    const nuking = antiNuke.addAction(executor.id, "memberUpdate");

    if (nuking) {
      const member = await newMember.guild.members
        .fetch(executor.id)
        .catch(() => null);

      if (member) {
        await antiNuke.punish(member, "Mass role updates");
      }
    }
  },
};
