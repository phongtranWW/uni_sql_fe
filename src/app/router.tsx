import AppLayout from "@/layouts/App/AppLayout";
import HomePage from "@/layouts/App/Home/HomePage";
import EditorLayout from "@/layouts/Editor/EditorLayout";
import EditorPage from "@/layouts/Editor/EditorPage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <EditorLayout />,
    children: [
      {
        path: "/editors/:id",
        element: <EditorPage />,
      },
    ],
  },
]);

export default router;
