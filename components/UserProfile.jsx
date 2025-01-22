import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <Image
        src={user.photoURL || "/hacker.png"}
        alt="User Profile Pic"
        className="card-img-center"
        width={150} // Required by Next.js
        height={150} // Required by Next.js
        // referrerPolicy="no-referrer"
        onError={(e) => (e.target.src = "/hacker.png")}
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
}
