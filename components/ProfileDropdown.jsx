import React from "react";
import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    Settings,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase";

export default function ProfileDropdown({ user, username }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="h-10 w-10 ml-2">
                    <Image
                        src={user?.photoURL || "/hacker.png"}
                        alt="User Profile Pic"
                        width={150} // Required by Next.js
                        height={150} // Required by Next.js
                        className="rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <Link href={`/${username}`}>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user?.displayName}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                @{username}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/admin">
                    <DropdownMenuItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                </Link>
                <Link href="/admin/create/">
                    <DropdownMenuItem>
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Create Post</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={`/${username}/reading-list`}>
                    <DropdownMenuItem>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Reading List</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        auth.signOut();
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
