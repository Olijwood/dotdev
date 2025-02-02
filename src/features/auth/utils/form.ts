import { UseFormReturn, FieldValues, Path } from "react-hook-form";

/**
 * Clears password fields and their validation errors.
 */
export const clearPasswordFields = <T extends FieldValues>(
    form: UseFormReturn<T>,
) => {
    form.setValue("password" as Path<T>, "" as T["password"]);
    form.setValue("newPassword" as Path<T>, "" as T["newPassword"]);
    form.clearErrors(["password" as Path<T>, "newPassword" as Path<T>]);
};
