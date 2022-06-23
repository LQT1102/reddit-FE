import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import UnauthenWrapper from "../components/bases/UnauthenWrapper";
import Wrapper from "../components/bases/Wrapper";
import InputField from "../components/fields/InputField";
import {
    ForgotPasswordInput,
    useForgotPasswordMutation,
} from "../generated/graphql";
import NextLink from "next/link";

type Props = {};

export default function ForgotPassword({}: Props) {
    const formMethods = useForm<ForgotPasswordInput>();

    const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

    const onForgotPasswordSubmit = async (vals: ForgotPasswordInput) => {
        await forgotPassword({
            variables: {
                forgotPasswordInput: vals,
            },
        });
    };

    return (
        <UnauthenWrapper>
            <Wrapper size="small">
                {!loading && data ? (
                    <Box>Please check your mailbox</Box>
                ) : (
                    <form
                        onSubmit={formMethods.handleSubmit(
                            onForgotPasswordSubmit
                        )}
                    >
                        <InputField
                            control={formMethods.control}
                            label="Email"
                            name="email"
                            placeholder="Email"
                            type={"email"}
                        />
                        <Flex justify={"space-between"}>
                            <Button
                                type="submit"
                                colorScheme={"teal"}
                                mt={4}
                                isLoading={formMethods.formState.isSubmitting}
                            >
                                Send reset password
                            </Button>

                            <NextLink href={"/login"}>
                                <Link>Go back to Login</Link>
                            </NextLink>
                        </Flex>
                    </form>
                )}
            </Wrapper>
        </UnauthenWrapper>
    );
}
