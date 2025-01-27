"use client";

import React, { useActionState } from "react";
import { BsGoogle } from "react-icons/bs";
import { googleAuthenticate } from "@/actions/google-login";
import { Button } from "../ui/button";

const GoogleLogin = () => {
    const [errorMsgGoogle, dispatchGoogle] = useActionState(
        googleAuthenticate,
        undefined,
    ); //googleAuthenticate hook
    return (
        <form className="mt-2 flex" action={dispatchGoogle}>
            <Button
                variant={"outline"}
                size={"lg"}
                className="flex w-full flex-row items-center gap-3"
            >
                <BsGoogle />
                Sign In With Google
            </Button>
            <p>{errorMsgGoogle}</p>
        </form>
    );
};

export default GoogleLogin;
