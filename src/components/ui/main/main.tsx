import { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
    return (
        <main className="flex h-[--main-height] flex-col items-center justify-center bg-gray-100">
            {children}
        </main>
    );
}

export { Main };
