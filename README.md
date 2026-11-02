# English Mastery

**Học tiếng Anh bằng cách hiểu logic, không phải học thuộc.**

English Mastery is an IELTS-style English learning web app for Vietnamese beginners. You type any grammar topic ("Cách dùng mạo từ a/an/the", "Present Perfect vs Past Simple", …) and Google Gemini writes a full lesson for you. The lesson explains the logic by contrasting Vietnamese and English, gives 8–12 analysed examples and 10 graded exercises, and ends with a writing challenge. A built-in learning path, the **"5 Đầu Mục Cốt Lõi"** (5 Core Pillars), takes you through 4 phases and 17 topics, from word order to tenses to articles.

The full product spec (in Vietnamese) is in [`APP_DESIGN.md`](APP_DESIGN.md).

## Features

Status: **Phase 1 MVP** is done.

- **AI lesson generation:** pick a topic, a level (Dễ / Trung bình / Khó) and skills, and Gemini returns a structured lesson: theory, Vietnamese–English comparison, examples, exercises and a challenge.
- **Interactive exercises:** multiple choice, fill in the blank and word reordering. Answers are checked on the server, and each one comes with an explanation of why it is right or wrong.
- **Learning path:** 4 phases and 17 topics. Every topic follows the same 5-step cycle: understand the logic → examples → exercises → produce → correction. Each topic tracks a status: not started, in progress, completed (≥ 60%) or mastered (≥ 85%).
- **Dashboard:** greeting, study streak, points, progress per phase, suggested next topics and recent lessons.
- **Auth:** email/password and Google sign-in through Supabase. Row Level Security is on every table.
- **Mobile-first UI:** Vietnamese interface throughout.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui + lucide-react |
| Auth & database | Supabase (Auth, PostgreSQL with RLS) |
| AI | Google Gemini via `@google/genai` (JSON mode with a response schema) |
| Deployment | Vercel |

## Getting started

### 1. Install

```bash
git clone https://github.com/nguyenvanhieu6732/learning-english.git
cd learning-english
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL files in `supabase/migrations/` **in order** (`001` → `008`), either in the SQL Editor or with `supabase db push`. File `008` seeds the learning path.
3. *(Optional)* To enable Google sign-in, go to **Authentication → Providers → Google**. Then add `http://localhost:3000/auth/callback` (and your production URL) under **Authentication → URL Configuration → Redirect URLs**.

### 3. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` *(optional)* | Defaults to `gemini-2.5-flash` |

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account and generate your first lesson.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Make a production build and serve it |
| `npm test` | Run the unit tests for scoring, streak and AI-output validation (Node's built-in test runner) |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── (auth)/            login, register
│   ├── (main)/            dashboard, progress (learning path), learn/[topicId], learn/custom, learn/lesson/[lessonId]
│   ├── api/               lessons/generate, exercises/check, progress
│   └── auth/              OAuth callback, sign-out
├── components/            auth, dashboard, lesson, exercises, learning-path, common, ui (shadcn)
├── lib/
│   ├── gemini/            client, prompts, response schema + validation
│   ├── supabase/          browser/server clients, session middleware
│   ├── scoring.ts         answer checking, score → status, streak
│   └── learning-path.ts   phases + topics + user progress
└── middleware.ts          protects routes for signed-in users only
supabase/migrations/       schema, RLS policies, seed data
tests/                     unit tests
```

## How it works

1. `POST /api/lessons/generate` sends the topic, level and skills to Gemini, using a JSON response schema.
2. `validateLesson()` checks the AI output and drops broken exercises. For example, it drops a multiple-choice question whose answer is not one of the options.
3. The lesson body is saved to `lessons.content_json`. Exercises go to the `exercises` table, with their answers kept server-side.
4. `POST /api/exercises/check` checks each answer. `POST /api/progress` recomputes the score from the database and updates the topic's progress. The server never trusts a score sent by the client.

## Roadmap

- [x] **Phase 1, MVP:** auth, dashboard, AI lessons, 3 exercise types, learning path, difficulty levels
- [ ] **Phase 2, core skills:** reading and writing modules with AI essay grading (IELTS criteria), listening with TTS, translate / write-sentence / grammar-analysis exercises
- [ ] **Phase 3, speaking & polish:** speech recording + STT + AI feedback, spaced-repetition review, detailed stats, dark mode, PWA
- [ ] **Phase 4, extras:** vocabulary notebook, community sharing, IELTS mock tests, leaderboard

## Known limitations

- Lesson generation has no rate limit yet. Add a per-user daily cap before opening public sign-ups.
- The writing challenge is self-checked against a sample answer. AI grading comes with the Writing module.
- Streak days are counted in Vietnam time (UTC+7).
