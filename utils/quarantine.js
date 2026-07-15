const db = require("../db");

const QUARANTINE_ROLE = "1524619612078084127";

module.exports = async (member, reason) => {
  if (!member) return;

  if (member.roles.cache.has(QUARANTINE_ROLE)) return;

  if (
    member.roles.highest.position >=
    member.guild.members.me.roles.highest.position
  ) {
    return;
  }

  const roles = member.roles.cache
    .filter(
      (role) =>
        role.id !== member.guild.id &&
        role.id !== QUARANTINE_ROLE &&
        !role.managed &&
        role.position < member.guild.members.me.roles.highest.position,
    )
    .map((role) => role.id);

  db.prepare(
    "INSERT OR REPLACE INTO restoring_roles (user_id, roles_removed) VALUES (?, ?)",
  ).run(member.id, JSON.stringify(roles));

  try {
    if (roles.length > 0) {
      await member.roles.remove(roles);
    }

    await member.roles.add(QUARANTINE_ROLE);
  } catch (err) {
    console.error(err);
    return;
  }

  await member
    .send(
      `You have been quarantined in ${member.guild.name}.\n\nReason: ${reason}`,
    )
    .catch(() => {});
};
