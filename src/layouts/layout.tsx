import { Container, Stack } from "@mui/material";
import { ReactNode } from "react";
import { Navbar } from "./navbar";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Stack>
      <Navbar />
      <Container maxWidth={"lg"} sx={{ marginY: 3 }}>
        {children}
      </Container>
    </Stack>
  );
};
