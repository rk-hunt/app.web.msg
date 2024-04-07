import { Form } from "antd";
import { memo, useMemo } from "react";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "input" | "select" | "datepicker";
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = useMemo(() => {
    if (inputType === "input") {
      return (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          {inputNode}
        </Form.Item>
      );
    }
  }, [inputType, dataIndex]);

  return <td {...restProps}>{inputNode}</td>;
};

export default memo(EditableCell);
