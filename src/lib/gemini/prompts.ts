import type { Difficulty, Skill } from "./schemas";

const LEVEL: Record<Difficulty, string> = {
  easy: "Dễ (Beginner): từ vựng cơ bản ~500 từ, câu SVO đơn, giải thích bằng tiếng Việt kèm tiếng Anh, nhiều gợi ý, có dịch song ngữ",
  medium: "Trung bình (Intermediate): từ vựng giao tiếp ~2000 từ, câu phức, giải thích chủ yếu tiếng Anh kèm tiếng Việt khi cần, ít gợi ý",
  hard: "Khó (Advanced): từ vựng học thuật IELTS, mọi cấu trúc, giải thích bằng tiếng Anh, không gợi ý",
};

const SKILL_VI: Record<Skill, string> = { reading: "Đọc", writing: "Viết", listening: "Nghe", speaking: "Nói" };

export const SYSTEM_PROMPT =
  "Bạn là giáo viên tiếng Anh chuyên dạy người Việt Nam mới bắt đầu. " +
  "Bạn dạy LOGIC, KHÔNG dạy học thuộc lòng: luôn giải thích vì sao, và so sánh với tiếng Việt khi giúp người học hiểu.";

export function lessonPrompt(topic: string, difficulty: Difficulty, skills: Skill[]) {
  return `Hãy tạo bài học về chủ đề: "${topic}"
Cấp độ: ${LEVEL[difficulty]}
Kỹ năng tập trung: ${skills.map((s) => SKILL_VI[s]).join(", ")}

Yêu cầu:
1. theory: giải thích logic ngắn gọn (explanation), so sánh Việt–Anh (vietnamese_comparison), 3–5 ý chính (key_points).
2. examples: 8–12 câu ví dụ. "highlight" là phần ngữ pháp cần chú ý (trích nguyên văn từ câu "en"), "why" giải thích tại sao.
3. exercises: đúng 10 bài tập, trộn 3 dạng:
   - multiple_choice: "options" có 3–4 lựa chọn, "answer" phải trùng nguyên văn một lựa chọn.
   - fill_blank: "question" chứa "___" ở chỗ cần điền, "answer" là từ/cụm cần điền.
   - reorder: "words" là các từ của câu đáp án đã xáo trộn (không có dấu câu), "answer" là câu đúng.
   Mỗi bài có "explanation" bằng tiếng Việt: vì sao đáp án đúng, và vì sao các lựa chọn sai là sai (lỗi tư duy thường gặp).
4. challenge: một đề thực hành tự viết câu/đoạn ngắn dùng kiến thức vừa học (prompt) và một bài mẫu (sample_answer).

Chỉ trả về JSON theo schema.`;
}
