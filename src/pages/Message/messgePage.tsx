import { memo, useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Form,
  Input,
  Layout,
  Popover,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  MessageURL,
  ProviderURL,
  datetimeFormat,
  localStorageKey,
  refreshItems,
} from "../../constants";
import { Message, MessageFilterBy } from "../../types";
import Markdown from "react-markdown";
import { sortByBuilder } from "../../utils";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const MessagePage: React.FC = () => {
  const { messageStore, providerStore } = useStores();
  const { data: providers } = providerStore;
  const {
    data,
    isFetching,
    pageContext,
    highlightWeight,
    filterBy,
    sortBy,
    refreshInterval,
  } = messageStore;

  const [form] = Form.useForm<any>();

  const onApplyFilter = useCallback(
    (values: MessageFilterBy) => {
      if (values.received_at) {
        const receivedAt = values.received_at as any;
        values.received_at = {
          start: dayjs(receivedAt[0] as any)
            .startOf("d")
            .valueOf(),
          end: dayjs(receivedAt[1] as any)
            .endOf("d")
            .valueOf(),
        };
      }

      const filter: MessageFilterBy = {
        ...messageStore.filterBy,
        ...values,
      };

      messageStore.setFilterBy(filter);
      messageStore.onListMessages(MessageURL.list, filter, sortBy);
    },
    [messageStore, sortBy]
  );

  const onSelectedRefreshInterval = useCallback(
    (menu: any) => {
      messageStore.onChangeRefreshInterval(parseFloat(menu.key));
    },
    [messageStore]
  );

  const onCheckLocalInterval = useCallback(() => {
    const refreshInterval = localStorage.getItem(localStorageKey.msgInterval);
    if (refreshInterval) {
      messageStore.onChangeRefreshInterval(JSON.parse(refreshInterval).key);
    }
  }, [messageStore]);

  const onChange = useCallback(
    (pagination: any, _: any, sorter: any) => {
      const sortBy = sortByBuilder(sorter);
      messageStore.setSortBy(sortBy);
      messageStore.onListMessages(
        MessageURL.list,
        filterBy,
        sortBy,
        pagination.current
      );
    },
    [filterBy, messageStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Provider",
        dataIndex: "provider_name",
      },
      {
        title: "Server",
        dataIndex: "server_name",
        sorter: {
          multiple: 1,
        },
      },
      {
        title: "Channel",
        dataIndex: "channel_name",
      },
      {
        title: "Author",
        dataIndex: "author_username",
        sorter: {
          multiple: 2,
        },
      },
      {
        title: "Received At",
        dataIndex: "received_at",
        defaultSortOrder: "descend",
        sorter: {
          multiple: 3,
        },
        render: (value: number) => {
          return dayjs(value).format(datetimeFormat);
        },
      },
      {
        title: "Content",
        dataIndex: "content",
        width: "30%",
        render: (_: string, message: Message) => {
          if (message.weight >= highlightWeight) {
            return <Markdown>{message.content}</Markdown>;
            // <span className="text-highlight">
          }
          return message.content;
        },
      },
    ];

    return columns;
  }, [highlightWeight]);

  const filterForm = useMemo(() => {
    return (
      <Form
        layout="vertical"
        form={form}
        name="filter_form"
        onFinish={onApplyFilter}
        style={{ padding: 8, width: 300 }}
      >
        <Form.Item label="Provider" name="provider_id">
          <Select
            placeholder="Discord"
            options={providers.map((provider) => ({
              value: provider._id,
              label: provider.name,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item label="Author" name="author_username">
          <Input placeholder="Username" allowClear />
        </Form.Item>
        <Form.Item label="Received At" name="received_at">
          <RangePicker
            presets={[
              { label: "Today", value: [dayjs(), dayjs()] },
              {
                label: "This Week",
                value: [dayjs().startOf("week"), dayjs().endOf("week")],
              },
              {
                label: "This Month",
                value: [dayjs().startOf("month"), dayjs().endOf("month")],
              },
            ]}
            placeholder={["Start Date", "End Date"]}
          />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <Input placeholder="Content" allowClear />
        </Form.Item>
        <Button type="primary" block htmlType="submit">
          Apply
        </Button>
      </Form>
    );
  }, [form, providers, onApplyFilter]);

  useEffect(() => {
    messageStore.onListMessages(MessageURL.list);
    providerStore.onList(ProviderURL.list);
    onCheckLocalInterval();
    return () => {
      messageStore.onReset();
    };
  }, [messageStore, providerStore, onCheckLocalInterval]);

  return (
    <Content>
      <Header title="Messages" />
      <Page title="Messages">
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
              <Dropdown
                menu={{
                  items: refreshItems,
                  selectable: true,
                  onSelect: onSelectedRefreshInterval,
                }}
              >
                <Button
                  icon={<ReloadOutlined />}
                >{`Refresh Every ${refreshInterval.label}`}</Button>
              </Dropdown>
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
                // onChange: onPaginationChanged,
              }}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Page>
    </Content>
  );
};

export default memo(observer(MessagePage));
