import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import UserLayout from "./components/UserLayout";
import { getAuthToken, getAuthUser } from "@/services/api";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Catalog from "./pages/Catalog";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Branches from "./pages/Branches";
import UserDashboard from "./pages/UserDashboard";
import UserBrowse from "./pages/UserBrowse";
import UserMyBooks from "./pages/UserMyBooks";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

// Protected route component for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Admin-only route component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  const user = getAuthUser();
  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
}

// User route component
function UserRoute({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  const user = getAuthUser();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Initialize auth check component
function AppInitializer({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (token && user) {
      // User is logged in, ensure they're on the right path
      const currentPath = window.location.pathname;
      
      if (user.role === 'ADMIN' && !currentPath.startsWith('/admin') && !currentPath.startsWith('/api')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'USER' && !currentPath.startsWith(`/${user.username}`) && !currentPath.startsWith('/api')) {
        navigate(`/${user.username}/dashboard`, { replace: true });
      }
    }

    setInitialized(true);
  }, [navigate]);

  if (!initialized) {
    return <div>Loading...</div>;
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
          <AppInitializer>
            <Routes>
              {/* Auth Routes (no sidebar/header) */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />

              {/* Admin Routes (with sidebar/header) */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Layout><Index /></Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/catalog"
                element={
                  <AdminRoute>
                    <Layout><Catalog /></Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <AdminRoute>
                    <Layout><Books /></Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <Layout><Users /></Layout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/branches"
                element={
                  <AdminRoute>
                    <Layout><Branches /></Layout>
                  </AdminRoute>
                }
              />

              {/* User Routes (with user layout) */}
              <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
              <Route path="/user/dashboard" element={<Navigate to="/user/dashboard" replace />} />
              <Route path="/user/browse" element={<Navigate to="/user/browse" replace />} />
              <Route path="/user/my-books" element={<Navigate to="/user/my-books" replace />} />
              <Route path="/user/profile" element={<Navigate to="/user/profile" replace />} />
              <Route path="/user/change-password" element={<Navigate to="/user/change-password" replace />} />
              
              <Route
                path="/:username/dashboard"
                element={
                  <UserRoute>
                    <UserLayout><UserDashboard /></UserLayout>
                  </UserRoute>
                }
              />
              <Route
                path="/:username/browse"
                element={
                  <UserRoute>
                    <UserLayout><UserBrowse /></UserLayout>
                  </UserRoute>
                }
              />
              <Route
                path="/:username/my-books"
                element={
                  <UserRoute>
                    <UserLayout><UserMyBooks /></UserLayout>
                  </UserRoute>
                }
              />
              <Route
                path="/:username/profile"
                element={
                  <UserRoute>
                    <UserLayout><UserProfile /></UserLayout>
                  </UserRoute>
                }
              />
              <Route
                path="/:username/change-password"
                element={
                  <UserRoute>
                    <UserLayout><ChangePassword /></UserLayout>
                  </UserRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
