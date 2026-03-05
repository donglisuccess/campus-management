<template>
  <section class="placeholder-page">
    <el-card class="placeholder-card">
      <h2 class="placeholder-title">智慧校园迎新小工具</h2>
      <p class="placeholder-desc">智慧校园迎新小工具系统开发中...</p>
      <el-button type="primary" round @click="goHome">返回首页</el-button>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

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
</style>
