import AppLogo from "@/components/AppLogo";
import { Flex, Layout } from "antd";
import EditorMenuBar from "./MenuBar/EditorMenuBar";

const { Header } = Layout;

export default function EditorHeader() {
  return (
    <Header className="!h-10 border-b border-gray-200">
      <Flex justify="start" align="center" className="w-full h-full">
        <Flex justify="start" align="center" gap={8}>
          <AppLogo className="w-6" />
          <EditorMenuBar />
        </Flex>
      </Flex>
    </Header>
  );
}
