// Lesson JSON shape returned by Gemini, its responseSchema, and validation of the AI output.
// No imports so `npm test` can load it with plain node.

export type Difficulty = "easy" | "medium" | "hard";
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const SKILLS = ["reading", "writing", "listening", "speaking"] as const;
export type Skill = (typeof SKILLS)[number];

// MVP exercise types (spec §12 Phase 1). Other DB enum values come with later phases.
export const MVP_EXERCISE_TYPES = ["multiple_choice", "fill_blank", "reorder"] as const;
export type ExerciseType = (typeof MVP_EXERCISE_TYPES)[number];

export interface GeneratedExercise {
  type: ExerciseType;
  question: string;
  options?: string[]; // multiple_choice
  words?: string[]; // reorder (shuffled)
  answer: string;
  explanation: string;
}

export interface LessonContent {
  title: string;
  theory: { explanation: string; vietnamese_comparison: string; key_points: string[] };
  examples: { en: string; vi: string; highlight: string; why: string }[];
  exercises: GeneratedExercise[];
  challenge: { prompt: string; sample_answer: string };
}

/** What the client sees of an exercise: never the answer. */
export interface ExerciseQuestion {
  question: string;
  options?: string[];
  words?: string[];
}

const str = { type: "STRING" };
const strArr = { type: "ARRAY", items: str };

/** Gemini responseSchema (OpenAPI subset). Type names are the SDK's `Type` enum values. */
export const lessonResponseSchema = {
  type: "OBJECT",
  properties: {
    title: str,
    theory: {
      type: "OBJECT",
      properties: { explanation: str, vietnamese_comparison: str, key_points: strArr },
      required: ["explanation", "vietnamese_comparison", "key_points"],
    },
    examples: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { en: str, vi: str, highlight: str, why: str },
        required: ["en", "vi", "highlight", "why"],
      },
    },
    exercises: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING", enum: [...MVP_EXERCISE_TYPES] },
          question: str,
          options: strArr,
          words: strArr,
          answer: str,
          explanation: str,
        },
        required: ["type", "question", "answer", "explanation"],
      },
    },
    challenge: {
      type: "OBJECT",
      properties: { prompt: str, sample_answer: str },
      required: ["prompt", "sample_answer"],
    },
  },
  required: ["title", "theory", "examples", "exercises", "challenge"],
} as const;

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(isStr);
const tokens = (s: string) =>
  s.toLowerCase().replace(/[.!?,]/g, "").split(/\s+/).filter(Boolean).sort().join(" ");

function exerciseOk(e: Record<string, unknown>): boolean {
  if (!isStr(e.question) || !isStr(e.answer) || !isStr(e.explanation)) return false;
  switch (e.type) {
    case "multiple_choice":
      return isStrArr(e.options) && e.options.includes(e.answer);
    case "fill_blank":
      return /_{2,}/.test(e.question);
    case "reorder":
      return isStrArr(e.words) && tokens(e.words.join(" ")) === tokens(e.answer);
    default:
      return false;
  }
}

/** Trust boundary: AI output is untrusted. Drops broken exercises, throws if the lesson is unusable. */
export function validateLesson(raw: unknown): LessonContent {
  const r = raw as Partial<LessonContent> | null;
  if (!r || !isStr(r.title) || !r.theory || !isStr(r.theory.explanation) || !Array.isArray(r.examples) || !r.challenge) {
    throw new Error("AI trả về bài học không đúng cấu trúc");
  }
  const exercises = (Array.isArray(r.exercises) ? r.exercises : []).filter((e) =>
    exerciseOk(e as unknown as Record<string, unknown>),
  );
  if (exercises.length === 0) throw new Error("AI không tạo được bài tập hợp lệ");
  return {
    title: r.title,
    theory: {
      explanation: r.theory.explanation,
      vietnamese_comparison: r.theory.vietnamese_comparison ?? "",
      key_points: Array.isArray(r.theory.key_points) ? r.theory.key_points.filter(isStr) : [],
    },
    examples: r.examples.filter((x) => x && isStr(x.en)),
    exercises,
    challenge: { prompt: r.challenge.prompt ?? "", sample_answer: r.challenge.sample_answer ?? "" },
  };
}
