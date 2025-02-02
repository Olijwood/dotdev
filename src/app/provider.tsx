import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const Provider = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
