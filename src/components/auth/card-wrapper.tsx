"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/components/ui/card";
import AuthHeader from "./auth-header";
import { BackButton } from "./back-button";

type CardWrapperProps = {
    children: React.ReactNode;
    headerLabel?: string;
    backButtonLabel: string;
    title?: string;
    showSocial?: boolean;
    backButtonHref: string;
};

const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    title,
}: CardWrapperProps) => {
    return (
        <Card className="w-2/3 shadow-md md:w-1/2 xl:w-1/3 2xl:w-1/4">
            <CardHeader>
                <AuthHeader label={headerLabel} title={title} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
};

export default CardWrapper;
