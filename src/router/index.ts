import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
