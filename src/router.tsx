import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Editors } from "./pages/editors";
import Login from "@/pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/editor",
    element: <Editors />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
