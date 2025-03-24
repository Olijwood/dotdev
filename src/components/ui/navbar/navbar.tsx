"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthButton, Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/features/search/components";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const { data: session } = useSession();

    const pathname = usePathname();

    const user = session?.user;
    const { email } = user || {};

    const hideNav = pathname === "/onboarding";
    const hideSearch = pathname === "/search";
    const hideCreate = pathname === "/create-post";

    return (
        <nav className={cn("border-b-2 border-gray-300", hideNav && "!hidden")}>
            <ul className="max-w-7xl mx-auto  flex h-[var(--navbar-height)] items-center justify-between px-2.5 ">
                <li>
                    <Link href="/">
                        <Button
                            size="lg"
                            className="rounded bg-black p-2.5 font-mono text-[1.6rem] font-bold uppercase text-white"
                        >
                            DOTDEV
                        </Button>
                    </Link>
                </li>
                <div
                    className={cn(
                        "hidden sm:block ml-4",
                        hideSearch && "!hidden",
                    )}
                >
                    <SearchBar placeholder="Search..." id="navbar-search" />
                </div>
                <div className="ml-auto flex items-center justify-evenly gap-1">
                    {email && (
                        <li
                            className={cn(
                                "hidden sm:block",
                                hideCreate && "hidden",
                            )}
                        >
                            <Link href="/create-post">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg border-2 border-blue-700 px-2.5 font-sans  text-base font-bold text-blue-700 hover:bg-blue-700 hover:text-white"
                                >
                                    Create Post
                                </Button>
                            </Link>
                        </li>
                    )}
                    <li
                        className={cn(
                            "flex items-center",
                            hideSearch && "!hidden",
                        )}
                    >
                        <div className="block h-full w-full p-2 rounded-lg sm:hidden  text-muted-foreground">
                            <Link href="/search">
                                <Search size={20} />
                            </Link>
                        </div>
                    </li>

                    {email && (
                        <li>
                            <ProfileDropdown />
                        </li>
                    )}
                    {!email && (
                        <>
                            <li className="">
                                <AuthButton href="/register">
                                    Register
                                </AuthButton>
                            </li>
                            <li className="ml-1">
                                <AuthButton href="/login">Login</AuthButton>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export { Navbar };

export const dynamic = "force-dynamic";
