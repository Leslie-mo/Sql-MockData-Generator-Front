import ReportModal from '@/components/ReportModal';
import {deleteFieldInfo, generateCreateFieldSql,} from '@/services/fieldInfoService';
import {useModel} from '@umijs/max';
import {Button, Descriptions, Divider, List, message, Popconfirm, Space, Tag, Typography,} from 'antd';
import {PaginationConfig} from 'antd/es/pagination';
import copy from 'copy-to-clipboard';
import React, {useState} from 'react';
import './index.less';

interface Props {
    pagination: PaginationConfig;
    loading?: boolean;
    showTag?: boolean;
    dataList: FieldInfoType.FieldInfo[];
    onImport?: (values: FieldInfoType.FieldInfo) => void;
}

/**
 * 表信息列表
 *
 * @constructor
 *
 */
const FieldInfoList: React.FC<Props> = (props) => {
    const {dataList, pagination, loading, showTag = true, onImport} = props;
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportedId, setReportedId] = useState(0);

    const {initialState} = useModel('@@initialState');
    const loginUser = initialState?.loginUser;

    /**
     * 删除节点
     * @param id
     */
    const doDelete = async (id: number) => {
        const hide = message.loading('正在删除');
        if (!id) return true;
        try {
            await deleteFieldInfo({
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
        <div className="field-info-list">
            <List<FieldInfoType.FieldInfo>
                itemLayout="vertical"
                size="large"
                loading={loading}
                pagination={pagination}
                dataSource={dataList}
                renderItem={(item, index) => {
                    const content: Field = JSON.parse(item.content);
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
                                            {showTag && item.reviewStatus === 1 && (
                                                <Tag color="success">公开</Tag>
                                            )}
                                            {item.userId === 1 && <Tag color="gold">官方</Tag>}
                                        </div>
                                    </Space>
                                }
                                column={3}
                            >
                                <Descriptions.Item label="Field Name">
                                    {content.fieldName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Type">
                                    {content.fieldType ?? 'none'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Comment">
                                    {content.comment ?? 'none'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Default">
                                    {content.defaultValue ?? 'none'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Self-increment">
                                    {content.autoIncrement ? 'yes' : 'no'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Primary key">
                                    {content.primaryKey ? 'yes' : 'no'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Non Empty">
                                    {content.notNull ? 'yes' : 'no'}
                                </Descriptions.Item>
                                <Descriptions.Item label="onUpdate">
                                    {content.onUpdate ?? 'none'}
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
                                        generateCreateFieldSql(item.id)
                                            .then((res) => {
                                                copy(res.data);
                                                message.success('COPY CREATE FIELD SQL SUCCESSFUL');
                                            })
                                            .catch((e) => {
                                                message.error('COPY FAIL，' + e.message);
                                            });
                                    }}
                                >

                                </Button>

                                {loginUser && loginUser.id === item.userId && (
                                    <Popconfirm
                                        title="Are you sure you want to delete?"
                                        onConfirm={() => {
                                            doDelete(item.id);
                                        }}
                                    >
                                        <Button type="text" danger>
                                            Delete
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

export default FieldInfoList;
