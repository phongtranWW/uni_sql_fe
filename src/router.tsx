import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Editors } from "./pages/editors";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/editor",
    element: <Editors />,
  },
]);

export default router;
