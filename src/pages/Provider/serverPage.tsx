import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  Popover,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  ProviderServerType,
  ProviderURL,
  ServerURL,
  datetimeFormat,
} from "../../constants";
import { Server, ServerFilterBy, ServerInfo } from "../../types";
import SetupModal from "../Partial/SetupModal";

const { Content } = Layout;

const ServerPage: React.FC = () => {
  const { serverStore, providerStore } = useStores();
  const { data: providers } = providerStore;
  const { data, isFetching, pageContext, isSaving } = serverStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm<any>();

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      const filter: ServerFilterBy = {
        ...serverStore.filterBy,
        ...values,
      };

      serverStore.setFilterBy(filter);
      serverStore.onList(ServerURL.list, filter);
    },
    [serverStore]
  );

  const onSaved = useCallback(
    (onReset: () => void) => {
      setVisibleModal(false);
      onApplyFilter({});
      onReset();
    },
    [onApplyFilter]
  );

  const onSave = useCallback(
    (info: ServerInfo, onReset: () => void) => {
      serverStore.onSave(ServerURL.base, info, onSaved.bind(null, onReset));
    },
    [serverStore, onSaved]
  );

  const onDelete = useCallback(
    (id: string) => {
      return new Promise(async (resolve, rejects) => {
        const response = await serverStore.onDelete(ServerURL.base, id);
        if (response) {
          resolve("success");
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [serverStore]
  );

  const onConfirmDeleting = useCallback(
    (server: Server) => {
      Modal.confirm({
        title: "Delete Server",
        content: `Do you want to delete server ${server.server_name}?`,
        onOk: () => onDelete(server._id as string),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onDelete]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      serverStore.onList(ServerURL.list, serverStore.filterBy, page);
    },
    [serverStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "server_name",
      },
      {
        title: "Server Id",
        dataIndex: "server_id",
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
        render: (_: any, record: Server) => {
          return (
            <Button
              icon={<DeleteOutlined />}
              size="small"
              onClick={onConfirmDeleting.bind(null, record)}
            />
          );
        },
      },
    ];

    return columns;
  }, [onConfirmDeleting]);

  const filterForm = useMemo(() => {
    return (
      <Form
        layout="vertical"
        form={form}
        name="filter_form"
        onFinish={onApplyFilter}
        style={{ padding: 8, width: 300 }}
      >
        <Form.Item label="Name" name="server_name">
          <Input placeholder="Professor" allowClear />
        </Form.Item>
        <Form.Item label="Server Id" name="server_id">
          <Input placeholder="00001" allowClear />
        </Form.Item>
        <Form.Item label="Provider" name="provider_id">
          <Select
            placeholder="Discord"
            options={providers.map((provider) => ({
              value: provider._id,
              label: provider.name,
            }))}
            allowClear
          />
        </Form.Item>
        <Button type="primary" block htmlType="submit">
          Apply
        </Button>
      </Form>
    );
  }, [form, providers, onApplyFilter]);

  useEffect(() => {
    serverStore.onList(ServerURL.list);
    providerStore.onList(ProviderURL.list);
    return () => {
      serverStore.onReset();
    };
  }, [serverStore, providerStore]);

  return (
    <Content>
      <Header title="Servers" />
      <Page title="Servers">
        <Row>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Flex justify="space-between">
              <Popover
                content={filterForm}
                trigger="click"
                placement="bottomLeft"
                arrow={false}
              >
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Popover>
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
            <Table
              rowKey="_id"
              columns={tableColumns}
              dataSource={data}
              loading={isFetching}
              pagination={{
                hideOnSinglePage: true,
                showSizeChanger: false,
                size: "default",
                pageSize: pageContext.per_page,
                current: pageContext.current_page,
                total: pageContext.total,
                showTotal: (total: number, range: any) =>
                  `${range[0]}-${range[1]} of ${total}`,
                onChange: onPaginationChanged,
              }}
            />
          </Col>
        </Row>
      </Page>
      <SetupModal
        title="New Server"
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onOpenModal}
        onSave={onSave}
      >
        <Form.Item
          label="Provider"
          name="provider_id"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            placeholder="Discord"
            options={providers.map((provider) => ({
              value: provider._id,
              label: provider.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="server_name"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Professor" />
        </Form.Item>
        <Form.Item
          label="Server Id"
          name="server_id"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="00001" />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            placeholder="Server"
            options={[
              {
                value: ProviderServerType.Server,
                label: ProviderServerType.Server,
              },
              {
                value: ProviderServerType.Channel,
                label: ProviderServerType.Channel,
              },
              {
                value: ProviderServerType.Group,
                label: ProviderServerType.Group,
              },
            ]}
          />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ServerPage));
