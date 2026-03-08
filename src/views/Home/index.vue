<template>
  <section class="home-page">
    <div class="home-glow home-glow-a"></div>
    <div class="home-glow home-glow-b"></div>

    <header class="home-header">
      <div class="home-header-main">
        <p class="home-kicker">Campus Digital Matrix</p>
        <h1 class="home-title">校园管理数字化平台</h1>
        <p class="home-subtitle">统一入口 · 多应用协同 · 数据驱动管理</p>

        <div class="home-pill-row">
          <span v-for="item in highlights" :key="item" class="home-pill">{{ item }}</span>
        </div>
      </div>

      <div class="home-header-side">
        <p class="side-label">已接入应用</p>
        <p class="side-value">{{ systems.length }}</p>
        <p class="side-desc">覆盖教学管理、竞赛活动、体测训练、实验实训等核心场景</p>
      </div>
    </header>

    <el-row :gutter="24" class="entry-grid">
      <el-col
        v-for="(item, index) in systems"
        :key="item.path"
        :xs="24"
        :sm="12"
        :md="8"
        class="entry-col"
      >
        <el-card :class="['entry-card', `entry-card--${item.tone}`]" shadow="hover" @click="goToSystem(item.path)">
          <div class="entry-topline">
            <span class="entry-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="entry-tag">应用服务</span>
          </div>

          <div class="entry-head">
            <el-icon :class="['entry-icon', `entry-icon--${item.tone}`]">
              <component :is="resolveIcon(item.icon)" />
            </el-icon>
            <h3 class="entry-title">{{ item.title }}</h3>
          </div>

          <p class="entry-description">{{ item.description }}</p>

          <div v-if="item.actions?.length" class="entry-action-row">
            <el-button
              v-for="action in item.actions"
              :key="action.label"
              :type="action.type ?? 'default'"
              round
              @click.stop="goToSystem(action.path)"
              class="entry-button entry-button--split"
            >
              {{ action.label }}
            </el-button>
          </div>
          <el-button v-else type="primary" round @click.stop="goToSystem(item.path)" class="entry-button">
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

interface SystemAction {
  label: string
  path: string
  type?: 'primary' | 'default'
}

interface SystemEntry {
  title: string
  description: string
  path: string
  icon: string
  tone: 'teal' | 'sky' | 'amber' | 'violet' | 'emerald' | 'rose'
  actions?: SystemAction[]
}

const router = useRouter()
const icons = Icons as unknown as Record<string, Component>

const highlights = ['统一认证', '数据中台', '多端协同']

const systems: SystemEntry[] = [
  {
    title: '师资管理应用服务云平台',
    description:
      '用于统一管理教师基础信息、荣誉奖励、教学科研数据等，支持教师信息维护、学习经历、科研成果、教学工作等多维度数据管理。',
    path: '/teacher-platform',
    icon: 'UserFilled',
    tone: 'teal'
  },
  {
    title: '竞赛活动应用平台',
    description:
      '支持学校发起竞赛活动、作品上传、在线评审、评分统计，并支持赛事材料管理、作品集展示和评分管理。',
    path: '/competition',
    icon: 'Trophy',
    tone: 'sky'
  },
  {
    title: '智慧体测平台',
    description:
      '基于 AI 技术实现学生体育训练与体测数据数字化管理，支持人脸识别、训练成绩记录、设备管理与训练视频存储。',
    path: '/fitness',
    icon: 'DataAnalysis',
    tone: 'amber'
  },
  {
    title: '5G虚拟仿真实训系统',
    description:
      '基于 5G 网络仿真技术的在线教学平台，支持 5G网络建设仿真训练、教学考核、实验任务配置和成绩管理。',
    path: '/vr-training',
    icon: 'Connection',
    tone: 'violet'
  },
  {
    title: '实验室综合管理云平台',
    description: '用于实训室与实验室设备管理、预约管理、数据统计分析和资产管理，实现实验室信息化管理。',
    path: '/lab/login',
    icon: 'Cpu',
    tone: 'emerald'
  },
  {
    title: '智慧校园迎新小工具',
    description:
      '用于新生入学报到管理，包含领导驾驶舱、微信小程序端和PC管理端，实现迎新流程数字化管理。',
    path: '/welcome',
    icon: 'School',
    tone: 'rose',
    actions: [
      { label: '进入大屏领导驾驶舱', path: '/welcome/dashboard', type: 'primary' },
      { label: '进入管理后台', path: '/welcome', type: 'default' }
    ]
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
  --home-text-main: #0f172a;
  --home-text-sub: #475569;

  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 6px 2px 10px;
}

.home-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(4px);
  pointer-events: none;
}

.home-glow-a {
  width: 300px;
  height: 300px;
  left: -120px;
  top: -80px;
  background: radial-gradient(circle at center, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0));
}

.home-glow-b {
  width: 280px;
  height: 280px;
  right: -90px;
  top: 80px;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0));
}

.home-header {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 18px;
  margin-bottom: 36px;
  padding: 16px;
  border-radius: 24px;
  background: linear-gradient(132deg, rgba(255, 255, 255, 0.92) 0%, rgba(236, 254, 255, 0.82) 100%);
  border: 1px solid rgba(148, 163, 184, 0.26);
  box-shadow: 0 20px 42px rgba(15, 23, 42, 0.08);
}

.home-header-main {
  border-radius: 18px;
  padding: 24px 24px 20px;
  background:
    linear-gradient(150deg, rgba(14, 116, 144, 0.08), rgba(15, 23, 42, 0.02)),
    #ffffff;
  border: 1px solid rgba(186, 230, 253, 0.6);
}

.home-kicker {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0e7490;
  background: rgba(14, 165, 233, 0.12);
}

.home-title {
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: clamp(30px, 3.1vw, 42px);
  line-height: 1.2;
  margin-top: 14px;
  color: var(--home-text-main);
}

.home-subtitle {
  margin-top: 10px;
  font-size: 15px;
  letter-spacing: 0.02em;
  color: var(--home-text-sub);
}

.home-pill-row {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.home-pill {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #0f172a;
  background: rgba(226, 232, 240, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.32);
}

.home-header-side {
  border-radius: 18px;
  padding: 24px 20px;
  color: #ecfeff;
  background:
    radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.3), rgba(45, 212, 191, 0)),
    linear-gradient(155deg, #0f766e 0%, #0e7490 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.side-label {
  font-size: 13px;
  opacity: 0.9;
}

.side-value {
  margin-top: 8px;
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.side-desc {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.65;
  opacity: 0.92;
}

.entry-grid {
  position: relative;
  z-index: 1;
}

.entry-col {
  margin-bottom: 24px;
}

.entry-card {
  position: relative;
  height: 100%;
  border-radius: 20px;
  border: 1px solid rgba(203, 213, 225, 0.5);
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 252, 0.98));
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.entry-card:hover {
  transform: translateY(-7px);
  border-color: rgba(94, 234, 212, 0.6);
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.13);
}

.entry-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 18px 18px 16px;
}

.entry-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.entry-index {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  color: #64748b;
  letter-spacing: 0.08em;
}

.entry-tag {
  font-size: 11px;
  color: #0f172a;
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  padding: 4px 10px;
}

.entry-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entry-icon {
  font-size: 34px;
  border-radius: 14px;
  padding: 10px;
}

.entry-icon--teal {
  color: #0f766e;
  background: linear-gradient(145deg, rgba(45, 212, 191, 0.22), rgba(15, 118, 110, 0.08));
}

.entry-icon--sky {
  color: #0369a1;
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.24), rgba(14, 116, 144, 0.08));
}

.entry-icon--amber {
  color: #b45309;
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.28), rgba(245, 158, 11, 0.08));
}

.entry-icon--violet {
  color: #6d28d9;
  background: linear-gradient(145deg, rgba(167, 139, 250, 0.28), rgba(139, 92, 246, 0.1));
}

.entry-icon--emerald {
  color: #047857;
  background: linear-gradient(145deg, rgba(52, 211, 153, 0.28), rgba(5, 150, 105, 0.08));
}

.entry-icon--rose {
  color: #be123c;
  background: linear-gradient(145deg, rgba(251, 113, 133, 0.26), rgba(225, 29, 72, 0.08));
}

.entry-title {
  font-size: 18px;
  color: var(--home-text-main);
  line-height: 1.35;
}

.entry-description {
  flex: 1;
  font-size: 14px;
  line-height: 1.72;
  color: var(--home-text-sub);
}

.entry-action-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.entry-button {
  width: 108px;
  border: none;
  background: linear-gradient(135deg, #0f766e, #0e7490);
  align-self: flex-end;
}

.entry-button--split {
  width: 100%;
}

.entry-button--split:deep(.el-button) {
  width: 100%;
}

.entry-action-row :deep(.el-button + .el-button) {
  margin-left: 0;
}

.entry-action-row :deep(.el-button.is-round) {
  padding-inline: 12px;
}

.entry-action-row :deep(.el-button--default) {
  border-color: rgba(190, 24, 93, 0.2);
  color: #9d174d;
  background: rgba(255, 241, 242, 0.92);
}

.entry-card--teal {
  border-top: 3px solid rgba(13, 148, 136, 0.5);
}

.entry-card--sky {
  border-top: 3px solid rgba(2, 132, 199, 0.5);
}

.entry-card--amber {
  border-top: 3px solid rgba(245, 158, 11, 0.5);
}

.entry-card--violet {
  border-top: 3px solid rgba(139, 92, 246, 0.5);
}

.entry-card--emerald {
  border-top: 3px solid rgba(16, 185, 129, 0.5);
}

.entry-card--rose {
  border-top: 3px solid rgba(244, 63, 94, 0.5);
}

@media (max-width: 768px) {
  .home-header {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 22px;
    padding: 12px;
  }

  .home-header-main,
  .home-header-side {
    padding: 18px 16px;
  }

  .home-header {
    margin-bottom: 24px;
  }

  .home-subtitle {
    font-size: 14px;
    letter-spacing: 0.01em;
  }

  .side-value {
    font-size: 42px;
  }

  .entry-card :deep(.el-card__body) {
    padding: 16px;
  }

  .entry-action-row {
    grid-template-columns: 1fr;
  }
}
</style>
