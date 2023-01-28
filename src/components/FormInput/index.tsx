import FieldInfoCreateModal from '@/components/FieldInfoModal/FieldInfoCreateModal';
import ImportFieldDrawer from '@/components/ImportFieldDrawer';
import TableInfoCreateModal from '@/components/TableInfoModal/TableInfoCreateModal';
import {
  COMMON_FIELD_LIST,
  DEFAULT_ADD_FIELD,
  FIELD_TYPE_LIST,
  MOCK_PARAMS_RANDOM_TYPE_LIST,
  MOCK_TYPE_LIST,
  ON_UPDATE_LIST,
} from '@/constants';
import {DownOutlined, PlusOutlined, UpOutlined} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
} from 'antd';
import copy from 'copy-to-clipboard';
import React, {forwardRef, useImperativeHandle, useState,} from 'react';
import './index.less';

const {Option} = Select;

interface Props {
    onSubmit: (values: TableSchema) => void;
    ref: any;
}

/**
 * 表单输入
 * @constructor
 */
const FormInput: React.FC<Props> = forwardRef((props, ref) => {
    const {onSubmit} = props;
    const [form] = Form.useForm();
    const [dictList, setDictList] = useState<DictType.Dict[]>([]);
    const [fieldInfoCreateModalVisible, setFieldInfoCreateModalVisible] =
        useState(false);
    const [tableInfoCreateModalVisible, setTableInfoCreateModalVisible] =
        useState(false);
    const [createFieldInfo, setCreateFieldInfo] =
        useState<FieldInfoType.FieldInfo>();
    const [createTableInfo, setCreateTableInfo] =
        useState<TableInfoType.TableInfo>();
    const [importFieldDrawerVisible, setImportFieldDrawerVisible] =
        useState(false);
    // 导入字段的位置
    const [importIndex, setImportIndex] = useState(0);
    // 字段折叠面板展开的键
    const [activeKey, setActiveKey] = useState([]);

    const onFinish = (values: any) => {
        if (!values.fieldList || values.fieldList.length < 1) {
            message.error('Add at least 1 new field');
            return;
        }
        console.log('Received values of form:', values);
        onSubmit?.(values);
    };

    // 获取可选词库列表
    // const loadDictList = () => {
    //   listMyDict({})
    //     .then((res) => {
    //       setDictList(res.data);
    //     })
    //     .catch((e) => {
    //       message.error('加载词库失败，' + e.message);
    //     });
    // };
    //
    // useEffect(() => {
    //   loadDictList();
    // }, []);

    // 供父组件调用
    useImperativeHandle(ref, () => ({
        setFormValues: (tableSchema: TableSchema) => {
            form.setFieldsValue(tableSchema);
        },
    }));

    /**
     * 字段类型选项
     */
    const fieldTypeOptions = FIELD_TYPE_LIST.map((field) => {
        return {
            label: field,
            value: field,
        };
    });

    /**
     * 字段类型选项
     */
    const onUpdateOptions = ON_UPDATE_LIST.map((field) => {
        return {
            label: field,
            value: field,
        };
    });

    /**
     * AutoComplete 过滤函数
     * @param inputValue
     * @param option
     */
    const filterOption = (inputValue: string, option: any) =>
        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

    return (
        <>
            <Form<TableSchema>
                className="form-input"
                form={form}
                scrollToFirstError
                onFinish={onFinish}
                onReset={() => {
                    form.resetFields(['fieldList']);
                }}
            >
                <Form.Item name="dbName" label="Database Name">
                    <Input placeholder="Enter database name"/>
                </Form.Item>
                <Form.Item
                    name="tableName"
                    label="Table Name"
                    initialValue="test_table"
                    rules={[{required: true}]}
                >
                    <Input placeholder="Enter table name"/>
                </Form.Item>
                <Form.Item name="tableComment" label="Table Comment">
                    <Input placeholder="Enter table comment"/>
                </Form.Item>
                <Form.Item
                    label="Generate Number"
                    name="mockNum"
                    initialValue={20}
                    rules={[{required: true}]}
                >
                    <InputNumber min={10} max={100}/>
                </Form.Item>
                <Form.List name="fieldList">
                    {(fields, {add, remove, move}) => (
                        <>
                            <Collapse
                                activeKey={activeKey}
                                onChange={(key) => {
                                    setActiveKey(key as []);
                                }}
                            >
                                {fields.map((field, index) => (
                                    <Collapse.Panel
                                        key={field.key}
                                        header={
                                            <Form.Item
                                                style={{maxWidth: 320, marginBottom: 0}}
                                                label="Field Name"
                                                requiredMark="optional"
                                                name={[field.name, 'fieldName']}
                                                rules={[{required: true}]}
                                            >
                                                <Input placeholder="Enter field name"/>
                                            </Form.Item>
                                        }
                                        extra={
                                            <Space className="field-toolbar">
                                                {index > 0 && (
                                                    <Button
                                                        type="text"
                                                        onClick={(e) => {
                                                            move(index, index - 1);
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <UpOutlined/>
                                                    </Button>
                                                )}
                                                {index < fields.length - 1 && (
                                                    <Button
                                                        type="text"
                                                        onClick={(e) => {
                                                            move(index, index + 1);
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <DownOutlined/>
                                                    </Button>
                                                )}

                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={(e) => {
                                                        remove(field.name);
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </Space>
                                        }
                                    >
                                        <Space key={field.key} align="baseline" wrap size={[24, 0]}>
                                            <Form.Item
                                                label="Field Type"
                                                name={[field.name, 'fieldType']}
                                                rules={[{required: true}]}
                                            >
                                                <AutoComplete
                                                    style={{width: 120}}
                                                    placeholder="Enter field type"
                                                    options={fieldTypeOptions}
                                                    filterOption={filterOption}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Default Value"
                                                name={[field.name, 'defaultValue']}
                                            >
                                                <Input placeholder="Enter default value"/>
                                            </Form.Item>
                                            <Form.Item label="Comment" name={[field.name, 'comment']}>
                                                <Input placeholder="Enter comment"/>
                                            </Form.Item>
                                            <Form.Item
                                                label="onUpdate"
                                                name={[field.name, 'onUpdate']}
                                            >
                                                <AutoComplete
                                                    style={{width: 180}}
                                                    placeholder="Whether is onUpdate"
                                                    options={onUpdateOptions}
                                                    filterOption={filterOption}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Not Null"
                                                name={[field.name, 'notNull']}
                                                valuePropName="checked"
                                            >
                                                <Checkbox/>
                                            </Form.Item>
                                            <Form.Item
                                                label="IsPrimaryKey"
                                                name={[field.name, 'primaryKey']}
                                                valuePropName="checked"
                                            >
                                                <Checkbox/>
                                            </Form.Item>
                                            <Form.Item
                                                label="AutoIncrement"
                                                name={[field.name, 'autoIncrement']}
                                                valuePropName="checked"
                                            >
                                                <Checkbox/>
                                            </Form.Item>
                                            <Form.Item
                                                label="Mock Type"
                                                name={[field.name, 'mockType']}
                                                initialValue="Fixed"
                                            >
                                                <Select
                                                    style={{width: 120}}
                                                    onChange={() => {
                                                        form.setFieldValue(
                                                            ['fieldList', index, 'mockParams'],
                                                            '',
                                                        );
                                                    }}
                                                >
                                                    {MOCK_TYPE_LIST.map((item) => (
                                                        <Option key={item} value={item}>
                                                            {item}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, curValues) => {
                                                    return (
                                                        prevValues.fieldList[index]?.mockType !==
                                                        curValues.fieldList[index]?.mockType
                                                    );
                                                }}
                                            >
                                                {(value) => {
                                                    const mockType =
                                                        value.getFieldsValue().fieldList[index].mockType;
                                                    if (mockType === 'Fixed') {
                                                        return (
                                                            <Form.Item
                                                                label="Fixed value"
                                                                name={[field.name, 'mockParams']}
                                                            >
                                                                <Input placeholder="Please input fixed value"/>
                                                            </Form.Item>
                                                        );
                                                    } else if (mockType === 'Random') {
                                                        return (
                                                            <Form.Item
                                                                label="Random Rule"
                                                                name={[field.name, 'mockParams']}
                                                            >
                                                                <Select style={{width: 120}}>
                                                                    {MOCK_PARAMS_RANDOM_TYPE_LIST.map((item) => (
                                                                        <Option key={item} value={item}>
                                                                            {item}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                        );
                                                    } else if (mockType === 'Rule') {
                                                        return (
                                                            <Form.Item
                                                                label="Rule"
                                                                name={[field.name, 'mockParams']}
                                                                rules={[{required: true}]}
                                                            >
                                                                <Input placeholder="Enter regular expression"/>
                                                            </Form.Item>
                                                        );
                                                    } else if (mockType === 'Increase') {
                                                        return (
                                                            <Form.Item
                                                                label="Starting Value"
                                                                name={[field.name, 'mockParams']}
                                                                rules={[{required: true}]}
                                                            >
                                                                <InputNumber/>
                                                            </Form.Item>
                                                        );
                                                    } else if (mockType === '词库') {
                                                        return (
                                                            <Form.Item
                                                                label="词库"
                                                                name={[field.name, 'mockParams']}
                                                            >
                                                                <Select
                                                                    style={{width: 150}}
                                                                    showSearch
                                                                    dropdownRender={(menu) => (
                                                                        <>
                                                                            {menu}
                                                                            <Divider style={{margin: '8px 0'}}/>
                                                                            <Space
                                                                                align="center"
                                                                                size={24}
                                                                                style={{
                                                                                    marginLeft: 8,
                                                                                }}
                                                                            >
                                                                                <Button
                                                                                    size="small"
                                                                                    onClick={() => {
                                                                                        window.open('/dict/add');
                                                                                    }}
                                                                                >
                                                                                    创建
                                                                                </Button>
                                                                                <Button
                                                                                    size="small"
                                                                                    // onClick={() => {
                                                                                    //   loadDictList();
                                                                                    // }}
                                                                                >
                                                                                    刷新
                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                >
                                                                    {dictList.map((item) => (
                                                                        <Option key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                        );
                                                    }
                                                    return <></>;
                                                }}
                                            </Form.Item>
                                        </Space>
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                            <Form.Item>
                                <Space
                                    direction="vertical"
                                    style={{width: '100%', marginTop: 16}}
                                >
                                    <Button
                                        type="dashed"
                                        onClick={() => add(DEFAULT_ADD_FIELD)}
                                        block
                                        icon={<PlusOutlined/>}
                                    >
                                        New Field
                                    </Button>
                                    {/*<Button*/}
                                    {/*  type="dashed"*/}
                                    {/*  onClick={() => {*/}
                                    {/*    setImportIndex(*/}
                                    {/*      form.getFieldsValue().fieldList?.length ?? 0,*/}
                                    {/*    );*/}
                                    {/*    setImportFieldDrawerVisible(true);*/}
                                    {/*  }}*/}
                                    {/*  block*/}
                                    {/*  icon={<PlusOutlined />}*/}
                                    {/*>*/}
                                    {/*  导入字段*/}
                                    {/*</Button>*/}
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            COMMON_FIELD_LIST.forEach((field) => {
                                                add(field);
                                            });
                                        }}
                                        block
                                        icon={<PlusOutlined/>}
                                    >
                                        New General Field
                                    </Button>
                                </Space>
                            </Form.Item>
                            <ImportFieldDrawer
                                onImport={(fieldInfo) => {
                                    add(JSON.parse(fieldInfo.content), importIndex);
                                    setImportFieldDrawerVisible(false);
                                    message.success('Import successfully!');
                                }}
                                visible={importFieldDrawerVisible}
                                onClose={() => setImportFieldDrawerVisible(false)}
                            />
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Space size="large" wrap>
                        <Button type="primary" htmlType="submit" >
                            One-Click Generation
                        </Button>
                        <Button
                            onClick={() => {
                                const fieldList = form.getFieldsValue().fieldList;
                                if (!fieldList || fieldList.length < 1) {
                                    message.error('Add at least 1 field');
                                    return;
                                }
                                const values = form.getFieldsValue();
                                setCreateTableInfo({
                                    name: values.tableComment,
                                    content: JSON.stringify(values),
                                } as TableInfoType.TableInfo);
                                setTableInfoCreateModalVisible(true);
                            }}
                        >
                            Save Table
                        </Button>
                        <Button
                            onClick={() => {
                                copy(JSON.stringify(form.getFieldsValue()));
                                message.success('Copied to clipboard');
                            }}
                        >
                            Copy Configuration
                        </Button>
                        <Button htmlType="reset" >Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
            <TableInfoCreateModal
                modalVisible={tableInfoCreateModalVisible}
                initialValues={createTableInfo}
                onSubmit={() => setTableInfoCreateModalVisible(false)}
                onCancel={() => setTableInfoCreateModalVisible(false)}
            />
            <FieldInfoCreateModal
                modalVisible={fieldInfoCreateModalVisible}
                initialValues={createFieldInfo}
                onSubmit={() => setFieldInfoCreateModalVisible(false)}
                onCancel={() => setFieldInfoCreateModalVisible(false)}
            />
        </>
    );
});

export default FormInput;
