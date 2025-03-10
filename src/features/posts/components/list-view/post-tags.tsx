// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import type { Tag } from "@/types/post";
import { CrayonTag } from "@/components/ui/badge";

interface PostTagsProps {
    tags: string[];
}

export default function PostTags({ tags }: PostTagsProps) {
    if (!tags.length) return null;

    return (
        <div className="-ml-1.5 mt-1  flex flex-wrap gap-0.5 ">
            {tags.map((tag) => (
                <CrayonTag key={tag} tag={tag} href={`/t/${tag}`} />
            ))}
        </div>
    );
}
