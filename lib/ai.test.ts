import { describe, expect, it } from "vitest";
import { buildAiPrompt, parseAiResponse } from "./ai";

describe("AI prompt helpers", () => {
  it("creates a bounded prompt that preserves the student's agency", () => {
    const prompt = buildAiPrompt("student project planner", "for a high-school personal project");

    expect(prompt).toContain("student");
    expect(prompt).toContain("do not invent");
    expect(prompt).toContain("for a high-school personal project");
  });

  it("parses gemini text into clean suggestion items", () => {
    const suggestions = parseAiResponse(`
      • Start with a clear user problem
      • Validate with 5 interviews
      • Turn the final plan into a milestone roadmap
    `);

    expect(suggestions).toEqual([
      "Start with a clear user problem",
      "Validate with 5 interviews",
      "Turn the final plan into a milestone roadmap",
    ]);
  });
});
