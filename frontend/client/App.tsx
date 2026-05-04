import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserLayout from "./components/UserLayout";
import { defaultUserName } from "./lib/mockData";
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes (no sidebar/header) */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin Routes (with sidebar/header) */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              element={<Layout><Index /></Layout>}
              path="/admin/dashboard"
            />
            <Route
              element={<Layout><Catalog /></Layout>}
              path="/admin/catalog"
            />
            <Route
              element={<Layout><Books /></Layout>}
              path="/admin/books"
            />
            <Route
              element={<Layout><Users /></Layout>}
              path="/admin/users"
            />
            <Route
              element={<Layout><Branches /></Layout>}
              path="/admin/branches"
            />

            {/* User Routes (with user layout) */}
            <Route path="/user" element={<Navigate to={`/${defaultUserName}/dashboard`} replace />} />
            <Route path="/user/dashboard" element={<Navigate to={`/${defaultUserName}/dashboard`} replace />} />
            <Route path="/user/browse" element={<Navigate to={`/${defaultUserName}/browse`} replace />} />
            <Route path="/user/my-books" element={<Navigate to={`/${defaultUserName}/my-books`} replace />} />
            <Route path="/user/profile" element={<Navigate to={`/${defaultUserName}/profile`} replace />} />
            <Route path="/user/change-password" element={<Navigate to={`/${defaultUserName}/change-password`} replace />} />
            <Route path="/:username" element={<Navigate to={`/${defaultUserName}/dashboard`} replace />} />
            <Route
              element={<UserLayout><UserDashboard /></UserLayout>}
              path="/:username/dashboard"
            />
            <Route
              element={<UserLayout><UserBrowse /></UserLayout>}
              path="/:username/browse"
            />
            <Route
              element={<UserLayout><UserMyBooks /></UserLayout>}
              path="/:username/my-books"
            />
            <Route
              element={<UserLayout><UserProfile /></UserLayout>}
              path="/:username/profile"
            />
            <Route
              element={<UserLayout><ChangePassword /></UserLayout>}
              path="/:username/change-password"
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
