<template>
  <div class="tpm-root">
    <aside class="tpm-side" :class="{ 'is-collapse': isMenuCollapse }">
      <div class="tpm-brand">
        <h2 v-if="!isMenuCollapse">师资管理后台</h2>
      </div>

      <el-menu
        :default-active="String(activeMenuId)"
        :collapse="isMenuCollapse"
        :unique-opened="true"
        popper-class="tpm-menu-popper"
        class="tpm-menu"
        @select="handleSelectMenu"
      >
        <el-sub-menu
          v-for="group in menuGroups"
          :key="group.name"
          :index="group.name"
        >
          <template #title>{{ group.name }}</template>
          <el-menu-item
            v-for="item in group.items"
            :key="item.id"
            :index="String(item.id)"
          >
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <main class="tpm-main">
      <div class="tpm-toolbar">
        <div>
          <h3>{{ activeMenu.title }}</h3>
          <p>当前登录人：{{ currentUserLabel }} | 字段数：{{ activeMenu.fields.length }}</p>
        </div>
        <div class="tpm-toolbar-actions">
          <el-button @click="logout">退出登录</el-button>
        </div>
      </div>

      <el-card v-if="currentRole === 'teacher'" class="tpm-content" shadow="never">
        <div class="tpm-actions">
          <el-button
            type="primary"
            :disabled="!canSaveCurrent"
            @click="saveCurrentEntry"
          >
            保存
          </el-button>
          <el-button
            v-if="activeMenu.multiple"
            :icon="Plus"
            :disabled="!canAddEntry"
            @click="addNewEntry"
          >
            新增
          </el-button>
        </div>

        <div class="tpm-entry-list">
          <el-card
            v-for="item in teacherDisplayEntries"
            :key="`${activeMenu.id}-${item.index}`"
            class="tpm-entry-card"
            shadow="never"
          >
            <div class="tpm-entry-head">
              <span>第 {{ item.index + 1 }} 条记录</span>
              <div>
                <el-tag type="success" effect="plain">可编辑</el-tag>
                <el-button
                  v-if="canDeleteTeacherRecord"
                  link
                  type="danger"
                  @click="deleteTeacherEntry(item.index)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <el-form label-position="top" class="tpm-form-grid">
              <el-form-item
                v-for="field in activeMenu.fields"
                :key="field"
                :label="field"
                required
              >
                <el-date-picker
                  v-if="isDateField(field)"
                  v-model="item.entry.values[field]"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  class="tpm-date-picker"
                  placeholder="请选择日期"
                  clearable
                />
                <el-input
                  v-else
                  v-model="item.entry.values[field]"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-card>

      <el-card v-else class="tpm-content" shadow="never">
        <el-form label-position="top" class="tpm-filter-grid">
          <el-form-item
            v-for="field in activeMenu.fields"
            :key="field"
            :label="field"
          >
            <el-date-picker
              v-if="isDateField(field)"
              v-model="adminFiltersDraft[field]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              class="tpm-date-picker"
              placeholder="请选择日期"
              clearable
            />
            <el-input
              v-else
              v-model="adminFiltersDraft[field]"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-form>

        <div class="tpm-query-row">
          <el-button type="primary" @click="runAdminQuery">查询</el-button>
          <el-button @click="resetAdminQuery">重置</el-button>
        </div>

        <div class="tpm-table-wrap">
          <el-table :data="pagedAdminRows" border stripe>
            <el-table-column prop="teacherId" label="教师工号" min-width="120" />
            <el-table-column prop="teacherName" label="教师姓名" min-width="120" />
            <el-table-column
              v-for="field in activeMenu.fields"
              :key="field"
              :prop="field"
              :label="field"
              min-width="160"
            />
            <el-table-column fixed="right" label="操作" min-width="160">
              <template #default="scope">
                <el-button link type="primary" @click="openAdminEditDialog(scope.row)">编辑</el-button>
                <el-button link type="danger" @click="deleteAdminRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="tpm-pagination">
          <el-pagination
            v-model:current-page="adminPage"
            v-model:page-size="adminPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="filteredAdminRows.length"
          />
        </div>
      </el-card>
    </main>
  </div>

  <el-dialog
    v-model="adminEditDialogVisible"
    title="编辑记录"
    width="780px"
    destroy-on-close
  >
    <el-form label-position="top" class="tpm-form-grid">
      <el-form-item
        v-for="field in activeMenu.fields"
        :key="field"
        :label="field"
        required
      >
        <el-date-picker
          v-if="isDateField(field)"
          v-model="adminEditForm[field]"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          class="tpm-date-picker"
          placeholder="请选择日期"
          clearable
        />
        <el-input v-else v-model="adminEditForm[field]" placeholder="请输入" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="adminEditDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveAdminEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {
  createNextEmptyEntry,
  ensureTeacherForms,
  findTeacherById,
  getMenuById,
  teacherPlatformMenus,
  teacherPlatformState,
  type PlatformRole,
  type TeacherFormEntry,
  type TeacherProfile
} from '@/mock/teacherPlatform'

interface AdminTableRow {
  teacherId: string
  teacherName: string
  entryIndex: number
  [key: string]: string | number
}

const STORAGE_ROLE = 'tp_role'
const STORAGE_USER = 'tp_user'

const router = useRouter()
const currentRole = ref<PlatformRole | null>(null)
const currentTeacherId = ref('')
const activeMenuId = ref(1)
const isMenuCollapse = ref(false)

const adminFiltersDraft = reactive<Record<string, string>>({})
const adminFiltersApplied = reactive<Record<string, string>>({})

const adminEditDialogVisible = ref(false)
const editingAdminRow = ref<AdminTableRow | null>(null)
const adminEditForm = reactive<Record<string, string>>({})
const adminPage = ref(1)
const adminPageSize = ref(10)

const activeMenu = computed(() => getMenuById(activeMenuId.value))

const menuGroups = computed(() => {
  const groups = new Map<string, typeof teacherPlatformMenus>()
  for (const item of teacherPlatformMenus) {
    if (!groups.has(item.group)) groups.set(item.group, [])
    groups.get(item.group)?.push(item)
  }
  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }))
})

const currentTeacher = computed<TeacherProfile | null>(() => {
  if (!currentTeacherId.value) return null
  return findTeacherById(currentTeacherId.value) ?? null
})

const currentEntries = computed<TeacherFormEntry[]>(() => {
  const teacher = currentTeacher.value
  if (!teacher) return []
  ensureTeacherForms(teacher)
  return teacher.forms[activeMenuId.value] ?? []
})

const teacherDisplayEntries = computed(() => currentEntries.value.map((entry, index) => ({ entry, index })))

const canSaveCurrent = computed(() => {
  if (currentRole.value !== 'teacher') return false
  if (currentEntries.value.length === 0) return false

  return currentEntries.value.every((entry) => {
    return activeMenu.value.fields.every((field) => String(entry.values[field] ?? '').trim() !== '')
  })
})

const canAddEntry = computed(() => {
  if (currentRole.value !== 'teacher') return false
  if (!activeMenu.value.multiple) return false
  return true
})

const canDeleteTeacherRecord = computed(() => {
  if (currentRole.value !== 'teacher') return false
  return currentEntries.value.length > 1
})

const currentUserLabel = computed(() => {
  if (currentRole.value === 'admin') return '管理员 admin'
  const teacher = currentTeacher.value
  if (!teacher) return '教师'
  return `教师 ${teacher.name} (${teacher.id})`
})

const adminRows = computed<AdminTableRow[]>(() => {
  const menuId = activeMenuId.value
  const rows: AdminTableRow[] = []

  for (const teacher of teacherPlatformState.teachers) {
    const entries = teacher.forms[menuId] ?? []
    entries.forEach((entry, entryIndex) => {
      const row: AdminTableRow = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        entryIndex
      }

      for (const field of activeMenu.value.fields) {
        row[field] = entry.values[field] ?? ''
      }

      rows.push(row)
    })
  }

  return rows
})

const filteredAdminRows = computed(() => {
  return adminRows.value.filter((row) => {
    return activeMenu.value.fields.every((field) => {
      const keyword = (adminFiltersApplied[field] ?? '').trim()
      if (!keyword) return true
      return String(row[field] ?? '').includes(keyword)
    })
  })
})

const pagedAdminRows = computed(() => {
  const start = (adminPage.value - 1) * adminPageSize.value
  const end = start + adminPageSize.value
  return filteredAdminRows.value.slice(start, end)
})

watch(
  () => activeMenuId.value,
  () => {
    for (const key of Object.keys(adminFiltersDraft)) delete adminFiltersDraft[key]
    for (const key of Object.keys(adminFiltersApplied)) delete adminFiltersApplied[key]
    for (const field of activeMenu.value.fields) {
      adminFiltersDraft[field] = ''
      adminFiltersApplied[field] = ''
    }

    if (currentRole.value === 'teacher' && currentTeacher.value) {
      const forms = currentTeacher.value.forms[activeMenu.value.id]
      if (!forms || forms.length === 0) {
        currentTeacher.value.forms[activeMenu.value.id] = [createNextEmptyEntry(activeMenu.value.id)]
      }
    }

    adminPage.value = 1
  },
  { immediate: true }
)

watch(
  () => filteredAdminRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / adminPageSize.value))
    if (adminPage.value > maxPage) adminPage.value = maxPage
  }
)

watch(
  () => adminPageSize.value,
  () => {
    adminPage.value = 1
  }
)

onMounted(() => {
  const role = sessionStorage.getItem(STORAGE_ROLE) as PlatformRole | null
  const teacherId = sessionStorage.getItem(STORAGE_USER) ?? ''

  if (role !== 'teacher' && role !== 'admin') {
    router.replace('/teacher-platform')
    return
  }

  currentRole.value = role

  if (role === 'teacher') {
    currentTeacherId.value = teacherId || 'teacher001'
    const teacher = findTeacherById(currentTeacherId.value)
    if (!teacher) {
      ElMessage.error('未找到教师数据，请重新登录')
      router.replace('/teacher-platform')
      return
    }
    ensureTeacherForms(teacher)
  }

  if (role === 'admin') {
    currentTeacherId.value = 'teacher001'
  }
})

function toggleCollapse(): void {
  isMenuCollapse.value = !isMenuCollapse.value
}

function handleSelectMenu(index: string): void {
  activeMenuId.value = Number(index)
}

function isDateField(field: string): boolean {
  return field.includes('时间') || field.includes('日期')
}

function runAdminQuery(): void {
  for (const field of activeMenu.value.fields) {
    adminFiltersApplied[field] = (adminFiltersDraft[field] ?? '').trim()
  }
  adminPage.value = 1
}

function resetAdminQuery(): void {
  for (const field of activeMenu.value.fields) {
    adminFiltersDraft[field] = ''
    adminFiltersApplied[field] = ''
  }
  adminPage.value = 1
}

function saveCurrentEntry(): void {
  if (currentEntries.value.length === 0) {
    ElMessage.warning('当前没有可保存的记录')
    return
  }

  if (!canSaveCurrent.value) {
    ElMessage.warning('请先完整填写所有字段后再保存')
    return
  }

  ElMessage.success(`${activeMenu.value.title}保存成功`)
}

function addNewEntry(): void {
  if (!canAddEntry.value || !currentTeacher.value) {
    ElMessage.warning('请先保存当前记录后再新增')
    return
  }

  currentTeacher.value.forms[activeMenu.value.id].push(createNextEmptyEntry(activeMenu.value.id))
}

async function deleteTeacherEntry(index: number): Promise<void> {
  if (!currentTeacher.value) return
  if (currentEntries.value.length <= 1) {
    ElMessage.warning('仅有一条记录时只允许编辑，不可删除')
    return
  }

  try {
    await ElMessageBox.confirm('确认删除当前记录吗？删除后不可恢复。', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    currentTeacher.value.forms[activeMenu.value.id].splice(index, 1)
    ElMessage.success('记录已删除')
  } catch {
    // User canceled
  }
}

function openAdminEditDialog(row: AdminTableRow): void {
  editingAdminRow.value = row
  for (const key of Object.keys(adminEditForm)) delete adminEditForm[key]
  for (const field of activeMenu.value.fields) {
    adminEditForm[field] = String(row[field] ?? '')
  }
  adminEditDialogVisible.value = true
}

function saveAdminEdit(): void {
  const row = editingAdminRow.value
  if (!row) return

  const teacher = findTeacherById(row.teacherId)
  if (!teacher) {
    ElMessage.error('未找到教师信息')
    return
  }

  const target = teacher.forms[activeMenu.value.id]?.[row.entryIndex]
  if (!target) {
    ElMessage.error('未找到可编辑记录')
    return
  }

  for (const field of activeMenu.value.fields) {
    target.values[field] = (adminEditForm[field] ?? '').trim()
  }

  adminEditDialogVisible.value = false
  ElMessage.success('记录已更新')
}

async function deleteAdminRow(row: AdminTableRow): Promise<void> {
  try {
    await ElMessageBox.confirm('删除后将无法恢复，是否确认删除？', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const teacher = findTeacherById(row.teacherId)
    if (!teacher) {
      ElMessage.error('未找到教师信息')
      return
    }

    const forms = teacher.forms[activeMenu.value.id] ?? []
    if (!forms[row.entryIndex]) {
      ElMessage.error('记录不存在或已删除')
      return
    }

    if (!activeMenu.value.multiple && forms.length <= 1) {
      ElMessage.warning('个人基本信息至少保留一条，不可删除')
      return
    }

    forms.splice(row.entryIndex, 1)
    ElMessage.success('删除成功')
  } catch {
    // User canceled
  }
}

function logout(): void {
  sessionStorage.removeItem(STORAGE_ROLE)
  sessionStorage.removeItem(STORAGE_USER)
  router.replace('/teacher-platform')
}
</script>

<style scoped>
.tpm-root {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 292px minmax(0, 1fr);
  background:
    radial-gradient(circle at 12% 10%, rgba(26, 115, 232, 0.14), transparent 30%),
    radial-gradient(circle at 86% 90%, rgba(5, 150, 105, 0.14), transparent 32%),
    linear-gradient(128deg, #ecf4ff 0%, #f7fff8 45%, #ffffff 100%);
}

.tpm-side {
  border-right: 1px solid #d2deee;
  background: linear-gradient(180deg, #0f2f49 0%, #143d5b 100%);
  color: #f4f8ff;
  padding: 14px 12px;
  overflow: auto;
}

.tpm-side.is-collapse {
  width: 72px;
}

.tpm-brand {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tpm-brand h2 {
  margin: 0;
  font-size: 19px;
  letter-spacing: 0.02em;
}

.tpm-collapse-btn {
  color: #d5e8ff;
}

.tpm-menu {
  border-right: none;
  background: transparent;
}

.tpm-menu :deep(.el-sub-menu__title) {
  color: #d6e8ff;
  border-radius: 0;
}

.tpm-menu :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.tpm-menu :deep(.el-menu-item) {
  color: #c5ddf8;
  border-radius: 0;
  margin: 3px 0;
}

.tpm-menu :deep(.el-menu-item:hover) {
  color: #ffffff;
  background: rgba(18, 98, 159, 0.46);
}

.tpm-menu :deep(.el-menu-item.is-active) {
  color: #ffffff;
  background: linear-gradient(90deg, rgba(30, 136, 229, 0.78), rgba(13, 148, 136, 0.72));
  border-radius: 0;
}

.tpm-menu :deep(.el-menu),
.tpm-menu :deep(.el-sub-menu),
.tpm-menu :deep(.el-sub-menu__title) {
  background: transparent;
}

:deep(.tpm-menu-popper) {
  background: #143d5b !important;
  border: 1px solid #255577;
}

:deep(.tpm-menu-popper .el-menu) {
  background: #143d5b !important;
}

:deep(.tpm-menu-popper .el-menu-item),
:deep(.tpm-menu-popper .el-sub-menu__title) {
  color: #d6e8ff;
  border-radius: 0;
}

:deep(.tpm-menu-popper .el-menu-item:hover),
:deep(.tpm-menu-popper .el-sub-menu__title:hover) {
  color: #ffffff;
  background: rgba(18, 98, 159, 0.46);
}

.tpm-main {
  padding: 20px;
  overflow: auto;
}

.tpm-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tpm-toolbar-actions {
  display: flex;
  gap: 10px;
}

.tpm-toolbar h3 {
  margin: 0;
  font-size: 24px;
  color: #122538;
}

.tpm-toolbar p {
  margin: 7px 0 0;
  color: #4f6478;
}

.tpm-content {
  border-radius: 16px;
  border: 1px solid #dce7f3;
  background: rgba(255, 255, 255, 0.92);
}

.tpm-query-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tpm-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.tpm-entry-list {
  display: grid;
  gap: 12px;
}

.tpm-entry-card {
  border: 1px solid #d9e6f3;
  border-radius: 14px;
}

.tpm-entry-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tpm-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 14px;
}

.tpm-filter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 14px;
}

.tpm-date-picker {
  width: 100%;
}

.tpm-table-wrap {
  overflow: auto;
}

.tpm-pagination {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 980px) {
  .tpm-root {
    grid-template-columns: 1fr;
  }

  .tpm-side,
  .tpm-side.is-collapse {
    width: 100%;
    max-height: 40vh;
  }

  .tpm-query-row,
  .tpm-actions,
  .tpm-toolbar-actions {
    flex-wrap: wrap;
  }

  .tpm-form-grid,
  .tpm-filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
