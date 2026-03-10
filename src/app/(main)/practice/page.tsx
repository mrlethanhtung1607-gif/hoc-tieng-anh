"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    BrainCircuit,
    Loader2,
    Sparkles,
    MessageCircle,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "assistant",
    content:
        "Hi there! 👋 I'm Emma, your English practice partner. Let's have a chat in English! Don't worry about making mistakes — I'll help you along the way. 😊\n\nSo, tell me: what did you do today?",
    timestamp: new Date(),
};

export default function PracticePage() {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    async function handleSend() {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Build history for API (exclude welcome message)
        const history = [...messages, userMsg]
            .filter((m) => m.id !== "welcome")
            .map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content,
            }));

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, history }),
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "assistant",
                content: data.reply || data.error || "Xin lỗi, tôi không thể trả lời lúc này.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: "assistant",
                    content: "⚠️ Không thể kết nối đến AI. Vui lòng kiểm tra kết nối mạng và thử lại.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function handleClear() {
        setMessages([WELCOME_MESSAGE]);
        setInput("");
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/20">
                        <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm flex items-center gap-1.5">
                            Emma — Giáo viên AI
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        </h1>
                        <p className="text-xs text-muted-foreground">Luyện giao tiếp Tiếng Anh</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-muted-foreground hover:text-foreground gap-1.5"
                    onClick={handleClear}
                >
                    <Trash2 className="h-3.5 w-3.5" /> Xóa
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        {/* Avatar */}
                        {msg.role === "assistant" ? (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm mt-1">
                                <BrainCircuit className="h-4 w-4 text-white" />
                            </div>
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm mt-1">
                                <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                        )}

                        {/* Bubble */}
                        <div
                            className={cn(
                                "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                                msg.role === "user"
                                    ? "bg-emerald-600 text-white rounded-br-md"
                                    : "bg-card border border-border rounded-bl-md"
                            )}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            <p
                                className={cn(
                                    "text-[10px] mt-1.5",
                                    msg.role === "user"
                                        ? "text-emerald-200"
                                        : "text-muted-foreground"
                                )}
                            >
                                {msg.timestamp.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex gap-3 max-w-[85%] animate-in fade-in duration-300">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm mt-1">
                            <BrainCircuit className="h-4 w-4 text-white" />
                        </div>
                        <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
                                <span>Giáo viên đang gõ...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-sm px-4 py-3">
                <div className="flex items-end gap-2 max-w-3xl mx-auto">
                    <div className="relative flex-1">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn bằng Tiếng Anh..."
                            rows={1}
                            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-muted-foreground/60"
                            style={{ maxHeight: "120px" }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = Math.min(target.scrollHeight, 120) + "px";
                            }}
                        />
                        <div className="absolute right-2 bottom-1.5">
                            <Button
                                size="sm"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="cursor-pointer h-8 w-8 p-0 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 shadow-sm"
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground/50 mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" /> Powered by Gemini AI · Nhấn Enter để gửi, Shift+Enter để xuống dòng
                </p>
            </div>
        </div>
    );
}
