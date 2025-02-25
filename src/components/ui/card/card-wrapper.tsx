"use client";

import { BackButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "./card";
import CardHeaderSection from "./card-header-section";

export type CardWrapperProps = {
    children: React.ReactNode;
    headerLabel?: string;
    backButtonLabel?: string;
    title?: string;
    backButtonHref?: string;
};

const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    title,
}: CardWrapperProps) => {
    return (
        <Card className="w-4/5 shadow-md md:w-1/2 xl:w-1/3 2xl:w-1/4">
            <CardHeader>
                <CardHeaderSection label={headerLabel} title={title} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                {backButtonLabel && backButtonHref && (
                    <BackButton label={backButtonLabel} href={backButtonHref} />
                )}
            </CardFooter>
        </Card>
    );
};

export { CardWrapper, CardHeaderSection };
