import { createBrowserRouter } from "react-router";
import RootLayout from "./pages/RootLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/tasks/Tasks";
import Categories from "./pages/categories/Categories";
import ProfileSetting from "./pages/profile/ProfileSetting";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CategoryTask from "./pages/categories/CategoryTask";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <RootLayout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "categories", Component: Categories },
      { path: "profile", Component: ProfileSetting },
      { path: "categoryTask/:id", Component: CategoryTask },
    ],
  },
  {
    path: "/login",
    Component: () => (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    Component: () => (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/forgotPassword",
    Component: () => (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
  },
]);
