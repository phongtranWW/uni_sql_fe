import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "@/router";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/app/store";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
);
