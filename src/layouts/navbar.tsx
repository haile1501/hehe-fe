import { SearchBar } from "@/components/search-bar";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { useState } from "react";

export const Navbar = () => {
  const [search, setSearch] = useState("");
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "background.paper",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 3,
        paddingY: 1.5,
      }}
    >
      <Stack direction={"row"} spacing={2}>
        <SearchBar searchValue={search} onChange={setSearch} />

        <Stack direction="row" spacing={2}>
          <Button variant="text">Dashboard</Button>
          <Button variant="text">Profile</Button>
          <Button variant="text">Settings</Button>
        </Stack>
      </Stack>

      <Box
        component="button"
        sx={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          p: 0,
        }}
      >
        <Avatar src={"/assets/avatar-1.png"} />
      </Box>
    </Box>
  );
};
