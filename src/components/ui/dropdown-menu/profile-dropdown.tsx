"use client";

import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    Settings,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { UserDetails } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export type ProfileDropdownProps = {
    userDetails: UserDetails;
};

const ProfileDropdown = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const { username, name, image } = user || {};
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="ml-2 size-11 border">
                    <AvatarImage
                        referrerPolicy="no-referrer"
                        src={image || "/hacker.png"}
                        alt={`@${username} profile picture`}
                    />
                    <AvatarFallback>{name ? name[0] : ""}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-52 px-2 py-1 text-neutral-800"
                align="end"
                forceMount
            >
                <Link href={`/${username}`}>
                    <DropdownMenuLabel className="rounded-md hover:bg-accent hover:text-accent-foreground hover:underline">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {name}
                            </p>
                            <p className="text-xs font-semibold leading-none text-muted-foreground [word-spacing:-0.125rem]">
                                @ {username}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/admin">
                    <DropdownMenuItem>
                        <LayoutDashboard className="mr-1 size-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/admin/create/">
                    <DropdownMenuItem>
                        <PenSquare className="mr-1 size-4" />
                        <span>Create Post</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={`/${username}/reading-list`}>
                    <DropdownMenuItem>
                        <BookOpen className="mr-1 size-4" />
                        <span>Reading List</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                    <DropdownMenuItem>
                        <Settings className="mr-1 size-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <LogoutButton>
                    <DropdownMenuItem>
                        <LogOut className="mr-1 size-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ProfileDropdown };
