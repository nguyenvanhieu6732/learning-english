// Run: npm test  (node --test with built-in TS type stripping, no extra deps)
import { test } from "node:test";
import assert from "node:assert/strict";
import { isCorrect, scoreOf, statusFor, computeStreak } from "../src/lib/scoring.ts";
import { validateLesson } from "../src/lib/gemini/schemas.ts";
import { findHighlight } from "../src/lib/highlight.ts";

test("findHighlight prefers whole words and falls back to a substring", () => {
  const marked = (text: string, h: string) => {
    const r = findHighlight(text, h);
    return r && text.slice(r.start, r.end);
  };
  assert.deepEqual(findHighlight("I want a new phone.", "a"), { start: 7, end: 8 }); // not the "a" in "want"
  assert.equal(marked("An apple", "an"), "An"); // case-insensitive, keeps original case
  assert.deepEqual(findHighlight("Tôi ăn a", "a"), { start: 7, end: 8 }); // "ă" counts as a letter
  assert.equal(marked("She walked home", "walk"), "walk"); // AI quoted part of a word
  assert.equal(marked("Use a/an (or the).", "a/an (or"), "a/an (or"); // regex characters are literal
  assert.equal(findHighlight("Hello", "xyz"), null);
  assert.equal(findHighlight("Hello", ""), null);
});

test("isCorrect ignores case, spacing and end punctuation", () => {
  assert.equal(isCorrect("fill_blank", "  An ", "an"), true);
  assert.equal(isCorrect("reorder", "i go to school every day", "I go to school every day."), true);
  assert.equal(isCorrect("multiple_choice", "the", "a"), false);
  assert.equal(isCorrect("fill_blank", "", "a"), false);
  assert.equal(isCorrect("fill_blank", "don’t", "don't"), true); // curly vs straight apostrophe
});

test("scoreOf and statusFor", () => {
  assert.equal(scoreOf(0, 0), 0);
  assert.equal(scoreOf(7, 10), 70);
  assert.equal(statusFor(90), "mastered");
  assert.equal(statusFor(85), "mastered");
  assert.equal(statusFor(70), "completed");
  assert.equal(statusFor(40), "in_progress");
});

test("computeStreak counts consecutive days ending today or yesterday", () => {
  const today = new Date("2026-11-02T10:00:00Z");
  const d = (s: string) => new Date(s);
  assert.equal(computeStreak([], today), 0);
  assert.equal(computeStreak([d("2026-11-02T01:00:00Z"), d("2026-11-02T05:00:00Z")], today), 1);
  assert.equal(
    computeStreak([d("2026-11-02T01:00:00Z"), d("2026-11-01T09:00:00Z"), d("2026-10-31T09:00:00Z")], today),
    3,
  );
  assert.equal(computeStreak([d("2026-11-01T09:00:00Z"), d("2026-10-31T09:00:00Z")], today), 2);
  assert.equal(computeStreak([d("2026-10-30T09:00:00Z")], today), 0);
});

const base = {
  title: "Articles",
  theory: { explanation: "x", vietnamese_comparison: "y", key_points: ["k"] },
  examples: [{ en: "I saw a dog.", vi: "Tôi thấy một con chó.", highlight: "a", why: "chưa xác định" }],
  challenge: { prompt: "Viết 3 câu", sample_answer: "..." },
};

test("validateLesson keeps good exercises and drops broken ones", () => {
  const lesson = validateLesson({
    ...base,
    exercises: [
      { type: "multiple_choice", question: "I want ___ apple.", options: ["a", "an", "the"], answer: "an", explanation: "e" },
      { type: "multiple_choice", question: "bad", options: ["a", "b"], answer: "c", explanation: "e" }, // answer not in options
      { type: "fill_blank", question: "She ___ a doctor.", answer: "is", explanation: "e" },
      { type: "fill_blank", question: "no blank here", answer: "is", explanation: "e" },
      { type: "reorder", question: "Sắp xếp", words: ["school", "I", "to", "go"], answer: "I go to school", explanation: "e" },
      { type: "reorder", question: "bad", words: ["I", "go"], answer: "I go home", explanation: "e" }, // words mismatch
      { type: "speak", question: "unsupported", answer: "x", explanation: "e" },
    ],
  });
  assert.deepEqual(lesson.exercises.map((e) => e.question), ["I want ___ apple.", "She ___ a doctor.", "Sắp xếp"]);
});

test("validateLesson rejects junk", () => {
  assert.throws(() => validateLesson(null));
  assert.throws(() => validateLesson({ ...base, exercises: [] })); // nothing usable
  assert.throws(() => validateLesson({ title: "x" }));
});
