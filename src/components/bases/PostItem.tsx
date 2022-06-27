import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronDownIcon,
    DeleteIcon,
    EditIcon,
} from "@chakra-ui/icons";
import {
    Box,
    Center,
    Flex,
    Heading,
    IconButton,
    Link,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PostsQuery } from "../../generated/graphql";

type A = { a: string; b: number }[];

type AElement = A[0];

type Props = NonNullable<
    NonNullable<NonNullable<PostsQuery["posts"]>["paginatedPosts"]>
>[0] & {
    editable?: boolean;
};

export default function PostItem({
    id,
    createdAt,
    text,
    textSnippet,
    title,
    user: { username },
    editable,
}: Props) {
    return (
        <ListItem key={id} shadow={"md"} borderWidth={"1px"}>
            <Flex p={5} gap={2}>
                <Flex direction={"column"} justify={"center"}>
                    <IconButton
                        size={"sm"}
                        color={"red.300"}
                        aria-label=""
                        bg={"#ffffff"}
                        icon={<ArrowUpIcon />}
                    />
                    <Center color={"red.300"} fontWeight={"bold"}>
                        1
                    </Center>
                    <IconButton
                        color={"gray"}
                        size={"sm"}
                        aria-label=""
                        bg={"#ffffff"}
                        icon={<ArrowDownIcon />}
                    />
                </Flex>
                <Box flex={1} minW={0}>
                    <NextLink href={`/post/${id}`}>
                        <Heading fontSize={"xl"}>
                            <Link>{title}</Link>
                        </Heading>
                    </NextLink>
                    <Text fontSize="xs" color={"gray"} mt={1}>
                        Posted by{" "}
                        <Text as={"span"} fontWeight={"medium"}>
                            {username}
                        </Text>
                    </Text>
                    <Flex align={"center"}>
                        <Text mt={4}>{textSnippet}</Text>
                    </Flex>
                </Box>
                {editable && (
                    <Menu placement="bottom-end">
                        <MenuButton
                            as={IconButton}
                            aria-label="drop"
                            size="sm"
                            colorScheme={"gray"}
                            bg={"#ffffff"}
                            icon={<ChevronDownIcon />}
                        />
                        <MenuList w={"auto"} minW={0}>
                            <NextLink href={`/post/edit/${id}`}>
                                <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                            </NextLink>
                            <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
                        </MenuList>
                    </Menu>
                )}
            </Flex>
        </ListItem>
    );
}
