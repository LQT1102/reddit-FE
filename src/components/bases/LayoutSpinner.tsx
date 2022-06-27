import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import Layout from "./Layout";

type Props = {};

export default function LayoutSpinner({}: Props) {
    return (
        <Layout>
            <Flex justify={"center"} align={"center"} minH={"200px"}>
                <Spinner />
            </Flex>
        </Layout>
    );
}
