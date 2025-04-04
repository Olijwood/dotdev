"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/components/ui/card";
import { FormError, FormSuccess } from "@/components/ui/form";
import { newVerification } from "@/features/auth/server/actions";
import { FormStatus } from "@/types";

export default function NewVerificationForm() {
    const [status, setStatus] = useState<FormStatus>({ state: "idle" });
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        setStatus({ state: "loading" });
        if (!token) {
            setStatus({ state: "error", message: "No token" });
            return;
        }

        newVerification(token)
            .then((res) => {
                if (res.success) {
                    setStatus({ state: "success", message: res.success });
                    router.push("/login");
                }
                if (res.error) {
                    setStatus({ state: "error", message: res.error });
                }
            })
            .catch(() => {
                setStatus({ state: "error", message: "Something went wrong" });
            });
    }, [token, router]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    const success = status.state === "success" ? status.message : "";
    const error = status.state === "error" ? status.message : "";
    const cTitle = success ? "" : "Email Confirmation";
    const cHeaderLabel = success || error ? "" : "Confirming your email";

    return (
        <CardWrapper
            title={cTitle}
            headerLabel={cHeaderLabel}
            backButtonLabel="Back to login"
            backButtonHref="/login"
        >
            <div className="flex w-full items-center justify-center">
                {!success && !error && <BeatLoader />}
                {success && <FormSuccess message={success} />}
                {error && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
}
