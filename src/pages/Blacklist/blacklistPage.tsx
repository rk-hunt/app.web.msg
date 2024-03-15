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
import { BlacklistType, BlacklistURL, datetimeFormat } from "../../constants";
import SetupModal from "../Partial/SetupModal";
import { Blacklist, BlacklistFilterBy, BlacklistInfo } from "../../types";

const { Content } = Layout;

const BlacklistPage: React.FC = () => {
  const { blacklistStore } = useStores();
  const { data, isFetching, pageContext, isSaving } = blacklistStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm<any>();

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      console.log("values: ", values);
      const filter: BlacklistFilterBy = {
        ...blacklistStore.filterBy,
        ...values,
      };

      blacklistStore.setFilterBy(filter);
      blacklistStore.onList(BlacklistURL.list, filter);
    },
    [blacklistStore]
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
    (info: BlacklistInfo, onReset: () => void) => {
      blacklistStore.onSave(
        BlacklistURL.base,
        info,
        onSaved.bind(null, onReset)
      );
    },
    [blacklistStore, onSaved]
  );

  const onDelete = useCallback(
    (id: string) => {
      return new Promise(async (resolve, rejects) => {
        const response = await blacklistStore.onDelete(BlacklistURL.base, id);
        if (response) {
          resolve("success");
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [blacklistStore]
  );

  const onConfirmDeleting = useCallback(
    (blacklist: Blacklist) => {
      Modal.confirm({
        title: "Delete Blacklist",
        content: `Do you want to delete blacklist ${blacklist.value}?`,
        onOk: () => onDelete(blacklist._id as string),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onDelete]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      blacklistStore.onList(BlacklistURL.list, blacklistStore.filterBy, page);
    },
    [blacklistStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Value",
        dataIndex: "value",
      },
      {
        title: "Type",
        dataIndex: "type",
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
        render: (_: any, record: Blacklist) => {
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
        <Form.Item label="Value" name="value">
          <Input placeholder="Value" allowClear />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select
            placeholder="User"
            options={[
              { value: BlacklistType.User, label: BlacklistType.User },
              { value: BlacklistType.Keyword, label: BlacklistType.Keyword },
            ]}
            allowClear
          />
        </Form.Item>
        <Button type="primary" block htmlType="submit">
          Apply
        </Button>
      </Form>
    );
  }, [form, onApplyFilter]);

  useEffect(() => {
    blacklistStore.onList(BlacklistURL.list);
    return () => {
      blacklistStore.onReset();
    };
  }, [blacklistStore]);

  return (
    <Content>
      <Header title="Blacklists" />
      <Page title="Blacklists">
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
                New Blacklist
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
        title="New Blacklist"
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onOpenModal}
        onSave={onSave}
      >
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            placeholder="User"
            options={[
              { value: BlacklistType.User, label: BlacklistType.User },
              { value: BlacklistType.Keyword, label: BlacklistType.Keyword },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Blacklist" />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(BlacklistPage));
