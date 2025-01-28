"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
} from "@/components/ui/form";
import { FormError } from "@/components/ui/form/form-error";
import { FormSuccess } from "@/components/ui/form/form-success";
import { Input } from "@/components/ui/input";
import { Social } from "@/features/auth/components/social";
import { login } from "@/features/auth/server/actions";
import { LoginSchema } from "@/schemas";
import type { FormStatus } from "@/types";

const LoginForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setStatus({ state: "loading" });
        login(data).then((res) => {
            if (res.error) {
                setStatus({ state: "error", message: res.error });
            }
            if (res.success) {
                setStatus({ state: "success", message: res.success });
            }
        });
    };

    const isLoading = status.state === "loading";
    const error = status.state === "error" ? status.message : "";
    const success = status.state === "success" ? status.message : "";

    const urlError =
        searchParams.get("error") === "OAuthAccountNotLinked"
            ? "Email already in use with another provider!"
            : "";

    return (
        <CardWrapper
            headerLabel="Login to your account"
            title="Login"
            backButtonHref="/register"
            backButtonLabel="Don't have an account? Register here."
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
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/password-reset">
                                            Forgot Password?
                                        </Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={urlError ? urlError : error} />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
            <Social />
        </CardWrapper>
    );
};

export default LoginForm;
