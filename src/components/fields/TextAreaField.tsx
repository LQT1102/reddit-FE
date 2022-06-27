import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Textarea,
} from "@chakra-ui/react";
import { Control, Controller, FieldName, Path } from "react-hook-form";

type TextAreaFielddProps<T extends Record<string, any>> = {
    name: FieldName<T>;
    label: string;
    placeholder: string;
    control: Control<T>;
};

export default function TextAreaField<T extends Record<string, any>>({
    control,
    label,
    name,
    placeholder,
}: TextAreaFielddProps<T>) {
    return (
        <Controller
            control={control}
            name={name as unknown as Path<T>}
            render={({ field, fieldState }) => (
                <FormControl isInvalid={!!fieldState.error}>
                    <FormLabel htmlFor={name}>{label}</FormLabel>
                    <Textarea id={name} placeholder={placeholder} {...field} />
                    {fieldState.error && (
                        <FormErrorMessage>
                            {fieldState.error.message}
                        </FormErrorMessage>
                    )}
                </FormControl>
            )}
        />
    );
}
