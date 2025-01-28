import { Input, InputProps } from "./input";

type NameInputProps = Omit<InputProps, "type" | "autoComplete"> & {
    placeholder?: string;
};

export function NameInput({
    placeholder = "John Doe",
    ...props
}: NameInputProps) {
    return (
        <Input
            type="text"
            autoComplete="name"
            placeholder={placeholder}
            {...props}
        />
    );
}
