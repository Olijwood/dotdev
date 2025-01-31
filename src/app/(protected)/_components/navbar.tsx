"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton, Button } from "@/components/ui/button";
import { UserButton } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/auth";
import { getUsernameFromEmail } from "@/lib/utils";
import type { UserDetails } from "@/types";

const Navbar = () => {
    const pathname = usePathname();
    const user = useCurrentUser();
    const { email, name, image } = user || {};
    const username = getUsernameFromEmail(email);
    const userDetails = {
        username,
        name,
        image,
    } as UserDetails;
    return (
        <nav className="border-b border-gray-200">
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

                {email && (
                    <>
                        <div className="ml-2 flex gap-x-2">
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

                            <Button
                                asChild
                                variant={
                                    pathname === "/settings"
                                        ? "default"
                                        : "outline"
                                }
                            >
                                <Link href="/settings">Settings</Link>
                            </Button>
                        </div>
                        <li className="ml-auto">
                            <Link href="/admin">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg border-2 border-blue-700 px-2.5 font-sans  text-base font-bold text-blue-700 hover:bg-blue-700 hover:text-white"
                                >
                                    Admin
                                </Button>
                            </Link>
                        </li>

                        <li className="ml-2">
                            <UserButton userDetails={userDetails} />
                        </li>
                    </>
                )}

                {!email && (
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
