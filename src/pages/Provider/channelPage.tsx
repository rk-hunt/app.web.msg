import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { debounce } from "lodash";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  ActionType,
  ChannelURL,
  datetimeFormat,
  ServerURL,
} from "../../constants";
import {
  Channel,
  ChannelFilterBy,
  ChannelInfo,
  ChannelReqInfo,
  SelectLabelInValue,
} from "../../types";
import SetupModal from "../Partial/SetupModal";
import Filter from "../Partial/Filter";

const { Content } = Layout;

const ChannelPage: React.FC = () => {
  const { serverStore, channelStore } = useStores();
  const { data: servers, isFetching: isFetchingServer } = serverStore;
  const { data, isFetching, pageContext, isSaving, serverTypes, channelInfo } =
    channelStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [actionType, setActionType] = useState(ActionType.Create);

  const onOpenModal = useCallback(
    (action: ActionType) => {
      setActionType(action);
      setVisibleModal(!visibleModal);
    },
    [visibleModal]
  );

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
    (info: ChannelInfo, onReset: () => void) => {
      const { server, ...rest } = info;
      const reqInfo: ChannelReqInfo = {
        ...rest,
        server_id: server.value,
      };

      if (actionType === ActionType.Create) {
        channelStore.onSave(
          ChannelURL.base,
          reqInfo,
          onSaved.bind(null, onReset)
        );
      } else {
        channelStore.onUpdate(
          `${ChannelURL.base}/${channelInfo._id}`,
          reqInfo,
          onSaved.bind(null, onReset)
        );
      }
    },
    [channelStore, onSaved, actionType, channelInfo]
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

  const onEdit = useCallback(
    (info: Channel) => {
      const channelInfo: ChannelInfo = {
        ...info,
        server: {
          value: info.server_id,
          label: info.server_name,
        },
      };
      channelStore.setChannelInfo(channelInfo);
      onOpenModal(ActionType.Update);
    },
    [channelStore, onOpenModal]
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

  const onSelectedServer = useCallback(
    (value: SelectLabelInValue) => {
      const selectServer = servers.find((server) => server._id === value.value);
      if (selectServer) {
        channelStore.setServerTypes(selectServer.type);
      }
    },
    [servers, channelStore]
  );

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
        title: "Server",
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
            <Space>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={onEdit.bind(null, record)}
              />

              <Button
                icon={<DeleteOutlined />}
                size="small"
                onClick={onConfirmDeleting.bind(null, record)}
              />
            </Space>
          );
        },
      },
    ];

    return columns;
  }, [onConfirmDeleting, onEdit]);

  useEffect(() => {
    channelStore.onList(ChannelURL.list);
    return () => {
      channelStore.onReset();
    };
  }, [channelStore]);

  return (
    <Content>
      <Header
        title="Channels"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenModal.bind(null, ActionType.Create)}
          >
            New Channel
          </Button>
        }
      />
      <Page title="Channels">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Name" name="channel_name">
                    <Input placeholder="Announcement" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Channel Id" name="channel_id">
                    <Input placeholder="1203356362361274400" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
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
                </Col>
              </Row>
            </Filter>
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
        title={
          actionType === ActionType.Create
            ? "New Channel"
            : `Edit Channel ${channelInfo.channel_name}`
        }
        visible={visibleModal}
        isSaving={isSaving}
        actionType={actionType}
        data={channelInfo}
        onCancel={onOpenModal.bind(null, ActionType.Create)}
        onSave={onSave}
      >
        <Form.Item
          label="Server"
          name="server"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            showSearch
            filterOption={false}
            loading={isFetchingServer}
            onSearch={onSearch}
            onSelect={onSelectedServer}
            placeholder="Type to search servers"
            labelInValue
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
          <Select placeholder="Channel" options={serverTypes} />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ChannelPage));
