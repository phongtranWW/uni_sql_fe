import { createBrowserRouter } from "react-router";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";

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
]);

export default router;
