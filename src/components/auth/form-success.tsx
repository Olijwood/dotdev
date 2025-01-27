import { CheckCheckIcon } from "lucide-react";

type FormSuccessProps = {
    message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="flex items-center space-x-4 rounded-lg bg-emerald-500/30 p-2 text-emerald-500">
            <CheckCheckIcon className="size-4 " />
            <p>{message}</p>
        </div>
    );
};
