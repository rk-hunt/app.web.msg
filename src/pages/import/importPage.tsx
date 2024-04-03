import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  TableColumnsType,
  Tag,
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
  ImportStatus,
  ServerURL,
  exportField,
  ChannelURL,
  WeightURL,
  BlacklistURL,
  ProviderURL,
} from "../../constants";
import useStores from "../../stores";

const { Content } = Layout;

const ImportPage: React.FC = () => {
  const { baseStore } = useStores();
  const { isImporting, getImportData } = baseStore;

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
    let cols: TableColumnsType<any> = [];
    switch (configuration) {
      case ImportExportConfig.Providers:
        cols = importProviderColumns;
        break;
      case ImportExportConfig.Servers:
        cols = importServerColumns;
        break;
      case ImportExportConfig.Channels:
        cols = importChannelColumns;
        break;
      case ImportExportConfig.Weights:
        cols = importWeightColumns;
        break;
      case ImportExportConfig.Blacklist:
        cols = importBlacklistColumns;
        break;
      default:
        cols = [];
    }

    const columns = cols.concat([
      {
        title: "Status",
        dataIndex: "status",
        render: (value: any) => {
          if (value !== undefined) {
            return (
              <Tag
                color={
                  value === ImportStatus.Valid ||
                  value === ImportStatus.Imported
                    ? "success"
                    : "error"
                }
              >
                {value}
              </Tag>
            );
          }
          return <></>;
        },
      },
      { title: "Message", dataIndex: "message" },
    ]);

    return columns;
  }, [configuration]);

  const beforeUpload = useCallback(
    (file: File) => {
      if (![importFileType.csv, importFileType.xlsx].includes(file.type)) {
        message.error(`${file.name} is not support file`);
        return false;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary", raw: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("jsonData: ", jsonData);
        baseStore.setImportData(jsonData);
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    [baseStore]
  );

  const onImport = useCallback(() => {
    let url: string = "";
    let fields: string[] = [];

    if (configuration === ImportExportConfig.Providers) {
      url = `${ProviderURL.base}/import`;
      fields = exportField.provider;
    } else if (configuration === ImportExportConfig.Servers) {
      url = `${ServerURL.base}/import`;
      fields = exportField.server;
    } else if (configuration === ImportExportConfig.Channels) {
      url = `${ChannelURL.base}/import`;
      fields = exportField.channel;
    } else if (configuration === ImportExportConfig.Weights) {
      url = `${WeightURL.base}/import`;
      fields = exportField.weight;
    } else if (configuration === ImportExportConfig.Blacklist) {
      url = `${BlacklistURL.base}/import`;
      fields = exportField.blacklist;
    }

    baseStore.onImport(url, configuration, fields);
  }, [configuration, baseStore]);

  useEffect(() => {
    return () => {
      baseStore.onReset();
    };
  }, [baseStore]);

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
                      disabled={getImportData.length <= 0}
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
              dataSource={getImportData}
              pagination={false}
            />
          </Col>
        </Row>
      </Page>
    </Content>
  );
};

export default memo(observer(ImportPage));
