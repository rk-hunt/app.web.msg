import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DiscordOutlined,
  FileDoneOutlined,
  GroupOutlined,
  MessageOutlined,
  PercentageOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthRoute } from "./routes";
import { menus } from "./constants";

const ProviderPage = lazy(() => import("./pages/Provider/providerPage"));
const ServerPage = lazy(() => import("./pages/Provider/serverPage"));
const BlacklistPage = lazy(() => import("./pages/Blacklist/blackListPage"));

const { Sider } = Layout;
const onGetIcons = (name: string): React.ReactNode => {
  switch (name) {
    case "providers":
      return <DiscordOutlined />;
    case "servers":
      return <GroupOutlined />;
    case "channels":
      return <TeamOutlined />;
    case "blacklists":
      return <FileDoneOutlined />;
    case "weights":
      return <PercentageOutlined />;
    case "messages":
      return <MessageOutlined />;
    case "users":
      return <UserOutlined />;
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
      <Sider width={225} theme="light">
        <div className="logo-container">
          <span className="logo-text">Token Info</span>
        </div>
        <Menu mode="inline">{renderMenus}</Menu>
      </Sider>
      <Suspense fallback={<div />}>
        <Routes>
          <Route
            path="/providers"
            element={
              <AuthRoute>
                <ProviderPage />
              </AuthRoute>
            }
          />
          <Route
            path="/servers"
            element={
              <AuthRoute>
                <ServerPage />
              </AuthRoute>
            }
          />
          <Route
            path="/blacklists"
            element={
              <AuthRoute>
                <BlacklistPage />
              </AuthRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
