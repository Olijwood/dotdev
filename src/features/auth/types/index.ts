export type INPUT_ERR = "Invalid input";
export type CRED_ERR = "Invalid Credentials";
export type EMAIL_CHECK_SUCCESS = "Check your email to verify your account";
export type EMAIL_VER_SUCCESS = "Email verified!";
export type EMAIL_IN_USE = "Please use a different email address";
export type EMAIL_RESET = "Reset email sent!";
export type PASSWORD_MATCH = "Passwords do not match";
export type TOKEN_ERR = "Invalid token";
export type NEW_PASSWORD_SUCCESS = "Password updated!";
export type TWOFA_TOKEN_ERR = "Invalid code!";
export type CODE_EXP_ERR = "Code expired!";

export type ResetPasswordStatus = {
    ERROR: EMAIL_RESET;
    SUCCESS: EMAIL_RESET;
    INPUT_ERR: INPUT_ERR;
};
export type LoginStatus = {
    SUCCESS: "Login successful";
    CRED_ERR: CRED_ERR;
    INPUT_ERR: INPUT_ERR;
    TOKEN_ERR: TWOFA_TOKEN_ERR;
    EMAIL_CHECK_SUCCESS: EMAIL_CHECK_SUCCESS;
    CODE_EXP_ERR: CODE_EXP_ERR;
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

export type NewPasswordStatus = {
    TOKEN_ERR: TOKEN_ERR;
    INPUT_ERR: INPUT_ERR;
    CRED_ERR: CRED_ERR;
    PASSWORD_ERR: PASSWORD_MATCH;
    SUCCESS: NEW_PASSWORD_SUCCESS;
};
