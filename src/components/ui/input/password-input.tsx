import { Input, InputProps } from "./input";

type PasswordInputProps = Omit<
    InputProps,
    "type" | "autoComplete" | "required"
> & {
    newPassword?: boolean;
};

export function PasswordInput({ newPassword, ...props }: PasswordInputProps) {
    return (
        <Input
            type="password"
            autoComplete={newPassword ? "new-password" : "current-password"}
            required
            {...props}
        />
    );
}
