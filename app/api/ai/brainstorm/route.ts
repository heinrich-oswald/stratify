import { NextResponse } from "next/server";
import { buildAiPrompt, buildFallbackIdeas, parseAiResponse } from "../../../../lib/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const context = typeof body?.context === "string" ? body.context.trim() : "";

  if (!prompt) {
    return NextResponse.json(
      { error: "Please describe your idea or project question first." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      suggestions: buildFallbackIdeas(prompt, context),
      source: "fallback",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildAiPrompt(prompt, context) }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Gemini request failed");
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("\n") ?? "";

    const suggestions = parseAiResponse(text);

    if (suggestions.length === 0) {
      throw new Error("Gemini returned no usable suggestions");
    }

    return NextResponse.json({ suggestions, source: "gemini" });
  } catch {
    return NextResponse.json({
      suggestions: buildFallbackIdeas(prompt, context),
      source: "fallback",
    });
  }
}
