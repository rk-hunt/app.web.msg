import React, { memo, useEffect } from "react";
import { Col, Row } from "antd";
import "./index.css";

type PageProps = {
  title: string;
};

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({
  title,
  children,
}) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="page">
      <Row className="h-100-per">
        <Col span={24} className="h-100-per">
          {children}
        </Col>
      </Row>
    </div>
  );
};
export default memo(Page);
