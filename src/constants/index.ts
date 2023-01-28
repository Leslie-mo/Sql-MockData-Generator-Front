/**
 * 字段类型列表
 */
export const FIELD_TYPE_LIST = [
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'bigint',
    'float',
    'double',
    'decimal',
    'date',
    'time',
    'year',
    'datetime',
    'timestamp',
    'char',
    'varchar',
    'tinytext',
    'text',
    'mediumtext',
    'longtext',
    'tinyblob',
    'blob',
    'mediumblob',
    'longblob',
    'binary',
    'varbinary',
];

/**
 * onUpdate 值列表
 */
export const ON_UPDATE_LIST = ['CURRENT_TIMESTAMP'];

/**
 * 默认添加的字段信息
 */
export const DEFAULT_ADD_FIELD: Field = {
    fieldName: 'username',
    comment: 'user name',
    defaultValue: undefined,
    fieldType: 'varchar(256)',
    mockType: 'Random',
    mockParams: 'Person name',
    notNull: true,
    primaryKey: false,
    autoIncrement: false,
};

/**
 * 通用字段列表
 */
export const COMMON_FIELD_LIST: Field[] = [
    {
        fieldName: 'id',
        comment: 'primary key',
        defaultValue: undefined,
        fieldType: 'bigint',
        mockType: 'None',
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
    },
    {
        fieldName: 'create_time',
        comment: 'create time',
        defaultValue: 'CURRENT_TIMESTAMP',
        fieldType: 'datetime',
        mockType: 'None',
        notNull: true,
        primaryKey: false,
        autoIncrement: false,
    },
    {
        fieldName: 'update_time',
        comment: 'update time',
        defaultValue: 'CURRENT_TIMESTAMP',
        fieldType: 'datetime',
        mockType: 'None',
        notNull: true,
        primaryKey: false,
        autoIncrement: false,
        onUpdate: 'CURRENT_TIMESTAMP',
    },
    {
        fieldName: 'is_deleted',
        comment: 'Whether is deleted (0-not deleted, 1-deleted)',
        defaultValue: '0',
        fieldType: 'tinyint',
        mockType: 'None',
        notNull: true,
        primaryKey: false,
        autoIncrement: false,
    },
];

/**
 * 模拟类型列表
 */
export const MOCK_TYPE_LIST = ['Fixed', 'Random', 'Increase', 'Rule', 'None'];

/**
 * 模拟参数随机生成类型列表
 */
export const MOCK_PARAMS_RANDOM_TYPE_LIST = [
    'String',
    'Integer',
    'Decimal',
    'Date',
    'Timestamp',
    'URL',
    'IP',
    'Email',
    'Phone number',
    'Person name',
    'City',
    'University',
];

/**
 * 审核状态枚举
 */
export const REVIEW_STATUS_ENUM = {
    0: {
        text: '待审核',
    },
    1: {
        text: '通过',
    },
    2: {
        text: '拒绝',
    },
};
