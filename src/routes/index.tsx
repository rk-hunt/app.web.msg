import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Spin } from "antd";

Spin.setDefaultIndicator(
  <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />
);

const LoginPage = lazy(() => import("../pages/Login/loginPage"));
const App = lazy(() => import("../App"));

const Router: React.FC = (props) => (
  <BrowserRouter>
    <Suspense fallback={<div />}>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<App />} path="*" />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
export default Router;
