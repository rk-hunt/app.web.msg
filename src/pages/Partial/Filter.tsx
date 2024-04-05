import { Button, Card, Col, Flex, Form, Row } from "antd";
import React, { memo, useCallback } from "react";
import { FilterOutlined } from "@ant-design/icons";

type FilterProps = {
  onFilter: (values: any) => void;
};

const Filter: React.FC<React.PropsWithChildren<FilterProps>> = ({
  onFilter,
  children,
}) => {
  const [form] = Form.useForm<any>();

  const _onFilter = useCallback(() => {
    form
      .validateFields()
      .then((values: any) => {
        onFilter(values);
      })
      .catch((err) => {});
  }, [form, onFilter]);

  return (
    <Card style={{ marginBottom: 24 }}>
      <Form
        layout="vertical"
        form={form}
        name="filter_form"
        onFinish={_onFilter}
      >
        <Row>
          <Col span={24}>{children}</Col>
          <Col span={24}>
            <Flex justify="end">
              <Button icon={<FilterOutlined />} htmlType="submit">
                Filter
              </Button>
            </Flex>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default memo(Filter);
