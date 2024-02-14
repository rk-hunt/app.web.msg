import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DiscordOutlined,
  GroupOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { menus } from "./constants";

const { Sider } = Layout;

const ProviderPage = lazy(() => import("./pages/Provider/providerPage"));
const ServerPage = lazy(() => import("./pages/Provider/serverPage"));

const onGetIcons = (name: string): React.ReactNode => {
  switch (name) {
    case "providers":
      return <DiscordOutlined />;
    case "servers":
      return <GroupOutlined />;
    case "channels":
      return <TeamOutlined />;
  }
};

const App: React.FC = () => {
  const renderMenus = useMemo(() => {
    const menuItems = menus.map((menu) => {
      return (
        <Menu.Item key={menu.key}>
          <Link to={menu.url}>
            {menu.icon ? onGetIcons(menu.icon) : undefined}
            <span>{menu.name}</span>
          </Link>
        </Menu.Item>
      );
    });

    return menuItems;
  }, []);

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
        <div className="logo-container">
          <span className="logo-text">Token Info</span>
        </div>
        <Menu mode="inline">{renderMenus}</Menu>
      </Sider>
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/providers" element={<ProviderPage />} />
          <Route path="/servers" element={<ServerPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
