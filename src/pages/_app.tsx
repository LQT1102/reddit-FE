import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";

// csr
// const apolloClient = new ApolloClient({
//     uri: "http://localhost:4000/graphql",
//     cache: new InMemoryCache(),
//     credentials: "include", //Cookies
// });

function MyApp({ Component, pageProps }: AppProps) {
    // ssr with apollo client
    const apolloClient = useApollo(pageProps);
    return (
        <ApolloProvider client={apolloClient}>
            <ChakraProvider resetCSS theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
