import { Layout } from "antd";
import AppHeader from "@/components/AppHeader";
import { Outlet } from "react-router";
import AppFooter from "@/components/AppFooter";

export default function AppLayout() {
  return (
    <Layout>
      <AppHeader />
      <Layout>
        <Outlet />
      </Layout>
      <AppFooter />
    </Layout>
  );
}
