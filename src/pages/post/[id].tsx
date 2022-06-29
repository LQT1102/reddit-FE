import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { limit } from "..";
import AlertErrorWithLayout from "../../components/bases/AlertErrorWithLayout";
import Layout from "../../components/bases/Layout";
import LayoutSpinner from "../../components/bases/LayoutSpinner";
import PostMenu from "../../components/bases/PostMenu";
import {
    PostDocument,
    PostIdsDocument,
    PostIdsQuery,
    PostQuery,
    PostQueryVariables,
    QueryPostsArgs,
    usePostQuery,
} from "../../generated/graphql";
import { addApolloState, initializeApollo } from "../../lib/apolloClient";

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
            <Flex align={"center"}>
                <Heading flex={1} mb={4}>
                    {data.post.title}
                </Heading>
                <PostMenu
                    id={data.post.id}
                    postUserId={data.post.userId + ""}
                />
            </Flex>
            <Text>{data.post.text}</Text>
            <Flex justify={"flex-end"} color={"gray"} mt={4}>
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
