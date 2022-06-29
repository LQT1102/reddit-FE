import { Reference } from "@apollo/client";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
    PaginatedPosts,
    useDeletePostMutation,
    useMeQuery,
} from "../../generated/graphql";

type Props = {
    id: string;
    postUserId: string;
};

export default function PostMenu({ id, postUserId }: Props) {
    const { data: meData } = useMeQuery();

    const toat = useToast();

    const router = useRouter();

    const [deletePost] = useDeletePostMutation();
    const onClickDelete = async (postId: string) => {
        await deletePost({
            variables: {
                id: postId,
            },
            update(cache, { data }) {
                if (data?.deletePost.success) {
                    cache.modify({
                        fields: {
                            posts(
                                existing: Pick<
                                    PaginatedPosts,
                                    | "__typename"
                                    | "cursor"
                                    | "hasMore"
                                    | "totalCount"
                                > & {
                                    paginatedPosts: Reference[];
                                }
                            ) {
                                const newPostsAfterDeletion = {
                                    ...existing,
                                    totalCount: existing.totalCount - 1,
                                    paginatedPosts:
                                        existing.paginatedPosts.filter(
                                            (postRefObject) =>
                                                postRefObject.__ref !==
                                                `Post:${postId}`
                                        ),
                                };

                                return newPostsAfterDeletion;
                            },
                        },
                    });
                    toat({
                        description: data?.deletePost.message,
                        status: "success",
                    });
                    if (!["", "/"].includes(router.route)) {
                        router.back();
                    }
                }
            },
        });
    };

    if (meData?.me?.id !== postUserId) {
        return <></>;
    }

    return (
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
                <MenuItem
                    onClick={() => onClickDelete(id)}
                    icon={<DeleteIcon />}
                >
                    Delete
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
