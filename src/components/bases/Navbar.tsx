import {
    Box,
    Button,
    Flex,
    Heading,
    Link as LinkChakra,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
    MeDocument,
    MeQuery,
    useLogoutMutation,
    useMeQuery,
} from "../../generated/graphql";

type Props = {};

export default function Navbar({}: Props) {
    const { data, loading, error } = useMeQuery();

    const [logout, { loading: logoutLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        await logout({
            update(cache, { data }) {
                if (data?.logout) {
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: null,
                        },
                    });
                }
            },
        });
    };

    return (
        <Box bg={"tan"} p={4}>
            <Flex
                maxW={800}
                justify={"space-between"}
                align={"center"}
                m={"auto"}
            >
                <Link href={"/"}>
                    <Heading>Reddit</Heading>
                </Link>
                <Box>
                    {!loading && !data?.me && (
                        <>
                            <Link href={"login"}>
                                <LinkChakra>Login</LinkChakra>
                            </Link>
                            /
                            <Link href={"register"}>
                                <LinkChakra>Register</LinkChakra>
                            </Link>
                        </>
                    )}
                    {!loading && data?.me && (
                        <Button
                            isLoading={logoutLoading}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}
