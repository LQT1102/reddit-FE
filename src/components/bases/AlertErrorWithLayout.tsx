import { Alert, AlertIcon, AlertTitle, Box, Link } from "@chakra-ui/react";
import React from "react";
import Layout from "./Layout";
import NextLink from "next/link";

type Props = {
    errorMessage: string;
};

export default function AlertErrorWithLayout({ errorMessage }: Props) {
    return (
        <Layout>
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
            <Box m={4}>
                <NextLink href={"/"}>
                    <Link>Back to Homepage</Link>
                </NextLink>
            </Box>
        </Layout>
    );
}
