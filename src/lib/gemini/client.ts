import { GoogleGenAI, type Schema } from "@google/genai";
import { lessonResponseSchema, validateLesson, type Difficulty, type Skill } from "./schemas";
import { SYSTEM_PROMPT, lessonPrompt } from "./prompts";

// Spec named @google/generative-ai; that SDK is deprecated, @google/genai is its replacement.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export async function generateLesson(topic: string, difficulty: Difficulty, skills: Skill[]) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: lessonPrompt(topic, difficulty, skills),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: lessonResponseSchema as unknown as Schema,
    },
  });
  return validateLesson(JSON.parse(res.text ?? "null"));
}
