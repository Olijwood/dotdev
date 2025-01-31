import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { Navbar } from "./_components/navbar";

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <Toaster position={"bottom-center"} />
            <Navbar />
            <section className="flex size-full flex-col items-center justify-center bg-blue-300">
                {children}
            </section>
        </SessionProvider>
    );
};

export default ProtectedLayout;
