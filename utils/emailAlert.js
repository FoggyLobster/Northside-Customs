const nodemailer = require("nodemailer");

let lastEmail = 0;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "northsidecustomsbot@gmail.com",
    pass: "nfmc mpvs zgln euzd",
  },
});

async function sendNukeAlert(data) {
  if (Date.now() - lastEmail < 60000) {
    return;
  }

  lastEmail = Date.now();

  await transporter.sendMail({
    from: "northsidecustomsbot@gmail.com",

    to: "brownbuster200@gmail.com",

    subject: "Discord Anti-Nuke Alert",

    text: `
ANTI-NUKE TRIGGERED

Server:
${data.guild}

User:
${data.user}

Reason:
${data.reason}

Time:
${new Date().toLocaleString()}

Actions Taken:
${data.actions}
`,
  });
}

module.exports = sendNukeAlert;
