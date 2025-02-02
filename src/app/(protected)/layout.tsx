import { Toaster } from "@/components/ui/sonner";

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <>
            <Toaster position={"bottom-center"} />
            {children}
        </>
    );
};

export default ProtectedLayout;
