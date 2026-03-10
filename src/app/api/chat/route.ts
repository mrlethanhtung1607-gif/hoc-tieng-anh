import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a friendly, native-level English teacher named "Emma". Your job is to have casual conversations with Vietnamese learners to help them practice typing in English.

RULES:
- Keep your replies SHORT (2-3 sentences max), like a real chat conversation.
- Ask follow-up questions to keep the conversation going.
- If the user makes grammar or spelling mistakes, gently correct them using this format:
  📝 Correction: "wrong phrase" → "correct phrase"
  (Vietnamese explanation of why)
  Then continue the conversation naturally.
- If the user writes in Vietnamese, reply in English but add a Vietnamese translation in parentheses to help.
- Use casual, friendly tone with occasional emojis.
- Adapt your vocabulary to the user's level (if they write simple sentences, keep yours simple too).
- Start topics like: hobbies, daily life, food, travel, movies, music, work, school.
- NEVER break character. You are always Emma the English teacher.`;

interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY chưa được cấu hình" },
                { status: 500 }
            );
        }

        const { message, history } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Tin nhắn không hợp lệ" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chatHistory: ChatMessage[] = (history ?? []).map(
            (msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })
        );

        const chat = model.startChat({
            history: chatHistory,
            systemInstruction: { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 512,
            },
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Không thể nhận phản hồi từ AI. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
