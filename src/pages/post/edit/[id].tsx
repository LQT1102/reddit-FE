import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    Link,
    Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import CheckAuthenWrapper from "../../../components/bases/CheckAuthenWrapper";
import Layout from "../../../components/bases/Layout";
import {
    UpdatePostInput,
    useMeQuery,
    usePostQuery,
    useUpdatePostMutation,
} from "../../../generated/graphql";
import NextLink from "next/link";
import LayoutSpinner from "../../../components/bases/LayoutSpinner";
import AlertErrorWithLayout from "../../../components/bases/AlertErrorWithLayout";
import InputField from "../../../components/fields/InputField";
import TextAreaField from "../../../components/fields/TextAreaField";
import { useForm } from "react-hook-form";

type Props = {
    id: string;
};

export default function PostEdit(props: Props) {
    const router = useRouter();
    const { data: meData, loading: meLoading } = useMeQuery();

    const {
        data: postData,
        loading: postLoading,
        error,
    } = usePostQuery({
        variables: {
            id: router.query.id as string,
        },
        skip: !router.isReady,
    });

    const formMethods = useForm<UpdatePostInput>({
        defaultValues: {
            id: router.query.id as string,
            title: postData?.post?.title,
            text: postData?.post?.text,
        },
    });

    const [updatePost, { loading: updatePostLoading, data: updatePostData }] =
        useUpdatePostMutation();

    const onUpdatePostSubmit = async (values: UpdatePostInput) => {
        await updatePost({
            variables: {
                updatePostInput: values,
            },
        });
        router.back();
    };

    useEffect(() => {
        formMethods.reset({
            id: router.query.id as string,
            title: postData?.post?.title,
            text: postData?.post?.text,
        });
    }, [postData?.post]);

    if (meLoading || postLoading || !router.isReady) {
        return <LayoutSpinner />;
    }

    if (!meLoading && !postLoading && (error || !postData?.post)) {
        return (
            <AlertErrorWithLayout
                errorMessage={error?.message || "Post not found."}
            />
        );
    }

    if (
        !meLoading &&
        !postLoading &&
        postData?.post?.userId &&
        meData?.me?.id !== postData?.post?.userId + ""
    ) {
        return <AlertErrorWithLayout errorMessage={"Unauthorised."} />;
    }

    return (
        <CheckAuthenWrapper>
            <Layout>
                <form onSubmit={formMethods.handleSubmit(onUpdatePostSubmit)}>
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
                            isLoading={updatePostLoading}
                        >
                            Update post
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
