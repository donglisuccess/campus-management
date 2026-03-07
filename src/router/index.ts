import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home/index.vue')
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/Teacher/index.vue')
      },
      {
        path: 'competition',
        name: 'Competition',
        component: () => import('@/views/Competition/index.vue')
      },
      {
        path: 'fitness',
        name: 'Fitness',
        component: () => import('@/views/Fitness/index.vue')
      },
      {
        path: 'fitness/manage',
        name: 'FitnessManage',
        component: () => import('@/views/Fitness/Manage.vue')
      },
      {
        path: 'vr-training',
        name: 'VrTraining',
        component: () => import('@/views/VrTraining/index.vue')
      },
      {
        path: 'lab',
        name: 'Lab',
        component: () => import('@/views/Lab/index.vue')
      },
      {
        path: 'welcome',
        name: 'Welcome',
        component: () => import('@/views/Welcome/index.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 教师管理应用服务云平台登录页面路由
routes.push({
  path: '/teacher-platform',
  name: 'TeacherPlatform',
  component: () => import('@/views/TeacherPlatform/index.vue')
})

routes.push({
  path: '/teacher-platform/manage',
  name: 'TeacherPlatformManage',
  component: () => import('@/views/TeacherPlatform/Manage.vue')
})

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
