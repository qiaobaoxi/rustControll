import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserManage from './views/nav1/UserManage.vue'
import equipmentManage from './views/nav1/equipmentManage.vue'
import menuManage from './views/nav1/menuManage.vue'
import viewEquipment from './views/nav1/viewEquipment.vue'
// import Jurisdiction from './views/nav1/Jurisdiction.vue'
// import Video from './views/nav1/video.vue'
// import Form from './views/nav1/Form.vue'
// import user from './views/nav1/user.vue'
// import Page4 from './views/nav2/Page4.vue'
// import Page5 from './views/nav2/Page5.vue'
// import Page6 from './views/nav3/Page6.vue'
// import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            // { path: '/userManage', component: UserManage, name: '用户管理' },
            { path: '/menuManage', component: menuManage, name: '项目管理' },
            { path: '/equipmentManage', component: equipmentManage, name: '项目文件匹配' },
            { path: '/viewEquipment', component: viewEquipment, name: '设备数据查看' },
            // { path: '/whitePaperManager', component: WhitePaperManager, name: '白皮书管理' },
        ]
    }
];

export default routes;