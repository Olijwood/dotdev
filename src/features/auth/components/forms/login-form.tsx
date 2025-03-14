"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
    FormWarning,
} from "@/components/ui/form";
import { FormError } from "@/components/ui/form/form-error";
import { FormSuccess } from "@/components/ui/form/form-success";
import { EmailInput, PasswordInput, Input } from "@/components/ui/input";
import { Social } from "@/features/auth/components/social";
import { login } from "@/features/auth/server/actions";
import { LoginSchema } from "@/schemas";
import type { FormStatus } from "@/types";
import { REACT_PLEASE_LOGIN_WARN } from "../../constants";

const LoginForm = () => {
    const [status, setStatus] = useState<FormStatus>({
        state: "idle",
    });
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });
    const { update } = useSession();
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setStatus({ state: "loading" });
        login(data).then(async (res) => {
            if (res.error) {
                form.reset();
                setStatus({ state: "error", message: res.error });
            }
            if (res.success) {
                await update();
                redirect("/");
            }
            if (res.twoFactor) {
                setStatus({ state: "idle" });
                setShowTwoFactor(true);
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

    const urlWarning =
        searchParams.get("warning") === REACT_PLEASE_LOGIN_WARN.URL_QUERY_PARAM
            ? REACT_PLEASE_LOGIN_WARN.WARNING
            : searchParams.get("warning") === "NotLoggedInSave"
              ? "Please login to save a post"
              : "";

    return (
        <CardWrapper
            title="Login"
            headerLabel=" "
            backButtonHref="/register"
            backButtonLabel="Don't have an account? Register here."
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <EmailInput
                                                    {...field}
                                                    required
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
                                                <PasswordInput
                                                    {...field}
                                                    placeholder="********"
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
                            </>
                        )}

                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>2FA Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="123456"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={urlError ? urlError : error} />
                    {urlWarning && <FormWarning message={urlWarning} />}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Logging in..."
                            : showTwoFactor
                              ? "Confirm"
                              : "Login"}
                    </Button>
                </form>
            </Form>
            <Social />
        </CardWrapper>
    );
};

export default LoginForm;
