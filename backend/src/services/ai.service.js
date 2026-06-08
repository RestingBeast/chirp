import { generateDigest } from "./ai/index.js";

export async function createTeamDigest(standups) {
  if (!standups || standups.length === 0) return "No updates provided today.";

  // Format the standups into a readable string for the AI
  const formattedStandups = standups
    .map(
      (s) =>
        `Member: ${s.userId.name}\nYesterday: ${s.yesterday}\nToday: ${s.today}\nBlockers: ${s.blockers}`,
    )
    .join("\n\n---\n\n");

  const prompt = `
    You are an elite Engineering Manager. Analyze the following daily standups from a technical team.
    
    STANDUPS:
    ${formattedStandups}

    TASK:
    Generate a 3-sentence "Team Health" summary:
    1. Sentence 1: High-level progress made yesterday.
    2. Sentence 2: Primary focus for today across the team.
    3. Sentence 3: Urgent blockers or risks (if none, mention team velocity).

    STRICT RULES:
    - No corporate fluff or "Great job team!"
    - Use technical, precise language.
    - Keep it under 500 characters total.
  `;

  return await generateNarrative(prompt);
}
