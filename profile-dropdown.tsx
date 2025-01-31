"use client";

import {
    LayoutDashboard,
    PenSquare,
    BookOpen,
    Settings,
    LogOut,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";

export function ProfileDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative size-8 rounded-full"
                >
                    <Avatar className="size-8">
                        <AvatarImage src="/avatars/01.png" alt="@olijwood" />
                        <AvatarFallback>OW</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Oliver Wood
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            @olijwood
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 size-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <PenSquare className="mr-2 size-4" />
                    <span>Create Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <BookOpen className="mr-2 size-4" />
                    <span>Reading List</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 size-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
