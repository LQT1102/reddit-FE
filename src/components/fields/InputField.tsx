import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import React from "react";
import { Control, Controller, FieldName, Path } from "react-hook-form";

type InputFieldProps<T extends Record<string, any>> = {
    name: FieldName<T>;
    label: string;
    placeholder: string;
    control: Control<T>;
    type?: React.HTMLInputTypeAttribute;
};

export default function InputField<T extends Record<string, any>>({
    control,
    label,
    name,
    placeholder,
    type,
}: InputFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name as unknown as Path<T>}
            render={({ field, fieldState }) => (
                <FormControl isInvalid={!!fieldState.error}>
                    <FormLabel htmlFor={name}>{label}</FormLabel>
                    <Input
                        id={name}
                        placeholder={placeholder}
                        type={type}
                        {...field}
                    />
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
