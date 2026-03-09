-- ============================================================
-- SEED DATA: Kids Cơ Bản + A1 Beginner
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- LEVELS
-- ============================================================
insert into public.levels (id, name, slug, cefr, category, description, "order") values
  ('11111111-1111-1111-1111-111111111111', 'Kids Cơ Bản', 'kids-basic', 'Pre-A1', 'kids',
   'Tiếng Anh dành cho trẻ em 4-8 tuổi. Học qua hình ảnh, bài hát và trò chơi.', 1),

  ('22222222-2222-2222-2222-222222222222', 'A1 - Beginner', 'a1-beginner', 'A1', 'adults',
   'Dành cho người mới bắt đầu. Giao tiếp cơ bản, tự giới thiệu, hỏi đường.', 2);

-- ============================================================
-- COURSES
-- ============================================================

-- Kids courses
insert into public.courses (id, level_id, title, slug, description, "order", is_published) values
  ('aaaa1111-0001-0001-0001-000000000001',
   '11111111-1111-1111-1111-111111111111',
   'Bảng chữ cái & Số đếm', 'kids-alphabet-numbers',
   'Học A-Z và đếm 1-20 qua hình ảnh sinh động.', 1, true),

  ('aaaa1111-0001-0001-0001-000000000002',
   '11111111-1111-1111-1111-111111111111',
   'Động vật & Màu sắc', 'kids-animals-colors',
   'Tên các con vật yêu thích và màu sắc.', 2, true);

-- A1 courses
insert into public.courses (id, level_id, title, slug, description, "order", is_published) values
  ('bbbb2222-0001-0001-0001-000000000001',
   '22222222-2222-2222-2222-222222222222',
   'Chào hỏi & Giới thiệu', 'a1-greetings',
   'Tự giới thiệu bản thân, chào hỏi lịch sự.', 1, true),

  ('bbbb2222-0001-0001-0001-000000000002',
   '22222222-2222-2222-2222-222222222222',
   'Cuộc sống hàng ngày', 'a1-daily-life',
   'Mô tả thói quen, thời gian biểu hàng ngày.', 2, true);

-- ============================================================
-- LESSONS
-- ============================================================

-- === Kids Course 1: Bảng chữ cái & Số đếm ===
insert into public.lessons (id, course_id, title, slug, skill, description, xp_reward, estimated_minutes, "order", is_published) values
  ('cccc0001-0001-0001-0001-000000000001',
   'aaaa1111-0001-0001-0001-000000000001',
   'Letters A-F', 'kids-letters-a-f', 'vocabulary',
   'Nhận biết và phát âm chữ A đến F.', 30, 5, 1, true),

  ('cccc0001-0001-0001-0001-000000000002',
   'aaaa1111-0001-0001-0001-000000000001',
   'Letters G-L', 'kids-letters-g-l', 'vocabulary',
   'Nhận biết và phát âm chữ G đến L.', 30, 5, 2, true),

  ('cccc0001-0001-0001-0001-000000000003',
   'aaaa1111-0001-0001-0001-000000000001',
   'Numbers 1-10', 'kids-numbers-1-10', 'vocabulary',
   'Đếm từ 1 đến 10 bằng Tiếng Anh.', 30, 5, 3, true),

  ('cccc0001-0001-0001-0001-000000000004',
   'aaaa1111-0001-0001-0001-000000000001',
   'Hát cùng ABC Song', 'kids-abc-song', 'listening',
   'Nghe và hát theo bài ABC Song.', 20, 5, 4, true);

-- === Kids Course 2: Động vật & Màu sắc ===
insert into public.lessons (id, course_id, title, slug, skill, description, xp_reward, estimated_minutes, "order", is_published) values
  ('cccc0002-0001-0001-0001-000000000001',
   'aaaa1111-0001-0001-0001-000000000002',
   'Farm Animals', 'kids-farm-animals', 'vocabulary',
   'Học tên con vật nuôi: dog, cat, cow, pig...', 30, 5, 1, true),

  ('cccc0002-0001-0001-0001-000000000002',
   'aaaa1111-0001-0001-0001-000000000002',
   'Colors of the Rainbow', 'kids-colors', 'vocabulary',
   'Học tên các màu sắc: red, blue, green...', 30, 5, 2, true),

  ('cccc0002-0001-0001-0001-000000000003',
   'aaaa1111-0001-0001-0001-000000000002',
   'What color is it?', 'kids-what-color', 'speaking',
   'Hỏi và trả lời về màu sắc.', 40, 8, 3, true);

-- === A1 Course 1: Chào hỏi & Giới thiệu ===
insert into public.lessons (id, course_id, title, slug, skill, description, xp_reward, estimated_minutes, "order", is_published) values
  ('dddd0001-0001-0001-0001-000000000001',
   'bbbb2222-0001-0001-0001-000000000001',
   'Hello & Goodbye', 'a1-hello-goodbye', 'vocabulary',
   'Các cách chào hỏi và tạm biệt phổ biến.', 50, 10, 1, true),

  ('dddd0001-0001-0001-0001-000000000002',
   'bbbb2222-0001-0001-0001-000000000001',
   'What is your name?', 'a1-your-name', 'speaking',
   'Tự giới thiệu tên, tuổi, quốc tịch.', 50, 10, 2, true),

  ('dddd0001-0001-0001-0001-000000000003',
   'bbbb2222-0001-0001-0001-000000000001',
   'To Be: am, is, are', 'a1-to-be', 'grammar',
   'Chia động từ TO BE trong thì hiện tại.', 50, 15, 3, true),

  ('dddd0001-0001-0001-0001-000000000004',
   'bbbb2222-0001-0001-0001-000000000001',
   'Listening: Self Introduction', 'a1-listening-intro', 'listening',
   'Nghe đoạn tự giới thiệu và trả lời câu hỏi.', 50, 10, 4, true);

-- === A1 Course 2: Cuộc sống hàng ngày ===
insert into public.lessons (id, course_id, title, slug, skill, description, xp_reward, estimated_minutes, "order", is_published) values
  ('dddd0002-0001-0001-0001-000000000001',
   'bbbb2222-0001-0001-0001-000000000002',
   'Daily Routines', 'a1-daily-routines', 'vocabulary',
   'Từ vựng hoạt động hàng ngày: wake up, eat breakfast...', 50, 10, 1, true),

  ('dddd0002-0001-0001-0001-000000000002',
   'bbbb2222-0001-0001-0001-000000000002',
   'Telling Time', 'a1-telling-time', 'reading',
   'Đọc và nói giờ bằng Tiếng Anh.', 50, 10, 2, true),

  ('dddd0002-0001-0001-0001-000000000003',
   'bbbb2222-0001-0001-0001-000000000002',
   'Simple Present Tense', 'a1-simple-present', 'grammar',
   'Cấu trúc thì hiện tại đơn: I work, She works...', 50, 15, 3, true),

  ('dddd0002-0001-0001-0001-000000000004',
   'bbbb2222-0001-0001-0001-000000000002',
   'Write About Your Day', 'a1-write-your-day', 'writing',
   'Viết đoạn văn ngắn mô tả một ngày của bạn.', 60, 15, 4, true);

-- ============================================================
-- EXERCISES
-- ============================================================

-- Kids: Letters A-F exercises
insert into public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") values
  ('cccc0001-0001-0001-0001-000000000001', 'multiple_choice',
   'Đây là chữ gì? 🍎 A _ _ _ E',
   '["Apple", "Ant", "Airplane", "Alligator"]',
   'Apple', 'Apple = Quả táo. Bắt đầu bằng chữ A.', 1),

  ('cccc0001-0001-0001-0001-000000000001', 'multiple_choice',
   'Con vật nào bắt đầu bằng chữ "C"? 🐱',
   '["Dog", "Cat", "Bird", "Fish"]',
   'Cat', 'Cat = Con mèo. Bắt đầu bằng chữ C.', 2),

  ('cccc0001-0001-0001-0001-000000000001', 'fill_blank',
   'Điền chữ còn thiếu: _OG (con chó)',
   null, 'D', 'DOG = Con chó. Bắt đầu bằng chữ D.', 3),

  ('cccc0001-0001-0001-0001-000000000001', 'matching',
   'Nối chữ cái với hình ảnh đúng',
   '["A - 🍎", "B - 🍌", "C - 🐱", "D - 🐕"]',
   'A-Apple, B-Banana, C-Cat, D-Dog',
   'Mỗi chữ cái đi kèm với một từ bắt đầu bằng chữ đó.', 4);

-- Kids: Farm Animals exercises
insert into public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") values
  ('cccc0002-0001-0001-0001-000000000001', 'multiple_choice',
   '🐄 Con vật này tên tiếng Anh là gì?',
   '["Dog", "Cow", "Cat", "Pig"]',
   'Cow', 'Cow = Con bò.', 1),

  ('cccc0002-0001-0001-0001-000000000001', 'multiple_choice',
   '🐷 "Pig" nghĩa là gì?',
   '["Con gà", "Con vịt", "Con lợn", "Con ngựa"]',
   'Con lợn', 'Pig = Con lợn.', 2),

  ('cccc0002-0001-0001-0001-000000000001', 'fill_blank',
   'Điền từ: The ___ says "Woof woof" 🐕',
   null, 'dog', 'Dog = Con chó. Chó kêu "Woof woof".', 3);

-- A1: Hello & Goodbye exercises
insert into public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") values
  ('dddd0001-0001-0001-0001-000000000001', 'multiple_choice',
   'Cách chào buổi sáng lịch sự nhất là gì?',
   '["Hey!", "Good morning!", "Yo!", "What''s up?"]',
   'Good morning!', '"Good morning" = Chào buổi sáng. Lịch sự và trang trọng.', 1),

  ('dddd0001-0001-0001-0001-000000000001', 'multiple_choice',
   '"See you later" nghĩa là gì?',
   '["Xin chào", "Hẹn gặp lại", "Cảm ơn", "Xin lỗi"]',
   'Hẹn gặp lại', '"See you later" = Hẹn gặp lại sau.', 2),

  ('dddd0001-0001-0001-0001-000000000001', 'fill_blank',
   'Điền từ: "Good ___, how are you?" (buổi chiều)',
   null, 'afternoon', '"Good afternoon" = Chào buổi chiều.', 3),

  ('dddd0001-0001-0001-0001-000000000001', 'translation',
   'Dịch sang tiếng Anh: "Rất vui được gặp bạn"',
   null, 'Nice to meet you', '"Nice to meet you" thường dùng khi gặp ai đó lần đầu.', 4);

-- A1: To Be exercises
insert into public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") values
  ('dddd0001-0001-0001-0001-000000000003', 'multiple_choice',
   'Chọn đáp án đúng: "She ___ a teacher."',
   '["am", "is", "are", "be"]',
   'is', 'She + IS. Dùng "is" với he/she/it.', 1),

  ('dddd0001-0001-0001-0001-000000000003', 'multiple_choice',
   'Chọn câu đúng:',
   '["I is happy.", "I am happy.", "I are happy.", "I be happy."]',
   'I am happy.', 'I + AM. Luôn dùng "am" với "I".', 2),

  ('dddd0001-0001-0001-0001-000000000003', 'fill_blank',
   'They ___ students. (chia TO BE)',
   null, 'are', 'They + ARE. Dùng "are" với they/we/you.', 3),

  ('dddd0001-0001-0001-0001-000000000003', 'fill_blank',
   'My cat ___ very cute. (chia TO BE)',
   null, 'is', 'My cat = It → dùng "is".', 4),

  ('dddd0001-0001-0001-0001-000000000003', 'reorder',
   'Sắp xếp thành câu đúng: "a / am / I / student"',
   '["I", "am", "a", "student"]',
   'I am a student.', 'I + am + a + student = Tôi là một sinh viên.', 5);

-- A1: Simple Present Tense exercises
insert into public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") values
  ('dddd0002-0001-0001-0001-000000000003', 'multiple_choice',
   'Chọn đáp án đúng: "He ___ to work every day."',
   '["go", "goes", "going", "gone"]',
   'goes', 'He/She/It + V-s/es. "He goes" là đúng.', 1),

  ('dddd0002-0001-0001-0001-000000000003', 'multiple_choice',
   'Chọn câu PHỦ ĐỊNH đúng:',
   '["She don''t like coffee.", "She doesn''t like coffee.", "She not like coffee.", "She isn''t like coffee."]',
   'She doesn''t like coffee.', 'He/She/It + doesn''t + V nguyên mẫu.', 2),

  ('dddd0002-0001-0001-0001-000000000003', 'fill_blank',
   'I ___ breakfast at 7 AM. (eat)',
   null, 'eat', 'I/You/We/They + V nguyên mẫu. "I eat".', 3),

  ('dddd0002-0001-0001-0001-000000000003', 'fill_blank',
   'She ___ English every day. (study)',
   null, 'studies', 'He/She/It + V-es. "study" → "studies" (đổi y → ies).', 4),

  ('dddd0002-0001-0001-0001-000000000003', 'translation',
   'Dịch sang tiếng Anh: "Tôi thức dậy lúc 6 giờ sáng."',
   null, 'I wake up at 6 AM.', '"Wake up" = thức dậy. Thì hiện tại đơn.', 5);
