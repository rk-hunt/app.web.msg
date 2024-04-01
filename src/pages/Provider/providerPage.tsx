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
  Row,
  Select,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  ActionType,
  ProviderType,
  ProviderURL,
  datetimeFormat,
} from "../../constants";
import SetupModal from "../Partial/SetupModal";
import { Provider, ProviderInfo } from "../../types";

const { Content } = Layout;

const ProviderPage: React.FC = () => {
  const { providerStore } = useStores();
  const { data, isFetching, pageContext, isSaving, provider, providerInfo } =
    providerStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [actionType, setActionType] = useState(ActionType.Create);

  const onOpenModal = useCallback(
    (action: ActionType) => {
      setActionType(action);
      setVisibleModal(!visibleModal);
    },
    [visibleModal]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      providerStore.onList(ProviderURL.list, {}, page);
    },
    [providerStore]
  );

  const onEdit = useCallback(
    (info: Provider) => {
      const providerInfo: ProviderInfo = {
        name: info.name,
        type: info.type,
      };
      providerStore.setProviderInfo(providerInfo);
      onOpenModal(ActionType.Update);
    },
    [providerStore, onOpenModal]
  );

  const onSaved = useCallback(
    (onReset: () => void) => {
      setVisibleModal(false);
      setVisibleModal(false);
      providerStore.onList(ProviderURL.list);
      onReset();
    },
    [providerStore]
  );

  const onSave = useCallback(
    (info: ProviderInfo, onReset: () => void) => {
      if (actionType === ActionType.Create) {
        providerStore.onSave(
          ProviderURL.base,
          info,
          onSaved.bind(null, onReset)
        );
      } else if (actionType === ActionType.Update) {
        providerStore.onUpdate(
          `${ProviderURL.base}/${provider._id}`,
          info,
          onSaved.bind(null, onReset)
        );
      }
    },
    [providerStore, provider, actionType, onSaved]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Token",
        dataIndex: "token",
        render: (token: string) => {
          return (
            <Tag bordered={false} color={token ? "success" : "error"}>
              {token ? "Set" : "Unset"}
            </Tag>
          );
        },
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
        render: (_: any, provider: Provider) => {
          return (
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={onEdit.bind(null, provider)}
            />
          );
        },
      },
    ];

    return columns;
  }, [onEdit]);

  useEffect(() => {
    providerStore.onList(ProviderURL.list);
    return () => {
      providerStore.onReset();
    };
  }, [providerStore]);

  return (
    <Content>
      <Header title="Providers" />
      <Page title="Providers">
        <Row>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Flex justify="flex-end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onOpenModal.bind(null, ActionType.Create)}
              >
                New Provider
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
        title={
          actionType === ActionType.Create
            ? "New Provider"
            : `Edit Provider ${providerInfo.name}`
        }
        visible={visibleModal}
        isSaving={isSaving}
        actionType={actionType}
        data={providerInfo}
        onCancel={onOpenModal.bind(null, ActionType.Create)}
        onSave={onSave}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Professor DC" />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            placeholder={ProviderType.Discord}
            options={[
              {
                value: ProviderType.Discord,
                label: ProviderType.Discord,
              },
              {
                value: ProviderType.Telegram,
                label: ProviderType.Telegram,
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Token"
          name="token"
          rules={
            actionType === ActionType.Create
              ? [{ required: true, message: "" }]
              : []
          }
        >
          <Input placeholder="Token" />
        </Form.Item>
        <Form.Item label="API Id" name="api_id">
          <Input placeholder="API Id" />
        </Form.Item>
        <Form.Item label="API Hash" name="api_hash">
          <Input placeholder="Token" />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ProviderPage));
