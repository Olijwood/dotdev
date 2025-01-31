import { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
    return <main className="h-[--main-height] bg-gray-100">{children}</main>;
}

export { Main };
