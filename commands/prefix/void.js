const db = require("../../db");

module.exports = {
  name: "void",
  description: "Voids an infraction.",

  async execute(message, args) {
    const isManager = message.member.roles.cache.has("1520794786758660266");
    const isAdmin = message.member.permissions.has("Administrator");

    if (!isManager && !isAdmin) {
      return message.reply("You do not have permission to use this command.");
    }

    const infractionId = args[0];

    if (!infractionId) {
      return message.reply("Please provide an infraction ID.");
    }

    const infraction = db
      .prepare("SELECT * FROM infractions WHERE id = ?")
      .get(infractionId);

    if (!infraction) {
      return message.reply("Infraction not found in the database.");
    }

    const issuer = await message.client.users.fetch(infraction.issuer_id);

    const msg = await message.reply("Voiding the infraction...");

    await issuer.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content:
                "# <:BellwithNotification:1522593207672635463> Infraction Voided",
            },
            {
              type: 14,
              spacing: 1,
            },
            {
              type: 10,
              content: `The infraction with the ID **${infractionId}** has been voided in **Northside Customs.** Need further assistance? Create another support ticket anytime!`,
            },
            {
              type: 14,
              spacing: 2,
            },
            {
              type: 12,
              items: [
                {
                  media: {
                    url: "https://cdn.discordapp.com/attachments/1520826464948322334/1521567358643339444/image.png",
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    db.prepare("DELETE FROM infractions WHERE id = ?").run(infractionId);

    await msg.edit({
      content: `Infraction with ID ${infractionId} has been voided.`,
    });
  },
};
