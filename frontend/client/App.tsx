import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import UserLayout from "./components/UserLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const Index = React.lazy(() => import("./pages/Index"));
const Catalog = React.lazy(() => import("./pages/Catalog"));
const Books = React.lazy(() => import("./pages/Books"));
const Users = React.lazy(() => import("./pages/Users"));
const Branches = React.lazy(() => import("./pages/Branches"));
const UserDashboard = React.lazy(() => import("./pages/UserDashboard"));
const UserBrowse = React.lazy(() => import("./pages/UserBrowse"));
const UserMyBooks = React.lazy(() => import("./pages/UserMyBooks"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
});

const dashboardPathForRole = (role: "ADMIN" | "USER" | null, username?: string | null) => {
  if (role === "USER" && username) {
    return `/${username}`;
  }

  return "/";
};

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={dashboardPathForRole(role, user?.username)} replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<"ADMIN" | "USER">;
}) {
  const { isAuthenticated, role, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={dashboardPathForRole(role, user?.username)} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div className="p-8"><SkeletonLoader width={200} height={28} /></div>}>
              <Routes>
                <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Layout><Index /></Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Layout><Catalog /></Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Layout><Books /></Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Layout><Users /></Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/branches"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <Layout><Branches /></Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/:username"
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <UserLayout><UserDashboard /></UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:username/browse"
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <UserLayout><UserBrowse /></UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:username/my-books"
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <UserLayout><UserMyBooks /></UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:username/profile"
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <UserLayout><UserProfile /></UserLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/:username/change-password"
                  element={
                    <ProtectedRoute allowedRoles={["USER"]}>
                      <UserLayout><ChangePassword /></UserLayout>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
