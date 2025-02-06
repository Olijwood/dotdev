import PostFeed from "@/features/posts/components/post-feed";

export default function Home() {
    return (
        <section className="relative flex size-full flex-col items-center justify-center gap-5">
            <PostFeed />
        </section>
    );
}
