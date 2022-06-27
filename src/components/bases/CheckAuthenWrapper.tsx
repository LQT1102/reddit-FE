import { Flex, Spinner } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import useCheckAuth from "../../hooks/useCheckAuth";

type Props = {
    children: ReactNode;
};

export default function CheckAuthenWrapper({ children }: Props) {
    const { loading: authLoading } = useCheckAuth();

    if (authLoading)
        return (
            <Flex justify={"center"} align={"center"} minH={"100vh"}>
                <Spinner />
            </Flex>
        );

    return <>{children}</>;
}
