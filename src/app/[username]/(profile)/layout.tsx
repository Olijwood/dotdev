const UserPostsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="scrollbar-y h-(--main-height) justify-start bg-muted">
            {children}
        </main>
    );
};

export default UserPostsLayout;
