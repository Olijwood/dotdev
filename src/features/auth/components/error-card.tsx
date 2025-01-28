import { BsExclamationTriangle } from "react-icons/bs";
import { CardWrapper } from "@/components/ui/card";

const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Oops! Something went wrong"
            backButtonLabel="Back to login"
            backButtonHref="/login"
        >
            <div className="flex w-full items-center justify-center">
                <BsExclamationTriangle className="text-destructive" />
            </div>
        </CardWrapper>
    );
};

export default ErrorCard;
