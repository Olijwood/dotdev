import { Toaster } from "@/components/ui/sonner";
import Provider from "../provider";

type ProtectedLayoutProps = {
    children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <Provider>
            <Toaster position={"bottom-center"} />
            {children}
        </Provider>
    );
};

export default ProtectedLayout;
