import {addTableInfo} from '@/services/tableInfoService';
import {ProColumns, ProTable} from '@ant-design/pro-components';
import {message, Modal} from 'antd';
import React, {PropsWithChildren} from 'react';

interface Props {
    modalVisible: boolean;
    initialValues?: TableInfoType.TableInfo;
    onSubmit: () => void;
    onCancel: () => void;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableInfoType.TableInfo) => {
    const hide = message.loading('Adding now');
    try {
        await addTableInfo({...fields} as TableInfoType.TableInfoAddRequest);
        hide();
        message.success('Added successfully!');
        return true;
    } catch (e: any) {
        hide();
        message.error('Add failed，' + e.message);
        return false;
    }
};

/**
 * 创建数据模态框
 * @param props
 * @constructor
 */
const TableInfoCreateModal: React.FC<PropsWithChildren<Props>> = (props) => {
    const {modalVisible, initialValues, onSubmit, onCancel} = props;

    /**
     * 表格列配置
     */
    const columns: ProColumns<TableInfoType.TableInfo>[] = [
        {
            title: 'Table name',
            dataIndex: 'name',
            formItemProps: {
                rules: [{required: true}],
            },
            fieldProps: {
                autoFocus: true,
                placeholder: 'Please enter the table name',
            }
        },
        {
            title: 'Table configuration',
            dataIndex: 'content',
            valueType: 'textarea',
        },
    ];

    return (
        <Modal
            destroyOnClose
            title="Save table configuration (can be directly imported later)"
            open={modalVisible}
            onCancel={() => onCancel()}
            footer={null}
        >
            <ProTable<TableInfoType.TableInfo, TableInfoType.TableInfo>
                form={{
                    initialValues,
                    submitter: {
                        render: (props, dom) => [...dom.reverse()],

                    },
                }}

                onSubmit={async (value) => {
                    const success = await handleAdd(value);
                    if (success) {
                        onSubmit?.();
                    }
                }}
                rowKey="id"
                type="form"
                columns={columns}
            />

        </Modal>
    );
};

export default TableInfoCreateModal;
