const { Client } = require("@gradio/client");

let client = null;

async function getClient() {
  if (!client) {
    client = await Client.connect(
      "hammad135/snap2fix-classifier"
    );
  }
  return client;
}

module.exports = getClient;