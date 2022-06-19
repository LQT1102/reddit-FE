import { Path, UseFormReturn } from "react-hook-form";
import { FieldError } from "../generated/graphql";

export const setFieldErrors = <T>(errors: FieldError[], formMethods: UseFormReturn<T, any>) => {
    errors.forEach((err) => {
        formMethods.setError(err.field as Path<T>, {
            message: err.message,
        });
    });
}