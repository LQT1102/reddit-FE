import { Flex, Spinner } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import useCheckAuth from "../../hooks/useCheckAuth";

type Props = {
    children: ReactNode;
};

export default function UnauthenWrapper({ children }: Props) {
    const { data: authData, loading: authLoading } = useCheckAuth();

    if (authLoading || (!authLoading && authData?.me))
        return (
            <Flex justify={"center"} align={"center"} minH={"100vh"}>
                <Spinner />
            </Flex>
        );

    return <>{children}</>;
}
