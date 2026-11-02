insert into public.learning_phases (id, name, description, order_index, estimated_days, daily_minutes) values
  (1, 'Xây Khung Xương', 'Word Order + Auxiliary & Modal', 1, 10, 60),
  (2, 'Làm Chủ Tense + Aspect', 'Hệ thống 12 thì theo logic 3 trục × 4 aspect', 2, 14, 75),
  (3, 'Tinh Chỉnh', 'Articles + So sánh Việt-Anh', 3, 7, 50),
  (4, 'Tích Hợp & Kiểm Tra', 'Biến kiến thức thành kỹ năng tự động', 4, 7, 60);

insert into public.topics (phase_id, name, description, slug, order_index, difficulty) values
  (1, 'Word Order - Nguyên lý SVO', 'Thứ tự từ quyết định chức năng ngữ pháp', 'word-order-svo', 1, 'easy'),
  (1, 'Word Order - Mở rộng', 'S+V+O+Place+Time, thứ tự tính từ', 'word-order-extended', 2, 'easy'),
  (1, 'Word Order - Câu hỏi', 'Yes/No questions, Wh- questions', 'word-order-questions', 3, 'easy'),
  (1, 'Word Order - Câu phức', 'Liên từ: because, although, when, if...', 'word-order-complex', 4, 'medium'),
  (1, 'Auxiliary: do/be/have', 'Trợ động từ tạo câu hỏi, phủ định, thì', 'auxiliary-verbs', 5, 'easy'),
  (1, 'Modal Verbs', 'can, could, may, might, must, should, will, would', 'modal-verbs', 6, 'medium'),
  (1, 'Ôn tập Giai đoạn 1', 'Viết đoạn văn tích hợp Word Order + Aux + Modal', 'phase1-review', 7, 'medium'),

  (2, 'Present Simple ↔ Continuous', 'Thói quen, sự thật vs hành động đang diễn ra', 'present-simple-continuous', 1, 'easy'),
  (2, 'Past Simple ↔ Continuous', 'Hành động đã xong vs đang diễn ra trong quá khứ', 'past-simple-continuous', 2, 'easy'),
  (2, 'Present Perfect', 'Present Perfect vs Past Simple (điểm khó nhất)', 'present-perfect', 3, 'medium'),
  (2, 'Present Perfect Continuous', 'Hành động kéo dài từ quá khứ đến hiện tại', 'present-perfect-continuous', 4, 'medium'),
  (2, 'Past Perfect', 'Past Perfect & Past Perfect Continuous: quá khứ của quá khứ', 'past-perfect', 5, 'medium'),
  (2, 'Future Forms', 'will, be going to, present continuous cho tương lai', 'future-forms', 6, 'medium'),

  (3, 'Articles a/an/the', 'Mạo từ a/an/the/zero theo logic xác định', 'articles', 1, 'medium'),
  (3, 'So sánh Việt-Anh', 'Nhận biết lỗi do tư duy tiếng Việt & tự sửa', 'vietnamese-english-errors', 2, 'medium'),

  (4, 'Viết đoạn tích hợp', 'Viết đoạn văn dùng đúng word order, thì, mạo từ', 'integrated-writing', 1, 'hard'),
  (4, 'Kiểm tra tổng hợp', 'Bài kiểm tra toàn bộ 5 đầu mục cốt lõi', 'final-test', 2, 'hard');
