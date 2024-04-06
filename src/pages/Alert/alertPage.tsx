import { memo, useCallback, useEffect, useMemo } from "react";
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
import { AlertFrequencyType, AlertURL, datetimeFormat } from "../../constants";
import { AlertFilterBy } from "../../types";
import Filter from "../Partial/Filter";

const { Content } = Layout;

const AlertPage: React.FC = () => {
  const { alertStore } = useStores();
  const { data, isFetching, pageContext } = alertStore;

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
          <Button type="primary" icon={<PlusOutlined />}>
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
    </Content>
  );
};

export default memo(observer(AlertPage));
