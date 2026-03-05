import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Editors } from "./pages/editors";
import TemplatePage from "./pages/template";

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
    path: "/template",
    element: <TemplatePage />,
  },
]);

export default router;
