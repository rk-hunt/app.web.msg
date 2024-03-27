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
  const { data, isFetching, pageContext, isSaving, provider } = providerStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleSetupModal, setVisibleSetupModal] = useState(false);
  const [actionType, setActionType] = useState(ActionType.Create);

  const onOpenModal = useCallback(
    (provider: Provider) => {
      providerStore.setProvider(provider);
      setActionType(ActionType.Set);
      setVisibleModal(true);
    },
    [providerStore]
  );

  const onCloseModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  const onOpenSetupModal = useCallback(() => {
    setActionType(ActionType.Create);
    setVisibleSetupModal(true);
  }, []);

  const onCloseSetupModal = useCallback(() => {
    setVisibleSetupModal(false);
  }, []);

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      providerStore.onList(ProviderURL.list, {}, page);
    },
    [providerStore]
  );

  const onSaved = useCallback(
    (onReset: () => void) => {
      setVisibleModal(false);
      setVisibleSetupModal(false);
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
      } else if (actionType === ActionType.Set) {
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
              onClick={onOpenModal.bind(null, provider)}
            />
          );
        },
      },
    ];

    return columns;
  }, [onOpenModal]);

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
                onClick={onOpenSetupModal}
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

      {/* set|unset token */}
      <SetupModal
        title="Set Token"
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onCloseModal}
        onSave={onSave}
      >
        <Form.Item
          label="Token"
          name="token"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Token" />
        </Form.Item>
      </SetupModal>

      {/* create provider modal */}
      <SetupModal
        title="New Provider"
        visible={visibleSetupModal}
        isSaving={isSaving}
        onCancel={onCloseSetupModal}
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
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Token" />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(ProviderPage));
