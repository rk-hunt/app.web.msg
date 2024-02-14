import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const ProviderPage = lazy(() => import("./pages/Provider/providerPage"));

const App: React.FC = () => {
  return (
    <Layout className="h-100-per">
      <Sider
        width={225}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        theme="light"
      >
        <div className="demo-logo-vertical" />
        <Menu mode="inline" defaultSelectedKeys={["4"]} items={items} />
      </Sider>
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/providers" element={<ProviderPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
