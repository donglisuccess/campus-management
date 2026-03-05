<template>
  <section class="home-page">
    <header class="home-header">
      <h1 class="home-title">校园管理数字化平台</h1>
      <p class="home-subtitle">Campus Digital Management Platform</p>
    </header>

    <el-row :gutter="24">
      <el-col
        v-for="item in systems"
        :key="item.path"
        :xs="24"
        :sm="12"
        :md="8"
        class="entry-col"
      >
        <el-card class="entry-card" shadow="hover" @click="goToSystem(item.path)">
          <div class="entry-head">
            <el-icon class="entry-icon">
              <component :is="resolveIcon(item.icon)" />
            </el-icon>
            <h3 class="entry-title">{{ item.title }}</h3>
          </div>
          <p class="entry-description">{{ item.description }}</p>
          <el-button type="primary" round @click.stop="goToSystem(item.path)" class="entry-button">
            进入系统
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'

interface SystemEntry {
  title: string
  description: string
  path: string
  icon: string
}

const router = useRouter()
const icons = Icons as unknown as Record<string, Component>

const systems: SystemEntry[] = [
  {
    title: '师资管理应用服务云平台',
    description:
      '用于统一管理教师基础信息、荣誉奖励、教学科研数据等，支持教师信息维护、学习经历、科研成果、教学工作等多维度数据管理。',
    path: '/teacher',
    icon: 'UserFilled'
  },
  {
    title: '竞赛活动应用平台',
    description:
      '支持学校发起竞赛活动、作品上传、在线评审、评分统计，并支持赛事材料管理、作品集展示和评分管理。',
    path: '/competition',
    icon: 'Trophy'
  },
  {
    title: '智慧体测平台',
    description:
      '基于 AI 技术实现学生体育训练与体测数据数字化管理，支持人脸识别、训练成绩记录、设备管理与训练视频存储。',
    path: '/fitness',
    icon: 'DataAnalysis'
  },
  {
    title: '5G虚拟仿真实训系统',
    description:
      '基于 5G 网络仿真技术的在线教学平台，支持 5G网络建设仿真训练、教学考核、实验任务配置和成绩管理。',
    path: '/vr-training',
    icon: 'Connection'
  },
  {
    title: '实验室综合管理云平台',
    description: '用于实训室与实验室设备管理、预约管理、数据统计分析和资产管理，实现实验室信息化管理。',
    path: '/lab',
    icon: 'Cpu'
  },
  {
    title: '智慧校园迎新小工具',
    description:
      '用于新生入学报到管理，包含领导驾驶舱、微信小程序端和PC管理端，实现迎新流程数字化管理。',
    path: '/welcome',
    icon: 'School'
  }
]

const goToSystem = (path: string) => {
  void router.push(path)
}

const resolveIcon = (name: string): Component => {
  return icons[name] ?? icons.Menu
}
</script>

<style scoped>
.home-page {
  width: 100%;
}

.home-header {
  text-align: center;
  margin-bottom: 36px;
  padding: 26px 20px;
  border-radius: 20px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.85) 0%, rgba(239, 247, 255, 0.9) 100%);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(6px);
}

.home-title {
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: clamp(30px, 3.2vw, 44px);
  letter-spacing: 0.02em;
  color: #0f172a;
}

.home-subtitle {
  margin-top: 12px;
  font-size: 17px;
  letter-spacing: 0.12em;
  color: #475569;
  text-transform: uppercase;
}

.entry-col {
  margin-bottom: 24px;
}

.entry-card {
  height: 100%;
  border-radius: 18px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.entry-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 38px rgba(15, 23, 42, 0.14);
}

.entry-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.entry-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entry-icon {
  font-size: 40px;
  color: #0f766e;
  background: linear-gradient(145deg, rgba(45, 212, 191, 0.2), rgba(59, 130, 246, 0.18));
  border-radius: 14px;
  padding: 12px;
}

.entry-title {
  font-size: 19px;
  color: #0f172a;
  line-height: 1.35;
}

.entry-description {
  flex: 1;
  font-size: 14px;
  line-height: 1.75;
  color: #475569;
}
.entry-button {
  width: 100px;
  align-self: flex-end;
}

@media (max-width: 768px) {
  .home-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .home-subtitle {
    font-size: 14px;
    letter-spacing: 0.07em;
  }
}
</style>
