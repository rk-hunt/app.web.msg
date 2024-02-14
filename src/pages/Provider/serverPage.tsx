import { memo, useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Table,
  TableColumnsType,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Header, Page } from "../../components";
import { ProviderServer } from "../../types";
import { datetimeFormat } from "../../constants";

const { Content } = Layout;

const providerServers: ProviderServer[] = [
  {
    _id: "65cb7500ad9feb48dba1e686",
    provider_id: "65cb7500ad9feb48dba1e686",
    provider_name: "Discord",
    server_id: "65cb7500ad9feb48dba1e687",
    server_name: "Heisenberg",
    type: "Channel",
    created_at: 1707832576683,
    updated_at: 0,
  },
  {
    _id: "65cb8a7ae89f207e6d3ed3c1",
    provider_id: "65cb8a7ae89f207e6d3ed3c1",
    provider_name: "Telegram",
    server_id: "65cb7500ad9feb48dba1e687",
    server_name: "Professor",
    type: "Group",
    created_at: Date.now(),
    updated_at: 0,
  },
];

const ServerPage: React.FC = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm<any>();

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "server_name",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Provider",
        dataIndex: "provider_name",
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        render: (value: number) => {
          return dayjs(value).format(datetimeFormat);
        },
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (value: number) => {
          return value === 0 ? "-" : dayjs(value).format(datetimeFormat);
        },
      },
      {
        title: "",
        dataIndex: "",
        render: (_: any) => {
          return <Button icon={<DeleteOutlined />} size="small" />;
        },
      },
    ];

    return columns;
  }, []);

  return (
    <Content>
      <Header title="Servers" />
      <Page title="Servers">
        <Row>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Flex justify="space-between">
              <Button>Filter</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onOpenModal}
              >
                New Server
              </Button>
            </Flex>
          </Col>
          <Col span={24}>
            <Table columns={tableColumns} dataSource={providerServers} />
          </Col>
        </Row>
      </Page>

      <Modal
        title="New Server"
        width={450}
        centered
        closable={false}
        open={visibleModal}
        onCancel={onOpenModal}
        okText="Save"
      >
        <Form
          layout="vertical"
          form={form}
          name="provider_form"
          style={{ paddingTop: 24, paddingBottom: 24 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "" }]}
          >
            <Input placeholder="Discord" type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default memo(observer(ServerPage));
