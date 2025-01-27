import {
    LoginStatus,
    RegisterStatus,
    ResetPasswordStatus,
    VerificationStatus,
} from "./types";

export const RESET_PASSWORD_STATUS: ResetPasswordStatus = {
    ERROR: "Reset email sent!",
    SUCCESS: "Reset email sent!",
    INPUT_ERR: "Invalid input",
} as const;

export const LOGIN_STATUS: LoginStatus = {
    SUCCESS: "Login successful",
    CRED_ERR: "Invalid Credentials",
    INPUT_ERR: "Invalid input",
    EMAIL_CHECK_SUCCESS: "Check your email to verify your account",
} as const;

export const REGISTER_STATUS: RegisterStatus = {
    INPUR_ERR: "Invalid input",
    PASSWORD_ERR: "Passwords do not match",
    EMAIL_USE_ERR: "Please use a different email address",
    EMAIL_CHECK_SUCCESS: "Check your email to verify your account",
} as const;

export const VERIFICATION_STATUS: VerificationStatus = {
    TOKEN_ERR: "Invalid token",
    CRED_ERR: "Invalid Credentials",
    EMAIL_VER_SUCCESS: "Email verified!",
} as const;
