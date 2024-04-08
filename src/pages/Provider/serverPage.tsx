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
  ProviderURL,
  ServerURL,
  datetimeFormat,
} from "../../constants";
import {
  SelectLabelInValue,
  Server,
  ServerFilterBy,
  ServerInfo,
  ServerReqInfo,
} from "../../types";
import SetupModal from "../Partial/SetupModal";
import Filter from "../Partial/Filter";

const { Content } = Layout;

const ServerPage: React.FC = () => {
  const { serverStore, providerStore } = useStores();
  const { data: providers, isFetching: isFetchingProvider } = providerStore;
  const { data, isFetching, pageContext, isSaving, serverInfo, providerTypes } =
    serverStore;
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
      const { provider, ...value } = values;
      const filter: ServerFilterBy = {
        ...serverStore.filterBy,
        ...value,
      };
      if (provider) {
        filter.provider_id = provider.value;
      }

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
      const { provider, ...rest } = info;
      const reqInfo: ServerReqInfo = {
        ...rest,
        provider_id: provider.value,
      };

      if (actionType === ActionType.Create) {
        serverStore.onSave(
          ServerURL.base,
          reqInfo,
          onSaved.bind(null, onReset)
        );
      } else {
        serverStore.onUpdate(
          `${ServerURL.base}/${serverInfo._id}`,
          reqInfo,
          onSaved.bind(null, onReset)
        );
      }
    },
    [serverStore, onSaved, actionType, serverInfo]
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

  const onEdit = useCallback(
    (info: Server) => {
      const serverInfo: ServerInfo = {
        ...info,
        provider: {
          value: info.provider_id,
          label: info.provider_name,
        },
      };
      serverStore.setServerInfo(serverInfo);
      onOpenModal(ActionType.Update);
    },
    [serverStore, onOpenModal]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      serverStore.onList(ServerURL.list, serverStore.filterBy, page);
    },
    [serverStore]
  );

  const onSearchProvider = useCallback(
    (value: string) => {
      providerStore.onList(ProviderURL.list, { name: value });
    },
    [providerStore]
  );

  const onSearch = useMemo(() => {
    return debounce(onSearchProvider, 800);
  }, [onSearchProvider]);

  const onSelectedProvider = useCallback(
    (value: SelectLabelInValue) => {
      const provider = providers.find((prov) => prov._id === value.value);
      if (provider) {
        serverStore.setProviderTypes(provider.type);
      }
    },
    [providers, serverStore]
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
    serverStore.onList(ServerURL.list);
    return () => {
      serverStore.onReset();
    };
  }, [serverStore]);

  return (
    <Content>
      <Header
        title="Servers"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenModal.bind(null, ActionType.Create)}
          >
            New Server
          </Button>
        }
      />
      <Page title="Servers">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Name" name="server_name">
                    <Input placeholder="Professor" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Server Id" name="server_id">
                    <Input placeholder="Server Id" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Provider" name="provider">
                    <Select
                      showSearch
                      allowClear
                      filterOption={false}
                      loading={isFetchingProvider}
                      onSearch={onSearch}
                      placeholder="Type to search"
                      labelInValue
                      options={providers.map((provider) => ({
                        value: provider._id,
                        label: provider.name,
                      }))}
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
            ? "New Server"
            : `Edit Server ${serverInfo.server_name}`
        }
        visible={visibleModal}
        isSaving={isSaving}
        actionType={actionType}
        data={serverInfo}
        onCancel={onOpenModal.bind(null, ActionType.Create)}
        onSave={onSave}
      >
        <Form.Item
          label="Provider"
          name="provider"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            showSearch
            filterOption={false}
            loading={isFetchingProvider}
            onSearch={onSearch}
            onSelect={onSelectedProvider}
            placeholder="Type to search"
            labelInValue
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
          <Select placeholder="Server" options={providerTypes} />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ServerPage));
