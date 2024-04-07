import { Button, Col, Divider, Form, Input, Modal, Row, Select } from "antd";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  AlertFilterDateTimeUnit,
  AlertFrequencyType,
  AlertOperator,
  AlertRuleType,
  ChannelURL,
  ProviderURL,
  ServerURL,
  alertFieldValues,
} from "../../constants";
import { observer } from "mobx-react-lite";
import useStores from "../../stores";
import { debounce } from "lodash";
import { alertFieldType, alertOperators, randomNumber } from "../../utils";
import { AlertFilterForm } from "../../types";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import message from "../../utils/message";

type AlertModalProps = {
  title: string;
  visible: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (
    values: any,
    filterForms: AlertFilterForm[],
    callback: () => void
  ) => void;
};

const defaultFilterFormValue = {
  key: randomNumber(),
  name: undefined,
  field: undefined,
  type: undefined,
  operator: undefined,
  value: undefined,
};

const FilterValue: React.FC<{
  index: number;
  filterForm: AlertFilterForm;
  onChange: (key: number, type: string, e: any) => void;
}> = ({ index, filterForm, onChange }) => {
  const { providerStore, serverStore, channelStore } = useStores();
  const { data: providers, isFetching: isFetchingProvider } = providerStore;
  const { data: servers, isFetching: isFetchingServer } = serverStore;
  const { data: channels, isFetching: isFetchingChannel } = channelStore;

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

  if (filterForm?.field === "providers") {
    return (
      <Form.Item
        label={index === 0 ? "Value" : null}
        name="value"
        initialValue={filterForm.value}
      >
        <Select
          showSearch
          allowClear
          filterOption={false}
          loading={isFetchingProvider}
          onSearch={onSearchProvider}
          mode={
            filterForm?.operator === AlertOperator.In ? "multiple" : undefined
          }
          disabled={filterForm.field === undefined}
          placeholder="Type to search providers"
          labelInValue
          options={providers.map((provider) => ({
            value: provider._id,
            label: provider.name,
          }))}
          onChange={onChange.bind(null, filterForm.key, "value")}
        />
      </Form.Item>
    );
  } else if (filterForm?.field === "servers") {
    return (
      <Form.Item
        label={index === 0 ? "Value" : null}
        name="value"
        initialValue={filterForm.value}
      >
        <Select
          showSearch
          filterOption={false}
          loading={isFetchingServer}
          onSearch={onSearchServer}
          mode={
            filterForm?.operator === AlertOperator.In ? "multiple" : undefined
          }
          disabled={filterForm.field === undefined}
          placeholder="Type to search servers"
          labelInValue
          options={servers.map((server) => ({
            value: server.server_id,
            label: server.server_name,
          }))}
          onChange={onChange.bind(null, filterForm.key, "value")}
        />
      </Form.Item>
    );
  } else if (filterForm?.field === "channels") {
    return (
      <Form.Item
        label={index === 0 ? "Value" : null}
        name="value"
        initialValue={filterForm.value}
      >
        <Select
          showSearch
          filterOption={false}
          loading={isFetchingChannel}
          onSearch={onSearchChannel}
          mode={
            filterForm?.operator === AlertOperator.In ? "multiple" : undefined
          }
          disabled={filterForm.field === undefined}
          placeholder="Type to search channels"
          labelInValue
          options={channels.map((channel) => ({
            value: channel.channel_id,
            label: channel.channel_name,
          }))}
          onChange={onChange.bind(null, filterForm.key, "value")}
        />
      </Form.Item>
    );
  } else if (filterForm?.field === "received_at") {
    return (
      <Form.Item
        label={index === 0 ? "Value" : null}
        name={randomNumber()}
        initialValue={filterForm.value?.value}
      >
        <Input
          placeholder="Value"
          onBlur={onChange.bind(null, filterForm.key, "value")}
          type="number"
          disabled={filterForm.field === undefined}
          addonAfter={
            <Select
              style={{ width: 100 }}
              defaultValue={
                filterForm.value?.unit || AlertFilterDateTimeUnit.minutes
              }
              options={[
                {
                  value: AlertFilterDateTimeUnit.minutes,
                  label: AlertFilterDateTimeUnit.minutes,
                },
                {
                  value: AlertFilterDateTimeUnit.hours,
                  label: AlertFilterDateTimeUnit.hours,
                },
                {
                  value: AlertFilterDateTimeUnit.days,
                  label: AlertFilterDateTimeUnit.days,
                },
                {
                  value: AlertFilterDateTimeUnit.months,
                  label: AlertFilterDateTimeUnit.months,
                },
              ]}
              onChange={onChange.bind(null, filterForm.key, "value")}
            />
          }
        />
      </Form.Item>
    );
  } else {
    return (
      <Form.Item
        label={index === 0 ? "Value" : null}
        name={randomNumber()}
        initialValue={filterForm.value}
      >
        <Input
          placeholder="Value"
          disabled={filterForm.field === undefined}
          onBlur={onChange.bind(null, filterForm.key, "value")}
        />
      </Form.Item>
    );
  }
};
const FilterValueField = observer(FilterValue);

const AlertModel: React.FC<AlertModalProps> = ({
  title,
  visible,
  isSaving,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm<any>();
  const [formFilter] = Form.useForm<any>();
  const [filterForms, setFilterForms] = useState<AlertFilterForm[]>([
    { ...defaultFilterFormValue },
  ]);

  const onAdd = useCallback(() => {
    const newFilterForms = filterForms.concat({
      ...defaultFilterFormValue,
      key: randomNumber(),
    });
    setFilterForms(newFilterForms);
  }, [filterForms]);
  const onRemove = useCallback(
    (key: number) => {
      if (filterForms.length > 1) {
        const updatedFilterForms = filterForms.filter(
          (filterForm) => filterForm.key !== key
        );
        setFilterForms(updatedFilterForms);
      }
    },
    [filterForms]
  );
  const onUpdate = useCallback(
    (key: number, type: string, e: any) => {
      const updatedFilterForms = filterForms.map((filterForm) => {
        if (filterForm.key === key) {
          if (type === "field") {
            const fieldType = alertFieldType(e);
            return {
              ...filterForm,
              key: randomNumber(),
              field: fieldType?.field,
              type: fieldType?.type as any,
            };
          } else if (type === "operator") {
            return {
              ...filterForm,
              key: randomNumber(),
              operator: e,
            };
          } else if (type === "value") {
            if (filterForm.field === "received_at") {
              const value = e.target
                ? { ...filterForm.value, value: e.target.value }
                : { ...filterForm.value, unit: e };

              return {
                ...filterForm,
                key: randomNumber(),
                value: value,
              };
            } else {
              return {
                ...filterForm,
                key: randomNumber(),
                value: e.target ? e.target.value : e,
              };
            }
          }
        }

        return filterForm;
      });

      console.log("updatedFilterForms: ", updatedFilterForms);
      setFilterForms(updatedFilterForms);
    },
    [filterForms]
  );

  const renderFilterForms = useMemo(() => {
    return filterForms.map((filterForm, index) => {
      return (
        <Form
          layout="vertical"
          form={formFilter}
          name={`alert_form_${filterForm.key}`}
          key={filterForm.key}
        >
          <Row gutter={32}>
            <Col span={6}>
              <Form.Item
                label={index === 0 ? `Field` : null}
                name={randomNumber()}
                initialValue={filterForm.field}
              >
                <Select
                  onChange={onUpdate.bind(null, filterForm.key, "field")}
                  placeholder="Type to search"
                  options={alertFieldValues}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={index === 0 ? `Operator` : null}
                name={randomNumber()}
                initialValue={filterForm.operator}
              >
                <Select
                  onChange={onUpdate.bind(null, filterForm.key, "operator")}
                  placeholder="Select an operator"
                  options={
                    filterForm.type
                      ? alertOperators(filterForm.type as any)
                      : []
                  }
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <FilterValueField
                index={index}
                filterForm={filterForm}
                onChange={onUpdate}
              />
            </Col>
            <Col span={2} style={{ marginTop: index === 0 ? 30 : 0 }}>
              <Button
                shape="circle"
                icon={<MinusOutlined />}
                onClick={onRemove.bind(null, filterForm.key)}
              />
            </Col>
          </Row>
        </Form>
      );
    });
  }, [filterForms, formFilter, onRemove, onUpdate]);

  const onReset = useCallback(() => {
    form.resetFields();
    setFilterForms([{ ...defaultFilterFormValue }]);
  }, [form]);

  const _onCancel = useCallback(() => {
    form.resetFields();
    setFilterForms([{ ...defaultFilterFormValue }]);
    onCancel();
  }, [onCancel, form]);

  const _onSave = useCallback(() => {
    form
      .validateFields()
      .then((values: any) => {
        if (
          filterForms.length <= 1 &&
          (filterForms[0].value === undefined || filterForms[0].value === "")
        ) {
          message.error("Filter must be configure at least one");
          return;
        }
        onSave(values, filterForms, onReset);
      })
      .catch((err) => {});
  }, [filterForms, form, onSave, onReset]);

  return (
    <Modal
      title={title}
      width="55%"
      centered
      closable={false}
      maskClosable={false}
      open={visible}
      onCancel={_onCancel}
      onOk={_onSave}
      okText="Save"
      confirmLoading={isSaving}
    >
      <Form
        layout="vertical"
        form={form}
        name="alert_form"
        style={{ paddingTop: 24 }}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "" }]}
            >
              <Input placeholder="Alert" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Frequency"
              name="frequency_type"
              rules={[{ required: true, message: "" }]}
            >
              <Select
                placeholder={AlertFrequencyType.Always}
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
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />

        <Row gutter={32}>
          <Col span={8}>
            <Form.Item label="Type" name="type">
              <Select
                placeholder={AlertRuleType.Count}
                options={[
                  {
                    value: AlertRuleType.Count,
                    label: AlertRuleType.Count,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Operator" name="operator">
              <Select
                placeholder={AlertFrequencyType.Always}
                options={[
                  {
                    value: AlertOperator.Equal,
                    label: AlertOperator.Equal,
                  },
                  {
                    value: AlertOperator.GreaterThan,
                    label: AlertOperator.GreaterThan,
                  },
                  {
                    value: AlertOperator.GreaterThanOrEqual,
                    label: AlertOperator.GreaterThanOrEqual,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Times" name="times">
              <Input placeholder="1" type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      {renderFilterForms}
      <Row>
        <Col span={24} style={{ marginTop: 24 }}>
          <Button icon={<PlusOutlined />} onClick={onAdd}>
            Add
          </Button>
        </Col>
      </Row>

      <Divider />
      {/* rules  */}
    </Modal>
  );
};

export default memo(observer(AlertModel));
