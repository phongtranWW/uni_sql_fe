import { RouterProvider } from "react-router/dom";
import router from "@/app/router";
import { ConfigProvider } from "antd";
import themeConfig from "@/app/theme";

export default function App() {
  return (
    <ConfigProvider theme={themeConfig.light}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
