import Link from "next/link";
import type { Session } from "next-auth";
import { AuthButton } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const Header = async () => {
    const session = (await auth()) as Session;
    console.log(session);

    const email = session?.user?.email;

    return (
        <header>
            <nav>
                <ul className="flex h-[--navbar-height] items-center justify-between px-[2vw]">
                    <li>
                        <Link href="/">
                            <button className="rounded bg-black px-4 py-2 text-lg font-bold uppercase text-white">
                                DotDev
                            </button>
                        </Link>
                    </li>

                    {/* user is signed in and has email */}
                    {email && (
                        <>
                            <Link href="/settings">
                                <li className="ml-2">Settings</li>
                            </Link>
                            <li className="ml-auto">
                                <Link href="/dashboard">
                                    <button className="rounded bg-blue-500 px-4 py-2 text-white hover:brightness-90">
                                        Create Post
                                    </button>
                                </Link>
                            </li>
                            <li className="ml-2">
                                <AuthButton logout>Logout</AuthButton>
                            </li>
                        </>
                    )}

                    {/* user is not signed OR has not created email */}
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
