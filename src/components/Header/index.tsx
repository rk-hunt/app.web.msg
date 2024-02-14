import React, { ReactElement, memo } from "react";
import { Flex, Typography } from "antd";
import "./index.css";

const { Title } = Typography;

type HeaderProps = {
  title: string;
  extra?: ReactElement;
};

const Header: React.FC<HeaderProps> = ({ title, extra }) => {
  return (
    <div className="header">
      <Flex justify="space-between">
        <div>
          <Title>{title}</Title>
        </div>
        {extra}
      </Flex>
    </div>
  );
};
export default memo(Header);
