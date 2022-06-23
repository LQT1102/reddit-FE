import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <React.Fragment>
            <Navbar />
            <Wrapper>{children}</Wrapper>
        </React.Fragment>
    );
}
