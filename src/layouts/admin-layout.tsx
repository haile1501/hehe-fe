import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
