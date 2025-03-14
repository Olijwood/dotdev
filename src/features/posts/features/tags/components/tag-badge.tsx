import Link from "next/link";

type TagBadgeProps = {
    name: string;
    isSpecial?: boolean;
};

export function TagBadge({ name, isSpecial }: TagBadgeProps) {
    return (
        <Link
            href={`/t/${name.replace("#", "")}`}
            className={`${isSpecial ? "text-yellow-600" : "text-gray-600"} hover:text-blue-700 text-sm`}
        >
            {name}
        </Link>
    );
}
