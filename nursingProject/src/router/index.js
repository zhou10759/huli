import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
const Login = r => require.ensure([], () => r(require('@/pages/login/login')), 'login');
const CustomerPage = r => require.ensure([], () => r(require('@/pages/customerPage/index')), 'customerPage');
const BusinessPage = r => require.ensure([], () => r(require('@/pages/businessPage/index')), 'businessPage');
const ProjectDetails = r => require.ensure([], () => r(require('@/pages/projectDetails/index')), 'projectDetails');
const AddEquipment = r => require.ensure([], () => r(require('@/pages/teacher/addEquipment')), 'addEquipment');
const Teacher = r => require.ensure([], () => r(require('@/pages/teacher/index')), 'index');
const AllOrder = r => require.ensure([], () => r(require('@/pages/teacher/allOrder')), 'allOrder');
const Distribution = r => require.ensure([], () => r(require('@/pages/distribution/index')), 'distribution');
const TeacherList = r => require.ensure([], () => r(require('@/pages/distribution/teacherList')), 'teacherList');
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/customerPage',
      name: 'customerPage',
      component: CustomerPage
    },
    {
      path: '/businessPage',
      name: 'businessPage',
      component: BusinessPage
    },
    {
      path: '/projectDetails',
      name: 'projectDetails',
      component: ProjectDetails
    },
    {
      path: '/addEquipment',
      name: 'addEquipment',
      component: AddEquipment
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher
    },
    {
      path: '/allOrder',
      name: 'allOrder',
      component: AllOrder
    },
    {
      path: '/distribution',
      name: 'distribution',
      component: Distribution
    },
    {
      path: '/teacherList',
      name: 'teacherList',
      component: TeacherList
    }
  ]
})
