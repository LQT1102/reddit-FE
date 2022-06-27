import { NetworkStatus } from "@apollo/client";
import { Button, Flex, List, Spinner, Stack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Layout from "../components/bases/Layout";
import PostItem from "../components/bases/PostItem";
import {
    PostsDocument,
    PostsQuery,
    QueryPostsArgs,
    useMeQuery,
    usePostsQuery,
} from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

export const limit = 3;
const Index = () => {
    const { data: meData } = useMeQuery();
    const { data, loading, fetchMore, networkStatus } = usePostsQuery({
        variables: { limit },
        notifyOnNetworkStatusChange: true,
    });

    const loadMorePosts = () => {
        fetchMore({
            variables: {
                cursor: data?.posts?.cursor,
            },
        });
    };

    const fetchMoreLoading = networkStatus === NetworkStatus.fetchMore;

    return (
        <Layout>
            {loading && !fetchMoreLoading ? (
                <Spinner />
            ) : (
                <Stack>
                    <List spacing={8}>
                        {data?.posts?.paginatedPosts.map((i) => (
                            <PostItem
                                key={i.id}
                                {...i}
                                editable={meData?.me?.id === i.user.id}
                            />
                        ))}
                    </List>

                    {data?.posts?.hasMore && (
                        <Flex>
                            <Button
                                onClick={loadMorePosts}
                                variant={"outline"}
                                m={"auto"}
                                colorScheme={"gray"}
                                isLoading={fetchMoreLoading}
                            >
                                Load more
                            </Button>
                        </Flex>
                    )}
                </Stack>
            )}
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query<PostsQuery, QueryPostsArgs>({
        query: PostsDocument,
        variables: { limit },

        //Rerender component when networkStatus change
        notifyOnNetworkStatusChange: true,
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};

export default Index;
