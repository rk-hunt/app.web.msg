import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { debounce } from "lodash";
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
  ChannelURL,
  datetimeFormat,
  ServerChannelType,
  ServerURL,
} from "../../constants";
import { Channel, ChannelFilterBy, ServerInfo } from "../../types";
import SetupModal from "../Partial/SetupModal";

const { Content } = Layout;

const ChannelPage: React.FC = () => {
  const { serverStore, channelStore } = useStores();
  const { data: servers, isFetching: isFetchingServer } = serverStore;
  const { data, isFetching, pageContext, isSaving } = channelStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm<any>();

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      const filter: ChannelFilterBy = {
        ...channelStore.filterBy,
        ...values,
      };

      channelStore.setFilterBy(filter);
      channelStore.onList(ChannelURL.list, filter);
    },
    [channelStore]
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
      channelStore.onSave(ChannelURL.base, info, onSaved.bind(null, onReset));
    },
    [channelStore, onSaved]
  );

  const onDelete = useCallback(
    (id: string) => {
      return new Promise(async (resolve, rejects) => {
        const response = await channelStore.onDelete(ChannelURL.base, id);
        if (response) {
          resolve("success");
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [channelStore]
  );

  const onConfirmDeleting = useCallback(
    (channel: Channel) => {
      Modal.confirm({
        title: "Delete Channel",
        content: `Do you want to delete channel ${channel.channel_name}?`,
        onOk: () => onDelete(channel._id as string),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onDelete]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      channelStore.onList(ChannelURL.list, channelStore.filterBy, page);
    },
    [channelStore]
  );

  const onSearchServer = useCallback(
    (value: string) => {
      serverStore.onList(ServerURL.list, { server_name: value });
    },
    [serverStore]
  );

  const onSearch = useMemo(() => {
    return debounce(onSearchServer, 800);
  }, [onSearchServer]);

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "channel_name",
      },
      {
        title: "Channel Id",
        dataIndex: "channel_id",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Server Name",
        dataIndex: "server_name",
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
        render: (_: any, record: Channel) => {
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
        <Form.Item label="Name" name="channel_name">
          <Input placeholder="Announcement" allowClear />
        </Form.Item>
        <Form.Item label="Channel Id" name="channel_id">
          <Input placeholder="00001" allowClear />
        </Form.Item>
        <Form.Item label="Server" name="server_id">
          <Select
            showSearch
            filterOption={false}
            loading={isFetchingServer}
            onSearch={onSearch}
            placeholder="General"
            options={servers.map((server) => ({
              value: server._id,
              label: server.server_name,
            }))}
            allowClear
          />
        </Form.Item>
        <Button type="primary" block htmlType="submit">
          Apply
        </Button>
      </Form>
    );
  }, [form, servers, onApplyFilter, onSearch, isFetchingServer]);

  useEffect(() => {
    channelStore.onList(ChannelURL.list);
    return () => {
      channelStore.onReset();
    };
  }, [channelStore]);

  return (
    <Content>
      <Header title="Channels" />
      <Page title="Channels">
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
                New Channel
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
        title="New Channel"
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onOpenModal}
        onSave={onSave}
      >
        <Form.Item
          label="Server"
          name="server_id"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            showSearch
            filterOption={false}
            loading={isFetchingServer}
            onSearch={onSearch}
            placeholder="General"
            options={servers.map((server) => ({
              value: server._id,
              label: server.server_name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Name"
          name="channel_name"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Professor" />
        </Form.Item>
        <Form.Item
          label="Channel Id"
          name="channel_id"
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
            placeholder="Channel"
            options={[
              {
                value: ServerChannelType.Channel,
                label: ServerChannelType.Channel,
              },
              {
                value: ServerChannelType.Topic,
                label: ServerChannelType.Topic,
              },
            ]}
          />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ChannelPage));
