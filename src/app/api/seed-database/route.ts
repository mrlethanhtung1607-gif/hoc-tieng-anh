import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ── 50 Units × ~20 words each = ~1000 words ─────────────
const UNITS = [
    { unit: 1, title: "Chào hỏi cơ bản", topic: "Basic Greetings" },
    { unit: 2, title: "Gia đình & Bạn bè", topic: "Family & Friends" },
    { unit: 3, title: "Công việc hàng ngày", topic: "Daily Routines" },
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
    { unit: 14, title: "Nghề nghiệp", topic: "Occupations & Jobs" },
    { unit: 15, title: "Cảm xúc & Tính cách", topic: "Emotions & Personality" },
    { unit: 16, title: "Bộ phận cơ thể", topic: "Body Parts" },
    { unit: 17, title: "Bệnh viện & Sức khỏe", topic: "Health & Hospital" },
    { unit: 18, title: "Thể thao & Vận động", topic: "Sports & Exercise" },
    { unit: 19, title: "Sở thích & Giải trí", topic: "Hobbies & Entertainment" },
    { unit: 20, title: "Âm nhạc & Nhạc cụ", topic: "Music & Instruments" },
    { unit: 21, title: "Du lịch & Khám phá", topic: "Travel & Exploration" },
    { unit: 22, title: "Mua sắm & Giá cả", topic: "Shopping & Prices" },
    { unit: 23, title: "Nhà hàng & Gọi món", topic: "Restaurant & Ordering" },
    { unit: 24, title: "Thành phố & Đường phố", topic: "City & Streets" },
    { unit: 25, title: "Thiên nhiên & Cây cối", topic: "Nature & Plants" },
    { unit: 26, title: "Biển & Đại dương", topic: "Sea & Ocean" },
    { unit: 27, title: "Vũ trụ & Hành tinh", topic: "Space & Planets" },
    { unit: 28, title: "Công nghệ & Internet", topic: "Technology & Internet" },
    { unit: 29, title: "Máy tính & Điện thoại", topic: "Computers & Phones" },
    { unit: 30, title: "Văn phòng & Công sở", topic: "Office & Workplace" },
    { unit: 31, title: "Động từ thường gặp 1", topic: "Common Verbs Part 1" },
    { unit: 32, title: "Động từ thường gặp 2", topic: "Common Verbs Part 2" },
    { unit: 33, title: "Tính từ mô tả", topic: "Descriptive Adjectives" },
    { unit: 34, title: "Trạng từ cơ bản", topic: "Basic Adverbs" },
    { unit: 35, title: "Giới từ & Liên từ", topic: "Prepositions & Conjunctions" },
    { unit: 36, title: "Thời gian & Lịch trình", topic: "Time & Schedules" },
    { unit: 37, title: "Tiền tệ & Ngân hàng", topic: "Money & Banking" },
    { unit: 38, title: "Nấu ăn & Nhà bếp", topic: "Cooking & Kitchen" },
    { unit: 39, title: "Hoa quả & Rau củ", topic: "Fruits & Vegetables" },
    { unit: 40, title: "Đồ uống & Tráng miệng", topic: "Beverages & Desserts" },
    { unit: 41, title: "Phim ảnh & Truyền hình", topic: "Movies & TV Shows" },
    { unit: 42, title: "Sách & Đọc sách", topic: "Books & Reading" },
    { unit: 43, title: "Lễ hội & Ngày lễ", topic: "Festivals & Holidays" },
    { unit: 44, title: "Hôn nhân & Gia đình", topic: "Marriage & Family Life" },
    { unit: 45, title: "Môi trường & Tái chế", topic: "Environment & Recycling" },
    { unit: 46, title: "Luật pháp & An ninh", topic: "Law & Security" },
    { unit: 47, title: "Kinh tế & Thương mại", topic: "Economy & Trade" },
    { unit: 48, title: "Giao tiếp xã giao", topic: "Social Etiquette" },
    { unit: 49, title: "Email & Thư tín", topic: "Emails & Letters" },
    { unit: 50, title: "Phỏng vấn & Xin việc", topic: "Interviews & Job Applications" },
];

export async function POST() {
    try {
        const supabase = await createClient();

        // Check auth — only allow authenticated users
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        // Delete old lessons first (fresh seed)
        const { error: deleteError } = await supabase
            .from("lessons")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

        if (deleteError) {
            return NextResponse.json(
                { error: `Lỗi xóa dữ liệu cũ: ${deleteError.message}` },
                { status: 500 }
            );
        }

        // Prepare rows: Unit 1 unlocked, rest locked
        const rows = UNITS.map((u) => ({
            title: u.title,
            unit_number: u.unit,
            is_unlocked: u.unit === 1,
        }));

        // Insert in batches of 25 to avoid payload limits
        const batchSize = 25;
        let insertedCount = 0;

        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const { error: insertError } = await supabase
                .from("lessons")
                .insert(batch);

            if (insertError) {
                return NextResponse.json(
                    {
                        error: `Lỗi insert batch ${Math.floor(i / batchSize) + 1}: ${insertError.message}`,
                        insertedSoFar: insertedCount,
                    },
                    { status: 500 }
                );
            }

            insertedCount += batch.length;
        }

        return NextResponse.json({
            success: true,
            message: `✅ Đã tạo ${insertedCount} bài học thành công!`,
            totalUnits: insertedCount,
            totalWords: insertedCount * 20,
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Lỗi không xác định khi seed" },
            { status: 500 }
        );
    }
}
