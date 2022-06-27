import { Button, Flex, Link, Toast, useToast } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import CheckAuthenWrapper from "../components/bases/CheckAuthenWrapper";
import Layout from "../components/bases/Layout";
import InputField from "../components/fields/InputField";
import TextAreaField from "../components/fields/TextAreaField";
import { CreatePostInput, useCreatePostMutation } from "../generated/graphql";
import NextLink from "next/link";
import { useRouter } from "next/router";

type Props = {};

export default function CreatePost({}: Props) {
    const router = useRouter();
    const toat = useToast();
    const [createPost, { data, loading, error }] = useCreatePostMutation();
    const formMethods = useForm<CreatePostInput>({
        defaultValues: {
            text: "",
            title: "",
        },
    });

    const onCreatePostSubmit = async (values: CreatePostInput) => {
        const res = await createPost({
            variables: {
                createPostInput: values,
            },
        });
        if (res.data?.createPost.success) {
            router.push("/");
            toat({
                title: "Success",
                status: "success",
                description: res.data?.createPost.message,
            });
        }
    };
    return (
        <CheckAuthenWrapper>
            <Layout>
                <form onSubmit={formMethods.handleSubmit(onCreatePostSubmit)}>
                    <InputField
                        control={formMethods.control}
                        label="Title"
                        name="title"
                        placeholder="Title"
                        type={"text"}
                    />
                    <TextAreaField
                        control={formMethods.control}
                        label="Content"
                        name="text"
                        placeholder="Content"
                    />
                    <Flex justify={"space-between"} mt={4}>
                        <Button
                            type="submit"
                            colorScheme={"teal"}
                            isLoading={formMethods.formState.isSubmitting}
                        >
                            Create
                        </Button>

                        <NextLink href={"/"}>
                            <Button>Go back to Homepage</Button>
                        </NextLink>
                    </Flex>
                </form>
            </Layout>
        </CheckAuthenWrapper>
    );
}
