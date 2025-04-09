import { DialogTitle } from "@radix-ui/react-dialog";
import {
    MapPin,
    Calendar,
    Mail,
    ExternalLink,
    Github,
    MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FollowButton } from "@/features/posts/components/detail-view/follow-button";
import { getDateString } from "@/lib/utils";

export type ProfileHeaderUserInfo = {
    currUid: string | undefined;
    id: string;
    name: string;
    username: string;
    profileImage: string | null;
    bio: string | null;
    location: string | null;
    joinedAt: Date;
    email: string;
    displayEmailOnProfile: boolean;
    website: string | null;
    githubUrl: string | null;
    work: string | null;
    brandColour: string | null;
};

type ProfileHeaderProps = {
    user: ProfileHeaderUserInfo;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const isAuthor = user.currUid === user.id;
    const joinedAtString = getDateString(user.joinedAt, true);

    return (
        <div className="relative">
            {/* Banner */}
            <div
                className="h-32 w-full"
                style={{ backgroundColor: user.brandColour ?? "#000000" }}
            />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white md:rounded-lg md:mx-4 -mt-6 relative">
                    {/* Profile picture */}
                    <div className="absolute -top-16 md:left-1/2 md:transform md:-translate-x-1/2 left-8">
                        <div
                            className="w-32 h-32 rounded-full border-6 overflow-hidden bg-white"
                            style={{
                                borderColor: user.brandColour ?? "#000000",
                            }}
                        >
                            <Image
                                src={user.profileImage || "hacker.png"}
                                alt={`${user.name} Profile Pic`}
                                width={128}
                                height={128}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        {isAuthor && <FollowButton followingId={user.id} />}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="min-w-9"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <div className="grid gap-4">
                                    <DialogTitle className="font-medium">
                                        Profile actions
                                    </DialogTitle>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline">
                                            Report abuse
                                        </Button>
                                        <Button variant="outline">
                                            Block user
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Main content */}
                    <div className="pt-20 pb-8 px-4 md:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {user.name || user.username}
                        </h1>

                        {user.bio && (
                            <p className="text-gray-700 mt-2 max-w-2xl mx-auto text-lg">
                                {user.bio}
                            </p>
                        )}

                        {/* Contact info */}
                        <div className="flex flex-wrap justify-center gap-4 mt-6 text-gray-600 text-sm">
                            {user.location && (
                                <InfoItem icon={<MapPin className="w-4 h-4" />}>
                                    {user.location}
                                </InfoItem>
                            )}
                            <InfoItem icon={<Calendar className="w-4 h-4" />}>
                                Joined on {joinedAtString}
                            </InfoItem>
                            {user.displayEmailOnProfile && (
                                <InfoItem icon={<Mail className="w-4 h-4" />}>
                                    {user.email}
                                </InfoItem>
                            )}
                            {user.website && (
                                <LinkItem
                                    icon={<ExternalLink className="w-4 h-4" />}
                                    href={user.website}
                                >
                                    {user.website}
                                </LinkItem>
                            )}
                            {user.githubUrl && (
                                <LinkItem
                                    icon={<Github className="w-5 h-5" />}
                                    href={user.githubUrl}
                                >
                                    {user.githubUrl.replace("https://", "")}
                                </LinkItem>
                            )}
                        </div>
                    </div>

                    {user.work && (
                        <div className="text-center pb-6">
                            <div className="text-gray-700 font-medium">
                                Work
                            </div>
                            <div>{user.work}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ProfileHeaderSkeleton() {
    return (
        <div className="relative ">
            <div className="h-32 w-full bg-gray-200" />

            <div className="max-w-7xl mx-auto">
                <div className="bg-white md:rounded-lg md:mx-4 -mt-6 relative">
                    <div className="absolute -top-16 md:left-1/2 md:transform md:-translate-x-1/2 left-8">
                        <div className="w-32 h-32 rounded-full border-6 border-gray-300 overflow-hidden bg-white">
                            <div className="w-full h-full bg-gray-200" />
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <FollowButton followingId={"1"} />
                        <Button
                            variant="outline"
                            size="icon"
                            className="min-w-9"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="pt-20 pb-8 px-4 md:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent">
                            a
                        </h1>

                        <p className=" mt-2 max-w-2xl mx-auto text-transparent">
                            lorel
                        </p>

                        {/* Contact info */}
                        <div className="flex flex-wrap justify-center gap-4 mt-6 text-gray-600 text-sm">
                            <InfoItem icon={<MapPin className="w-4 h-4" />}>
                                {" "}
                            </InfoItem>
                            <InfoItem icon={<Calendar className="w-4 h-4" />}>
                                Joined on
                            </InfoItem>
                            <LinkItem
                                icon={<ExternalLink className="w-4 h-4" />}
                                href="/"
                            >
                                {" "}
                            </LinkItem>
                        </div>
                    </div>

                    <div className="text-center pb-6">
                        <div className="text-gray-700 font-medium">Work</div>
                        <div> </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable info line (non-link)
function InfoItem({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-1">
            {icon}
            <span className="break-words">{children}</span>
        </div>
    );
}

// Reusable link line (external)
function LinkItem({
    icon,
    href,
    children,
}: {
    icon: React.ReactNode;
    href: string;
    children: React.ReactNode;
}) {
    const normalizedHref = href.startsWith("http") ? href : `https://${href}`;

    return (
        <div className="flex items-center gap-1 break-words max-w-xs">
            {icon}
            <a
                href={normalizedHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
            >
                {children}
            </a>
        </div>
    );
}
