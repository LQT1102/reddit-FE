import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Link as LinkChakra,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
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
                            <Link href={"/login"}>
                                <LinkChakra>Login</LinkChakra>
                            </Link>
                            /
                            <Link href={"/register"}>
                                <LinkChakra>Register</LinkChakra>
                            </Link>
                        </>
                    )}
                    {!loading && data?.me && (
                        <Flex gap={4} align={"center"}>
                            <Link href={"/create-post"}>
                                <Button colorScheme={"blue"}>New Post</Button>
                            </Link>
                            <Menu placement="bottom-end">
                                <MenuButton
                                    as={Button}
                                    aria-label="drop"
                                    bg={"#ffffff"}
                                    rounded={"4px"}
                                    p={0}
                                    cursor={"pointer"}
                                    colorScheme={"gray"}
                                >
                                    <Button
                                        bg={"transparent"}
                                        as={"span"}
                                        p={0}
                                        isLoading={logoutLoading}
                                    >
                                        <Flex align={"center"} gap={2} p={1}>
                                            <Avatar
                                                size={"xs"}
                                                name={data?.me?.username}
                                            />
                                            <Text color={"green.900"}>
                                                {data?.me?.username}
                                            </Text>

                                            <ChevronDownIcon />
                                        </Flex>
                                    </Button>
                                </MenuButton>
                                <MenuList w={"auto"} minW={0}>
                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}
