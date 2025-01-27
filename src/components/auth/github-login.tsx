"use client";

import React, { useActionState } from "react";
import { BsGithub } from "react-icons/bs";
import { githubAuthenticate } from "@/actions/github-login";
import { Button } from "../ui/button";

const GithubLogin = () => {
    const [errorMsgGithub, dispatchGithub] = useActionState(
        githubAuthenticate,
        undefined,
    ); //githubAuthenticate hook
    return (
        <form className="mt-1 flex" action={dispatchGithub}>
            <Button
                variant={"outline"}
                size="lg"
                className="flex w-full flex-row items-center gap-3"
            >
                <BsGithub />
                Sign In With Github
            </Button>
            <p>{errorMsgGithub}</p>
        </form>
    );
};

export default GithubLogin;
