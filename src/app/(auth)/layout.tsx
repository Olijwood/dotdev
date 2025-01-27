import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <section
            className="relative flex size-full flex-col items-center justify-center"
            // style={{
            //     height: "calc(100vh - var(--navbar-height))",
            // }}
        >
            {children}
        </section>
    );
};

export default AuthLayout;
