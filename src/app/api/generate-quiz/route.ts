import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert English teacher creating quiz questions for Vietnamese learners.

RULES:
- Generate exactly 3 questions in JSON format
- Mix question types: 1 flashcard + 2 multiple choice, OR 2 flashcard + 1 multiple choice
- For flashcards: provide an English word/phrase with phonetic, Vietnamese meaning, and example
- For multiple choice: ask translation or grammar questions with 4 options
- Adjust difficulty based on the CEFR level provided
- All explanations should be in Vietnamese
- Keep questions relevant to the given topic
- Return ONLY valid JSON, no markdown code blocks

OUTPUT FORMAT (strict JSON array):
[
  {
    "type": "flashcard",
    "word": "English word/phrase",
    "phonetic": "/phonetic/",
    "meaning": "Vietnamese meaning",
    "example": "Example sentence in English",
    "exampleTranslation": "Vietnamese translation of example"
  },
  {
    "type": "multiple_choice",
    "prompt": "Question text",
    "promptTranslation": "Brief instruction in Vietnamese",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "Short explanation in Vietnamese"
  }
]`;

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY chưa được cấu hình. Hãy thêm vào file .env.local" },
                { status: 500 }
            );
        }

        const { topic, level } = await request.json();

        if (!topic || !level) {
            return NextResponse.json(
                { error: "Thiếu topic hoặc level" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Create 3 English learning questions about the topic "${topic}" for a student at CEFR level ${level}. Follow the output format strictly.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
            },
        });

        const text = result.response.text();
        const questions = JSON.parse(text);

        // Validate structure
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("AI response is not a valid array");
        }

        // Add IDs
        const withIds = questions.map((q: Record<string, unknown>, i: number) => ({
            ...q,
            id: `ai-${Date.now()}-${i}`,
        }));

        return NextResponse.json({ questions: withIds });
    } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            { error: "Không thể tạo câu hỏi. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
