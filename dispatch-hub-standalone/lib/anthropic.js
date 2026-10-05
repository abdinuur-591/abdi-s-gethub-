const Anthropic = require("@anthropic-ai/sdk");

// Reads your API key from the environment — NEVER hardcode it here.
// Set ANTHROPIC_API_KEY in your Vercel project's Environment Variables.
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = { client };
