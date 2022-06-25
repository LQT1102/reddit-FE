import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    List,
    ListItem,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import Navbar from "../components/bases/Navbar";
import {
    Post,
    PostsDocument,
    PostsQuery,
    QueryPostsArgs,
    usePostsQuery,
} from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import NextLink from "next/link";
import Layout from "../components/bases/Layout";
import PostItem from "../components/bases/PostItem";
import { NetworkStatus, QueryOptions } from "@apollo/client";

const limit = 1;
const Index = () => {
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
                            <PostItem key={i.id} {...i} />
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

export const getStaticProps = async () => {
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
