"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { OAuthProviderUIConfig } from "@/features/auth/constants";

type OAuthButtonProps = {
    provider: OAuthProviderUIConfig;
};

const OAuthButton = ({ provider }: OAuthButtonProps) => {
    const onClick = () => {
        signIn(provider.id, { callbackUrl: "/" });
    };

    return (
        <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClick}
        >
            <provider.icon className="size-7" />
        </Button>
    );
};

export { OAuthButton };
