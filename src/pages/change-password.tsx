import { Box, Button, Flex, Link, useToast } from "@chakra-ui/react";
import NextLink from "Next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Wrapper from "../components/bases/Wrapper";
import InputField from "../components/fields/InputField";
import {
    ChangePasswordInput,
    useChangePasswordMutation,
} from "../generated/graphql";
import { setFieldErrors } from "../helpers/setFieldErrors";

type Props = {};

export default function ChangePassword({}: Props) {
    const {
        query: { userId, token },
        push,
    } = useRouter();
    const formMethods = useForm<ChangePasswordInput>({
        defaultValues: {
            newPassword: "",
        },
    });

    const toat = useToast();

    const [commonError, setCommonError] = useState<string>();

    const [changePassword, { loading }] = useChangePasswordMutation();

    const onChangePasswordSubmit = async (vals: ChangePasswordInput) => {
        if (userId && token) {
            const response = await changePassword({
                variables: {
                    userId: userId + "",
                    token: token + "",
                    changePasswordInput: vals,
                },
            });

            if (response.data?.changePassword.errors?.length) {
                const { errors } = response.data?.changePassword;
                const _tokenError = errors.find((x) => x.field === "token");

                if (_tokenError) setCommonError(_tokenError.message);
                else setFieldErrors(errors, formMethods);
            } else {
                toat({
                    title: "Welcome",
                    description: response.data?.changePassword.user?.username,
                    status: "success",
                });
                push("/");
            }
        } else {
            setCommonError("Invalid change password request.");
        }
    };

    return (
        <Wrapper size="small">
            <form onSubmit={formMethods.handleSubmit(onChangePasswordSubmit)}>
                <InputField
                    control={formMethods.control}
                    label="New password"
                    name="newPassword"
                    placeholder="New password"
                    type={"password"}
                />

                <Box color={"red"}>{commonError}</Box>

                <Flex justify={"space-between"}>
                    <Button
                        type="submit"
                        colorScheme={"teal"}
                        mt={4}
                        isLoading={formMethods.formState.isSubmitting}
                    >
                        Submit
                    </Button>

                    <NextLink href={"/forgot-password"}>
                        <Link>Go back to Forgot password</Link>
                    </NextLink>
                </Flex>
            </form>
        </Wrapper>
    );
}
