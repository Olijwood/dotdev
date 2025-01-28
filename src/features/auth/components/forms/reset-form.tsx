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
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/schemas";
import type { FormStatus } from "@/types";

const ResetForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });
    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        setStatus({ state: "loading" });
        console.log(data);
    };

    const isLoading = status.state === "loading";
    const error = status.state === "error" ? status.message : "";
    const success = status.state === "success" ? status.message : "";

    return (
        <CardWrapper
            title="Forgot password?"
            // headerLabel="Forgot password"
            backButtonHref="/login"
            backButtonLabel="Back to login."
        >
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
                                        <Input
                                            {...field}
                                            placeholder="johndoe@email.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
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
        </CardWrapper>
    );
};

export default ResetForm;
