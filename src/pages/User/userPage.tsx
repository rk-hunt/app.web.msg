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
  Select,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import useStores from "../../stores";
import { Header, Page } from "../../components";
import { UserURL, datetimeFormat, UserStatus } from "../../constants";
import SetupModal from "../Partial/SetupModal";
import { UserFilterBy, User, WeightInfo } from "../../types";
import Filter from "../Partial/Filter";

const { Content } = Layout;

const UserPage: React.FC = () => {
  const { userStore } = useStores();
  const { data, isFetching, pageContext, isSaving } = userStore;

  const [visibleModal, setVisibleModal] = useState(false);

  const onOpenModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [visibleModal]);

  const onApplyFilter = useCallback(
    (values: any) => {
      const filter: UserFilterBy = {
        ...userStore.filterBy,
        ...values,
      };

      userStore.setFilterBy(filter);
      userStore.onList(UserURL.list, filter);
    },
    [userStore]
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
      userStore.onSave(UserURL.base, info, onSaved.bind(null, onReset));
    },
    [userStore, onSaved]
  );

  const onUpdateStatus = useCallback(
    (id: string, status: UserStatus) => {
      return new Promise(async (resolve, rejects) => {
        const response = await userStore.onUpdateUserStatus(id, status);
        if (response) {
          resolve("success");
          onApplyFilter({});
          return;
        }
        rejects("error");
      }).catch(() => {
        return "error";
      });
    },
    [userStore, onApplyFilter]
  );

  const onConfirmUpdate = useCallback(
    (user: User) => {
      const userStatus =
        user.status === UserStatus.Active
          ? UserStatus.Inactive
          : UserStatus.Active;

      Modal.confirm({
        title: "Update User Status",
        content: `Do you want to update user ${user.name} status to ${userStatus}?`,
        onOk: () => onUpdateStatus(user._id as string, userStatus),
        centered: true,
        okText: "Yes",
        cancelText: "No",
      });
    },
    [onUpdateStatus]
  );

  const onPaginationChanged = useCallback(
    (page: number, _: number) => {
      userStore.onList(UserURL.list, userStore.filterBy, page);
    },
    [userStore]
  );

  const tableColumns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Admin",
        dataIndex: "is_admin",
        render: (isAdmin: boolean) => {
          return isAdmin === true ? "Yes" : "No";
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => {
          return (
            <Tag
              bordered={false}
              color={status === UserStatus.Active ? "success" : "error"}
            >
              {status}
            </Tag>
          );
        },
      },
      {
        title: "Last Login At",
        dataIndex: "last_login_at",
        render: (value: number) => {
          return value === 0 ? "-" : dayjs(value).format(datetimeFormat);
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
        render: (_: any, record: User) => {
          return (
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={onConfirmUpdate.bind(null, record)}
            />
          );
        },
      },
    ];

    return columns;
  }, [onConfirmUpdate]);

  useEffect(() => {
    userStore.onList(UserURL.list);
    return () => {
      userStore.onReset();
    };
  }, [userStore]);

  return (
    <Content>
      <Header
        title="Users"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={onOpenModal}>
            New User
          </Button>
        }
      />
      <Page title="Users">
        <Row>
          <Col span={24}>
            <Filter onFilter={onApplyFilter}>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item label="Email" name="email">
                    <Input placeholder="email@token.info" allowClear />
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
        title="New User"
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
          <Input placeholder="Professor" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "" }]}
        >
          <Input placeholder="email@token.info" />
        </Form.Item>
        <Form.Item
          label="Is Admin"
          name="is_admin"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            placeholder="Yes"
            options={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
          />
        </Form.Item>
      </SetupModal>
    </Content>
  );
};

export default memo(observer(UserPage));
