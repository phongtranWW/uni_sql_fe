import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import Editor from "./pages/editor";
import Login from "@/pages/login";
import AuthCallback from "./pages/callback";
import ProtectedRoute from "./components/custom/protected-route";
import Profile from "./pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/editor/databases/:id",
    element: <Editor />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
