/**
 * 路由
 * 配置参考：https://umijs.org/docs/max/layout-menu#%E6%89%A9%E5%B1%95%E7%9A%84%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE
 */
export default [
    {
        name: '',
        path: '/',
        component: 'index',
    },
    {
        name: '创建词库',
        path: '/dict/add',
        component: 'dict/add',
        wrappers: [
            '@/wrappers/auth',
        ],
    },
    {
        name: '创建词库成功',
        path: '/dict/add_result',
        component: 'dict/add_result',
        hideInMenu: true,
        wrappers: [
            '@/wrappers/auth',
        ],
    },
    {
        path: '/user',
        hideInMenu: true,
        headerRender: false,
        routes: [
            {
                name: '用户登录',
                path: '/user/login',
                component: 'user/login',
            },
            {
                name: '用户注册',
                path: '/user/register',
                component: 'user/register',
            },
        ],
    },
    {
        path: '/admin',
        access: 'canAdmin',
        name: '管理',
        // flatMenu: true,
        routes: [
            {
                name: '用户管理',
                path: '/admin/user',
                component: 'admin/user',
            },
            {
                name: '词库管理',
                path: '/admin/dict',
                component: 'admin/dict',
            },
            {
                name: '表管理',
                path: '/admin/table',
                component: 'admin/tableInfo',
            },
            {
                name: '字段管理',
                path: '/admin/field',
                component: 'admin/fieldInfo',
            },
            {
                name: '举报管理',
                path: '/admin/report',
                component: 'admin/report',
            },
        ],
    },
];


