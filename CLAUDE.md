# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**English Mastery**: an IELTS-style English learning web app for Vietnamese beginners. `APP_DESIGN.md` (Vietnamese) is the spec and source of truth; `Ke_hoach_hoc_5_dau_muc_cot_loi_tieng_Anh.docx` is the original study plan the learning path comes from. Phase 1 MVP (spec §12) is built; Phases 2–4 are not.

## Commands

- `npm run dev`: dev server (needs `.env.local`, copy from `.env.example`)
- `npm test`: pure-logic tests (`tests/logic.test.ts`), run by Node's built-in test runner with type stripping, no extra deps. Test files import with `.ts` extensions, so `tests/` is excluded from `tsconfig.json`, and the modules they import (`src/lib/scoring.ts`, `src/lib/gemini/schemas.ts`, `src/lib/highlight.ts`) must stay import-free.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`

## Setup

1. Create a Supabase project and run `supabase/migrations/001…008` in order (SQL editor or `supabase db push`). 008 seeds the 4 phases and 17 topics.
2. Enable Google in Supabase Auth if you want OAuth. Add `<site>/auth/callback` to the redirect URLs.
3. Fill in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY` (optional `GEMINI_MODEL`).

## Architecture

- Next.js 14 App Router, `src/`. Route groups: `(auth)` (login/register) and `(main)` (dashboard, progress, learn/*). `src/middleware.ts` refreshes the Supabase session and redirects anonymous users to `/login`. `(main)/layout.tsx` also checks auth.
- **All DB access goes through the user's session client** (`src/lib/supabase/server.ts` `getUser()`), so RLS enforces ownership. There is no service-role client. A `handle_new_user` trigger creates the `public.users` row from signup metadata (`display_name`, `current_level`).
- **Lesson generation**: `POST /api/lessons/generate` → `src/lib/gemini/client.ts` (`@google/genai`, JSON mode with `lessonResponseSchema`) → `validateLesson()` drops malformed exercises (the trust boundary for AI output) → theory/examples/challenge go in `lessons.content_json`, exercises go in `exercises` (answer in `answer_json`).
- **Answers are checked server-side**: the lesson page never selects `answer_json`. `POST /api/exercises/check` returns correctness plus the explanation Gemini wrote at generation time (no AI call per answer). `POST /api/progress` recomputes the score from the DB, writes `lesson_history`, and upserts `user_progress` (status never downgrades; ≥85% = mastered, ≥60% = completed).
- Custom (free-topic) lessons have `topic_id = null` and don't affect learning-path progress. Streak is computed from `lesson_history` dates in UTC+7. Points are the sum of `user_progress.total_points`.
- Theme: shadcn/ui (new-york). CSS vars in `globals.css` hold raw oklch components (e.g. `0.21 0.006 285.885`), and `tailwind.config.ts` wraps them as `oklch(var(--x) / <alpha-value>)`. Keep that format when adding colors.

## Conventions

- UI text and grammar explanations are in Vietnamese. Explanations teach the *logic* (often contrasting Vietnamese and English), not rote memorization. Keep this in the prompts (`src/lib/gemini/prompts.ts`).
- MVP exercise types are `multiple_choice | fill_blank | reorder` (`MVP_EXERCISE_TYPES`). The DB enum already allows the later types. Adding one means: a schema entry, a branch in `exerciseOk()`, a component in `src/components/exercises/`, and a case in `ExerciseRunner`.
- Known shortcuts are marked `shortcut:` in the code (no Gemini rate limit, fixed UTC+7 streak, self-checked challenge, custom topics not stored in `topics`).
