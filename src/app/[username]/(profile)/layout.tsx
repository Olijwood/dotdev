import { Main } from "@/components/ui/main";

const UserPostsLayout = ({ children }: { children: React.ReactNode }) => {
    return <Main className="scrollbar-y justify-start">{children}</Main>;
};

export default UserPostsLayout;
