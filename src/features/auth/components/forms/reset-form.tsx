"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormError,
    FormSuccess,
} from "@/components/ui/form";
import { EmailInput } from "@/components/ui/input";
import { resetPassword } from "@/features/auth/server/actions";
import { ResetPasswordSchema } from "@/schemas";
import type { FormStatus } from "@/types";

const ResetForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        setStatus({ state: "loading" });
        resetPassword(data)
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
    };

    const isLoading = status.state === "loading";
    const error = status.state === "error" ? status.message : "";
    const success = status.state === "success" ? status.message : "";
    const cTitle = success ? "" : "Forgot password?";
    return (
        <CardWrapper
            title={cTitle}
            backButtonHref="/login"
            backButtonLabel="Back to login."
        >
            {success ? (
                <FormSuccess message={success} />
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <EmailInput {...field} required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Send reset email"}
                        </Button>
                    </form>
                </Form>
            )}
        </CardWrapper>
    );
};

export default ResetForm;
