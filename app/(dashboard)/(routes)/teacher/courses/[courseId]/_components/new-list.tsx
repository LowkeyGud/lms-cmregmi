import { Badge } from "@/components/ui/badge";
import { Reorder, useDragControls } from "framer-motion"
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react"

interface NewListProps {
    items: any[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
};

export const NewList = ({
    items,
    onReorder,
    onEdit
}: NewListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: any) => {


        if (!result.destination) return;


        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <main>
            <Reorder.Group as="ol" axis="y" onReorder={(e) => onDragEnd(e)} values={chapters}>
                {chapters.map((chapter) => (
                    <Reorder.Item
                        value={chapter._id}
                        key={chapter._id}
                    >
                        <div
                            className={`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm
                                            ${chapter.isPublished && "bg-blue-100 border-blue-200 text-blue-700"}
                                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300
                                            dark:${chapter.isPublished && "bg-blue-800 border-blue-600 text-blue-300"}
                                        `}
                        >
                            <div
                                className={`px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition
                                                ${chapter.isPublished && "border-r-blue-200 hover:bg-blue-200"}
                                                dark:border-r-slate-800 dark:hover:bg-slate-700
                                                dark:${chapter.isPublished && "border-r-blue-600 hover:bg-blue-800"}
                                            `}
                            >
                                <Grip
                                    className="h-5 w-5"
                                />
                            </div>
                            {chapter.title}
                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                {chapter.isFree && (
                                    <Badge>
                                        Free
                                    </Badge>
                                )}
                                <Badge
                                    className={`bg-gray-500
                                                ${chapter.isPublished && "bg-sky-700"}
                                                dark:bg-slate-500
                                                dark:${chapter.isPublished && "bg-sky-700"}
                                                `}
                                >
                                    {chapter.isPublished ? "Published" : "Draft"}
                                </Badge>
                                <Pencil
                                    onClick={() => onEdit(chapter.id)}
                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                />
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </main>
    );
}
