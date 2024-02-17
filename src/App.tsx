import React, {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { observer } from "mobx-react-lite";
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
import useStores from "./stores";
import { AuthRoute } from "./routes";
import { menus } from "./constants";

const ProviderPage = lazy(() => import("./pages/Provider/providerPage"));
const ServerPage = lazy(() => import("./pages/Provider/serverPage"));
const ChannelPage = lazy(() => import("./pages/Provider/channelPage"));
const BlacklistPage = lazy(() => import("./pages/Blacklist/blacklistPage"));
const WeightPage = lazy(() => import("./pages/Weight/weightPage"));

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
  const { authStore } = useStores();

  const [selectedKey, setSelectedKey] = useState("providers");

  const onSelectedMenu = useCallback((menu: any) => {
    setSelectedKey(menu.key);
  }, []);

  const renderMenus = useMemo(() => {
    const menuItems = menus.map((menu) => {
      return {
        key: menu.key,
        icon: onGetIcons(menu.icon),
        label: (
          <Link to={menu.url}>
            <span>{menu.name}</span>
          </Link>
        ),
      };
    });

    return menuItems;
  }, []);

  useEffect(() => {
    const pathnames = window.location.pathname.split("/");
    setSelectedKey(pathnames[1] || "providers");

    authStore.onGetMe();
  }, [authStore]);

  return (
    <Layout className="h-100-per">
      <Sider width={225} theme="light">
        <div className="logo-container">
          <span className="logo-text">Token Info</span>
        </div>
        <Menu
          mode="inline"
          items={renderMenus}
          onSelect={onSelectedMenu}
          selectedKeys={[selectedKey]}
        />
      </Sider>
      <Suspense fallback={<div />}>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <ProviderPage />
              </AuthRoute>
            }
          />
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
            path="/channels"
            element={
              <AuthRoute>
                <ChannelPage />
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
          <Route
            path="/weights"
            element={
              <AuthRoute>
                <WeightPage />
              </AuthRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default memo(observer(App));
