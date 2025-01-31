import Link from "next/link";
import type { Session } from "next-auth";
import { AuthButton, Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { getUsernameFromEmail } from "@/lib/utils";
import type { UserDetails } from "@/types";

const Header = async () => {
    const session = (await auth()) as Session;
    console.log(session);

    const { user } = session || {};
    const { name, email, image } = user || {};
    const username = getUsernameFromEmail(email);
    // const username = "olijwood";
    const userDetails = {
        username,
        name,
        image,
    } as UserDetails;
    return (
        <header className="border-b border-gray-200">
            <nav>
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
                            <Link href="/server">
                                <li className="ml-2">Server</li>
                            </Link>
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
                                <ProfileDropdown userDetails={userDetails} />
                            </li>
                        </>
                    )}

                    {!email && (
                        <>
                            <li className="ml-auto">
                                <AuthButton href="/register">
                                    Register
                                </AuthButton>
                            </li>
                            <li className="ml-2">
                                <AuthButton href="/login">Login</AuthButton>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export { Header };
