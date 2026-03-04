import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Editors } from "./pages/editors";
import Login from "@/pages/login";
import AuthCallback from "./pages/callback";
import ProtectedRoute from "./components/custom/protected-route";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/editors",
        element: <Editors />,
      },
    ],
  },
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
]);

export default router;
