import { Suspense } from "react";
import { Main } from "@/components/ui/main";
import Loading from "./loading";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<Loading />}>
            <Main className="justify-start   items-stretch !bg-white">
                {children}
            </Main>
        </Suspense>
    );
}
