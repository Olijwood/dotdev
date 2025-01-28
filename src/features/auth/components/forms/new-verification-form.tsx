"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/components/ui/card";
import { FormError, FormSuccess } from "@/components/ui/form";
import { newVerification } from "@/features/auth/server/actions";
import { FormStatus } from "@/types";

export default function NewVerificationForm() {
    const [status, setStatus] = useState<FormStatus>({ state: "idle" });
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        setStatus({ state: "loading" });
        if (!token) {
            setStatus({ state: "error", message: "Token not found" });
            return;
        }

        newVerification(token)
            .then((res) => {
                if (res.error) {
                    setStatus({ state: "error", message: res.error });
                }
                if (res.success) {
                    setStatus({ state: "success", message: res.success });
                }
            })
            .catch(() => {
                setStatus({ state: "error", message: "Something went wrong" });
            });
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    const success = status.state === "success" ? status.message : "";
    const error = status.state === "error" ? status.message : "";

    return (
        <CardWrapper
            title="Email Confirmation"
            headerLabel="Confirming your email"
            backButtonLabel="Back to login"
            backButtonHref="/login"
        >
            <div className="flex w-full items-center justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    );
}
