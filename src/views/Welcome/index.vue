<template>
  <section class="placeholder-page">
    <el-card class="placeholder-card">
      <p class="placeholder-kicker">Welcome Admin</p>
      <h2 class="placeholder-title">智慧校园迎新小工具</h2>
      <p class="placeholder-desc">现已开放领导驾驶舱与 PC 管理端一期模块，可继续扩展校园地图、统计分析与设备管理。</p>
      <div class="placeholder-actions">
        <el-button type="primary" round @click="goDashboard">进入领导驾驶舱</el-button>
        <el-button round @click="goManage">进入管理后台</el-button>
        <el-button round @click="goHome">返回首页</el-button>
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goDashboard = () => {
  void router.push('/welcome/dashboard')
}

const goManage = () => {
  void router.push('/welcome/login')
}

const goHome = () => {
  void router.push('/')
}
</script>

<style scoped>
.placeholder-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 120px);
}

.placeholder-card {
  width: min(620px, 100%);
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
}

.placeholder-kicker {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #be123c;
  background: rgba(251, 113, 133, 0.12);
}

.placeholder-title {
  font-size: 28px;
  color: #0f172a;
  margin-bottom: 14px;
}

.placeholder-desc {
  font-size: 16px;
  color: #475569;
  margin-bottom: 22px;
}

.placeholder-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
