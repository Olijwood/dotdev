const PostLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="scrollbar-y flex h-[--main-height] flex-col items-center sm:py-4">
            <>{children}</>
        </main>
    );
};

export default PostLayout;
