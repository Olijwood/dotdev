import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MainProps = {
    children: ReactNode;
    className?: string;
};

function Main({ className, children }: MainProps) {
    return (
        <main
            className={cn(
                "flex h-[--main-height] flex-col items-center justify-center bg-[hsl(0,0,93%)]",
                className,
            )}
        >
            {children}
        </main>
    );
}

export { Main };
