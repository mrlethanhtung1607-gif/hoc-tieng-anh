import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoryById } from "@/lib/actions/stories";
import { ClozeReader } from "./cloze-reader";

async function StoryContent({ id }: { id: string }) {
    const story = await getStoryById(id);

    if (!story) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy truyện này.</p>
            </div>
        );
    }

    return (
        <ClozeReader
            storyId={story.id}
            title={story.title}
            content={story.content}
            heartsReward={story.hearts_reward}
            difficulty={story.difficulty}
            coverEmoji={story.cover_emoji}
        />
    );
}

export default async function StoryDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-2xl space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            }
        >
            <StoryContent id={id} />
        </Suspense>
    );
}
