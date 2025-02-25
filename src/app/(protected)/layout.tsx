import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <>
            <Suspense
                fallback={
                    <div className="relative flex size-full flex-col items-center justify-center">
                        <Loader size="xl" />
                    </div>
                }
            >
                <main className="scrollbar-y scrollbar-thin flex h-[--main-height] flex-col items-center bg-neutral-200 py-2 sm:py-4">
                    {children}
                </main>
                <Toaster position={"bottom-center"} className="bg-gray-100" />
            </Suspense>
        </>
    );
};

export default ProtectedLayout;
