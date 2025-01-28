"use client";

import { cn } from "@/lib/utils";
import { OAUTH_PROVIDERS } from "../constants";
import { OAuthButton } from "./oauth-button";

const Social = () => {
    return (
        <div
            className={cn(
                "flex gap-2 justify-center items-center w-full",
                "mt-2",
            )}
        >
            {OAUTH_PROVIDERS.map((provider) => (
                <OAuthButton key={provider.id} provider={provider} />
            ))}
        </div>
    );
};

export { Social };
