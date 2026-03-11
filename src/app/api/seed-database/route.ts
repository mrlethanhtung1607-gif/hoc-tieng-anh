import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ── Hardcoded questions per unit (ZERO API cost) ─────────
// Each unit has 10 questions: mix of flashcard + multiple_choice
// Format matches the Question types in lesson/[id]/page.tsx

const UNIT_QUESTIONS: Record<number, unknown[]> = {
    // ── Unit 1: Chào hỏi cơ bản ──────────────────────────
    1: [
        { type: "flashcard", word: "Hello", phonetic: "/həˈloʊ/", meaning: "Xin chào", example: "Hello, how are you?", exampleTranslation: "Xin chào, bạn khỏe không?" },
        { type: "flashcard", word: "Good morning", phonetic: "/ɡʊd ˈmɔːrnɪŋ/", meaning: "Chào buổi sáng", example: "Good morning, teacher!", exampleTranslation: "Chào buổi sáng, thầy cô!" },
        { type: "multiple_choice", prompt: "'Xin chào' trong Tiếng Anh là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Goodbye", "Hello", "Sorry", "Please"], correctIndex: 1, explanation: "Hello = Xin chào, dùng để chào hỏi." },
        { type: "flashcard", word: "Thank you", phonetic: "/θæŋk juː/", meaning: "Cảm ơn", example: "Thank you for helping me.", exampleTranslation: "Cảm ơn bạn đã giúp tôi." },
        { type: "multiple_choice", prompt: "How do you say 'Tạm biệt' in English?", promptTranslation: "Chọn đáp án đúng", options: ["Hello", "Sorry", "Goodbye", "Welcome"], correctIndex: 2, explanation: "Goodbye = Tạm biệt." },
        { type: "flashcard", word: "Sorry", phonetic: "/ˈsɑːri/", meaning: "Xin lỗi", example: "Sorry, I am late.", exampleTranslation: "Xin lỗi, tôi đến muộn." },
        { type: "multiple_choice", prompt: "'Thank you' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Xin lỗi", "Tạm biệt", "Cảm ơn", "Xin chào"], correctIndex: 2, explanation: "Thank you = Cảm ơn." },
        { type: "flashcard", word: "Please", phonetic: "/pliːz/", meaning: "Làm ơn", example: "Please sit down.", exampleTranslation: "Làm ơn ngồi xuống." },
        { type: "multiple_choice", prompt: "Khi muốn xin lỗi, bạn nói gì?", promptTranslation: "Chọn đáp án đúng", options: ["Please", "Sorry", "Hello", "Thanks"], correctIndex: 1, explanation: "Sorry = Xin lỗi." },
        { type: "multiple_choice", prompt: "'Good night' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Chào buổi sáng", "Chào buổi chiều", "Chúc ngủ ngon", "Tạm biệt"], correctIndex: 2, explanation: "Good night = Chúc ngủ ngon." },
    ],

    // ── Unit 2: Gia đình & Bạn bè ────────────────────────
    2: [
        { type: "flashcard", word: "Father", phonetic: "/ˈfɑːðər/", meaning: "Bố / Cha", example: "My father is a doctor.", exampleTranslation: "Bố tôi là bác sĩ." },
        { type: "flashcard", word: "Mother", phonetic: "/ˈmʌðər/", meaning: "Mẹ", example: "My mother cooks dinner.", exampleTranslation: "Mẹ tôi nấu bữa tối." },
        { type: "multiple_choice", prompt: "'Mẹ' trong Tiếng Anh là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Father", "Brother", "Mother", "Sister"], correctIndex: 2, explanation: "Mother = Mẹ." },
        { type: "flashcard", word: "Brother", phonetic: "/ˈbrʌðər/", meaning: "Anh / Em trai", example: "I have two brothers.", exampleTranslation: "Tôi có hai anh em trai." },
        { type: "flashcard", word: "Sister", phonetic: "/ˈsɪstər/", meaning: "Chị / Em gái", example: "My sister is very kind.", exampleTranslation: "Chị tôi rất tốt bụng." },
        { type: "multiple_choice", prompt: "'Uncle' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Bà", "Chú / Bác", "Anh trai", "Con trai"], correctIndex: 1, explanation: "Uncle = Chú / Bác." },
        { type: "flashcard", word: "Grandmother", phonetic: "/ˈɡrænˌmʌðər/", meaning: "Bà ngoại / Bà nội", example: "My grandmother is 80 years old.", exampleTranslation: "Bà tôi 80 tuổi." },
        { type: "multiple_choice", prompt: "How do you say 'Con gái' in English?", promptTranslation: "Chọn đáp án đúng", options: ["Son", "Daughter", "Sister", "Niece"], correctIndex: 1, explanation: "Daughter = Con gái." },
        { type: "multiple_choice", prompt: "'Grandfather' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Bố", "Chú", "Ông nội / ngoại", "Anh trai"], correctIndex: 2, explanation: "Grandfather = Ông nội / Ông ngoại." },
        { type: "flashcard", word: "Family", phonetic: "/ˈfæmɪli/", meaning: "Gia đình", example: "I love my family.", exampleTranslation: "Tôi yêu gia đình mình." },
    ],

    // ── Unit 3: Nghề nghiệp ──────────────────────────────
    3: [
        { type: "flashcard", word: "Doctor", phonetic: "/ˈdɑːktər/", meaning: "Bác sĩ", example: "The doctor helps sick people.", exampleTranslation: "Bác sĩ giúp người bệnh." },
        { type: "flashcard", word: "Teacher", phonetic: "/ˈtiːtʃər/", meaning: "Giáo viên", example: "My teacher is very patient.", exampleTranslation: "Giáo viên của tôi rất kiên nhẫn." },
        { type: "multiple_choice", prompt: "'Bác sĩ' trong Tiếng Anh là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Teacher", "Doctor", "Engineer", "Nurse"], correctIndex: 1, explanation: "Doctor = Bác sĩ." },
        { type: "flashcard", word: "Engineer", phonetic: "/ˌendʒɪˈnɪr/", meaning: "Kỹ sư", example: "She is a software engineer.", exampleTranslation: "Cô ấy là kỹ sư phần mềm." },
        { type: "flashcard", word: "Nurse", phonetic: "/nɜːrs/", meaning: "Y tá", example: "The nurse takes care of patients.", exampleTranslation: "Y tá chăm sóc bệnh nhân." },
        { type: "multiple_choice", prompt: "'Police officer' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Lính cứu hỏa", "Công an", "Luật sư", "Nông dân"], correctIndex: 1, explanation: "Police officer = Công an / Cảnh sát." },
        { type: "flashcard", word: "Chef", phonetic: "/ʃef/", meaning: "Đầu bếp", example: "The chef makes delicious food.", exampleTranslation: "Đầu bếp nấu món ăn ngon." },
        { type: "multiple_choice", prompt: "How do you say 'Giáo viên' in English?", promptTranslation: "Chọn đáp án đúng", options: ["Student", "Teacher", "Doctor", "Driver"], correctIndex: 1, explanation: "Teacher = Giáo viên." },
        { type: "multiple_choice", prompt: "'Firefighter' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Công an", "Bác sĩ", "Lính cứu hỏa", "Kỹ sư"], correctIndex: 2, explanation: "Firefighter = Lính cứu hỏa." },
        { type: "flashcard", word: "Farmer", phonetic: "/ˈfɑːrmər/", meaning: "Nông dân", example: "The farmer grows rice.", exampleTranslation: "Nông dân trồng lúa." },
    ],

    // ── Unit 4: Đồ ăn & Thức uống ────────────────────────
    4: [
        { type: "flashcard", word: "Apple", phonetic: "/ˈæpəl/", meaning: "Quả táo", example: "I eat an apple every day.", exampleTranslation: "Tôi ăn một quả táo mỗi ngày." },
        { type: "flashcard", word: "Bread", phonetic: "/bred/", meaning: "Bánh mì", example: "She buys bread at the bakery.", exampleTranslation: "Cô ấy mua bánh mì ở tiệm bánh." },
        { type: "multiple_choice", prompt: "'Cơm' trong Tiếng Anh là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Bread", "Noodle", "Rice", "Cake"], correctIndex: 2, explanation: "Rice = Cơm / Gạo." },
        { type: "flashcard", word: "Water", phonetic: "/ˈwɔːtər/", meaning: "Nước", example: "Please give me a glass of water.", exampleTranslation: "Làm ơn cho tôi một ly nước." },
        { type: "flashcard", word: "Meat", phonetic: "/miːt/", meaning: "Thịt", example: "This meat is very fresh.", exampleTranslation: "Thịt này rất tươi." },
        { type: "multiple_choice", prompt: "'Milk' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Nước ép", "Sữa", "Trà", "Cà phê"], correctIndex: 1, explanation: "Milk = Sữa." },
        { type: "flashcard", word: "Egg", phonetic: "/eɡ/", meaning: "Quả trứng", example: "I like fried eggs for breakfast.", exampleTranslation: "Tôi thích trứng chiên cho bữa sáng." },
        { type: "multiple_choice", prompt: "How do you say 'Cá' in English?", promptTranslation: "Chọn đáp án đúng", options: ["Chicken", "Pork", "Fish", "Beef"], correctIndex: 2, explanation: "Fish = Cá." },
        { type: "multiple_choice", prompt: "'Chicken' nghĩa là gì?", promptTranslation: "Chọn đáp án đúng", options: ["Thịt bò", "Thịt heo", "Thịt gà", "Cá"], correctIndex: 2, explanation: "Chicken = Thịt gà." },
        { type: "flashcard", word: "Fruit", phonetic: "/fruːt/", meaning: "Trái cây", example: "Eating fruit is good for your health.", exampleTranslation: "Ăn trái cây tốt cho sức khỏe." },
    ],
};

// ── Lesson titles (50 units) ─────────────────────────────
const UNITS = [
    { unit: 1, title: "Chào hỏi cơ bản", topic: "Basic Greetings" },
    { unit: 2, title: "Gia đình & Bạn bè", topic: "Family & Friends" },
    { unit: 3, title: "Nghề nghiệp", topic: "Occupations & Jobs" },
    { unit: 4, title: "Đồ ăn & Thức uống", topic: "Food & Drinks" },
    { unit: 5, title: "Số đếm & Ngày tháng", topic: "Numbers & Dates" },
    { unit: 6, title: "Màu sắc & Hình dạng", topic: "Colors & Shapes" },
    { unit: 7, title: "Quần áo & Phụ kiện", topic: "Clothes & Accessories" },
    { unit: 8, title: "Nhà cửa & Nội thất", topic: "Home & Furniture" },
    { unit: 9, title: "Thời tiết & Mùa", topic: "Weather & Seasons" },
    { unit: 10, title: "Động vật nuôi", topic: "Pets & Domestic Animals" },
    { unit: 11, title: "Động vật hoang dã", topic: "Wild Animals" },
    { unit: 12, title: "Phương tiện giao thông", topic: "Transportation" },
    { unit: 13, title: "Trường học & Lớp học", topic: "School & Classroom" },
    { unit: 14, title: "Cảm xúc & Tính cách", topic: "Emotions & Personality" },
    { unit: 15, title: "Bộ phận cơ thể", topic: "Body Parts" },
    { unit: 16, title: "Bệnh viện & Sức khỏe", topic: "Health & Hospital" },
    { unit: 17, title: "Thể thao & Vận động", topic: "Sports & Exercise" },
    { unit: 18, title: "Sở thích & Giải trí", topic: "Hobbies & Entertainment" },
    { unit: 19, title: "Âm nhạc & Nhạc cụ", topic: "Music & Instruments" },
    { unit: 20, title: "Du lịch & Khám phá", topic: "Travel & Exploration" },
    { unit: 21, title: "Mua sắm & Giá cả", topic: "Shopping & Prices" },
    { unit: 22, title: "Nhà hàng & Gọi món", topic: "Restaurant & Ordering" },
    { unit: 23, title: "Thành phố & Đường phố", topic: "City & Streets" },
    { unit: 24, title: "Thiên nhiên & Cây cối", topic: "Nature & Plants" },
    { unit: 25, title: "Biển & Đại dương", topic: "Sea & Ocean" },
    { unit: 26, title: "Vũ trụ & Hành tinh", topic: "Space & Planets" },
    { unit: 27, title: "Công nghệ & Internet", topic: "Technology & Internet" },
    { unit: 28, title: "Máy tính & Điện thoại", topic: "Computers & Phones" },
    { unit: 29, title: "Văn phòng & Công sở", topic: "Office & Workplace" },
    { unit: 30, title: "Động từ thường gặp 1", topic: "Common Verbs Part 1" },
    { unit: 31, title: "Động từ thường gặp 2", topic: "Common Verbs Part 2" },
    { unit: 32, title: "Tính từ mô tả", topic: "Descriptive Adjectives" },
    { unit: 33, title: "Trạng từ cơ bản", topic: "Basic Adverbs" },
    { unit: 34, title: "Giới từ & Liên từ", topic: "Prepositions & Conjunctions" },
    { unit: 35, title: "Thời gian & Lịch trình", topic: "Time & Schedules" },
    { unit: 36, title: "Tiền tệ & Ngân hàng", topic: "Money & Banking" },
    { unit: 37, title: "Nấu ăn & Nhà bếp", topic: "Cooking & Kitchen" },
    { unit: 38, title: "Hoa quả & Rau củ", topic: "Fruits & Vegetables" },
    { unit: 39, title: "Đồ uống & Tráng miệng", topic: "Beverages & Desserts" },
    { unit: 40, title: "Phim ảnh & Truyền hình", topic: "Movies & TV Shows" },
    { unit: 41, title: "Sách & Đọc sách", topic: "Books & Reading" },
    { unit: 42, title: "Lễ hội & Ngày lễ", topic: "Festivals & Holidays" },
    { unit: 43, title: "Hôn nhân & Gia đình", topic: "Marriage & Family Life" },
    { unit: 44, title: "Môi trường & Tái chế", topic: "Environment & Recycling" },
    { unit: 45, title: "Luật pháp & An ninh", topic: "Law & Security" },
    { unit: 46, title: "Kinh tế & Thương mại", topic: "Economy & Trade" },
    { unit: 47, title: "Giao tiếp xã giao", topic: "Social Etiquette" },
    { unit: 48, title: "Email & Thư tín", topic: "Emails & Letters" },
    { unit: 49, title: "Phỏng vấn & Xin việc", topic: "Interviews & Job Applications" },
    { unit: 50, title: "Tổng ôn tập", topic: "Final Review" },
];

export async function POST() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        // ── Step 1: Delete old lessons ───────────────────
        await supabase.from("lessons").delete().neq("id", "00000000-0000-0000-0000-000000000000");

        // ── Step 2: Insert lessons with hardcoded questions ──
        const rows = UNITS.map((u) => ({
            title: u.title,
            unit_number: u.unit,
            is_unlocked: u.unit === 1,
            questions: UNIT_QUESTIONS[u.unit] || null, // JSONB — null for units without static data
        }));

        const batchSize = 25;
        let insertedCount = 0;

        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const { error } = await supabase.from("lessons").insert(batch);

            if (error) {
                return NextResponse.json(
                    { error: `Lỗi insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`, insertedSoFar: insertedCount },
                    { status: 500 }
                );
            }
            insertedCount += batch.length;
        }

        const withQuestions = Object.keys(UNIT_QUESTIONS).length;

        return NextResponse.json({
            success: true,
            message: `✅ Đã tạo ${insertedCount} bài học! ${withQuestions} Unit có câu hỏi tĩnh (miễn phí), ${insertedCount - withQuestions} Unit sẽ dùng AI.`,
            totalUnits: insertedCount,
            staticUnits: withQuestions,
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Lỗi không xác định khi seed" }, { status: 500 });
    }
}
