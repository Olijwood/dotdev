import Image from "next/image";
import Link from "next/link";
import { SidebarHeading } from "./sidebar-heading";

type Props = {
    name: string;
    guidelines?: string | null;
    about?: string | null;
    aboutLink?: string | null;
};

export function LeftSidebar({ name, guidelines, about, aboutLink }: Props) {
    return (
        <aside className="p-2 md:col-span-1 order-2 md:order-1">
            <div className="border-b border-gray-300 p-4 ">
                <Link
                    href="/create-post"
                    className="block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium text-center  "
                >
                    Create Post
                </Link>
            </div>
            <GuidelinesCard guidelines={guidelines} />
            <AboutCard name={name} about={about} aboutLink={aboutLink} />
            <ModeratorsCard />
        </aside>
    );
}

export function SkeletonLeftSidebar() {
    return (
        <aside className="p-2 md:col-span-1 order-2 md:order-1">
            <div className="border-b border-gray-300 p-4">
                <div className="block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium text-center">
                    Create Post
                </div>
            </div>
            <SkeletonGuidelinesCard />
            <SkeletonAboutCard />
            <SkeletonModeratorsCard />
        </aside>
    );
}

function GuidelinesCard({ guidelines }: { guidelines?: string | null }) {
    return (
        <div className=" border-b border-gray-300 p-4 ">
            <SidebarHeading>Submission Guidelines</SidebarHeading>
            <p className="text-gray-700 text-sm">
                {guidelines || "No guidelines provided"}
            </p>
        </div>
    );
}
function SkeletonGuidelinesCard({
    guidelines,
}: {
    guidelines?: string | null;
}) {
    return (
        <div className=" border-b border-gray-300 p-4 ">
            <SidebarHeading>Submission Guidelines</SidebarHeading>
            <p className="text-muted text-sm">
                {guidelines || "No guidelines provided"}
            </p>
        </div>
    );
}

function AboutCard({
    name,
    about,
    aboutLink,
}: {
    name: string;
    about?: string | null;
    aboutLink?: string | null;
}) {
    return (
        <div className="text-wrap overflow-hidden border-b border-gray-300 p-4">
            <SidebarHeading>about #{name}</SidebarHeading>
            <p className="text-gray-700 text-sm mb-2">
                {about || "No description provided"}
            </p>
            <a
                href={aboutLink || "/"}
                className="text-blue-600  hover:text-blue-800 text-sm"
            >
                {aboutLink || ""}
            </a>
        </div>
    );
}

function SkeletonAboutCard() {
    return (
        <div className="text-wrap overflow-hidden border-b border-gray-300 p-4">
            <SidebarHeading>about #</SidebarHeading>
            <p className="text-muted text-sm mb-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
                hic animi! Ullam reiciendis laboriosam magnam doloremque.
            </p>
        </div>
    );
}

function ModeratorsCard() {
    return (
        <div className=" border-b border-gray-300 rounded-md p-4">
            <SidebarHeading>tag moderators</SidebarHeading>
            <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Link href={`/user/${i}`} key={i}>
                        <Image
                            src={`/hacker.png?height=50&width=50`}
                            alt={`Moderator ${i}`}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SkeletonModeratorsCard() {
    return (
        <div className=" border-b border-gray-300 rounded-md p-4">
            <SidebarHeading>tag moderators</SidebarHeading>
            <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                        <div className="rounded-full bg-gray-200 h-10 w-10 flex items-center justify-center text-lg font-bolder"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
