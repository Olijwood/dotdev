type INPUT_ERR = "Invalid input";
type CRED_ERR = "Invalid Credentials";
type EMAIL_CHECK_SUCCESS = "Check your email to verify your account";
type EMAIL_VER_SUCCESS = "Email verified!";
type EMAIL_IN_USE = "Please use a different email address";
type EMAIL_RESET = "Reset email sent!";
type PASSWORD_MATCH = "Passwords do not match";
type TOKEN_ERR = "Invalid token";

export type ResetPasswordStatus = {
    ERROR: EMAIL_RESET;
    SUCCESS: EMAIL_RESET;
    INPUT_ERR: INPUT_ERR;
};
export type LoginStatus = {
    SUCCESS: "Login successful";
    CRED_ERR: CRED_ERR;
    INPUT_ERR: INPUT_ERR;
    EMAIL_CHECK_SUCCESS: EMAIL_CHECK_SUCCESS;
};

export type RegisterStatus = {
    INPUR_ERR: INPUT_ERR;
    PASSWORD_ERR: PASSWORD_MATCH;
    EMAIL_USE_ERR: EMAIL_IN_USE;
    EMAIL_CHECK_SUCCESS: EMAIL_CHECK_SUCCESS;
};

export type VerificationStatus = {
    TOKEN_ERR: TOKEN_ERR;
    CRED_ERR: CRED_ERR;
    EMAIL_VER_SUCCESS: EMAIL_VER_SUCCESS;
};
