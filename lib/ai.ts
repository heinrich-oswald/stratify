export function buildAiPrompt(prompt: string, context = "") {
  const safePrompt = prompt.trim();
  const safeContext = context.trim();

  return [
    "You are Stratify AI for a student project workspace.",
    "Your job is to help the student think clearly without inventing facts.",
    "Give 3 to 5 concise, actionable suggestions.",
    "Use only the information the student provided in the prompt and context.",
    "Important: do not invent personal experiences, interviews, sources, evidence, or reflections.",
    "Do not mark work complete or claim a fact is verified.",
    safeContext ? `Context: ${safeContext}` : "",
    `User request: ${safePrompt}`,
    "Output as a short bullet list. One idea per line. No intro or summary.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function parseAiResponse(rawText: string): string[] {
  return rawText
    .split(/\n|\r|•|\-|\*/)
    .map((item) => item.trim())
    .map((item) => item.replace(/^[-*•]\s*/, ""))
    .filter(Boolean)
    .filter((item) => item.length > 8)
    .slice(0, 5);
}

export function buildFallbackIdeas(prompt: string, context = "") {
  const normalized = prompt.trim() || "your idea";
  const contextText = context.trim() ? ` for ${context}` : "";

  return [
    `Start by clarifying the main problem that ${normalized} is solving${contextText}.`,
    "Break the idea into a few concrete outcomes and define what success would look like.",
    "Identify the smallest test that would check whether the idea is valuable before building more.",
    "Turn the next phase into a short milestone plan with evidence checkpoints and a review step.",
  ];
}
