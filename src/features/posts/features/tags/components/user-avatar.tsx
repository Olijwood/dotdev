import Image from "next/image";
import Link from "next/link";

type UserAvatarProps = {
    name: string;
    username: string;
    avatarUrl?: string;
    isVerified?: boolean;
};

export function UserAvatar({
    name,
    username,
    avatarUrl = "",
    isVerified = false,
}: UserAvatarProps) {
    return (
        <div className="flex gap-3">
            <Link href={`/profile/${username}`} className="shrink-0">
                <Image
                    src={avatarUrl || "/hacker.svg"}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </Link>
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <Link
                        href={`/${username}`}
                        className="font-medium hover:text-blue-700"
                    >
                        {name}
                    </Link>
                    {isVerified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-1 rounded">
                            <span className="sr-only">Verified</span>
                            ✓✓
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm">Mar 12</p>
            </div>
        </div>
    );
}
