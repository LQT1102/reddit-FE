import { gql } from "@apollo/client";
import { Button, Flex, Link, Spinner, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import CheckAuthenWrapper from "../components/bases/CheckAuthenWrapper";
import Wrapper from "../components/bases/Wrapper";
import InputField from "../components/fields/InputField";
import {
    LoginInput,
    MeDocument,
    MeQuery,
    useLoginMutation,
} from "../generated/graphql";
import { setFieldErrors } from "../helpers/setFieldErrors";
import NextLink from "next/link";

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
        <CheckAuthenWrapper>
            <Wrapper size="small">
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
                            <Link>Forgot password</Link>
                        </NextLink>
                    </Flex>
                </form>
            </Wrapper>
        </CheckAuthenWrapper>
    );
}
