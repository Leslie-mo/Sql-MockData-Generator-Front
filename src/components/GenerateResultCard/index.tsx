import CodeEditor from '@/components/CodeEditor';
import {downloadDataExcel} from '@/services/sqlService';
import {CopyOutlined, DownloadOutlined} from '@ant-design/icons';
import {Button, Card, Collapse, Empty, message, Space, Table, Tabs,} from 'antd';
import copy from 'copy-to-clipboard';
import React from 'react';

interface Props {
    result?: GenerateVO;
    loading?: boolean;
    showCard?: boolean;
}

/**
 * 生成结果卡片
 *
 * @constructor
 *
 */
const GenerateResultCard: React.FC<Props> = (props) => {
    const {result, loading = false, showCard = true} = props;

    /**
     * 下载 excel 数据
     */
    const doDownloadDataExcel = async () => {
        if (!result) {
            return;
        }
        try {
            const res = await downloadDataExcel(result);
            // 下载文件
            const blob = new Blob([res]);
            const objectURL = URL.createObjectURL(blob);
            const btn = document.createElement('a');
            btn.download = `${result.tableSchema.tableName}_table_data.xlsx`;
            btn.href = objectURL;
            btn.click();
            URL.revokeObjectURL(objectURL);
        } catch (e: any) {
            message.error('Operation failed，' + e.message);
        }
    };

    /**
     * 生成表格列
     * @param tableSchema
     */
    const schemaToColumn = (tableSchema: TableSchema) => {
        if (!tableSchema?.fieldList) {
            return [];
        }
        return tableSchema.fieldList.map((column) => {
            return {
                title: column.fieldName,
                dataIndex: column.fieldName,
                key: column.fieldName,
            };
        });
    };

    const tabContent = result ? (
        <Tabs
            items={[
                {
                    label: `SQL`,
                    key: 'createSql',
                    children: (
                        <>
                            <Space>
                                <Button
                                    icon={<CopyOutlined/>}
                                    type="primary"
                                    onClick={(e) => {
                                        if (!result) {
                                            return;
                                        }
                                        copy(`${result.createSql}\n\n${result.insertSql}`);
                                        e.stopPropagation();
                                        message.success('Copied to clipboard');
                                    }}
                                >
                                    Copy all
                                </Button>
                            </Space>
                            <div style={{marginTop: 16}}/>
                            <Collapse defaultActiveKey={['1', '2']}>
                                <Collapse.Panel
                                    header="Create table statement"
                                    key="1"
                                    className="code-collapse-panel"
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined/>}
                                            onClick={(e) => {
                                                copy(result?.createSql);
                                                e.stopPropagation();
                                                message.success('Copied to clipboard');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    }
                                >
                                    <CodeEditor value={result.createSql} language="sql"/>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header="Insert statement"
                                    key="2"
                                    className="code-collapse-panel"
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined/>}
                                            onClick={(e) => {
                                                copy(result?.insertSql);
                                                e.stopPropagation();
                                                message.success('Copied to clipboard');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    }
                                >
                                    <CodeEditor value={result.insertSql} language="sql"/>
                                </Collapse.Panel>
                            </Collapse>
                        </>
                    ),
                },
                {
                    label: `Mock Data`,
                    key: 'mockData',
                    children: (
                        <>
                            <Space>
                                <Button
                                    icon={<DownloadOutlined/>}
                                    type="primary"
                                    onClick={() => doDownloadDataExcel()}
                                >
                                    Download Data Excel
                                </Button>
                            </Space>
                            <div style={{marginTop: 16}}/>
                            <Table
                                bordered={true}
                                dataSource={result.dataList}
                                columns={schemaToColumn(result.tableSchema)}
                            />
                        </>
                    ),
                },
                {
                    label: `JSON Data`,
                    key: 'dataJson',
                    children: (
                        <>
                            <Space>
                                <Button
                                    icon={<CopyOutlined/>}
                                    type="primary"
                                    onClick={(e) => {
                                        copy(result?.dataJson);
                                        e.stopPropagation();
                                        message.success('Copied to clipboard');
                                    }}
                                >
                                    Copy code
                                </Button>
                            </Space>
                            <div style={{marginTop: 16}}/>
                            <CodeEditor value={result.dataJson} language="json"/>
                        </>
                    ),
                },
                {
                    label: `Java Code`,
                    key: 'javaCode',
                    children: (
                        <>
                            <Collapse defaultActiveKey={['1', '2']}>
                                <Collapse.Panel
                                    header="Entity code"
                                    key="1"
                                    className="code-collapse-panel"
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined/>}
                                            onClick={(e) => {
                                                copy(result?.javaEntityCode);
                                                e.stopPropagation();
                                                message.success('Copied to clipboard');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    }
                                >
                                    <CodeEditor value={result.javaEntityCode} language="java"/>
                                </Collapse.Panel>
                                <Collapse.Panel
                                    header="Java new entity object code"
                                    key="2"
                                    className="code-collapse-panel"
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined/>}
                                            onClick={(e) => {
                                                copy(result?.javaObjectCode);
                                                e.stopPropagation();
                                                message.success('Copied to clipboard');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    }
                                >
                                    <CodeEditor value={result.javaObjectCode} language="java"/>
                                </Collapse.Panel>
                            </Collapse>
                        </>
                    ),
                },
                {
                    label: `Frontend code`,
                    key: 'frontendCode',
                    children: (
                        <>
                            <Collapse defaultActiveKey={['1']}>
                                <Collapse.Panel
                                    header="Typescript code"
                                    key="1"
                                    className="code-collapse-panel"
                                    extra={
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined/>}
                                            onClick={(e) => {
                                                copy(result?.typescriptTypeCode);
                                                e.stopPropagation();
                                                message.success('Copied to clipboard');
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    }
                                >
                                    <CodeEditor
                                        value={result.typescriptTypeCode}
                                        language="typescript"
                                    />
                                </Collapse.Panel>
                            </Collapse>
                        </>
                    ),
                },
            ]}
        />
    ) : (
        <Empty description="Please enter the configuration first and click [One-Click Generation]"/>
    );

    return showCard ? (
        <Card title="Generate Result" loading={loading}>
            {tabContent}
        </Card>
    ) : (
        tabContent
    );
};

export default GenerateResultCard;
