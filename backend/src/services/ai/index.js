import { generateNarrative as groq } from "./adapters/groqAdapter.js";

const adapters = { groq };

const provider = process.env.AI_PROVIDER || "groq";

export async function generateDigest(prompt) {
  const adapter = adapters[provider];
  if (!adapter) throw new Error(`Unknown AI provider: ${provider}`);
  return adapter(prompt);
}
