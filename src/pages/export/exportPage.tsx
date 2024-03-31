import { memo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Layout,
  Radio,
  Row,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Header, Page } from "../../components";
import { ImportExportExtension, ImportExportConfig } from "../../constants";
import useStores from "../../stores";
import { getExportOption } from "../../utils";

const { Content } = Layout;

const ExportPage: React.FC = () => {
  const { baseStore } = useStores();
  const { isExporting } = baseStore;

  const [form] = Form.useForm<any>();

  const onExport = useCallback(
    (values: any) => {
      form
        .validateFields()
        .then((values: any) => {
          const option = getExportOption(values.configuration);
          baseStore.onExport(
            option.url,
            option.fields,
            values.export_ext,
            values.configuration
          );
        })
        .catch((err) => {});
    },
    [form, baseStore]
  );

  return (
    <Content>
      <Header title="Exports" />
      <Page title="Exports">
        <Row justify="center">
          <Col sm={12} md={10} lg={10} xl={8}>
            <Card style={{ width: "100%" }}>
              <Row>
                <Col span={24} style={{ marginTop: 12, marginBottom: 16 }}>
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      export_ext: ImportExportExtension.csv,
                      configuration: "Providers",
                    }}
                  >
                    <Form.Item
                      name="configuration"
                      label="Configuration"
                      rules={[{ required: true, message: "" }]}
                    >
                      <Select
                        placeholder="Select export configuration"
                        options={[
                          {
                            value: ImportExportConfig.Providers,
                            label: ImportExportConfig.Providers,
                          },
                          {
                            value: ImportExportConfig.Servers,
                            label: ImportExportConfig.Servers,
                          },
                          {
                            value: ImportExportConfig.Channels,
                            label: ImportExportConfig.Channels,
                          },
                          {
                            value: ImportExportConfig.Weights,
                            label: ImportExportConfig.Weights,
                          },
                          {
                            value: ImportExportConfig.Blacklist,
                            label: ImportExportConfig.Blacklist,
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="export_ext"
                      label="Export As"
                      rules={[{ required: true, message: "" }]}
                    >
                      <Radio.Group>
                        <Flex vertical>
                          <Radio
                            value={ImportExportExtension.csv}
                            style={{ paddingBottom: 8 }}
                          >
                            CSV (Comma Separated Value)
                          </Radio>
                          <Radio value={ImportExportExtension.xlsx}>
                            XLSX (Microsoft Excel)
                          </Radio>
                        </Flex>
                      </Radio.Group>
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={24}>
                  <Flex justify="end">
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      loading={isExporting}
                      onClick={onExport}
                    >
                      Export
                    </Button>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Page>
    </Content>
  );
};

export default memo(observer(ExportPage));
