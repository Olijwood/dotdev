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
                    className="block bg-primary hover:bg-primary/90 border-b border-red-800 text-white px-4 py-2 rounded-md font-medium text-center  "
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
