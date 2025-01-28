"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/input";
import { newPassword } from "@/features/auth/server/actions";
import { NewPasswordSchema } from "@/schemas";
import type { FormStatus } from "@/types";

const NewPasswordForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        mode: "onSubmit",
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = async (data: z.infer<typeof NewPasswordSchema>) => {
        setStatus({ state: "loading" });
        newPassword(data, token)
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
    const cTitle = success ? "" : "Enter a new password";
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                newPassword
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                newPassword
                                            />
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
                            {isLoading ? "Loading..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            )}
        </CardWrapper>
    );
};

export default NewPasswordForm;
