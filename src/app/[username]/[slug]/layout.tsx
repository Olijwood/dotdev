import { Suspense } from "react";
import Loading from "@/components/ui/loading";

const PostLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense fallback={<Loading />}>
            <main className="scrollbar-y flex h-[var(--main-height)] flex-col items-center bg-muted sm:py-3 ">
                {children}
            </main>
        </Suspense>
    );
};

export default PostLayout;
