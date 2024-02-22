import { memo, useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { Button, Col, Layout, Row, Table, TableColumnsType } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import { ProviderURL, datetimeFormat } from "../../constants";

const { Content } = Layout;

const ProviderPage: React.FC = () => {
  const { providerStore } = useStores();
  const { data, isFetching, pageContext } = providerStore;

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      providerStore.onList(ProviderURL.list, {}, page);
    },
    [providerStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "name",
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
        render: (_: any) => {
          return <Button icon={<DeleteOutlined />} size="small" />;
        },
      },
    ];

    return columns;
  }, []);

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
    </Content>
  );
};

export default memo(observer(ProviderPage));
