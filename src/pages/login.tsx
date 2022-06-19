import { gql } from "@apollo/client";
import { Button, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import UnauthenWrapper from "../components/bases/UnauthenWrapper";
import Wrapper from "../components/bases/Wrapper";
import InputField from "../components/fields/InputField";
import {
    LoginInput,
    MeDocument,
    MeQuery,
    useLoginMutation,
} from "../generated/graphql";
import { setFieldErrors } from "../helpers/setFieldErrors";
import useCheckAuth from "../hooks/useCheckAuth";

type Props = {};

export default function Login({}: Props) {
    const [loginUser, { loading, data, error }] = useLoginMutation();
    const router = useRouter();
    const toat = useToast();

    const formMethods = useForm<LoginInput>({
        defaultValues: {
            password: "",
            usernameOrEmail: "",
        },
    });

    const onLoginSubmit = async (vals: LoginInput) => {
        const response = await loginUser({
            variables: {
                loginInput: vals,
            },
            update(cache, { data }) {
                //clear cache
                // const meData = cache.readQuery({
                //     query: MeDocument,
                // });
                // console.log(meData);

                if (data?.login.success) {
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: data.login.user,
                        },
                    });
                }
            },
        });

        const errors = response.data?.login.errors;
        if (errors?.length) {
            setFieldErrors(errors, formMethods);
        } else {
            formMethods.reset();
            toat({
                title: "Welcome",
                description: response.data?.login.user?.username,
                status: "success",
            });
            router.push("/");
        }
    };

    return (
        <UnauthenWrapper>
            <Wrapper>
                {data?.login.errors?.length && <Text>Failed to login</Text>}
                <form onSubmit={formMethods.handleSubmit(onLoginSubmit)}>
                    <InputField
                        control={formMethods.control}
                        label="Username or email"
                        name="usernameOrEmail"
                        placeholder="Username or email"
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
