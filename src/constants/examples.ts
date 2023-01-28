/**
 * 智能导入输入示例
 */
export const AUTO_INPUT_EXAMPLE = "id，user name，create time，update time，is_deleted";

/**
 * JSON 输入示例
 */
export const JSON_INPUT_EXAMPLE = {
    dbName: 'yupi_db',
    tableName: 'user',
    tableComment: 'user name',
    fieldList: [
        {
            fieldName: 'username',
            comment: 'username',
            fieldType: 'varchar(256)',
            mockType: 'random',
            mockParams: '人名',
            notNull: true,
            primaryKey: false,
            autoIncrement: false,
        },
        {
            fieldName: 'id',
            comment: 'primary key',
            fieldType: 'bigint',
            mockType: 'fixed',
            notNull: true,
            primaryKey: true,
            autoIncrement: true,
        },
        {
            fieldName: 'create_time',
            comment: 'create time',
            defaultValue: 'CURRENT_TIMESTAMP',
            fieldType: 'datetime',
            mockType: 'fixed',
            notNull: true,
            primaryKey: false,
            autoIncrement: false,
        },
        {
            fieldName: 'update_time',
            comment: 'update time',
            defaultValue: 'CURRENT_TIMESTAMP',
            fieldType: 'datetime',
            mockType: 'fixed',
            notNull: true,
            primaryKey: false,
            autoIncrement: false,
            extra: 'on update CURRENT_TIMESTAMP',
        },
        {
            fieldName: 'is_deleted',
            comment: 'Whether is deleted (0-not deleted, 1-deleted)',
            defaultValue: '0',
            fieldType: 'tinyint',
            mockType: 'fixed',
            notNull: true,
            primaryKey: false,
            autoIncrement: false,
        },
    ],
};

/**
 * SQL 输入示例
 */
export const SQL_INPUT_EXAMPLE =
    '-- user table\n' +
    'create table if not exists user\n' +
    '(\n' +
    "id bigint not null auto_increment comment 'primary key' primary key,\n" +
    "username varchar(256) not null comment 'username',\n" +
    "create_time datetime default CURRENT_TIMESTAMP not null comment 'create time',\n" +
    "update_time datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'update time',\n" +
    "is_deleted tinyint default 0 not null comment 'whether is deleted (0-not deleted, 1-deleted)'\n" +
    ") comment 'user table';";
