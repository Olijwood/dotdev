import React from "react";

function Main({ children }: { children: React.ReactNode }) {
    return (
        <main style={{ height: "calc(100vh - var(--navbar-height))" }}>
            {children}
        </main>
    );
}

export default Main;
