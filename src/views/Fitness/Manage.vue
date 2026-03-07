<template>
  <section class="fitness-manage-page">
    <aside class="fitness-manage-side">
      <div class="fitness-manage-brand">
        <p class="fitness-manage-kicker">Smart PE Admin</p>
        <h1>平台管理员</h1>
        <p>统一查看菜单、指标、设备和日志。</p>
      </div>

      <div class="fitness-manage-user">
        <span>当前账号</span>
        <strong>{{ currentAccount }}</strong>
      </div>

      <el-menu :default-active="activeMenuId" class="fitness-manage-menu" @select="handleSelect">
        <el-sub-menu v-for="group in menuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="fitness-manage-actions">
        <el-button class="fitness-manage-ghost" @click="goLogin">返回登录页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="fitness-manage-main">
      <header class="fitness-manage-header">
        <div>
          <p class="fitness-manage-header-kicker">{{ activeMenu.group }}</p>
          <h2>{{ activeMenu.title }}</h2>
          <p>{{ activeMenu.description }}</p>
        </div>
      </header>

      <section class="fitness-stat-grid">
        <article v-for="item in activeMenu.stats" :key="item.label" class="fitness-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section class="fitness-content-grid">
        <el-card class="fitness-panel" shadow="never">
          <template #header>
            <div class="fitness-panel-head">
              <h3>数据摘要</h3>
            </div>
          </template>

          <div class="fitness-highlight-list">
            <article v-for="item in activeMenu.highlights" :key="item" class="fitness-highlight-item">
              {{ item }}
            </article>
          </div>
        </el-card>

        <el-card class="fitness-panel" shadow="never">
          <template #header>
            <div class="fitness-panel-head fitness-panel-head--with-meta">
              <div>
                <h3>数据列表</h3>
                <p>当前菜单共 {{ activeMenu.rows.length }} 条数据，筛选后 {{ filteredRows.length }} 条。</p>
              </div>
              <div class="fitness-table-toolbar">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索当前列表"
                  clearable
                  class="fitness-search-input"
                />
                <el-button @click="resetSearch">重置</el-button>
              </div>
            </div>
          </template>

          <el-table :data="filteredRows" border stripe class="fitness-data-table">
            <el-table-column
              v-for="column in activeMenu.columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth ?? 120"
            />
          </el-table>
        </el-card>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  FITNESS_ADMIN_MENU_ITEMS,
  FITNESS_STORAGE_ACCOUNT,
  FITNESS_STORAGE_ROLE
} from '@/mock/fitnessPlatform'

const router = useRouter()
const activeMenuId = ref('dashboard')
const searchKeyword = ref('')

const menuGroups = computed(() => {
  const groups = new Map<string, typeof FITNESS_ADMIN_MENU_ITEMS>()

  for (const item of FITNESS_ADMIN_MENU_ITEMS) {
    if (!groups.has(item.group)) {
      groups.set(item.group, [])
    }

    groups.get(item.group)?.push(item)
  }

  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }))
})

const activeMenu = computed(() => {
  return FITNESS_ADMIN_MENU_ITEMS.find((item) => item.id === activeMenuId.value) ?? FITNESS_ADMIN_MENU_ITEMS[0]
})

const filteredRows = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  if (!keyword) {
    return activeMenu.value.rows
  }

  return activeMenu.value.rows.filter((row) => {
    return activeMenu.value.columns.some((column) => {
      const value = row[column.prop] ?? ''
      return String(value).toLowerCase().includes(keyword)
    })
  })
})

const currentAccount = computed(() => {
  return sessionStorage.getItem(FITNESS_STORAGE_ACCOUNT) ?? 'fitness_admin'
})

const handleSelect = (index: string) => {
  activeMenuId.value = index
}

const resetSearch = () => {
  searchKeyword.value = ''
}

const goLogin = () => {
  void router.push('/fitness')
}

const logout = () => {
  sessionStorage.removeItem(FITNESS_STORAGE_ROLE)
  sessionStorage.removeItem(FITNESS_STORAGE_ACCOUNT)
  ElMessage.success('已退出平台管理员界面')
  void router.push('/fitness')
}

onMounted(() => {
  const role = sessionStorage.getItem(FITNESS_STORAGE_ROLE)
  if (role !== 'admin') {
    ElMessage.warning('请先使用平台管理员账号登录')
    void router.replace('/fitness')
  }
})

watch(activeMenuId, () => {
  searchKeyword.value = ''
})
</script>

<style scoped>
.fitness-manage-page {
  min-height: calc(100vh - 96px);
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
}

.fitness-manage-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 20px;
  border-radius: 26px;
  background: linear-gradient(165deg, #0f172a 0%, #0f766e 65%, #14b8a6 100%);
  color: #f8fafc;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.16);
}

.fitness-manage-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.82;
}

.fitness-manage-brand h1 {
  margin-top: 8px;
  font-size: 30px;
  line-height: 1.12;
}

.fitness-manage-brand p:last-child {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(248, 250, 252, 0.88);
}

.fitness-manage-user {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
}

.fitness-manage-user span,
.fitness-manage-user strong {
  display: block;
}

.fitness-manage-user span {
  font-size: 12px;
  opacity: 0.78;
}

.fitness-manage-user strong {
  margin-top: 8px;
  font-size: 20px;
}

.fitness-manage-menu {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
}

.fitness-manage-menu :deep(.el-menu),
.fitness-manage-menu :deep(.el-sub-menu__title),
.fitness-manage-menu :deep(.el-menu-item) {
  background: transparent;
  color: #f8fafc;
}

.fitness-manage-menu :deep(.el-menu-item.is-active) {
  color: #0f172a;
  background: #ecfeff;
}

.fitness-manage-actions {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.fitness-manage-ghost {
  border-color: rgba(255, 255, 255, 0.28);
  color: #f8fafc;
  background: transparent;
}

.fitness-manage-main {
  display: grid;
  gap: 18px;
}

.fitness-manage-header {
  padding: 24px 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.fitness-manage-header-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f766e;
}

.fitness-manage-header h2 {
  margin-top: 8px;
  font-size: 32px;
  color: #0f172a;
}

.fitness-manage-header p:last-child {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.8;
  color: #526173;
}

.fitness-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.fitness-stat-card {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(236, 253, 245, 0.92));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.fitness-stat-card span,
.fitness-stat-card strong {
  display: block;
}

.fitness-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.fitness-stat-card strong {
  margin-top: 10px;
  font-size: 28px;
  color: #0f172a;
}

.fitness-content-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.48fr) minmax(0, 1fr);
  gap: 18px;
}

.fitness-panel {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
}

.fitness-panel-head h3 {
  font-size: 22px;
  color: #0f172a;
}

.fitness-panel-head--with-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fitness-panel-head--with-meta p {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.fitness-table-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fitness-search-input {
  width: 240px;
}

.fitness-highlight-list {
  display: grid;
  gap: 12px;
}

.fitness-highlight-item {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(240, 253, 250, 0.78);
  color: #1f2937;
  line-height: 1.7;
}

.fitness-data-table :deep(.el-table__cell) {
  padding-top: 12px;
  padding-bottom: 12px;
}

@media (max-width: 1180px) {
  .fitness-manage-page,
  .fitness-content-grid {
    grid-template-columns: 1fr;
  }

  .fitness-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .fitness-stat-grid {
    grid-template-columns: 1fr;
  }

  .fitness-panel-head--with-meta,
  .fitness-table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .fitness-search-input {
    width: 100%;
  }

  .fitness-manage-side,
  .fitness-manage-header {
    padding: 18px;
  }

  .fitness-manage-header h2 {
    font-size: 26px;
  }
}
</style>