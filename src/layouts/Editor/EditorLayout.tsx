import { Layout } from "antd";
import { Outlet } from "react-router";
import EditorHeader from "@/layouts/Editor/Header/EditorHeader";
import EditorSider from "@/layouts/Editor/Sider/EditorSider";

export default function EditorLayout() {
  return (
    <Layout className="!h-screen">
      <EditorHeader />
      <Layout>
        <EditorSider />
        <Outlet />
      </Layout>
    </Layout>
  );
}
