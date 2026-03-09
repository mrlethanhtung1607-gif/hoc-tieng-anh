"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/types/database";

interface AudioPlayerProps {
    exercises: Exercise[];
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ exercises }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    const current = exercises[currentIndex];
    const audioUrl = current?.media_url;

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }, [currentIndex]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = parseFloat(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const goNext = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex((i) => i + 1);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Track info */}
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    Track {currentIndex + 1} / {exercises.length}
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                    {current?.question ?? "Bài nghe"}
                </h3>
            </div>

            {/* Player card */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-lg">
                {audioUrl ? (
                    <>
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            preload="none"
                            onTimeUpdate={() =>
                                setCurrentTime(
                                    audioRef.current?.currentTime ?? 0
                                )
                            }
                            onLoadedMetadata={() =>
                                setDuration(
                                    audioRef.current?.duration ?? 0
                                )
                            }
                            onEnded={() => setIsPlaying(false)}
                        />

                        {/* Seek bar */}
                        <div className="flex items-center gap-3">
                            <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min={0}
                                max={duration || 1}
                                step={0.1}
                                value={currentTime}
                                onChange={handleSeek}
                                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-emerald-500
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-emerald-500"
                            />
                            <span className="w-10 text-xs text-muted-foreground tabular-nums">
                                {formatTime(duration)}
                            </span>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goPrev}
                                disabled={currentIndex === 0}
                                className="cursor-pointer"
                            >
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                onClick={togglePlay}
                                className="h-12 w-12 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer"
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goNext}
                                disabled={
                                    currentIndex === exercises.length - 1
                                }
                                className="cursor-pointer"
                            >
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Placeholder when no audio */
                    <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                        <Volume2 className="h-12 w-12 opacity-30" />
                        <p className="text-sm">
                            Chưa có file audio cho bài nghe này.
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goPrev}
                                disabled={currentIndex === 0}
                                className="cursor-pointer"
                            >
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goNext}
                                disabled={
                                    currentIndex === exercises.length - 1
                                }
                                className="cursor-pointer"
                            >
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transcript */}
            {current?.explanation && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
                    <h4 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Transcript / Giải thích
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {current.explanation}
                    </p>
                </div>
            )}

            {/* Answer section */}
            {current?.correct_answer && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/20">
                    <h4 className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        Đáp án
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                        {current.correct_answer}
                    </p>
                </div>
            )}
        </div>
    );
}
