import { AuthProvider } from "@/contexts/auth-context";
import { Layout } from "@/layouts/layout";
import { LoginPage } from "@/pages/contestant/login";
import { Box } from "@mui/material";
import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const routes = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "admin",
    lazy: async () => {
      const { AdminLayout } = await import("@/layouts/admin-layout");
      return {
        Component: () => (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
      };
    },
    children: [
      {
        index: true,
        element: <Navigate to="/admin/contests" replace />,
      },
      {
        path: "contests",
        lazy: async () => {
          const { ContestManagementPage } = await import("@/pages/admin/index");
          return {
            Component: () => <ContestManagementPage />,
          };
        },
      },
      {
        path: "contests/edit-exam",
        lazy: async () => {
          const { ExamEditPage } = await import("@/pages/admin/exam-edit-page");
          return {
            Component: () => <ExamEditPage />,
          };
        },
      },
      {
        path: "contests/control",
        lazy: async () => {
          const { ContestDetailPage } =
            await import("@/pages/admin/contest-detail-page");
          return {
            Component: () => <ContestDetailPage />,
          };
        },
      },
    ],
  },
  {
    path: "contestant",
    lazy: async () => {
      return {
        Component: () => (
          <AuthProvider>
            <Box
              sx={{
                minHeight: "100vh",
                backgroundImage: "url('/assets/banner.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 60%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Outlet />
            </Box>
          </AuthProvider>
        ),
      };
    },
    children: [
      {
        path: "login",
        lazy: async () => {
          return {
            Component: () => <LoginPage />,
          };
        },
      },
      {
        path: "play",
        lazy: async () => {
          const { ContestantContestPage } =
            await import("@/pages/contestant/contest-page");
          return {
            Component: () => <ContestantContestPage />,
          };
        },
      },
    ],
  },
];
