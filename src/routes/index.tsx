import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

Spin.setDefaultIndicator(
  <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />
);

const LoginPage = lazy(() => import("../pages/Login/loginPage"));
const App = lazy(() => import("../App"));

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (!axios.defaults.headers.common.authorization) {
    axios.defaults.headers.common = {
      authorization: accessToken,
      accept: "application/json",
    };
  }

  return children ? children : <Outlet />;
};
const UnprotectedRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    return <Navigate to="/providers" />;
  }

  return children ? children : <Outlet />;
};

const Router: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          element={
            <UnprotectedRoute>
              <LoginPage />
            </UnprotectedRoute>
          }
          path="/login"
        />
        <Route
          path="*"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export { AuthRoute };
export default Router;
