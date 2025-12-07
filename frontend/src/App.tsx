import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { HomePage } from "./components/HomePage";
import { BookDetailsPage } from "./components/BookDetailsPage";
import { MyBorrowsPage } from "./components/MyBorrowsPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { ManageBooksPage } from "./components/ManageBooksPage";
import { Toaster } from "./components/ui/sonner";
import { getApiUrl } from "./lib/config"; // ← ADD THIS IMPORT

export type User = {
  id: string;
  username: string;
  role: "member" | "admin";
};

export type Page =
  | "login"
  | "register"
  | "home"
  | "book-details"
  | "my-borrows"
  | "admin-dashboard"
  | "manage-books";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [user, setUser] = useState<User | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  // ============================================
  // API INTERCEPTOR - ADD THIS useEffect
  // ============================================
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const url = input.toString();

      // If it's an API call, convert to full URL
      if (url.startsWith("/api/")) {
        const fullUrl = getApiUrl(url);

        // Add user ID to request body for POST/PATCH/DELETE
        if (init?.method && ["POST", "PATCH", "DELETE"].includes(init.method)) {
          const body = init.body ? JSON.parse(init.body as string) : {};

          // Add user ID if logged in (except login/register)
          if (user && !url.includes("/login") && !url.includes("/register")) {
            body.id = user.id;
          }

          init = {
            ...init,
            body: JSON.stringify(body),
          };
        }

        return originalFetch(fullUrl, init);
      }

      return originalFetch(input, init);
    };

    // Check for saved user session
    const savedUser = localStorage.getItem("yalla_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentPage(userData.role === "admin" ? "admin-dashboard" : "home");
      } catch (error) {
        console.error("Failed to parse saved user");
        localStorage.removeItem("yalla_user");
      }
    }
  }, [user]);
  // ============================================

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("yalla_user", JSON.stringify(loggedInUser)); // ← ADD THIS
    if (loggedInUser.role === "admin") {
      setCurrentPage("admin-dashboard");
    } else {
      setCurrentPage("home");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("yalla_user"); // ← ADD THIS
    setCurrentPage("login");
  };

  const navigateTo = (page: Page, bookId?: string) => {
    if (bookId) setSelectedBookId(bookId);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => navigateTo("register")}
          />
        );
      case "register":
        return <RegisterPage onNavigateToLogin={() => navigateTo("login")} />;
      case "home":
        return (
          <HomePage
            user={user!}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      case "book-details":
        return (
          <BookDetailsPage
            bookId={selectedBookId!}
            user={user!}
            onBack={() => navigateTo("home")}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      case "my-borrows":
        return (
          <MyBorrowsPage
            user={user!}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboard
            user={user!}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      case "manage-books":
        return (
          <ManageBooksPage
            user={user!}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      default:
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => navigateTo("register")}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}
