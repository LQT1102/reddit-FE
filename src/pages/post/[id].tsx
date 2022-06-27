import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Flex,
    Heading,
    Link,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { limit } from "..";
import Layout from "../../components/bases/Layout";
import {
    PostIdsQuery,
    PostQuery,
    PostQueryVariables,
    QueryPostArgs,
    QueryPostsArgs,
    usePostIdsQuery,
    usePostQuery,
} from "../../generated/graphql";
import { addApolloState, initializeApollo } from "../../lib/apolloClient";
import { PostIdsDocument, PostDocument } from "../../generated/graphql";
import NextLink from "next/link";
import LayoutSpinner from "../../components/bases/LayoutSpinner";
import AlertErrorWithLayout from "../../components/bases/AlertErrorWithLayout";

type Props = {};

export default function Post({}: Props) {
    const router = useRouter();
    const {
        data,
        error,
        loading: postLoading,
    } = usePostQuery({
        variables: {
            id: router.query.id as string,
        },
    });

    if (postLoading) {
        return <LayoutSpinner />;
    }

    if (error || !data?.post) {
        return (
            <AlertErrorWithLayout
                errorMessage={error?.message || "Post not found."}
            />
        );
    }
    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Text>{data.post.text}</Text>
            <Flex justify={"space-between"} color={"gray"} mt={4}>
                <NextLink href={`/post/edit/${data.post.id}`}>
                    <Link>Edit</Link>
                </NextLink>
                <NextLink href={"/"}>
                    <Link>Back to Homepage</Link>
                </NextLink>
            </Flex>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query<PostIdsQuery, QueryPostsArgs>({
        query: PostIdsDocument,
        variables: { limit },
    });

    return {
        paths: data!.posts!.paginatedPosts.map((post) => ({
            params: {
                id: `${post.id}`,
            },
        })),
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps<any, PostQueryVariables> = async ({
    params,
}) => {
    const apolloClient = initializeApollo();
    await apolloClient.query<PostQuery, PostQueryVariables>({
        query: PostDocument,
        variables: {
            id: params?.id as string,
        },
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};
