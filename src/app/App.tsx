import { RouterProvider } from "react-router/dom";
import router from "@/app/router";
import { ConfigProvider } from "antd";
import theme from "./theme";

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
