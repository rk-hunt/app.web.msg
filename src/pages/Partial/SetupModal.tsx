import { Form, Modal } from "antd";
import React, { memo, useCallback } from "react";

type SetupModalProps = {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
};

const SetupModal: React.FC<React.PropsWithChildren<SetupModalProps>> = ({
  title,
  visible,
  onCancel,
  onSave,
  children,
}) => {
  const [form] = Form.useForm<any>();

  const _onSave = useCallback(() => {
    form
      .validateFields()
      .then((values: any) => {
        onSave(values);
      })
      .catch((err) => {});
  }, [form, onSave]);

  return (
    <Modal
      title={title}
      width={450}
      centered
      closable={false}
      open={visible}
      onCancel={onCancel}
      onOk={_onSave}
      okText="Save"
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
