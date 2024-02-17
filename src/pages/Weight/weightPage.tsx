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
import { WeightType, WeightURL, datetimeFormat } from "../../constants";
import SetupModal from "../Partial/SetupModal";
import { Weight, WeightFilterBy, WeightInfo } from "../../types";

const { Content } = Layout;

const WeightPage: React.FC = () => {
  const { weightStore } = useStores();
  const { data, isFetching, pageContext, isSaving } = weightStore;

  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm<any>();

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      const filter: WeightFilterBy = {
        ...weightStore.filterBy,
        ...values,
      };

      weightStore.setFilterBy(filter);
      weightStore.onList(WeightURL.list, filter);
    },
    [weightStore]
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
    (info: WeightInfo, onReset: () => void) => {
      info.weight = parseFloat(info.weight as any);
      weightStore.onSave(WeightURL.base, info, onSaved.bind(null, onReset));
    },
    [weightStore, onSaved]
  );
  const onDelete = useCallback(
    (id: string) => {
      return new Promise(async (resolve, rejects) => {
        const response = await weightStore.onDelete(WeightURL.base, id);
        if (response) {
          resolve("success");
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [weightStore]
  );
  const onConfirmDeleting = useCallback(
    (weight: Weight) => {
      Modal.confirm({
        title: "Delete Weight",
        content: `Do you want to delete weight ${weight.value}?`,
        onOk: () => onDelete(weight._id as string),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onDelete]
  );
  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      weightStore.onList(WeightURL.list, weightStore.filterBy, page);
    },
    [weightStore]
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
        title: "Weight",
        dataIndex: "weight",
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
        render: (_: any, record: Weight) => {
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
              { value: WeightType.User, label: WeightType.User },
              { value: WeightType.Keyword, label: WeightType.Keyword },
              { value: WeightType.Server, label: WeightType.Server },
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
    weightStore.onList(WeightURL.list);
    return () => {
      weightStore.onReset();
    };
  }, [weightStore]);

  return (
    <Content>
      <Header title="Weights" />
      <Page title="Weights">
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
                New Weight
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
        title="New Weight"
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
              { value: WeightType.User, label: WeightType.User },
              { value: WeightType.Keyword, label: WeightType.Keyword },
              { value: WeightType.Server, label: WeightType.Server },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="Professor" />
        </Form.Item>
        <Form.Item
          label="Weight"
          name="weight"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="5" />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(WeightPage));
