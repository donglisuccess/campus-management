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
          <p class="fitness-manage-header-desc">{{ activeMenu.description }}</p>
          <div class="fitness-manage-header-meta">
            <span v-for="item in displayStats" :key="item.label" class="fitness-manage-header-chip">
              {{ item.label }} {{ item.value }}
            </span>
          </div>
          <div class="fitness-manage-header-notes">
            <p v-for="item in displayHighlights" :key="item">{{ item }}</p>
          </div>
        </div>
      </header>

      <section class="fitness-stat-grid">
        <article v-for="item in displayStats" :key="item.label" class="fitness-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section class="fitness-content-grid">
        <el-card class="fitness-panel" shadow="never">
          <template #header>
            <div class="fitness-panel-head fitness-panel-head--with-meta">
              <div>
                <h3>数据列表</h3>
                <p>当前菜单共 {{ totalRowCount }} 条数据，筛选后 {{ filteredRowCount }} 条。</p>
              </div>
              <div class="fitness-table-toolbar">
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索当前列表"
                  clearable
                  class="fitness-search-input"
                />
                <template v-if="isAccountMenu">
                  <el-select v-model="accountRoleFilter" placeholder="角色筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in accountRoleOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="accountStatusFilter" placeholder="状态筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in accountStatusOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
                <template v-if="isStudentMenu">
                  <el-select v-model="studentGradeFilter" placeholder="年级筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in studentGradeOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="studentClassFilter" placeholder="班级筛选" filterable clearable class="fitness-filter-select fitness-filter-select-wide">
                    <el-option v-for="item in studentClassOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="studentFaceStatusFilter" placeholder="人脸状态" clearable class="fitness-filter-select">
                    <el-option v-for="item in studentFaceStatusOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="studentQualityFilter" placeholder="照片质量" clearable class="fitness-filter-select">
                    <el-option v-for="item in studentQualityOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
                <template v-if="isScoreMenu">
                  <el-select v-model="scoreProjectFilter" placeholder="项目筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in scoreProjectOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="scoreSourceFilter" placeholder="来源筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in scoreSourceOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-select v-model="scoreStatusFilter" placeholder="状态筛选" clearable class="fitness-filter-select">
                    <el-option v-for="item in scoreStatusOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
                <el-button @click="resetSearch">重置</el-button>
              </div>
            </div>
          </template>

          <el-table :data="tableRows" :loading="tableLoading" border stripe class="fitness-data-table">
            <el-table-column
              v-for="column in activeMenu.columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth ?? 120"
            >
              <template #default="scope">
                <div v-if="isAccountMenu && column.prop === 'status'" class="fitness-status-actions">
                  <el-button
                    size="small"
                    :type="scope.row.status === '启用' ? 'success' : 'default'"
                    @click="setAccountStatus(scope.row, '启用')"
                  >
                    启用
                  </el-button>
                  <el-button
                    size="small"
                    :type="scope.row.status === '禁用' ? 'danger' : 'default'"
                    @click="setAccountStatus(scope.row, '禁用')"
                  >
                    禁用
                  </el-button>
                </div>
                <div v-else-if="isStudentMenu && column.prop === 'facePhotoUrl'" class="fitness-photo-cell">
                  <el-image
                    :src="scope.row.facePhotoUrl"
                    fit="cover"
                    :preview-src-list="[scope.row.facePhotoUrl]"
                    preview-teleported
                    class="fitness-photo-image"
                  />
                </div>
                <div v-else-if="isStudentMenu && column.prop === 'actions'" class="fitness-row-actions">
                  <el-button size="small" @click="openStudentEditor(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" plain @click="removeStudent(scope.row)">删除</el-button>
                </div>
                <div v-else-if="isScoreMenu && column.prop === 'actions'" class="fitness-row-actions">
                  <el-button size="small" type="primary" plain @click="openScoreDetail(scope.row)">查看详情</el-button>
                </div>
                <div v-else-if="isVideoMenu && column.prop === 'actions'" class="fitness-row-actions">
                  <el-button size="small" type="primary" plain @click="openVideoDetail(scope.row)">查看详情</el-button>
                </div>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="hasRemotePagination" class="fitness-pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              background
              layout="total, sizes, prev, pager, next"
              :page-sizes="[10, 20, 50, 100]"
              :total="filteredRowCount"
            />
          </div>
        </el-card>
      </section>

      <el-dialog v-model="studentEditorVisible" title="编辑学生信息" width="760px">
        <el-form :model="studentEditForm" label-width="88px" class="fitness-edit-form">
          <el-form-item label="学号">
            <el-input v-model="studentEditForm.studentId" disabled />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="studentEditForm.studentName" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="studentEditForm.gender">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select v-model="studentEditForm.gradeName" filterable>
              <el-option v-for="item in studentEditableGradeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级">
            <el-select v-model="studentEditForm.className" filterable allow-create default-first-option>
              <el-option v-for="item in studentEditableClassOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="人脸状态">
            <el-select v-model="studentEditForm.faceStatus">
              <el-option v-for="item in studentEditableFaceStatusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="照片质量">
            <el-select v-model="studentEditForm.quality">
              <el-option v-for="item in studentEditableQualityOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="采集方式">
            <el-select v-model="studentEditForm.captureChannel">
              <el-option label="H5采集" value="H5采集" />
              <el-option label="小程序采集" value="小程序采集" />
              <el-option label="批量导入" value="批量导入" />
            </el-select>
          </el-form-item>
          <el-form-item label="照片链接" class="fitness-edit-form-full">
            <el-input v-model="studentEditForm.facePhotoUrl" placeholder="请输入人脸照片链接" />
          </el-form-item>
          <el-form-item label="重新上传" class="fitness-edit-form-full">
            <div class="fitness-upload-row">
              <el-upload :auto-upload="false" :show-file-list="false" :on-change="handleStudentPhotoChange">
                <el-button>选择新图片</el-button>
              </el-upload>
              <el-image :src="studentEditForm.facePhotoUrl" fit="cover" class="fitness-photo-image fitness-photo-image-preview" />
            </div>
          </el-form-item>
        </el-form>

        <template #footer>
          <div class="fitness-dialog-actions">
            <el-button @click="studentEditorVisible = false">取消</el-button>
            <el-button type="primary" @click="submitStudentEdit">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="scoreDetailVisible" :title="scoreDetailTitle" width="1080px">
        <div class="fitness-detail-toolbar">
          <el-input v-model="scoreDetailKeyword" placeholder="搜索学号、姓名、班级" clearable class="fitness-search-input" />
          <el-select v-model="scoreDetailClassFilter" placeholder="班级筛选" clearable filterable class="fitness-filter-select fitness-filter-select-wide">
            <el-option v-for="item in scoreDetailClassOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="scoreDetailResultFilter" placeholder="等级筛选" clearable class="fitness-filter-select">
            <el-option v-for="item in scoreDetailResultOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="scoreDetailStatusFilter" placeholder="入库状态" clearable class="fitness-filter-select">
            <el-option v-for="item in scoreDetailStatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <el-table :data="pagedScoreDetailRows" border stripe class="fitness-data-table">
          <el-table-column
            v-for="column in scoreDetailColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          />
        </el-table>

        <div class="fitness-pagination fitness-detail-pagination">
          <el-pagination
            v-model:current-page="scoreDetailPage"
            v-model:page-size="scoreDetailPageSize"
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 20, 50]"
            :total="scoreDetailRows.length"
          />
        </div>
      </el-dialog>

      <el-dialog v-model="videoDetailVisible" :title="videoDetailTitle" width="980px">
        <div v-if="currentVideoClip" class="fitness-video-player-panel">
          <div class="fitness-video-player-meta">
            <h4>{{ currentVideoClip.clipName }}</h4>
            <p>{{ currentVideoClip.timeRange }} | {{ currentVideoClip.studentName }} | {{ currentVideoClip.project }}</p>
          </div>
          <video :src="currentVideoClip.videoUrl" controls preload="metadata" class="fitness-video-player"></video>
        </div>

        <el-table :data="videoDetailRows" border stripe class="fitness-data-table">
          <el-table-column
            v-for="column in videoDetailColumns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <el-button
                v-if="column.prop === 'clipName'"
                link
                type="primary"
                @click="playVideoClip(scope.row)"
              >
                {{ scope.row.clipName }}
              </el-button>
              <el-button
                v-else-if="column.prop === 'actions'"
                size="small"
                type="primary"
                plain
                @click="playVideoClip(scope.row)"
              >
                播放
              </el-button>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  FITNESS_ACCOUNT_ROLE_OPTIONS,
  FITNESS_ACCOUNT_STATUS_OPTIONS,
  FITNESS_ACCOUNT_TOTAL,
  queryFitnessAccounts,
  updateFitnessAccountStatus,
  type FitnessAccountRecord,
  type FitnessAccountRoleLabel,
  type FitnessAccountStatus
} from '@/mock/fitnessAccounts'
import {
  FITNESS_ADMIN_MENU_ITEMS,
  FITNESS_STORAGE_ACCOUNT,
  FITNESS_STORAGE_ROLE
} from '@/mock/fitnessPlatform'
import {
  FITNESS_STUDENT_CLASS_OPTIONS,
  FITNESS_STUDENT_FACE_STATUS_OPTIONS,
  FITNESS_STUDENT_GRADE_OPTIONS,
  FITNESS_STUDENT_HIGHLIGHTS,
  FITNESS_STUDENT_QUALITY_OPTIONS,
  FITNESS_STUDENT_TOTAL,
  deleteFitnessStudent,
  getFitnessStudentMenuStats,
  getFitnessStudentStats,
  queryFitnessStudents,
  updateFitnessStudent,
  type FitnessStudentRecord
} from '@/mock/fitnessStudents'
import {
  FITNESS_SCORE_DETAIL_COLUMNS,
  FITNESS_SCORE_DETAIL_RESULT_OPTIONS,
  FITNESS_SCORE_DETAIL_STATUS_OPTIONS,
  FITNESS_SCORE_PROJECT_OPTIONS,
  FITNESS_SCORE_SOURCE_OPTIONS,
  FITNESS_SCORE_STATUS_OPTIONS,
  FITNESS_SCORE_SUMMARY_RECORDS,
  FITNESS_SCORE_STATS,
  FITNESS_SCORE_HIGHLIGHTS,
  getFitnessScoreDetailClassOptions,
  queryFitnessScoreDetails,
  queryFitnessScoreSummary,
  type FitnessScoreDetailRecord,
  type FitnessScoreSummaryRecord
} from '@/mock/fitnessScores'
import {
  FITNESS_VIDEO_DETAIL_COLUMNS,
  FITNESS_VIDEO_HIGHLIGHTS,
  FITNESS_VIDEO_STATS,
  getFitnessVideoDetailRecords,
  type FitnessVideoDetailRecord,
  type FitnessVideoSummaryRecord
} from '@/mock/fitnessVideos'

const router = useRouter()
const ACCOUNT_MENU_ID = 'accounts'
const STUDENT_MENU_ID = 'students'
const SCORE_MENU_ID = 'scores'
const VIDEO_MENU_ID = 'videos'
const activeMenuId = ref('dashboard')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const tableLoading = ref(false)
const accountRows = ref<FitnessAccountRecord[]>([])
const accountTotal = ref(FITNESS_ACCOUNT_TOTAL)
const accountRoleFilter = ref<FitnessAccountRoleLabel | ''>('')
const accountStatusFilter = ref<FitnessAccountStatus | ''>('')
const studentRows = ref<FitnessStudentRecord[]>([])
const studentTotal = ref(FITNESS_STUDENT_TOTAL)
const studentGradeFilter = ref('')
const studentClassFilter = ref('')
const studentFaceStatusFilter = ref('')
const studentQualityFilter = ref('')
const studentEditorVisible = ref(false)
const scoreRows = ref<FitnessScoreSummaryRecord[]>(queryFitnessScoreSummary({}))
const scoreProjectFilter = ref('')
const scoreSourceFilter = ref('')
const scoreStatusFilter = ref('')
const scoreDetailVisible = ref(false)
const scoreDetailBatchId = ref('')
const scoreDetailTitle = ref('成绩详情')
const scoreDetailKeyword = ref('')
const scoreDetailClassFilter = ref('')
const scoreDetailResultFilter = ref('')
const scoreDetailStatusFilter = ref('')
const scoreDetailRows = ref<FitnessScoreDetailRecord[]>([])
const scoreDetailPage = ref(1)
const scoreDetailPageSize = ref(10)
const videoDetailVisible = ref(false)
const videoDetailTitle = ref('视频片段详情')
const videoDetailRows = ref<FitnessVideoDetailRecord[]>([])
const currentVideoClip = ref<FitnessVideoDetailRecord | null>(null)
const studentEditForm = ref<FitnessStudentRecord>({
  studentId: '',
  studentName: '',
  gender: '男',
  gradeName: '七年级',
  className: '',
  facePhotoUrl: '',
  faceStatus: '已同步设备',
  quality: '合格',
  captureChannel: 'H5采集',
  updatedAt: ''
})

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

const isAccountMenu = computed(() => activeMenu.value.id === ACCOUNT_MENU_ID)
const isStudentMenu = computed(() => activeMenu.value.id === STUDENT_MENU_ID)
const isScoreMenu = computed(() => activeMenu.value.id === SCORE_MENU_ID)
const isVideoMenu = computed(() => activeMenu.value.id === VIDEO_MENU_ID)
const hasRemotePagination = computed(() => isAccountMenu.value || isStudentMenu.value)
const accountRoleOptions = FITNESS_ACCOUNT_ROLE_OPTIONS
const accountStatusOptions = FITNESS_ACCOUNT_STATUS_OPTIONS
const studentGradeOptions = FITNESS_STUDENT_GRADE_OPTIONS.filter((item) => item !== '全部')
const studentClassOptions = FITNESS_STUDENT_CLASS_OPTIONS.filter((item) => item !== '全部')
const studentFaceStatusOptions = FITNESS_STUDENT_FACE_STATUS_OPTIONS.filter((item) => item !== '全部')
const studentQualityOptions = FITNESS_STUDENT_QUALITY_OPTIONS.filter((item) => item !== '全部')
const studentEditableGradeOptions = studentGradeOptions
const studentEditableClassOptions = studentClassOptions
const studentEditableFaceStatusOptions = studentFaceStatusOptions
const studentEditableQualityOptions = studentQualityOptions
const scoreProjectOptions = FITNESS_SCORE_PROJECT_OPTIONS
const scoreSourceOptions = FITNESS_SCORE_SOURCE_OPTIONS
const scoreStatusOptions = FITNESS_SCORE_STATUS_OPTIONS
const scoreDetailColumns = FITNESS_SCORE_DETAIL_COLUMNS
const scoreDetailResultOptions = FITNESS_SCORE_DETAIL_RESULT_OPTIONS
const scoreDetailStatusOptions = FITNESS_SCORE_DETAIL_STATUS_OPTIONS
const videoDetailColumns = FITNESS_VIDEO_DETAIL_COLUMNS
const scoreDetailClassOptions = computed(() => {
  if (!scoreDetailBatchId.value) {
    return []
  }

  return getFitnessScoreDetailClassOptions(scoreDetailBatchId.value)
})
const pagedScoreDetailRows = computed(() => {
  const start = (scoreDetailPage.value - 1) * scoreDetailPageSize.value
  const end = start + scoreDetailPageSize.value
  return scoreDetailRows.value.slice(start, end)
})
const displayStats = computed(() => {
  if (isStudentMenu.value) return getFitnessStudentMenuStats()
  if (isScoreMenu.value) return FITNESS_SCORE_STATS
  if (isVideoMenu.value) return FITNESS_VIDEO_STATS
  return activeMenu.value.stats
})
const displayHighlights = computed(() => {
  if (isStudentMenu.value) return FITNESS_STUDENT_HIGHLIGHTS
  if (isScoreMenu.value) return FITNESS_SCORE_HIGHLIGHTS
  if (isVideoMenu.value) return FITNESS_VIDEO_HIGHLIGHTS
  return activeMenu.value.highlights
})

const localFilteredRows = computed(() => {
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

const tableRows = computed(() => {
  if (isAccountMenu.value) {
    return accountRows.value
  }

  if (isStudentMenu.value) {
    return studentRows.value
  }

  if (isScoreMenu.value) {
    return scoreRows.value
  }

  return localFilteredRows.value
})

const totalRowCount = computed(() => {
  if (isAccountMenu.value) {
    return FITNESS_ACCOUNT_TOTAL
  }

  if (isStudentMenu.value) {
    return getFitnessStudentStats().total
  }

  if (isScoreMenu.value) {
    return FITNESS_SCORE_SUMMARY_RECORDS.length
  }

  return activeMenu.value.rows.length
})

const filteredRowCount = computed(() => {
  if (isAccountMenu.value) {
    return accountTotal.value
  }

  if (isStudentMenu.value) {
    return studentTotal.value
  }

  if (isScoreMenu.value) {
    return scoreRows.value.length
  }

  return localFilteredRows.value.length
})

const currentAccount = computed(() => {
  return sessionStorage.getItem(FITNESS_STORAGE_ACCOUNT) ?? 'fitness_admin'
})

const handleSelect = (index: string) => {
  activeMenuId.value = index
}

const resetSearch = () => {
  searchKeyword.value = ''
  accountRoleFilter.value = ''
  accountStatusFilter.value = ''
  studentGradeFilter.value = ''
  studentClassFilter.value = ''
  studentFaceStatusFilter.value = ''
  studentQualityFilter.value = ''
  scoreProjectFilter.value = ''
  scoreSourceFilter.value = ''
  scoreStatusFilter.value = ''
  currentPage.value = 1
}

const loadAccountRows = () => {
  if (!isAccountMenu.value) {
    return
  }

  tableLoading.value = true

  const { total, list } = queryFitnessAccounts({
    keyword: searchKeyword.value,
    role: accountRoleFilter.value,
    status: accountStatusFilter.value,
    page: currentPage.value,
    pageSize: pageSize.value
  })

  accountRows.value = list
  accountTotal.value = total
  tableLoading.value = false
}

const loadStudentRows = () => {
  if (!isStudentMenu.value) {
    return
  }

  tableLoading.value = true

  const { total, list } = queryFitnessStudents({
    keyword: searchKeyword.value,
    gradeName: studentGradeFilter.value,
    className: studentClassFilter.value,
    faceStatus: studentFaceStatusFilter.value,
    quality: studentQualityFilter.value,
    page: currentPage.value,
    pageSize: pageSize.value
  })

  studentRows.value = list
  studentTotal.value = total
  tableLoading.value = false
}

const loadScoreRows = () => {
  scoreRows.value = queryFitnessScoreSummary({
    keyword: searchKeyword.value,
    project: scoreProjectFilter.value,
    source: scoreSourceFilter.value,
    status: scoreStatusFilter.value
  })
}

const loadScoreDetailRows = () => {
  if (!scoreDetailBatchId.value) {
    scoreDetailRows.value = []
    return
  }

  scoreDetailRows.value = queryFitnessScoreDetails({
    batchId: scoreDetailBatchId.value,
    keyword: scoreDetailKeyword.value,
    className: scoreDetailClassFilter.value,
    resultLevel: scoreDetailResultFilter.value,
    scoreStatus: scoreDetailStatusFilter.value
  })
}

const refreshRemoteRows = () => {
  if (isAccountMenu.value) {
    loadAccountRows()
    return
  }

  if (isStudentMenu.value) {
    loadStudentRows()
    return
  }

  if (isScoreMenu.value) {
    loadScoreRows()
  }
}

const setAccountStatus = (row: FitnessAccountRecord, status: FitnessAccountStatus) => {
  if (row.status === status) {
    return
  }

  const updated = updateFitnessAccountStatus(row.account, status)

  if (!updated) {
    ElMessage.error('账号状态更新失败')
    return
  }

  row.status = status
  loadAccountRows()
  ElMessage.success(`${row.name} 已${status}`)
}

const openStudentEditor = (row: FitnessStudentRecord) => {
  studentEditForm.value = { ...row }
  studentEditorVisible.value = true
}

const openScoreDetail = (row: FitnessScoreSummaryRecord) => {
  scoreDetailBatchId.value = row.batchId
  scoreDetailTitle.value = `${row.project} 明细`
  scoreDetailKeyword.value = ''
  scoreDetailClassFilter.value = ''
  scoreDetailResultFilter.value = ''
  scoreDetailStatusFilter.value = ''
  scoreDetailPage.value = 1
  scoreDetailPageSize.value = 10
  loadScoreDetailRows()
  scoreDetailVisible.value = true
}

const openVideoDetail = (row: FitnessVideoSummaryRecord) => {
  videoDetailTitle.value = `${row.deviceName} 视频时段列表`
  videoDetailRows.value = getFitnessVideoDetailRecords(row.videoId)
  currentVideoClip.value = videoDetailRows.value[0] ?? null
  videoDetailVisible.value = true
}

const playVideoClip = (row: FitnessVideoDetailRecord) => {
  currentVideoClip.value = row
}

const handleStudentPhotoChange = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) {
    return
  }

  studentEditForm.value.facePhotoUrl = URL.createObjectURL(uploadFile.raw)
}

const submitStudentEdit = () => {
  if (!studentEditForm.value.studentName.trim()) {
    ElMessage.warning('请输入学生姓名')
    return
  }

  if (!studentEditForm.value.className.trim()) {
    ElMessage.warning('请输入班级')
    return
  }

  if (!studentEditForm.value.facePhotoUrl.trim()) {
    ElMessage.warning('请上传或填写人脸照片')
    return
  }

  const updated = updateFitnessStudent({ ...studentEditForm.value })

  if (!updated) {
    ElMessage.error('学生信息保存失败')
    return
  }

  studentEditorVisible.value = false
  loadStudentRows()
  ElMessage.success('学生信息已更新')
}

const removeStudent = async (row: FitnessStudentRecord) => {
  try {
    await ElMessageBox.confirm(`确认删除学生 ${row.studentName}（${row.studentId}）吗？删除后不可恢复。`, '删除提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  const deleted = deleteFitnessStudent(row.studentId)

  if (!deleted) {
    ElMessage.error('删除失败，记录不存在')
    return
  }

  if (studentRows.value.length === 1 && currentPage.value > 1) {
    currentPage.value -= 1
  }

  loadStudentRows()
  ElMessage.success('学生记录已删除')
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
    return
  }

  refreshRemoteRows()
})

watch(activeMenuId, () => {
  searchKeyword.value = ''
  accountRoleFilter.value = ''
  accountStatusFilter.value = ''
  studentGradeFilter.value = ''
  studentClassFilter.value = ''
  studentFaceStatusFilter.value = ''
  studentQualityFilter.value = ''
  scoreProjectFilter.value = ''
  scoreSourceFilter.value = ''
  scoreStatusFilter.value = ''
  currentPage.value = 1

  refreshRemoteRows()
})

watch([searchKeyword, accountRoleFilter, accountStatusFilter], () => {
  if (isAccountMenu.value) {
    currentPage.value = 1
    loadAccountRows()
  }
})

watch([searchKeyword, studentGradeFilter, studentClassFilter, studentFaceStatusFilter, studentQualityFilter], () => {
  if (isStudentMenu.value) {
    currentPage.value = 1
    loadStudentRows()
  }
})

watch([searchKeyword, scoreProjectFilter, scoreSourceFilter, scoreStatusFilter], () => {
  if (isScoreMenu.value) {
    loadScoreRows()
  }
})

watch([scoreDetailKeyword, scoreDetailClassFilter, scoreDetailResultFilter, scoreDetailStatusFilter], () => {
  if (scoreDetailVisible.value) {
    scoreDetailPage.value = 1
    loadScoreDetailRows()
  }
})

watch([currentPage, pageSize], () => {
  if (hasRemotePagination.value) {
    refreshRemoteRows()
  }
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

.fitness-manage-header-desc {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.8;
  color: #526173;
}

.fitness-manage-header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.fitness-manage-header-chip {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 13px;
  font-weight: 600;
}

.fitness-manage-header-notes {
  display: grid;
  gap: 8px;
  margin-top: 18px;
}

.fitness-manage-header-notes p {
  margin: 0;
  color: #526173;
  line-height: 1.7;
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

.fitness-filter-select {
  width: 140px;
}

.fitness-filter-select-wide {
  width: 180px;
}

.fitness-detail-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.fitness-data-table :deep(.el-table__cell) {
  padding-top: 12px;
  padding-bottom: 12px;
}

.fitness-photo-cell {
  display: flex;
  justify-content: center;
}

.fitness-photo-image {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.26);
}

.fitness-photo-image-preview {
  width: 88px;
  height: 88px;
}

.fitness-status-actions {
  display: flex;
  gap: 8px;
}

.fitness-row-actions {
  display: flex;
  gap: 8px;
}

.fitness-edit-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 16px;
}

.fitness-edit-form-full {
  grid-column: 1 / -1;
}

.fitness-upload-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.fitness-dialog-actions {
  display: flex;
  justify-content: flex-end;
}

.fitness-video-player-panel {
  margin-bottom: 18px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
}

.fitness-video-player-meta h4 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.fitness-video-player-meta p {
  margin: 8px 0 14px;
  color: #64748b;
}

.fitness-video-player {
  width: 100%;
  max-height: 420px;
  border-radius: 14px;
  background: #000;
}

.fitness-detail-pagination {
  margin-top: 16px;
}

.fitness-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
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

  .fitness-filter-select,
  .fitness-filter-select-wide {
    width: 100%;
  }

  .fitness-edit-form {
    grid-template-columns: 1fr;
  }

  .fitness-upload-row,
  .fitness-detail-toolbar,
  .fitness-row-actions,
  .fitness-status-actions {
    flex-wrap: wrap;
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