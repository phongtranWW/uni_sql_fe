import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import Editor from "./pages/editor";
import Login from "@/pages/login";
import AuthCallback from "./pages/callback";

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
]);

export default router;
