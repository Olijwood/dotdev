import Link from "next/link";
import { useContext, useEffect } from "react";
import { UserContext } from "@/lib/context";
import ProfileDropdown from "./ProfileDropdown";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="fixed top-0 w-full bg-white text-black font-bold border-b border-gray-300 z-50">
      <ul className="flex items-center justify-between h-[70px] px-[10vw]">
        <li>
          <Link href="/">
            <button className="bg-black text-white text-lg uppercase font-bold px-4 py-2 rounded">
              DotDev
            </button>
          </Link>
        </li>

        {/* user is signed in and has username */}
        {username && (
          <>
            <li className="ml-auto">
              <Link href="/admin">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:brightness-90">
                  Create Post
                </button>
              </Link>
            </li>
            <li>
              <ProfileDropdown user={user} username={username} />
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li className="ml-auto">
            <Link href="/enter">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:brightness-90">
                Log in
              </button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
