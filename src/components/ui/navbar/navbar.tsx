"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthButton, Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    // const pathname = usePathname();
    const { username } = user || {};

    return (
        <nav className="border-b-2 border-gray-300">
            <ul className="flex h-[--navbar-height] items-center justify-between px-2.5">
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

                {username && (
                    <>
                        {/* <div className="ml-2 flex gap-x-2">
                            <Button
                                asChild
                                variant={
                                    pathname === "/server"
                                        ? "default"
                                        : "outline"
                                }
                            >
                                <Link href="/server">Server</Link>
                            </Button>
                            <Button
                                asChild
                                variant={
                                    pathname === "/client"
                                        ? "default"
                                        : "outline"
                                }
                            >
                                <Link href="/client">Client</Link>
                            </Button>
                        </div> */}
                        <li className="ml-auto">
                            <Link href="/dashboard">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg border-2 border-blue-700 px-2.5 font-sans  text-base font-bold text-blue-700 hover:bg-blue-700 hover:text-white"
                                >
                                    Create Post
                                </Button>
                            </Link>
                        </li>

                        <li className="ml-2">
                            <ProfileDropdown />
                        </li>
                    </>
                )}

                {!username && (
                    <>
                        <li className="ml-auto">
                            <AuthButton href="/register">Register</AuthButton>
                        </li>
                        <li className="ml-2">
                            <AuthButton href="/login">Login</AuthButton>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export { Navbar };
