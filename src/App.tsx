import { RouterProvider } from "react-router";
import router from "@/router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import { useAppDispatch } from "./app/hook";
import { restoreSession } from "./features/auth/slice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="vite-ui-theme"
      enableSystem={false}
    >
      <ReactFlowProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};

export default App;
