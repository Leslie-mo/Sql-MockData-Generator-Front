import {JSON_INPUT_EXAMPLE} from '@/constants/examples';
import {Button, Form, Modal, Space} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

interface Props {
    onSubmit: (values: TableSchema) => void;
    visible: boolean;
    onClose: () => void;
}

/**
 * JSON 配置输入模态框
 *
 * @constructor
 *
 */
const JsonInput: React.FC<Props> = (props) => {
    const {visible, onSubmit, onClose} = props;
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const tableSchema = JSON.parse(values.content);
        onSubmit?.(tableSchema);
    };

    return (
        <Modal title="Import Configuration" open={visible} footer={null} onCancel={onClose}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="content"
                    label={
                        <>
                            Please enter table structure JSON：
                            <Button
                                onClick={() =>
                                    form.setFieldValue(
                                        'content',
                                        JSON.stringify(JSON_INPUT_EXAMPLE),
                                    )
                                }
                            >
                                Import example
                            </Button>
                        </>
                    }
                    rules={[{required: true, message: 'Please enter configuration'}]}
                >
                    <TextArea
                        placeholder="Please enter the configuration JSON"
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

export default JsonInput;
