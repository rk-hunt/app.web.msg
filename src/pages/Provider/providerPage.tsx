import { Button, Col, Flex, Layout, Row, Table, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { memo } from "react";
import { Header, Page } from "../../components";
import { PlusOutlined } from "@ant-design/icons";

const { Content } = Layout;
const columns: TableColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Action",
    dataIndex: "",
  },
];

const ProviderPage: React.FC = () => {
  return (
    <Content>
      <Header title="Provider" />
      <Page title="Providers">
        <Row
          style={{
            paddingLeft: 50,
            paddingRight: 50,
            paddingBottom: 25,
          }}
        >
          <Col span={24} style={{ marginBottom: 24 }}>
            <Flex justify="flex-end">
              <Button type="primary" icon={<PlusOutlined />}>
                New Provider
              </Button>
            </Flex>
          </Col>
          <Col span={24}>
            <Table columns={columns} />
          </Col>
        </Row>
      </Page>
    </Content>
  );
};

export default memo(observer(ProviderPage));
