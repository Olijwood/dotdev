"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { newVerification } from "@/actions/new-verification";
import CardWrapper from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { FormStatus } from "@/components/auth/types";

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
