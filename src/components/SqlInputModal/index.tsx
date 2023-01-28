import {SQL_INPUT_EXAMPLE} from '@/constants/examples';
import {getSchemaBySql} from '@/services/sqlService';
import {Button, Form, message, Modal, Space} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

interface Props {
    onSubmit: (values: TableSchema) => void;
    visible: boolean;
    onClose: () => void;
}

/**
 * 建表 SQL 输入模态框
 *
 * @constructor
 *
 */
const SqlInput: React.FC<Props> = (props) => {
    const {onSubmit, visible, onClose} = props;
    const [form] = Form.useForm();

    /**
     * sql 转为 schema
     * @param values
     */
    const onFinish = async (values: any) => {
        if (!values.sql) {
            return;
        }
        try {
            const res = await getSchemaBySql(values);
            onSubmit?.(res.data);
        } catch (e: any) {
            message.error('Import error，' + e.message);
        }
    };

    return (
        <Modal title="Import Create Table SQL" open={visible} footer={null} onCancel={onClose}>
            <Form<GenerateBySqlRequest>
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="sql"
                    label={
                        <>
                            Please enter the create table SQL：
                            <Button
                                onClick={() => form.setFieldValue('sql', SQL_INPUT_EXAMPLE)}
                            >
                                Import example
                            </Button>
                        </>
                    }
                    rules={[{required: true, message: ' Please enter the create table SQL'}]}
                >
                    <TextArea
                        placeholder="Please enter the create table SQL"
                        autoSize={{minRows: 16}}
                    />
                </Form.Item>
                <Form.Item>
                    <Space size="large">
                        <Button type="primary" htmlType="submit" style={{width: 120}}>
                            Import
                        </Button>
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SqlInput;
