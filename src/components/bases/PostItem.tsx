import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    Box,
    Center,
    Flex,
    Heading,
    IconButton,
    Link,
    ListItem,
    Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { PostsQuery, useVoteMutation, VoteType } from "../../generated/graphql";
import PostMenu from "./PostMenu";

type Props = NonNullable<
    NonNullable<NonNullable<PostsQuery["posts"]>["paginatedPosts"]>
>[0] & {
    editable?: boolean;
};

const PostItem = ({
    id,
    createdAt,
    text,
    textSnippet,
    title,
    user: { username, id: userId },
    editable,
    points,
    votedType,
}: Props) => {
    const [vote, { loading: voteLoading }] = useVoteMutation();

    const [voteLoadingType, setVoteLoadingType] = useState<
        VoteType.Upvote | VoteType.DownVote | "NotLoading"
    >("NotLoading");

    const handleVote = async (postId: string, type: VoteType) => {
        try {
            setVoteLoadingType(type);
            await vote({
                variables: {
                    voteType: type,
                    postId: +postId,
                },
            });
            setVoteLoadingType("NotLoading");
        } catch (error) {}
    };

    return (
        <ListItem key={id} shadow={"md"} borderWidth={"1px"}>
            <Flex p={5} gap={2}>
                <Flex direction={"column"} justify={"center"}>
                    <IconButton
                        size={"sm"}
                        color={
                            votedType === VoteType.Upvote ? "red.300" : "gray"
                        }
                        aria-label=""
                        bg={"#ffffff"}
                        icon={<ChevronUpIcon />}
                        onClick={handleVote.bind(this, id, VoteType.Upvote)}
                        isLoading={
                            voteLoading && voteLoadingType === VoteType.Upvote
                        }
                    />
                    <Center color={"red.300"} fontWeight={"bold"}>
                        {points}
                    </Center>
                    <IconButton
                        color={
                            votedType === VoteType.DownVote ? "red.300" : "gray"
                        }
                        size={"sm"}
                        aria-label=""
                        bg={"#ffffff"}
                        icon={<ChevronDownIcon />}
                        onClick={handleVote.bind(this, id, VoteType.DownVote)}
                        isLoading={
                            voteLoading && voteLoadingType === VoteType.DownVote
                        }
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
                {editable && <PostMenu id={id} postUserId={userId} />}
            </Flex>
        </ListItem>
    );
};

export default PostItem;
