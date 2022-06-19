import { Button, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import UnauthenWrapper from "../components/bases/UnauthenWrapper";
import Wrapper from "../components/bases/Wrapper";
import InputField from "../components/fields/InputField";
import {
    MeDocument,
    MeQuery,
    RegisterInput,
    useRegisterMutation,
} from "../generated/graphql";
import { setFieldErrors } from "../helpers/setFieldErrors";
import useCheckAuth from "../hooks/useCheckAuth";

type Props = {};

export default function Register({}: Props) {
    const [registerUser, { loading, data, error }] = useRegisterMutation();
    const router = useRouter();
    const toat = useToast();

    const formMethods = useForm({
        defaultValues: {
            username: "",
            password: "",
            email: "",
        },
    });

    const onRegisterSubmit = async (vals: RegisterInput) => {
        const response = await registerUser({
            variables: {
                registerInput: vals,
            },
            update(cache, { data }) {
                if (data?.register.success) {
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: data.register.user,
                        },
                    });
                }
            },
        });

        const errors = response.data?.register.errors;
        if (errors?.length) {
            setFieldErrors(errors, formMethods);
        } else {
            formMethods.reset();
            toat({
                title: "Welcome",
                description: response.data?.register.user?.username,
                status: "success",
            });
            router.push("/");
        }
    };

    return (
        <UnauthenWrapper>
            <Wrapper>
                {data?.register.errors?.length && (
                    <Text>Failed to register</Text>
                )}
                {data && data.register.success && (
                    <Text>Register successfully</Text>
                )}
                <form onSubmit={formMethods.handleSubmit(onRegisterSubmit)}>
                    <InputField
                        control={formMethods.control}
                        label="Username"
                        name="username"
                        placeholder="Username"
                        type={"text"}
                    />
                    <InputField
                        control={formMethods.control}
                        label="Email"
                        name="email"
                        placeholder="Email"
                        type={"text"}
                    />
                    <InputField
                        control={formMethods.control}
                        label="Password"
                        name="password"
                        placeholder="Password"
                        type={"password"}
                    />
                    <Button
                        type="submit"
                        colorScheme={"teal"}
                        mt={4}
                        isLoading={formMethods.formState.isSubmitting}
                    >
                        Submit
                    </Button>
                </form>
            </Wrapper>
        </UnauthenWrapper>
    );
}
