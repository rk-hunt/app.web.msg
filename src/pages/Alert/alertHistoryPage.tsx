import { memo, useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { Col, Layout, Row, Table, TableColumnsType } from "antd";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import { AlertURL, datetimeFormat } from "../../constants";

const { Content } = Layout;

const AlertHistoryPage: React.FC = () => {
  const { alertHistoryStore } = useStores();
  const { data, isFetching, pageContext } = alertHistoryStore;

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      alertHistoryStore.onList(AlertURL.history, {}, page);
    },
    [alertHistoryStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Alert At",
        dataIndex: "alert_at",
        render: (value: number) => {
          return dayjs(value).format(datetimeFormat);
        },
      },
      {
        title: "Message",
        dataIndex: "message",
        render: (message: string) => {
          return <span style={{ whiteSpace: "pre-line" }}>{message}</span>;
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
    ];

    return columns;
  }, []);

  useEffect(() => {
    alertHistoryStore.onList(AlertURL.history);
    return () => {
      alertHistoryStore.onReset();
    };
  }, [alertHistoryStore]);

  return (
    <Content>
      <Header title="Alerts" />
      <Page title="Alerts">
        <Row>
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

export default memo(observer(AlertHistoryPage));
