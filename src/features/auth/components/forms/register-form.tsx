"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button/button";
import { CardWrapper } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/ui/form/form-error";
import { FormSuccess } from "@/components/ui/form/form-success";
import { Input } from "@/components/ui/input";
import { Social } from "@/features/auth/components/social";
import { register } from "@/features/auth/server/actions";
import { RegisterSchema } from "@/schemas";
import type { FormStatus } from "@/types";

const RegisterForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        setStatus({ state: "loading" });
        register(data).then((res) => {
            if (res.error) {
                setStatus({ state: "error", message: res.error });
            }
            if (res.success) {
                setStatus({ state: "success", message: res.success });
            }
        });
    };

    const isLoading = status.state === "loading";
    const isError = status.state === "error";
    const isSuccess = status.state === "success";

    return (
        <CardWrapper
            headerLabel="Create an account"
            title="Register"
            backButtonHref="/login"
            backButtonLabel="Already have an account? Log in"
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
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="John Doe"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
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
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {isSuccess && <FormSuccess message={status.message} />}
                    {isError && <FormError message={status.message} />}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Register"}
                    </Button>
                </form>
            </Form>
            <Social />
        </CardWrapper>
    );
};

export default RegisterForm;
