import { Main } from "@/components/ui/main";

const TagsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Main className="h-[var(--main-height)] py-2 sm:px-2 overflow-hidden justify-start">
            {children}
        </Main>
    );
};

export default TagsLayout;
