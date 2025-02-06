import { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
    return (
        <main className="flex h-[--main-height] flex-col items-center justify-center bg-[hsl(0,0,92.5%)]">
            {children}
        </main>
    );
}

export { Main };
