import { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
    return (
        <main style={{ height: "calc(100vh - var(--navbar-height))" }}>
            {children}
        </main>
    );
}

export { Main };
