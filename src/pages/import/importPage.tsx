import { memo, useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import * as XLSX from "xlsx";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Layout,
  Row,
  Select,
  Table,
  Upload,
  message,
} from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Header, Page } from "../../components";
import {
  ImportExportExtension,
  ImportExportConfig,
  importFileType,
  importServerColumns,
  importChannelColumns,
  importProviderColumns,
  importWeightColumns,
  importBlacklistColumns,
} from "../../constants";
import useStores from "../../stores";

const { Content } = Layout;

const ImportPage: React.FC = () => {
  const { baseStore, serverStore } = useStores();
  const { isImporting, importData } = baseStore;

  const [form] = Form.useForm<any>();
  const [configuration, setConfiguration] = useState(
    ImportExportConfig.Providers
  );

  const onSelectConfiguration = useCallback(
    (value: any) => {
      setConfiguration(value);
      baseStore.setImportData([]);
    },
    [baseStore]
  );

  const tableColumns = useMemo(() => {
    switch (configuration) {
      case ImportExportConfig.Providers:
        return importProviderColumns;
      case ImportExportConfig.Servers:
        return importServerColumns;
      case ImportExportConfig.Channels:
        return importChannelColumns;
      case ImportExportConfig.Weights:
        return importWeightColumns;
      case ImportExportConfig.Blacklist:
        return importBlacklistColumns;
      default:
        return [];
    }
  }, [configuration]);

  const beforeUpload = useCallback(
    (file: File) => {
      if (![importFileType.csv, importFileType.xlsx].includes(file.type)) {
        message.error(`${file.name} is not support file`);
        return false;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(event.target?.result as any);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0 });
        console.log("jsonData: ", jsonData);
        baseStore.setImportData(jsonData);
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    [baseStore]
  );

  const onImport = useCallback(() => {
    switch (configuration) {
      case ImportExportConfig.Providers:
        break;
      case ImportExportConfig.Servers:
        serverStore.onImportServer(importData);
        break;
      default:
        break;
    }
  }, [configuration, importData, serverStore]);

  return (
    <Content>
      <Header title="Imports" />
      <Page title="Imports">
        <Row gutter={32}>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Card style={{ width: "100%" }}>
              <Row gutter={32}>
                <Col span={8}>
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
                        placeholder="Select import configuration"
                        onSelect={onSelectConfiguration}
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
                  </Form>
                </Col>
                <Col span={8}>
                  <Upload
                    beforeUpload={beforeUpload}
                    accept={`${importFileType.csv},${importFileType.xlsx}`}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />} style={{ marginTop: 30 }}>
                      Click to Upload
                    </Button>
                  </Upload>
                </Col>
                <Col span={8}>
                  <Flex justify="end">
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      loading={isImporting}
                      disabled={importData.length <= 0}
                      style={{ marginTop: 30 }}
                      onClick={onImport}
                    >
                      Import
                    </Button>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Table
              rowKey="_id"
              columns={tableColumns}
              dataSource={importData}
              pagination={false}
            />
          </Col>
        </Row>
      </Page>
    </Content>
  );
};

export default memo(observer(ImportPage));
