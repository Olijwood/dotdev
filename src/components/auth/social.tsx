"use client";

import { signIn } from "next-auth/react";
import { BsGithub, BsGoogle } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        });
    };

    return (
        <div className="mb-0 mt-2 flex w-full items-center gap-x-3">
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => onClick("google")}
            >
                <BsGoogle className="size-7" />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => onClick("github")}
            >
                <BsGithub className="h-7" />
            </Button>
        </div>
    );
};

export default Social;
