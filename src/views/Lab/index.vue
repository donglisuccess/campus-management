<template>
  <section v-if="isSystemAdmin" class="lab-manage-page">
    <aside class="lab-manage-side">
      <div class="lab-manage-brand">
        <p class="lab-manage-kicker">Lab Cloud Admin</p>
        <h1>系统管理员后台</h1>
        <p>统一管理实验室平台用户权限、资源档案、流程监控与数据上报。</p>
      </div>

      <div class="lab-manage-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="activeMenuId" class="lab-manage-menu" @select="handleSelectMenu">
        <el-sub-menu v-for="group in menuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-manage-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-manage-main">
      <header class="lab-manage-header">
        <div>
          <p class="lab-manage-header-kicker">{{ activeMenu.group }}</p>
          <h2>{{ activeMenu.title }}</h2>
          <p class="lab-manage-header-desc">{{ activeMenu.description }}</p>
        </div>
      </header>

      <section class="lab-stat-grid">
        <article v-for="item in topStats" :key="item.label" class="lab-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-manage-panel" shadow="never">
        <template #header>
          <div class="lab-panel-head lab-panel-head--toolbar">
            <div>
              <h3>{{ activeMenu.title }}</h3>
              <p>当前菜单共 {{ activeRows.length }} 条 mock 数据，筛选后 {{ filteredRows.length }} 条。</p>
            </div>

            <div class="lab-toolbar-actions">
              <el-button @click="resetFilters">重置</el-button>
              <el-button type="primary" @click="applyFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-filter-grid">
          <el-form-item v-for="filter in activeMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="draftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="draftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="draftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="pagedRows" border stripe class="lab-data-table">
          <el-table-column
            v-for="column in activeMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="activeMenuId === 'user-permission'" label="操作" fixed="right" min-width="160">
            <template #default="scope">
              <div class="lab-row-actions">
                <el-button
                  link
                  :type="scope.row.status === '启用' ? 'success' : 'primary'"
                  :disabled="scope.row.status === '启用'"
                  @click="updateUserStatus(scope.row, '启用')"
                >
                  启用
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status === '停用'"
                  @click="updateUserStatus(scope.row, '停用')"
                >
                  禁用
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="filteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else-if="isLabAdmin" class="lab-role-page">
    <aside class="lab-role-side">
      <div class="lab-role-brand">
        <p class="lab-role-kicker">Lab Operations</p>
        <h1>实验室管理员工作台</h1>
        <p>聚焦实验室预约、课表占用、门禁记录、巡检任务与使用率分析。</p>
      </div>

      <div class="lab-role-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="labAdminMenuId" class="lab-role-menu" @select="handleSelectLabAdminMenu">
        <el-sub-menu v-for="group in labAdminMenuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-role-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-role-main">
      <header class="lab-role-header">
        <div>
          <p class="lab-role-header-kicker">{{ activeLabAdminMenu.group }}</p>
          <h2>{{ activeLabAdminMenu.title }}</h2>
          <p class="lab-role-header-desc">{{ activeLabAdminMenu.description }}</p>
        </div>
      </header>

      <section class="lab-role-stat-grid">
        <article v-for="item in labAdminTopStats" :key="item.label" class="lab-role-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-role-panel" shadow="never">
        <template #header>
          <div class="lab-role-panel-head">
            <div>
              <h3>{{ activeLabAdminMenu.title }}</h3>
              <p>当前菜单共 {{ labAdminActiveRows.length }} 条 mock 数据，筛选后 {{ labAdminFilteredRows.length }} 条。</p>
            </div>
            <div class="lab-role-toolbar-actions">
              <el-button @click="resetLabAdminFilters">重置</el-button>
              <el-button type="primary" @click="applyLabAdminFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-role-filter-grid">
          <el-form-item v-for="filter in activeLabAdminMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="labAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyLabAdminFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="labAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="labAdminDraftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="labAdminPagedRows" border stripe class="lab-role-table">
          <el-table-column
            v-for="column in activeLabAdminMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="labAdminMenuId === 'reservation-manage'"
            label="操作"
            fixed="right"
            min-width="220"
          >
            <template #default="scope">
              <div class="lab-role-row-actions">
                <el-button link type="primary" @click="openReservationDetail(scope.row)">查看详情</el-button>
                <el-button
                  link
                  type="success"
                  :disabled="scope.row.status !== '待审核'"
                  @click="approveReservation(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status !== '待审核'"
                  @click="openRejectDialog(scope.row)"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-role-pagination">
          <el-pagination
            v-model:current-page="labAdminCurrentPage"
            v-model:page-size="labAdminPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="labAdminFilteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else class="placeholder-page">
    <el-card class="placeholder-card">
      <div class="placeholder-badge-row">
        <span class="placeholder-badge">{{ currentRoleLabel }}</span>
        <span class="placeholder-user">{{ currentUserName }}</span>
      </div>
      <h2 class="placeholder-title">实验室综合管理云平台</h2>
      <p class="placeholder-desc">
        当前已进入平台。系统管理员后台已搭建完成，其他角色页面可在此基础上继续扩展对应业务菜单与工作台。
      </p>
      <div class="placeholder-action-row">
        <el-button type="primary" round @click="goHome">返回首页</el-button>
        <el-button round @click="logout">退出登录</el-button>
      </div>
    </el-card>
  </section>

  <el-dialog v-model="reservationDetailVisible" title="预约详情" width="760px">
    <el-descriptions v-if="reservationDetailRow" :column="2" border>
      <el-descriptions-item label="预约单号">{{ reservationDetailRow.reservationNo }}</el-descriptions-item>
      <el-descriptions-item label="实验室">{{ reservationDetailRow.labName }}</el-descriptions-item>
      <el-descriptions-item label="申请人">{{ reservationDetailRow.applicant }}</el-descriptions-item>
      <el-descriptions-item label="申请角色">{{ reservationDetailRow.applicantRole }}</el-descriptions-item>
      <el-descriptions-item label="课程/用途">{{ reservationDetailRow.courseName }}</el-descriptions-item>
      <el-descriptions-item label="预约日期">{{ reservationDetailRow.reservationDate }}</el-descriptions-item>
      <el-descriptions-item label="预约时段">{{ reservationDetailRow.timeSlot }}</el-descriptions-item>
      <el-descriptions-item label="审核状态">{{ reservationDetailRow.status }}</el-descriptions-item>
      <el-descriptions-item label="审核人">{{ reservationDetailRow.reviewer }}</el-descriptions-item>
      <el-descriptions-item label="驳回原因">
        {{ reservationDetailRow.rejectReason || '无' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="reservationRejectVisible" title="驳回预约" width="520px">
    <el-form label-position="top">
      <el-form-item label="驳回原因" required>
        <el-input
          v-model="reservationRejectReason"
          type="textarea"
          :rows="4"
          maxlength="120"
          show-word-limit
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="reservationRejectVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReservationReject">确认驳回</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  LAB_MENU_ROWS,
  LAB_MANAGER_MENU_ROWS,
  LAB_MANAGER_MENUS,
  LAB_MANAGER_STATS,
  LAB_SYSTEM_ADMIN_MENUS,
  LAB_SYSTEM_STATS,
  getLabManagerMenuById,
  getLabMenuById,
  type LabManagerMenuId,
  type LabMenuId
} from '@/mock/labPlatform'

const router = useRouter()

const currentRole = computed(() => sessionStorage.getItem('lab_role') || '')
const currentRoleLabel = computed(() => sessionStorage.getItem('lab_role_label') || '访客')
const currentUserName = computed(() => sessionStorage.getItem('lab_name') || '未登录用户')
const isSystemAdmin = computed(() => currentRole.value === 'system-admin')
const isLabAdmin = computed(() => currentRole.value === 'lab-admin')

const activeMenuId = ref<LabMenuId>('user-permission')
const draftFilters = reactive<Record<string, string>>({})
const appliedFilters = reactive<Record<string, string>>({})
const currentPage = ref(1)
const pageSize = ref(10)
const menuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabMenuId, Record<string, string | number>[]>
)
const labAdminMenuId = ref<LabManagerMenuId>('reservation-manage')
const labAdminDraftFilters = reactive<Record<string, string>>({})
const labAdminAppliedFilters = reactive<Record<string, string>>({})
const labAdminCurrentPage = ref(1)
const labAdminPageSize = ref(10)
const reservationDetailVisible = ref(false)
const reservationRejectVisible = ref(false)
const reservationDetailRow = ref<Record<string, string | number> | null>(null)
const reservationPendingRow = ref<Record<string, string | number> | null>(null)
const reservationRejectReason = ref('')
const labAdminMenuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_MANAGER_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabManagerMenuId, Record<string, string | number>[]>
)

const activeMenu = computed(() => getLabMenuById(activeMenuId.value))
const activeLabAdminMenu = computed(() => getLabManagerMenuById(labAdminMenuId.value))

const menuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_SYSTEM_ADMIN_MENUS>()

  for (const item of LAB_SYSTEM_ADMIN_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const activeRows = computed(() => menuRowsState[activeMenuId.value] ?? [])
const labAdminActiveRows = computed(() => labAdminMenuRowsState[labAdminMenuId.value] ?? [])

const filteredRows = computed(() => {
  return activeRows.value.filter((row) => {
    return activeMenu.value.filters.every((filter) => {
      const keyword = (appliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const labAdminFilteredRows = computed(() => {
  return labAdminActiveRows.value.filter((row) => {
    return activeLabAdminMenu.value.filters.every((filter) => {
      const keyword = (labAdminAppliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRows.value.slice(start, end)
})

const labAdminPagedRows = computed(() => {
  const start = (labAdminCurrentPage.value - 1) * labAdminPageSize.value
  const end = start + labAdminPageSize.value
  return labAdminFilteredRows.value.slice(start, end)
})

const topStats = computed(() => {
  if (activeMenuId.value === 'approval-center') {
    const waiting = filteredRows.value.filter((item) => item.status === '待审核').length
    const processing = filteredRows.value.filter((item) => item.status === '审批中').length
    const passed = filteredRows.value.filter((item) => item.status === '已通过').length
    const rejected = filteredRows.value.filter((item) => item.status === '已驳回').length
    return [
      { label: '待审核', value: `${waiting}` },
      { label: '审批中', value: `${processing}` },
      { label: '已通过', value: `${passed}` },
      { label: '已驳回', value: `${rejected}` }
    ]
  }

  if (activeMenuId.value === 'operation-logs') {
    const success = filteredRows.value.filter((item) => item.result === '成功').length
    const warning = filteredRows.value.filter((item) => item.result === '预警').length
    const failed = filteredRows.value.filter((item) => item.result === '失败').length
    return [
      { label: '日志总数', value: `${filteredRows.value.length}` },
      { label: '执行成功', value: `${success}` },
      { label: '执行预警', value: `${warning}` },
      { label: '执行失败', value: `${failed}` }
    ]
  }

  return LAB_SYSTEM_STATS.slice(0, 4)
})

const labAdminTopStats = computed(() => {
  if (labAdminMenuId.value === 'reservation-manage') {
    return [
      { label: '待审核', value: `${labAdminFilteredRows.value.filter((item) => item.status === '待审核').length}` },
      { label: '已通过', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已驳回').length}` },
      { label: '已取消', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已取消').length}` }
    ]
  }

  if (labAdminMenuId.value === 'inspection-tasks') {
    return [
      { label: '待执行', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '待执行').length}` },
      { label: '处理中', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '处理中').length}` },
      { label: '已完成', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '已完成').length}` },
      { label: '逾期', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '逾期').length}` }
    ]
  }

  return LAB_MANAGER_STATS
})

const resetFilterState = () => {
  for (const key of Object.keys(draftFilters)) {
    delete draftFilters[key]
  }

  for (const key of Object.keys(appliedFilters)) {
    delete appliedFilters[key]
  }

  for (const filter of activeMenu.value.filters) {
    draftFilters[filter.key] = ''
    appliedFilters[filter.key] = ''
  }

  currentPage.value = 1
}

const resetLabAdminFilterState = () => {
  for (const key of Object.keys(labAdminDraftFilters)) {
    delete labAdminDraftFilters[key]
  }

  for (const key of Object.keys(labAdminAppliedFilters)) {
    delete labAdminAppliedFilters[key]
  }

  for (const filter of activeLabAdminMenu.value.filters) {
    labAdminDraftFilters[filter.key] = ''
    labAdminAppliedFilters[filter.key] = ''
  }

  labAdminCurrentPage.value = 1
}

const applyFilters = () => {
  for (const filter of activeMenu.value.filters) {
    appliedFilters[filter.key] = draftFilters[filter.key] ?? ''
  }
  currentPage.value = 1
}

const applyLabAdminFilters = () => {
  for (const filter of activeLabAdminMenu.value.filters) {
    labAdminAppliedFilters[filter.key] = labAdminDraftFilters[filter.key] ?? ''
  }
  labAdminCurrentPage.value = 1
}

const resetFilters = () => {
  resetFilterState()
}

const resetLabAdminFilters = () => {
  resetLabAdminFilterState()
}

const handleSelectMenu = (index: string) => {
  activeMenuId.value = index as LabMenuId
}

const labAdminMenuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_MANAGER_MENUS>()

  for (const item of LAB_MANAGER_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const handleSelectLabAdminMenu = (index: string) => {
  labAdminMenuId.value = index as LabManagerMenuId
}

const openReservationDetail = (row: Record<string, string | number>) => {
  reservationDetailRow.value = row
  reservationDetailVisible.value = true
}

const approveReservation = (row: Record<string, string | number>) => {
  if (labAdminMenuId.value !== 'reservation-manage' || row.status !== '待审核') {
    return
  }

  row.status = '已通过'
  row.reviewer = currentUserName.value
  row.rejectReason = ''
  ElMessage.success('预约审核已通过')
}

const openRejectDialog = (row: Record<string, string | number>) => {
  if (labAdminMenuId.value !== 'reservation-manage' || row.status !== '待审核') {
    return
  }

  reservationPendingRow.value = row
  reservationRejectReason.value = ''
  reservationRejectVisible.value = true
}

const submitReservationReject = () => {
  if (!reservationPendingRow.value) {
    return
  }

  if (!reservationRejectReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  reservationPendingRow.value.status = '已驳回'
  reservationPendingRow.value.reviewer = currentUserName.value
  reservationPendingRow.value.rejectReason = reservationRejectReason.value.trim()
  reservationRejectVisible.value = false
  ElMessage.success('预约申请已驳回')
}

const updateUserStatus = (row: Record<string, string | number>, status: '启用' | '停用') => {
  if (activeMenuId.value !== 'user-permission') {
    return
  }

  row.status = status
  ElMessage.success(`账号已${status === '启用' ? '启用' : '禁用'}`)
}

const goHome = () => {
  void router.push('/')
}

const logout = () => {
  sessionStorage.removeItem('lab_auth')
  sessionStorage.removeItem('lab_role')
  sessionStorage.removeItem('lab_role_label')
  sessionStorage.removeItem('lab_account')
  sessionStorage.removeItem('lab_name')
  void router.push('/lab/login')
}

watch(
  () => activeMenuId.value,
  () => {
    resetFilterState()
  },
  { immediate: true }
)

watch(
  () => labAdminMenuId.value,
  () => {
    resetLabAdminFilterState()
  },
  { immediate: true }
)

watch(
  () => filteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }
)

watch(
  () => labAdminFilteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / labAdminPageSize.value))
    if (labAdminCurrentPage.value > maxPage) {
      labAdminCurrentPage.value = maxPage
    }
  }
)

watch(
  () => pageSize.value,
  () => {
    currentPage.value = 1
  }
)

watch(
  () => labAdminPageSize.value,
  () => {
    labAdminCurrentPage.value = 1
  }
)
</script>

<style scoped>
.lab-manage-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-manage-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #ecfeff;
  background:
    radial-gradient(circle at top, rgba(45, 212, 191, 0.22), transparent 36%),
    linear-gradient(180deg, #115e59 0%, #155e75 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-manage-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-manage-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-manage-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(236, 254, 255, 0.88);
}

.lab-manage-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-manage-user-card span,
.lab-manage-user-card em {
  font-size: 13px;
  color: rgba(236, 254, 255, 0.84);
}

.lab-manage-user-card strong {
  font-size: 18px;
}

.lab-manage-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-manage-menu :deep(.el-menu) {
  background: transparent;
}

.lab-manage-menu :deep(.el-sub-menu__title),
.lab-manage-menu :deep(.el-menu-item) {
  color: rgba(240, 253, 250, 0.94);
}

.lab-manage-menu :deep(.el-sub-menu .el-menu-item),
.lab-manage-menu :deep(.el-sub-menu .el-menu) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-manage-menu :deep(.el-menu-item.is-active) {
  color: #052e2b;
  background: rgba(240, 253, 250, 0.92);
  border-radius: 12px;
}

.lab-manage-menu :deep(.el-sub-menu__title:hover),
.lab-manage-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-manage-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-manage-main {
  min-width: 0;
}

.lab-manage-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(240, 253, 250, 0.78));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-manage-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.lab-manage-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-manage-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-manage-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.lab-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-data-table {
  width: 100%;
}

.lab-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lab-role-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-role-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #eff6ff;
  background:
    radial-gradient(circle at top, rgba(96, 165, 250, 0.22), transparent 36%),
    linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-role-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-role-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-role-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(219, 234, 254, 0.9);
}

.lab-role-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-role-user-card span,
.lab-role-user-card em {
  font-size: 13px;
  color: rgba(219, 234, 254, 0.88);
}

.lab-role-user-card strong {
  font-size: 18px;
}

.lab-role-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-role-menu :deep(.el-menu),
.lab-role-menu :deep(.el-sub-menu .el-menu) {
  background: transparent;
}

.lab-role-menu :deep(.el-sub-menu__title),
.lab-role-menu :deep(.el-menu-item) {
  color: rgba(239, 246, 255, 0.96);
}

.lab-role-menu :deep(.el-sub-menu .el-menu-item) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-role-menu :deep(.el-menu-item.is-active) {
  color: #172554;
  background: rgba(239, 246, 255, 0.94);
  border-radius: 12px;
}

.lab-role-menu :deep(.el-sub-menu__title:hover),
.lab-role-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-role-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-role-main {
  min-width: 0;
}

.lab-role-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(239, 246, 255, 0.82));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-role-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.lab-role-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-role-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-role-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-role-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-role-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-role-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-role-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-role-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.lab-role-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-role-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-role-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-role-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-role-table {
  width: 100%;
}

.lab-role-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-role-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

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

.placeholder-badge-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.placeholder-badge,
.placeholder-user {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.placeholder-badge {
  color: #065f46;
  background: rgba(16, 185, 129, 0.14);
}

.placeholder-user {
  color: #0f172a;
  background: rgba(148, 163, 184, 0.16);
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
  line-height: 1.75;
}

.placeholder-action-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 1100px) {
  .lab-manage-page {
    grid-template-columns: 1fr;
  }

  .lab-role-page {
    grid-template-columns: 1fr;
  }

  .lab-stat-grid,
  .lab-filter-grid,
  .lab-role-stat-grid,
  .lab-role-filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .lab-stat-grid,
  .lab-filter-grid,
  .lab-role-stat-grid,
  .lab-role-filter-grid {
    grid-template-columns: 1fr;
  }

  .lab-panel-head,
  .lab-toolbar-actions,
  .lab-role-panel-head,
  .lab-role-toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lab-pagination,
  .lab-role-pagination {
    justify-content: center;
  }
}
</style>
