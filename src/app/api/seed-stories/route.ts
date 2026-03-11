import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ── Dialogue story format ────────────────────────────────
// Each story.content is a JSONB array of segments:
// { type: "dialogue", character: "narrator"|"A"|"B", text: string, translations: Record<string,string> }
// { type: "question", prompt: string, options: string[], correctIndex: number }

const STORIES = [
    {
        title: "Quán cà phê",
        description: "Nam gọi đồ uống tại quán cà phê",
        difficulty: "A1",
        hearts_reward: 1,
        cover_emoji: "☕",
        content: [
            { type: "dialogue", character: "narrator", text: "Nam walks into a small coffee shop.", translations: { "walks": "bước vào", "into": "vào trong", "small": "nhỏ", "coffee": "cà phê", "shop": "quán" } },
            { type: "dialogue", character: "A", text: "Hello! Can I have a coffee, please?", translations: { "Hello": "Xin chào", "Can": "Có thể", "have": "cho tôi", "coffee": "cà phê", "please": "làm ơn" } },
            { type: "dialogue", character: "B", text: "Sure! Hot or iced?", translations: { "Sure": "Được thôi", "Hot": "Nóng", "or": "hay", "iced": "đá" } },
            { type: "dialogue", character: "A", text: "Iced, please. And a piece of cake.", translations: { "Iced": "Đá", "please": "làm ơn", "And": "Và", "piece": "miếng", "cake": "bánh" } },
            { type: "question", prompt: "Nam muốn uống gì?", options: ["Hot coffee", "Iced coffee", "Tea", "Juice"], correctIndex: 1 },
            { type: "dialogue", character: "B", text: "Great choice! That will be fifty thousand dong.", translations: { "Great": "Tuyệt vời", "choice": "lựa chọn", "will": "sẽ", "be": "là", "fifty": "năm mươi", "thousand": "nghìn", "dong": "đồng" } },
            { type: "dialogue", character: "A", text: "Here you go. Thank you!", translations: { "Here": "Đây", "you": "bạn", "go": "nè", "Thank": "Cảm ơn" } },
            { type: "dialogue", character: "B", text: "Thank you! Enjoy your coffee.", translations: { "Thank": "Cảm ơn", "Enjoy": "Thưởng thức", "your": "của bạn", "coffee": "cà phê" } },
            { type: "dialogue", character: "narrator", text: "Nam sits down and enjoys his iced coffee with cake.", translations: { "sits": "ngồi", "down": "xuống", "enjoys": "thưởng thức", "his": "của anh ấy", "iced": "đá", "coffee": "cà phê", "with": "với", "cake": "bánh" } },
        ],
    },
    {
        title: "Hỏi đường",
        description: "Linh hỏi đường đến bưu điện",
        difficulty: "A1",
        hearts_reward: 1,
        cover_emoji: "🗺️",
        content: [
            { type: "dialogue", character: "narrator", text: "Linh is lost in the city center.", translations: { "is": "đang", "lost": "bị lạc", "city": "thành phố", "center": "trung tâm" } },
            { type: "dialogue", character: "A", text: "Excuse me, where is the post office?", translations: { "Excuse": "Xin lỗi", "me": "tôi", "where": "ở đâu", "is": "là", "post": "bưu", "office": "điện" } },
            { type: "dialogue", character: "B", text: "Go straight and turn left at the traffic light.", translations: { "Go": "Đi", "straight": "thẳng", "turn": "rẽ", "left": "trái", "traffic": "giao thông", "light": "đèn" } },
            { type: "question", prompt: "Linh cần rẽ hướng nào?", options: ["Turn right", "Turn left", "Go back", "Turn around"], correctIndex: 1 },
            { type: "dialogue", character: "A", text: "Turn left. Got it. Is it far from here?", translations: { "Turn": "Rẽ", "left": "trái", "Got": "Hiểu", "it": "rồi", "Is": "Có", "far": "xa", "from": "từ", "here": "đây" } },
            { type: "dialogue", character: "B", text: "No, it is about five minutes on foot.", translations: { "No": "Không", "about": "khoảng", "five": "năm", "minutes": "phút", "on": "bằng", "foot": "chân" } },
            { type: "dialogue", character: "A", text: "Thank you so much!", translations: { "Thank": "Cảm ơn", "you": "bạn", "so": "rất", "much": "nhiều" } },
            { type: "dialogue", character: "narrator", text: "Linh follows the directions and finds the post office.", translations: { "follows": "đi theo", "directions": "chỉ dẫn", "finds": "tìm thấy", "post": "bưu", "office": "điện" } },
        ],
    },
    {
        title: "Ở siêu thị",
        description: "Mai đi mua đồ ở siêu thị",
        difficulty: "A1",
        hearts_reward: 1,
        cover_emoji: "🛒",
        content: [
            { type: "dialogue", character: "narrator", text: "Mai goes to the supermarket after school.", translations: { "goes": "đi", "to": "đến", "supermarket": "siêu thị", "after": "sau", "school": "trường" } },
            { type: "dialogue", character: "A", text: "I need to buy some eggs and milk.", translations: { "need": "cần", "buy": "mua", "some": "một ít", "eggs": "trứng", "and": "và", "milk": "sữa" } },
            { type: "dialogue", character: "B", text: "The eggs are in aisle three.", translations: { "eggs": "trứng", "are": "ở", "in": "trong", "aisle": "lối đi", "three": "ba" } },
            { type: "dialogue", character: "A", text: "Thank you! How much are the eggs?", translations: { "Thank": "Cảm ơn", "How": "Bao", "much": "nhiêu", "are": "giá", "eggs": "trứng" } },
            { type: "question", prompt: "Mai cần mua gì?", options: ["Bread and butter", "Eggs and milk", "Rice and fish", "Fruits and water"], correctIndex: 1 },
            { type: "dialogue", character: "B", text: "Thirty thousand dong for a dozen.", translations: { "Thirty": "Ba mươi", "thousand": "nghìn", "dong": "đồng", "for": "cho", "dozen": "một tá" } },
            { type: "dialogue", character: "A", text: "That is cheap! I will take two dozens.", translations: { "That": "Giá đó", "is": "thì", "cheap": "rẻ", "will": "sẽ", "take": "lấy", "two": "hai", "dozens": "tá" } },
            { type: "dialogue", character: "narrator", text: "Mai pays and walks home happily.", translations: { "pays": "trả tiền", "walks": "đi bộ", "home": "về nhà", "happily": "vui vẻ" } },
        ],
    },
    {
        title: "Bạn mới ở lớp",
        description: "Hùng làm quen với bạn mới đến từ Mỹ",
        difficulty: "A2",
        hearts_reward: 2,
        cover_emoji: "🤝",
        content: [
            { type: "dialogue", character: "narrator", text: "A new student joins Hung's class today.", translations: { "new": "mới", "student": "học sinh", "joins": "gia nhập", "class": "lớp", "today": "hôm nay" } },
            { type: "dialogue", character: "A", text: "Hi! My name is Hung. What is your name?", translations: { "Hi": "Chào", "My": "Tên tôi", "name": "tên", "is": "là", "What": "Gì", "your": "của bạn" } },
            { type: "dialogue", character: "B", text: "Hi Hung! I am Tom. I am from America.", translations: { "Hi": "Chào", "I": "Tôi", "am": "là", "from": "đến từ", "America": "Mỹ" } },
            { type: "dialogue", character: "A", text: "Welcome to Vietnam! Do you like it here?", translations: { "Welcome": "Chào mừng", "to": "đến", "Do": "Có", "you": "bạn", "like": "thích", "it": "nó", "here": "ở đây" } },
            { type: "question", prompt: "Tom đến từ đâu?", options: ["England", "Australia", "America", "Canada"], correctIndex: 2 },
            { type: "dialogue", character: "B", text: "Yes! The food is amazing, especially pho.", translations: { "Yes": "Có", "food": "đồ ăn", "is": "thì", "amazing": "tuyệt vời", "especially": "đặc biệt", "pho": "phở" } },
            { type: "dialogue", character: "A", text: "I can show you around the city after school!", translations: { "can": "có thể", "show": "dẫn", "you": "bạn", "around": "quanh", "city": "thành phố", "after": "sau", "school": "giờ học" } },
            { type: "dialogue", character: "B", text: "That sounds great! Let us be friends.", translations: { "That": "Nghe", "sounds": "có vẻ", "great": "tuyệt", "Let": "Hãy", "us": "chúng ta", "be": "là", "friends": "bạn bè" } },
            { type: "dialogue", character: "narrator", text: "Hung and Tom become best friends.", translations: { "become": "trở thành", "best": "tốt nhất", "friends": "bạn bè" } },
        ],
    },
    {
        title: "Đặt phòng khách sạn",
        description: "Lan gọi điện đặt phòng khách sạn",
        difficulty: "A2",
        hearts_reward: 2,
        cover_emoji: "🏨",
        content: [
            { type: "dialogue", character: "narrator", text: "Lan calls a hotel to book a room for her vacation.", translations: { "calls": "gọi điện", "hotel": "khách sạn", "book": "đặt", "room": "phòng", "for": "cho", "her": "của cô ấy", "vacation": "kỳ nghỉ" } },
            { type: "dialogue", character: "B", text: "Good morning! Sunshine Hotel. How can I help you?", translations: { "Good": "Chào", "morning": "buổi sáng", "How": "Làm sao", "can": "có thể", "help": "giúp", "you": "bạn" } },
            { type: "dialogue", character: "A", text: "I would like to book a room for two nights.", translations: { "would": "muốn", "like": "thích", "book": "đặt", "room": "phòng", "two": "hai", "nights": "đêm" } },
            { type: "dialogue", character: "B", text: "Sure! We have single and double rooms. Which do you prefer?", translations: { "Sure": "Được", "have": "có", "single": "đơn", "double": "đôi", "rooms": "phòng", "Which": "Loại nào", "prefer": "thích hơn" } },
            { type: "question", prompt: "Lan muốn đặt phòng mấy đêm?", options: ["One night", "Two nights", "Three nights", "One week"], correctIndex: 1 },
            { type: "dialogue", character: "A", text: "A double room, please. Does it have a sea view?", translations: { "double": "đôi", "room": "phòng", "please": "làm ơn", "Does": "Có", "have": "có", "sea": "biển", "view": "tầm nhìn" } },
            { type: "dialogue", character: "B", text: "Yes! It has a beautiful sea view. The price is eight hundred thousand dong per night.", translations: { "Yes": "Vâng", "beautiful": "đẹp", "sea": "biển", "view": "tầm nhìn", "price": "giá", "eight": "tám", "hundred": "trăm", "thousand": "nghìn", "per": "mỗi", "night": "đêm" } },
            { type: "dialogue", character: "A", text: "That sounds perfect. I will take it!", translations: { "sounds": "nghe", "perfect": "hoàn hảo", "will": "sẽ", "take": "đặt" } },
            { type: "dialogue", character: "narrator", text: "Lan books the room and starts packing for her trip.", translations: { "books": "đặt", "room": "phòng", "starts": "bắt đầu", "packing": "đóng gói", "trip": "chuyến đi" } },
        ],
    },
];

export async function POST() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        // Delete old stories
        await supabase.from("stories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

        // Insert new dialogue stories
        const rows = STORIES.map((s) => ({
            title: s.title,
            description: s.description,
            difficulty: s.difficulty,
            hearts_reward: s.hearts_reward,
            cover_emoji: s.cover_emoji,
            content: s.content, // JSONB array
        }));

        const { error } = await supabase.from("stories").insert(rows);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `✅ Đã tạo ${rows.length} truyện hội thoại Duolingo-style!`,
            total: rows.length,
        });
    } catch (error) {
        console.error("Seed stories error:", error);
        return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
    }
}
