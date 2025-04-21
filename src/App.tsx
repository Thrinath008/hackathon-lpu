import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate to redirect
import { auth } from "./firebase"; // Import Firebase auth service
import { useEffect, useState } from "react"; // Import React hooks

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import CVUploadPage from "./pages/CVUploadPage";
import FindMembersPage from "./pages/FindMembersPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedLayout from "@/components/ProtectedLayout"; 
import DashboardPage from "./pages/DashboardPage"; // Import the DashboardPage component
// Import the ProtectedLayout

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the user is authenticated on app load
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Set to true if user is logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (isAuthenticated === null) {
    // Return loading state while checking authentication status
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/cv-upload" element={isAuthenticated ? <CVUploadPage /> : <Navigate to="/login" />} />
              <Route path="/find-members" element={isAuthenticated ? <FindMembersPage /> : <Navigate to="/login" />} />
              <Route path="/profile/:userId" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
