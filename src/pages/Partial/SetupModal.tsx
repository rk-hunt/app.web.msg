import { Form, Modal } from "antd";
import React, { memo, useCallback, useEffect } from "react";
import { ActionType } from "../../constants";

type SetupModalProps = {
  title: string;
  visible: boolean;
  isSaving: boolean;
  actionType?: ActionType;
  data?: any;
  onCancel: () => void;
  onSave: (values: any, callback: () => void) => void;
};

const SetupModal: React.FC<React.PropsWithChildren<SetupModalProps>> = ({
  title,
  visible,
  isSaving,
  actionType = ActionType.Create,
  data,
  onCancel,
  onSave,
  children,
}) => {
  const [form] = Form.useForm<any>();

  const onReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  const _onCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [onCancel, form]);

  const _onSave = useCallback(() => {
    form
      .validateFields()
      .then((values: any) => {
        onSave(values, onReset);
      })
      .catch((err) => {});
  }, [form, onSave, onReset]);

  useEffect(() => {
    if (actionType === ActionType.Update) {
      form.setFieldsValue(data);
    }
  }, [actionType, data, form]);

  return (
    <Modal
      title={title}
      width={450}
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
        name="provider_form"
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default memo(SetupModal);
