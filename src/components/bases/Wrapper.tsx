import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function Wrapper({ children }: Props) {
    return (
        <Box maxW={"400px"} w={"100%"} mt={8} mx={"auto"}>
            {children}
        </Box>
    );
}
