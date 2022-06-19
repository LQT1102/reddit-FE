import { List, ListItem, Spinner } from "@chakra-ui/react";
import Navbar from "../components/bases/Navbar";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

const Index = () => {
    const { data, loading } = usePostsQuery();

    return (
        <>
            <Navbar />
            {loading ? (
                <Spinner />
            ) : (
                <List>
                    {data?.posts?.map((i) => (
                        <ListItem>{i.title}</ListItem>
                    ))}
                </List>
            )}
        </>
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
