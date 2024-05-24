import { memo, useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import { HighlightOutlined, ReloadOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import {
  ChannelURL,
  MessageURL,
  ProviderType,
  ProviderURL,
  ServerURL,
  dateFormat,
  datetimeFormat,
  highlightContentItems,
  localStorageKey,
  providerLink,
  refreshItems,
} from "../../constants";
import { Message, MessageFilterBy, MessageHighlightContent } from "../../types";
import Markdown from "react-markdown";
import { sortByBuilder } from "../../utils";
import Filter from "../Partial/Filter";
import { debounce } from "lodash";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const MessagePage: React.FC = () => {
  const { messageStore, providerStore, serverStore, channelStore } =
    useStores();
  const { data: providers, isFetching: isFetchingProvider } = providerStore;
  const { data: servers, isFetching: isFetchingServer } = serverStore;
  const { data: channels, isFetching: isFetchingChannel } = channelStore;

  const {
    data,
    isFetching,
    pageContext,
    highlightWeight,
    filterBy,
    sortBy,
    refreshInterval,
    highlightContent,
  } = messageStore;

  const onApplyFilter = useCallback(
    (values: MessageFilterBy) => {
      const { provider, servers, channels, ...value } = values;
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
        ...value,
      };
      if (provider) {
        filter.provider_id = provider.value;
      }
      if (servers) {
        filter.server_id = servers.map((server) => server.value);
      }
      if (channels) {
        filter.channel_id = channels.map((channel) => channel.value);
      }

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

  const onSelectedHighlightContent = useCallback(
    (menu: any) => {
      const highlightContentItem = highlightContentItems.find(
        (item) => item.key === parseInt(menu.key)
      );
      messageStore.setHighlightContent(
        highlightContentItem as MessageHighlightContent
      );
    },
    [messageStore]
  );

  const onCheckLocalHighlightContent = useCallback(() => {
    const highlightContent = localStorage.getItem(
      localStorageKey.msgHighlightContent
    );
    if (highlightContent) {
      messageStore.setHighlightContent(
        JSON.parse(highlightContent as string) as MessageHighlightContent
      );
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

  const onListProvider = useCallback(
    (value: string) => {
      providerStore.onList(ProviderURL.list, { name: value });
    },
    [providerStore]
  );

  const onSearchProvider = useMemo(() => {
    return debounce(onListProvider, 800);
  }, [onListProvider]);

  const onListServer = useCallback(
    (value: string) => {
      serverStore.onList(ServerURL.list, { server_name: value });
    },
    [serverStore]
  );

  const onSearchServer = useMemo(() => {
    return debounce(onListServer, 800);
  }, [onListServer]);

  const onListChannel = useCallback(
    (value: string) => {
      channelStore.onList(ChannelURL.list, { channel_name: value });
    },
    [channelStore]
  );

  const onSearchChannel = useMemo(() => {
    return debounce(onListChannel, 800);
  }, [onListChannel]);

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Provider",
        dataIndex: "provider_name",
      },
      {
        title: "Server",
        dataIndex: "server_name",
      },
      {
        title: "Channel",
        dataIndex: "channel_name",
      },
      {
        title: "Author",
        dataIndex: "author_username",
        sorter: {
          multiple: 1,
        },
      },
      {
        title: "Received At",
        dataIndex: "received_at",
        defaultSortOrder: "descend",
        sorter: {
          multiple: 2,
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
          const url =
            message.provider_type === ProviderType.Discord
              ? `${providerLink.Discord}/${message.server_id}/${message.channel_id}`
              : `${providerLink.Telegram}${message.server_id}`;

          if (message.weight >= highlightWeight) {
            return (
              <a href={url} target="_blank" rel="noreferrer">
                <mark
                  className={highlightContent.key === 1 ? "text-highlight" : ""}
                >
                  <Markdown>{message.content}</Markdown>
                </mark>
              </a>
            );
          }
          return (
            <a href={url} target="_blank" rel="noreferrer">
              <mark>
                <Markdown>{message.content}</Markdown>
              </mark>
            </a>
          );
        },
      },
    ];

    return columns;
  }, [highlightWeight, highlightContent]);

  useEffect(() => {
    onCheckLocalHighlightContent();
    messageStore.onListMessages(MessageURL.list);
    onCheckLocalInterval();
    return () => {
      messageStore.onReset();
    };
  }, [
    messageStore,
    providerStore,
    onCheckLocalInterval,
    onCheckLocalHighlightContent,
  ]);

  return (
    <Content>
      <Header
        title="Messages"
        extra={
          <div>
            <Dropdown
              menu={{
                items: highlightContentItems,
                selectable: true,
                onSelect: onSelectedHighlightContent,
              }}
            >
              <Button
                icon={<HighlightOutlined />}
                style={{ marginRight: 8 }}
              >{`Highlight Content ${highlightContent.label}`}</Button>
            </Dropdown>
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
          </div>
        }
      />
      <Page title="Messages">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Provider" name="provider">
                    <Select
                      showSearch
                      allowClear
                      filterOption={false}
                      loading={isFetchingProvider}
                      onSearch={onSearchProvider}
                      placeholder="Type to search"
                      labelInValue
                      options={providers.map((provider) => ({
                        value: provider._id,
                        label: provider.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Server" name="servers">
                    <Select
                      showSearch
                      allowClear
                      filterOption={false}
                      loading={isFetchingServer}
                      onSearch={onSearchServer}
                      mode="multiple"
                      placeholder="Type to search"
                      labelInValue
                      options={servers.map((server) => ({
                        value: server.server_id,
                        label: server.server_name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Channel" name="channels">
                    <Select
                      showSearch
                      allowClear
                      filterOption={false}
                      loading={isFetchingChannel}
                      onSearch={onSearchChannel}
                      placeholder="Type to search"
                      labelInValue
                      options={channels.map((channel) => ({
                        value: channel.channel_id,
                        label: channel.channel_name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Author" name="author_username">
                    <Input placeholder="Username" allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Received At" name="received_at">
                    <RangePicker
                      format={dateFormat}
                      presets={[
                        { label: "Today", value: [dayjs(), dayjs()] },
                        {
                          label: "This Week",
                          value: [
                            dayjs().startOf("week"),
                            dayjs().endOf("week"),
                          ],
                        },
                        {
                          label: "This Month",
                          value: [
                            dayjs().startOf("month"),
                            dayjs().endOf("month"),
                          ],
                        },
                      ]}
                      placeholder={["Start Date", "End Date"]}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Content" name="content">
                    <Input placeholder="Content" allowClear />
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
