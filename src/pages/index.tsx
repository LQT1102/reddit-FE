import {
    Box,
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
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import NextLink from "next/link";
import Layout from "../components/bases/Layout";

const Index = () => {
    const { data, loading } = usePostsQuery();

    return (
        <Layout>
            {loading ? (
                <Spinner />
            ) : (
                <Stack>
                    <List spacing={8}>
                        {data?.posts?.map((i) => (
                            <ListItem
                                key={i.id}
                                shadow={"md"}
                                borderWidth={"1px"}
                            >
                                <Flex p={5}>
                                    <Box>
                                        <NextLink href={`/post/${i.id}`}>
                                            <Heading fontSize={"xl"}>
                                                <Link>{i.title}</Link>
                                            </Heading>
                                        </NextLink>
                                        <Text>posted by {i.user.username}</Text>
                                        <Flex align={"center"}>
                                            <Text mt={4}>{i.textSnippet}</Text>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            )}
        </Layout>
    );
};

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query({
        query: PostsDocument,
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};

export default Index;
