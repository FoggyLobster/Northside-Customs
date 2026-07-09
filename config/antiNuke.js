const sendNukeAlert = require("../utils/emailAlert");

const actions = new Map();

const config = {
  limits: {
    ban: {
      amount: 5,
      timeframe: 10000,
    },

    kick: {
      amount: 5,
      timeframe: 10000,
    },

    channelDelete: {
      amount: 3,
      timeframe: 10000,
    },

    roleDelete: {
      amount: 5,
      timeframe: 10000,
    },

    memberUpdate: {
      amount: 5,
      timeframe: 10000,
    },

    everyonePing: {
      amount: 5,
      timeframe: 5000,
    },
  },

  quarantineRole: "1524619612078084127",
};

function addAction(userId, type) {
  const key = `${userId}-${type}`;

  if (!actions.has(key)) {
    actions.set(key, []);
  }

  const timestamps = actions.get(key);

  timestamps.push(Date.now());

  const filtered = timestamps.filter(
    (time) => Date.now() - time < config.limits[type].timeframe,
  );

  actions.set(key, filtered);

  return filtered.length >= config.limits[type].amount;
}

async function punish(member, reason) {
  if (!member) return;

  const roles = member.roles.cache.filter(
    (role) =>
      role.id !== member.guild.id &&
      role.position < member.guild.members.me.roles.highest.position,
  );

  await member.roles.remove(roles).catch(console.error);

  await member.roles.add(config.quarantineRole).catch(console.error);

  await sendNukeAlert({
    guild: member.guild.name,

    user: member.user.tag,

    reason: reason,

    actions: `
- Removed roles
- Added quarantine role
`,
  });
}

module.exports = {
  addAction,

  punish,

  config,
};
