import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "@/router";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/app/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        storageKey="vite-ui-theme"
        enableSystem={false}
      >
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
);
