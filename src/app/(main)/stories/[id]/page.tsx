import { getStoryById } from "@/lib/actions/stories";
import { notFound } from "next/navigation";
import DialogueReader from "./dialogue-reader";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: Props) {
    const { id } = await params;
    const story = await getStoryById(id);

    if (!story) notFound();

    return (
        <DialogueReader
            storyId={story.id}
            title={story.title}
            heartsReward={story.hearts_reward}
            content={story.content}
        />
    );
}
