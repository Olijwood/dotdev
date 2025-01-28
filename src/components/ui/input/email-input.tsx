import { Input, InputProps } from "./input";

type EmailInputProps = Omit<InputProps, "type" | "autoComplete"> & {
    placeholder?: string;
};

export function EmailInput({
    placeholder = "janesmith@gmail.com",
    ...props
}: EmailInputProps) {
    return (
        <Input
            type="email"
            autoComplete="email"
            placeholder={placeholder}
            {...props}
        />
    );
}
