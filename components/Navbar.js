import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { UserContext } from "@/lib/context";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  //   useEffect(() => {
  //     console.log("Navbar user:", user);
  //   }, [user]);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">DotDev</button>
          </Link>
        </li>

        {/* user is signed in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <Image
                  src={user?.photoURL || "/hacker.png"}
                  alt="User Profile Pic"
                  className="card-img-center"
                  width={150} // Required by Next.js
                  height={150} // Required by Next.js
                  referrerPolicy="no-referrer"
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
