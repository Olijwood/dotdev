import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

const PostLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <>
            <Suspense
                fallback={
                    <div className="relative flex size-full flex-col items-center justify-center">
                        <Loader size="xl" />
                    </div>
                }
            >
                {children}
            </Suspense>
            <Toaster position={"top-center"} className="bg-gray-100" />
        </>
    );
};

export default PostLayout;
