"use client";

import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    Settings,
    LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserDetails } from "@/types";

export type ProfileDropdownProps = {
    userDetails: UserDetails;
};

const ProfileDropdown = ({ userDetails }: ProfileDropdownProps) => {
    const { username, name, image } = userDetails;
    console.log("userDetails", userDetails);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="ml-2 size-10">
                    <Image
                        src={image || "/hacker.png"}
                        alt="User Profile Pic"
                        width={150}
                        height={150}
                        className="rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-52  p-2 text-neutral-800"
                align="end"
                forceMount
            >
                <Link href={`/${username}`}>
                    <DropdownMenuLabel className="rounded-md hover:bg-accent hover:text-accent-foreground hover:underline">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {name}
                            </p>
                            <p className="text-xs font-semibold leading-none text-muted-foreground [word-spacing:-0.1rem]">
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
                <DropdownMenuItem>
                    <Settings className="mr-1 size-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-1 size-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ProfileDropdown };
