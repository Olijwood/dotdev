import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostMetadataProps {
    author: {
        username: string;
        name?: string;
        userImg?: string;
    };
    date: string;
}

export default function PostMetadata({ author, date }: PostMetadataProps) {
    const { name, username, userImg } = author;
    return (
        <div className="flex items-center">
            <Link href={`/${username}`} className="shrink-0">
                <Avatar className="size-10 border">
                    <AvatarImage src={userImg} alt={`${username} avatar`} />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>

            <div className="ml-3">
                <div className="flex items-center">
                    <Link
                        href={`/${username}`}
                        className="font-medium hover:text-blue-600"
                    >
                        {name || username}
                    </Link>
                </div>

                <div className="text-sm text-gray-500">{date}</div>
            </div>
        </div>
    );
}
