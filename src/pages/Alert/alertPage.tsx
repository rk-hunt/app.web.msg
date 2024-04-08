import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  ActionType,
  AlertFrequencyType,
  AlertURL,
  datetimeFormat,
} from "../../constants";
import { AlertFilterBy, AlertFilterForm } from "../../types";
import Filter from "../Partial/Filter";
import AlertModal from "./alertModal";

const { Content } = Layout;

const AlertPage: React.FC = () => {
  const { alertStore } = useStores();
  const { data, isFetching, pageContext, isSaving } = alertStore;

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
      const filter: AlertFilterBy = {
        ...alertStore.filterBy,
        ...values,
      };

      alertStore.setFilterBy(filter);
      alertStore.onList(AlertURL.list, filter);
    },
    [alertStore]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      alertStore.onList(AlertURL.list, alertStore.filterBy, page);
    },
    [alertStore]
  );

  const onSaved = useCallback(
    (onReset: () => void) => {
      setVisibleModal(false);
      alertStore.onList(AlertURL.list);
      onReset();
    },
    [alertStore]
  );

  const onSave = useCallback(
    (info: any, filterForms: AlertFilterForm[], onReset: () => void) => {
      alertStore.onSaveAlert(info, filterForms, onSaved.bind(null, onReset));
    },
    [alertStore, onSaved]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Frequency",
        dataIndex: "frequency_type",
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
    ];

    return columns;
  }, []);

  useEffect(() => {
    alertStore.onList(AlertURL.list);
    return () => {
      alertStore.onReset();
    };
  }, [alertStore]);

  return (
    <Content>
      <Header
        title="Alerts"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onOpenModal.bind(null, ActionType.Create)}
          >
            New Alert
          </Button>
        }
      />
      <Page title="Alerts">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Name" name="name">
                    <Input placeholder="Name" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Frequency" name="frequency_type">
                    <Select
                      placeholder="Always"
                      options={[
                        {
                          value: AlertFrequencyType.Always,
                          label: AlertFrequencyType.Always,
                        },
                        {
                          value: AlertFrequencyType.Once,
                          label: AlertFrequencyType.Once,
                        },
                        {
                          value: AlertFrequencyType.OncePerDay,
                          label: AlertFrequencyType.OncePerDay,
                        },
                      ]}
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
      <AlertModal
        title={actionType === ActionType.Create ? "New Alert" : `Edit Alert`}
        visible={visibleModal}
        isSaving={isSaving}
        onCancel={onOpenModal.bind(null, ActionType.Create)}
        onSave={onSave}
      />
    </Content>
  );
};

export default memo(observer(AlertPage));
