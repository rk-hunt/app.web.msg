import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Table,
  TableColumnsType,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import { AlertChannelURL, datetimeFormat } from "../../constants";
import SetupModal from "../Partial/SetupModal";
import {
  AlertChannelFilterBy,
  AlertChannelInfo,
  AlertChannel,
} from "../../types";
import Filter from "../Partial/Filter";

const { Content } = Layout;

const AlertChannelPage: React.FC = () => {
  const { alertChannelStore } = useStores();
  const { data, isFetching, pageContext, isSaving } = alertChannelStore;

  const [visibleModal, setVisibleModal] = useState(false);

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      const filter: AlertChannelFilterBy = {
        ...alertChannelStore.filterBy,
        ...values,
      };

      alertChannelStore.setFilterBy(filter);
      alertChannelStore.onList(AlertChannelURL.list, filter);
    },
    [alertChannelStore]
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
    (info: AlertChannelInfo, onReset: () => void) => {
      alertChannelStore.onSave(
        AlertChannelURL.base,
        info,
        onSaved.bind(null, onReset)
      );
    },
    [alertChannelStore, onSaved]
  );

  const onDelete = useCallback(
    (id: string) => {
      return new Promise(async (resolve, rejects) => {
        const response = await alertChannelStore.onDelete(
          AlertChannelURL.base,
          id
        );
        if (response) {
          resolve("success");
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [alertChannelStore]
  );

  const onConfirmDeleting = useCallback(
    (alertChannel: AlertChannel) => {
      Modal.confirm({
        title: "Delete Alert Channel",
        content: `Do you want to delete alert channel ${alertChannel.name}?`,
        onOk: () => onDelete(alertChannel._id as string),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onDelete]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      alertChannelStore.onList(
        AlertChannelURL.list,
        alertChannelStore.filterBy,
        page
      );
    },
    [alertChannelStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Channel Id",
        dataIndex: "channel_id",
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
        render: (_: any, record: AlertChannel) => {
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

  useEffect(() => {
    alertChannelStore.onList(AlertChannelURL.list);
    return () => {
      alertChannelStore.onReset();
    };
  }, [alertChannelStore]);

  return (
    <Content>
      <Header
        title="Alert Channels"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenModal}>
            New Alert Channel
          </Button>
        }
      />
      <Page title="Alert Channels">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Name" name="name">
                    <Input placeholder="Name" allowClear />
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
        title="New Alert Channel"
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onOpenModal}
        onSave={onSave}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          label="Bot Token"
          name="bot_token"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Bot Token" />
        </Form.Item>
        <Form.Item
          label="Channel Id"
          name="channel_id"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Channel Id" />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(AlertChannelPage));
