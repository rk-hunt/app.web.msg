import React, { memo } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import "./index.css";
import { SendOutlined } from "@ant-design/icons";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<any>();

  const onRequestOTP = () => {
    console.log("sending...");
  };

  return (
    <div className="login-container">
      <Flex justify="center" align="center" style={{ width: "100%" }}>
        <Card className="login-card">
          <div>
            <Flex justify="center">
              <Title level={2}>Token Info</Title>
            </Flex>
          </div>
          <div className="login-form">
            <Form
              layout="vertical"
              form={form}
              name="login_form"
              initialValues={{}}
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[{ required: true, message: "" }]}
              >
                <Input
                  size="large"
                  placeholder="email@token.info"
                  type="email"
                />
              </Form.Item>
              <Form.Item
                label="OTP"
                name="username"
                rules={[{ required: true, message: "" }]}
              >
                <Input
                  size="large"
                  placeholder="010101"
                  addonAfter={<SendOutlined onClick={onRequestOTP} />}
                />
              </Form.Item>
            </Form>

            <Flex justify="flex-end">
              <Button
                type="primary"
                size="large"
                block
                style={{ marginTop: 16 }}
              >
                Login
              </Button>
            </Flex>
          </div>
        </Card>
      </Flex>
    </div>
  );
};

export default memo(observer(LoginPage));
