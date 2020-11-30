const fetch = require("node-fetch");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.checkProductStatus = (event, context) => {
  const message = event.data ? event.data : "Hello, World";
  console.log(message);

  (async () => {
    const response = await fetch(
      "https://www.amazon.com/PlayStation-5-Digital/dp/B08FC6MR62"
      // "https://www.amazon.com/DualSense-Wireless-Controller-PlayStation-5/dp/B08FC6C75Y"
    );
    const body = await response.text();
    try {
      if (body.includes("Currently unavailable.")) {
        sendSlackMessage("Product unavailable.");
      } else {
        sendSlackMessage("Product in stock!");
      }
    } catch (error) {
      console.error(error);
    }
  })().catch(console.error);
};

async function sendSlackMessage(message) {
  const bodyJSON = JSON.stringify({
    text: message
  });
  const response = await fetch(
    "https://hooks.slack.com/services/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",
    {
      method: "POST",
      body: bodyJSON
    }
  );
  console.log("slack message sent with status", response.status);
}
