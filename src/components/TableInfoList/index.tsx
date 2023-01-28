import ReportModal from '@/components/ReportModal';
import {deleteTableInfo, generateCreateTableSql,} from '@/services/tableInfoService';
import {useModel} from '@umijs/max';
import {Button, Descriptions, Divider, List, message, Popconfirm, Space, Typography,} from 'antd';
import {PaginationConfig} from 'antd/es/pagination';
import copy from 'copy-to-clipboard';
import React, {useState} from 'react';
import './index.less';

interface Props {
    pagination: PaginationConfig;
    loading?: boolean;
    dataList: TableInfoType.TableInfo[];
    showTag?: boolean;
    onImport?: (values: TableInfoType.TableInfo) => void;
}

/**
 * 表信息列表
 *
 * @constructor
 *
 */
const TableInfoList: React.FC<Props> = (props) => {
    const {dataList, pagination, loading, showTag = true, onImport} = props;
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportedId, setReportedId] = useState(0);

    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    /**
     *  删除节点
     * @param id
     */
    const doDelete = async (id: number) => {
        const hide = message.loading('正在删除');
        if (!id) return true;
        try {
            await deleteTableInfo({
                id,
            });
            message.success('操作成功');
        } catch (e: any) {
            message.error('操作失败，' + e.message);
        } finally {
            hide();
        }
    };

    return (
        <div className="table-info-list">
            <List<TableInfoType.TableInfo>
                itemLayout="vertical"
                size="large"
                loading={loading}
                pagination={pagination}
                dataSource={dataList}
                renderItem={(item, index) => {
                    const content: TableSchema = JSON.parse(item.content);
                    return (
                        <List.Item
                            key={index}
                            extra={
                                onImport && (
                                    <Button
                                        onClick={() => {
                                            onImport(item);
                                        }}
                                    >
                                        Import
                                    </Button>
                                )
                            }
                        >
                            <Descriptions
                                title={
                                    <Space align="center">
                                        <div>{item.name}</div>
                                        <div>
                                            {showTag && item.reviewStatus === 1}
                                            {item.userId === 1}
                                        </div>
                                    </Space>
                                }
                                column={2}
                            >
                                <Descriptions.Item label="Table name">
                                    {content.tableName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Table comment">
                                    {content.tableComment ?? 'none'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Field list">
                                    {content.fieldList.map((field) => field.fieldName).join(', ')}
                                </Descriptions.Item>
                            </Descriptions>
                            <Space
                                split={<Divider type="vertical"/>}
                                style={{fontSize: 14}}
                            >
                                <Typography.Text type="secondary">
                                    {item.createTime.toString().split('T')[0]}
                                </Typography.Text>
                                <Button
                                    type="text"
                                    onClick={() => {
                                        generateCreateTableSql(item.id)
                                            .then((res) => {
                                                copy(res.data);
                                                message.success('Copy create table SQL successfully!');
                                            })
                                            .catch((e) => {
                                                message.error('Copy failed，' + e.message);
                                            });
                                    }}
                                >
                                    copy statement
                                </Button>

                                {(
                                    <Popconfirm
                                        title="Are you sure you want to delete？"
                                        onConfirm={() => {
                                            doDelete(item.id);
                                        }}
                                    >
                                        <Button type="text" danger>
                                            delete
                                        </Button>
                                    </Popconfirm>
                                )}
                            </Space>
                        </List.Item>
                    );
                }}
            />
            <ReportModal
                visible={reportModalVisible}
                reportedId={reportedId}
                onClose={() => {
                    setReportModalVisible(false);
                }}
            />
        </div>
    );
};

export default TableInfoList;
