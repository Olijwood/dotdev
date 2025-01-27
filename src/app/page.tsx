import Image from "next/image";

export default function Home() {
    return (
        <section className="relative flex size-full flex-col items-center justify-center gap-5">
            <h1>Welcome to the home page</h1>
            <p>Sign in to create a post</p>
            <Image src="/next.svg" alt="Logo" width={100} height={100} />
        </section>
    );
}
