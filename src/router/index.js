// 路由文件
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index' // 登录
import Index from '@/views/index' // 首页
import Home from '@/views/home' // 首页组件页
import NotFound from '@/views/notFound' // 404页面

import Organization from '@/views/staff/organization/index' // 员工管理-组织架构
import Jurisdiction from '@/views/staff/departmentauth/index' // 员工管理-权限分配
import RoleAssign from '@/views/staff/rolestaff'

import List from '@/views/student/list/index' // 学生管理-学生列表
import ListDetail from '@/views/student/list/detail' // 学生管理-学生列表-学生详情
import Guide from '@/views/student/guide/index' // 学生管理-入学操作指引
import Entrance from '@/views/student/entrance/index' // 学生管理-入学管理
import entranceLook from '@/views/student/entrance/components/look/index' // 学生管理-入学管理-学生详情

import Class from '@/views/class/index' // 班级管理

import Dormitory from '@/views/dormitory/index' // 宿舍管理

import Record from '@/views/moral/record/index' // 德育管理-记录历史
import Detailed from '@/views/moral/detailed/index' // 德育管理-细则管理

import SendNotice from '@/views/message/sendNotice/index' // 消息管理-发送公告
import Bulletingroup from '@/views/message/bulletingroup/index' // 消息管理-公告组管理
import SendHistory from '@/views/message/sendHistory/index' // 消息管理-发送历史

import * as config from '@/utils/config'
import { getCookie } from '@/utils/cookies'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '*', component: NotFound},
    {
      path: '/authentication',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: { name: 'Home' },
      children: [
        { path: 'home', name: 'Home', component: Home },

        { path: 'organization', name: 'Organization', component: Organization },
        { path: 'jurisdiction', name: 'Jurisdiction', component: Jurisdiction },
        { path: 'roleassign', name: 'RoleAssign', component: RoleAssign },

        { path: 'list', name: 'List', component: List },
        { path: 'listDetail', name: 'ListDetail', component: ListDetail },
        { path: 'entrance', name: 'Entrance', component: Entrance },
        { path: 'entranceLook', name: 'entranceLook', component: entranceLook },
        { path: 'guide', name: 'Guide', component: Guide },

        { path: 'class', name: 'Class', component: Class },

        { path: 'dormitory', name: 'Dormitory', component: Dormitory },

        { path: 'record', name: 'Record', component: Record },
        { path: 'detailed', name: 'Detailed', component: Detailed },

        { path: 'sendNotice', name: 'SendNotice', component: SendNotice },
        { path: 'bulletingroup', name: 'Bulletingroup', component: Bulletingroup },
        { path: 'sendHistory', name: 'SendHistory', component: SendHistory }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = getCookie('token')
  const token2 = sessionStorage.getItem('token')
  if (to.name === 'Login' || token || token2) {
    next()
  } else {
    const redirectUrl = escape(`${config.schoolUrl}/#/authentication`)
    window.location.href = `${config.bizUrl}/#/login?redirectUrl=${redirectUrl}`
  }
  // window.location.href = 'http://biz.sc.zhiytech.com/#/login?redirectUrl=school.sc.zhiytech.com/authentication'
})

export default router
