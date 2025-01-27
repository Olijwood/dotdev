import Link from "next/link";

export default async function Navbar() {
    const session = "";

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-gray-300 bg-white font-bold text-black">
            <ul className="flex h-[70px] items-center justify-between px-[10vw]">
                <li>
                    <Link href="/">
                        <button className="rounded bg-black px-4 py-2 text-lg font-bold uppercase text-white">
                            DotDev
                        </button>
                    </Link>
                </li>
                {session ? (
                    <>
                        <li className="ml-auto">
                            <Link href="/admin/create">
                                <button className="rounded bg-blue-500 px-4 py-2 text-white hover:brightness-90">
                                    Create Post
                                </button>
                            </Link>
                        </li>
                        <li></li>
                    </>
                ) : (
                    <li className="ml-auto"></li>
                )}
            </ul>
        </nav>
    );
}
