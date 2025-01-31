import { Resend } from "resend";
import { BASE_URL } from "@/routes";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${BASE_URL}/new-verification?token=${token}`;
    console.log(confirmLink);
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "DotDev - Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${BASE_URL}/new-password?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "DotDev - Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "DotDev - 2FA code",
        html: `<p>Your 2FA code: ${token}</p>`,
    });
};
