import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { Grip, Pencil } from 'lucide-react';

interface ChapterProps {
    itemss: any[];
}

function SortableItem(props: { chapter: any; position: any; id: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className={`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm
                                            ${props.chapter.isPublished && "bg-blue-100 border-blue-200 text-blue-700"}
                                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300
                                            dark:${props.chapter.isPublished && "bg-blue-800 border-blue-600 text-blue-300"}
                                        `}
            >
                {/* handle */}
                <div
                    className={`px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition
                                                ${props.chapter.isPublished && "border-r-blue-200 hover:bg-blue-200"}
                                                dark:border-r-slate-800 dark:hover:bg-slate-700
                                                dark:${props.chapter.isPublished && "border-r-blue-600 hover:bg-blue-800"}
                                            `}
                >
                    <Grip
                        className="h-5 w-5"
                    />
                </div>
                {props.chapter.title}Hello
                <div className="ml-auto pr-2 flex items-center gap-x-2">
                    {props.chapter.isFree && (
                        <Badge>
                            Free
                        </Badge>
                    )}
                    <Badge
                        className={`bg-gray-500
                                                ${props.chapter.isPublished && "bg-sky-700"}
                                                dark:bg-slate-500
                                                dark:${props.chapter.isPublished && "bg-sky-700"}
                                                `}
                    >
                        {props.chapter.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Pencil
                        // onClick={() => onEdit(props.chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                    />
                </div>
            </div>
        </div>
    );
}

const DragDrop = ({ itemss }: ChapterProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const items = itemss.map(({ _id, title, position }) => ({ _id }));
    // const items = itemss;

    const [chapters, setChapters] = useState(items);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    if (!isMounted) {
        return null;
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setChapters((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update the database with new order
                axios.post('/api/update-chapters', { chapters: newItems });

                return newItems;
            });
        }
    };

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={chapters as any}
                    strategy={verticalListSortingStrategy}
                >
                    {chapters.map((item, id) => (
                        <SortableItem key={id} id={id} chapter={item} position={item} />)
                    )}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default DragDrop;
