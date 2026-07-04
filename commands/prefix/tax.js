module.exports = {
  name: "tax",
  description:
    "Get the taxed total for a robux payment (10 robux = 7 robux after tax)",
  execute(message, args) {
    const robux = args[0];
    if (robux) {
      const taxed = Math.ceil(robux * 0.7);
      message.channel.send(
        `If you got paid ${robux} robux, you would receive ${taxed} robux.\nTo get the total amount of ${robux}, you would need to charge ${robux * 1.3} robux.`,
      );
    } else {
      message.channel.send("You didn't provide a robux amount.");
    }
  },
};
