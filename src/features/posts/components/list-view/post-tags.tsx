import { CrayonTag } from "@/components/ui/badge";
import { Tag } from "../../types";

interface PostTagsProps {
    tags: Tag[];
}

export default function PostTags({ tags }: PostTagsProps) {
    // console.log("POST TAGS tags:", tags);
    if (!tags || !tags.length) return null;

    return (
        <div className="-ml-1.5 mt-1  flex flex-wrap gap-0.5 ">
            {tags.map((tag) => {
                // console.log("tag:", tag);
                if (!tag || !tag.name) {
                    // console.log("NO TAG");
                    return null;
                }
                return (
                    <CrayonTag
                        key={tag.id || tag.name}
                        tag={tag.name}
                        href={`/t/${tag.name}`}
                    />
                );
            })}
        </div>
    );
}
