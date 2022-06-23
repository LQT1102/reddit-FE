import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type WrapperSide = "regular" | "small";

type Props = {
    children: ReactNode;
    size?: WrapperSide;
};

export default function Wrapper({ children, size = "regular" }: Props) {
    return (
        <Box
            maxW={size === "regular" ? "800px" : "400px"}
            w={"100%"}
            mt={8}
            mx={"auto"}
        >
            {children}
        </Box>
    );
}
