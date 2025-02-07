import { ReactNode, Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { Main } from "@/components/ui/main";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <Suspense
            fallback={
                <div className="relative flex size-full flex-col items-center justify-center">
                    <Loader size="xl" />
                </div>
            }
        >
            <Main>{children}</Main>
        </Suspense>
    );
};

export default AuthLayout;
