<template>
  <section class="fitness-teacher-page">
    <aside class="fitness-teacher-side">
      <div class="fitness-teacher-brand">
        <p class="fitness-teacher-kicker">Smart PE Teacher</p>
        <h1>体育教师工作台</h1>
        <p>围绕训练成绩、视频回看和设备联动的教师侧业务入口。</p>
      </div>

      <div class="fitness-teacher-user">
        <span>当前教师账号</span>
        <strong>{{ currentAccount }}</strong>
      </div>

      <el-menu :default-active="activeMenuId" class="fitness-teacher-menu" @select="handleSelect">
        <el-menu-item v-for="item in menuItems" :key="item.id" :index="item.id">
          {{ item.title }}
        </el-menu-item>
      </el-menu>

      <div class="fitness-teacher-actions">
        <el-button class="fitness-teacher-ghost" @click="goLogin">返回登录页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="fitness-teacher-main">
      <header class="fitness-teacher-header">
        <p class="fitness-teacher-header-kicker">{{ activeMenu.subtitle }}</p>
        <h2>{{ activeMenu.title }}</h2>
        <p class="fitness-teacher-header-desc">{{ activeMenu.description }}</p>
      </header>

      <section class="fitness-teacher-stat-grid">
        <article v-for="item in activeStats" :key="item.label" class="fitness-teacher-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section v-if="activeMenuId === 'dashboard'" class="fitness-teacher-dashboard-grid">
        <el-card class="fitness-teacher-panel" shadow="never">
          <template #header>
            <div class="fitness-teacher-panel-head">
              <div>
                <h3>待处理成绩批次</h3>
                <p>优先处理待复核和部分中断的成绩批次。</p>
              </div>
            </div>
          </template>

          <el-table :data="pendingScoreRows" border stripe>
            <el-table-column prop="project" label="训练项目" min-width="130" />
            <el-table-column prop="source" label="来源" min-width="120" />
            <el-table-column prop="count" label="记录数" min-width="100" />
            <el-table-column prop="status" label="状态" min-width="110" />
            <el-table-column prop="updatedAt" label="更新时间" min-width="170" />
            <el-table-column label="操作" min-width="120">
              <template #default="scope">
                <el-button size="small" type="primary" plain @click="openScoreDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="fitness-teacher-panel" shadow="never">
          <template #header>
            <div class="fitness-teacher-panel-head">
              <div>
                <h3>设备联动概览</h3>
                <p>体育教师可查看训练设备状态并执行同步。</p>
              </div>
            </div>
          </template>

          <div class="fitness-teacher-device-list">
            <article v-for="item in deviceRows" :key="item.deviceId" class="fitness-teacher-device-card">
              <div>
                <strong>{{ item.deviceName }}</strong>
                <p>{{ item.location }} · {{ item.ip }}</p>
              </div>
              <el-tag :type="deviceTagType(item.status)" effect="light">{{ item.status }}</el-tag>
            </article>
          </div>
        </el-card>
      </section>

      <el-card v-else-if="activeMenuId === 'scores'" class="fitness-teacher-panel" shadow="never">
        <template #header>
          <div class="fitness-teacher-panel-head fitness-teacher-panel-head--toolbar">
            <div>
              <h3>训练成绩列表</h3>
              <p>支持按项目、来源、处理状态筛选当前教师关注的成绩批次。</p>
            </div>

            <div class="fitness-teacher-toolbar">
              <el-input v-model="scoreKeyword" placeholder="搜索项目、来源、状态" clearable class="fitness-teacher-search" />
              <el-select v-model="scoreProjectFilter" placeholder="项目筛选" clearable class="fitness-teacher-filter">
                <el-option v-for="item in scoreProjectOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="scoreSourceFilter" placeholder="来源筛选" clearable class="fitness-teacher-filter">
                <el-option v-for="item in scoreSourceOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="scoreStatusFilter" placeholder="状态筛选" clearable class="fitness-teacher-filter">
                <el-option v-for="item in scoreStatusOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-button @click="resetScoreFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="scoreRows" border stripe>
          <el-table-column prop="project" label="训练项目" min-width="140" />
          <el-table-column prop="source" label="数据来源" min-width="120" />
          <el-table-column prop="count" label="记录数" min-width="110" />
          <el-table-column prop="status" label="处理状态" min-width="110" />
          <el-table-column prop="updatedAt" label="最近更新时间" min-width="180" />
          <el-table-column label="操作" min-width="120">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="openScoreDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="activeMenuId === 'videos'" class="fitness-teacher-panel" shadow="never">
        <template #header>
          <div class="fitness-teacher-panel-head fitness-teacher-panel-head--toolbar">
            <div>
              <h3>训练视频回看</h3>
              <p>按设备查看视频片段，便于课堂复盘和成绩复核。</p>
            </div>

            <div class="fitness-teacher-toolbar">
              <el-input v-model="videoKeyword" placeholder="搜索区域、设备、状态" clearable class="fitness-teacher-search" />
              <el-button @click="videoKeyword = ''">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredVideoRows" border stripe>
          <el-table-column prop="zone" label="区域" min-width="120" />
          <el-table-column prop="deviceName" label="设备名称" min-width="160" />
          <el-table-column prop="duration" label="视频时长" min-width="110" />
          <el-table-column prop="storage" label="空间占用" min-width="110" />
          <el-table-column prop="status" label="留存状态" min-width="110" />
          <el-table-column label="操作" min-width="120">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click="openVideoDetail(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else class="fitness-teacher-panel" shadow="never">
        <template #header>
          <div class="fitness-teacher-panel-head fitness-teacher-panel-head--toolbar">
            <div>
              <h3>设备联动</h3>
              <p>查看设备在线状态，按需完成鉴权并同步学生人脸。</p>
            </div>

            <div class="fitness-teacher-toolbar">
              <el-input v-model="deviceKeyword" placeholder="搜索设备、IP、位置" clearable class="fitness-teacher-search" />
              <el-button @click="deviceKeyword = ''">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredDeviceRows" border stripe>
          <el-table-column prop="deviceName" label="设备名称" min-width="160" />
          <el-table-column prop="ip" label="IP 地址" min-width="140" />
          <el-table-column prop="type" label="项目类型" min-width="110" />
          <el-table-column prop="status" label="在线状态" min-width="110" />
          <el-table-column prop="location" label="位置" min-width="120" />
          <el-table-column prop="storage" label="存储空间" min-width="110" />
          <el-table-column label="操作" min-width="220">
            <template #default="scope">
              <div class="fitness-teacher-row-actions">
                <el-button size="small" type="primary" plain @click="authorizeDevice(scope.row)">鉴权</el-button>
                <el-button
                  size="small"
                  type="success"
                  plain
                  :disabled="scope.row.status !== '在线'"
                  @click="syncDeviceStudents(scope.row)"
                >
                  同步人脸
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>
  </section>

  <el-dialog v-model="scoreDetailVisible" :title="scoreDetailTitle" width="1080px">
    <div class="fitness-teacher-detail-toolbar">
      <el-input v-model="scoreDetailKeyword" placeholder="搜索学号、姓名、班级" clearable class="fitness-teacher-search" />
      <el-select v-model="scoreDetailClassFilter" placeholder="班级筛选" clearable class="fitness-teacher-filter">
        <el-option v-for="item in scoreDetailClassOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="scoreDetailResultFilter" placeholder="等级筛选" clearable class="fitness-teacher-filter">
        <el-option v-for="item in scoreDetailResultOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="scoreDetailStatusFilter" placeholder="入库状态" clearable class="fitness-teacher-filter">
        <el-option v-for="item in scoreDetailStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <el-table :data="scoreDetailRows" border stripe>
      <el-table-column prop="studentId" label="学号" min-width="140" />
      <el-table-column prop="studentName" label="姓名" min-width="100" />
      <el-table-column prop="gender" label="性别" min-width="80" />
      <el-table-column prop="className" label="班级" min-width="140" />
      <el-table-column prop="score" label="成绩" min-width="90" />
      <el-table-column prop="resultLevel" label="等级" min-width="100" />
      <el-table-column prop="scoreStatus" label="入库状态" min-width="110" />
      <el-table-column prop="uploadTime" label="上传时间" min-width="180" />
    </el-table>
  </el-dialog>

  <el-dialog v-model="videoDetailVisible" :title="videoDetailTitle" width="1120px">
    <div v-if="currentVideoClip" class="fitness-teacher-video-player-panel">
      <div class="fitness-teacher-video-player-meta">
        <h4>{{ currentVideoClip.clipName }}</h4>
        <p>{{ currentVideoClip.studentName }} · {{ currentVideoClip.project }} · {{ currentVideoClip.timeRange }}</p>
      </div>
      <video :src="currentVideoClip.videoUrl" controls class="fitness-teacher-video-player"></video>
    </div>

    <el-table :data="videoDetailRows" border stripe>
      <el-table-column prop="timeRange" label="时间段" min-width="130" />
      <el-table-column prop="clipName" label="视频文件" min-width="220" />
      <el-table-column prop="studentName" label="学生" min-width="100" />
      <el-table-column prop="project" label="训练项目" min-width="110" />
      <el-table-column prop="duration" label="时长" min-width="90" />
      <el-table-column prop="storage" label="占用空间" min-width="100" />
      <el-table-column prop="status" label="留存状态" min-width="110" />
      <el-table-column label="操作" min-width="100">
        <template #default="scope">
          <el-button size="small" type="primary" plain @click="playVideoClip(scope.row)">播放</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  authenticateFitnessDevice,
  getFitnessDeviceRecords,
  syncFitnessStudentsToDevice,
  type FitnessDeviceRecord
} from '@/mock/fitnessDevices'
import {
  FITNESS_SCORE_DETAIL_RESULT_OPTIONS,
  FITNESS_SCORE_DETAIL_STATUS_OPTIONS,
  FITNESS_SCORE_PROJECT_OPTIONS,
  FITNESS_SCORE_SOURCE_OPTIONS,
  FITNESS_SCORE_STATUS_OPTIONS,
  FITNESS_SCORE_SUMMARY_RECORDS,
  getFitnessScoreDetailClassOptions,
  queryFitnessScoreDetails,
  queryFitnessScoreSummary,
  type FitnessScoreDetailRecord,
  type FitnessScoreSummaryRecord
} from '@/mock/fitnessScores'
import {
  getFitnessVideoDetailRecords,
  getFitnessVideoSummaryRecords,
  type FitnessVideoDetailRecord,
  type FitnessVideoSummaryRecord
} from '@/mock/fitnessVideos'
import { FITNESS_STORAGE_ACCOUNT, FITNESS_STORAGE_ROLE } from '@/mock/fitnessPlatform'

interface TeacherMenuItem {
  id: 'dashboard' | 'scores' | 'videos' | 'devices'
  title: string
  subtitle: string
  description: string
}

const router = useRouter()

const menuItems: TeacherMenuItem[] = [
  {
    id: 'dashboard',
    title: '教师工作台',
    subtitle: 'Daily Overview',
    description: '汇总查看成绩批次、训练视频和设备联动状态。'
  },
  {
    id: 'scores',
    title: '训练成绩',
    subtitle: 'Score Review',
    description: '筛选训练成绩批次并进入学生维度明细。'
  },
  {
    id: 'videos',
    title: '训练视频',
    subtitle: 'Video Replay',
    description: '按设备查看视频片段，用于课堂复盘和成绩核验。'
  },
  {
    id: 'devices',
    title: '设备联动',
    subtitle: 'Device Sync',
    description: '查看设备状态，执行鉴权和学生人脸同步。'
  }
]

const activeMenuId = ref<TeacherMenuItem['id']>('dashboard')
const scoreKeyword = ref('')
const scoreProjectFilter = ref('')
const scoreSourceFilter = ref('')
const scoreStatusFilter = ref('')
const videoKeyword = ref('')
const deviceKeyword = ref('')

const scoreRows = ref<FitnessScoreSummaryRecord[]>([])
const deviceRows = ref<FitnessDeviceRecord[]>([])
const videoRows = ref<FitnessVideoSummaryRecord[]>([])

const scoreDetailVisible = ref(false)
const scoreDetailBatchId = ref('')
const scoreDetailTitle = ref('成绩详情')
const scoreDetailKeyword = ref('')
const scoreDetailClassFilter = ref('')
const scoreDetailResultFilter = ref('')
const scoreDetailStatusFilter = ref('')
const scoreDetailRows = ref<FitnessScoreDetailRecord[]>([])

const videoDetailVisible = ref(false)
const videoDetailTitle = ref('视频详情')
const videoDetailRows = ref<FitnessVideoDetailRecord[]>([])
const currentVideoClip = ref<FitnessVideoDetailRecord | null>(null)

const currentAccount = computed(() => sessionStorage.getItem(FITNESS_STORAGE_ACCOUNT) ?? 'pe_teacher_01')
const activeMenu = computed(() => menuItems.find((item) => item.id === activeMenuId.value) ?? menuItems[0])

const activeStats = computed(() => {
  if (activeMenuId.value === 'scores') {
    const pending = scoreRows.value.filter((item) => item.status !== '正常').length
    const imported = scoreRows.value.filter((item) => item.source === '表格导入').length

    return [
      { label: '批次数量', value: `${scoreRows.value.length}` },
      { label: '待处理批次', value: `${pending}` },
      { label: '表格导入', value: `${imported}` },
      { label: '训练项目', value: `${new Set(scoreRows.value.map((item) => item.project)).size}` }
    ]
  }

  if (activeMenuId.value === 'videos') {
    const warning = filteredVideoRows.value.filter((item) => item.status !== '正常').length

    return [
      { label: '视频源', value: `${filteredVideoRows.value.length}` },
      { label: '异常留存', value: `${warning}` },
      { label: '首段可播', value: `${videoDetailRows.value.length || 0}` },
      { label: '当前教师', value: currentAccount.value }
    ]
  }

  if (activeMenuId.value === 'devices') {
    const online = deviceRows.value.filter((item) => item.status === '在线').length
    const pending = deviceRows.value.filter((item) => item.status === '待鉴权').length

    return [
      { label: '设备总数', value: `${deviceRows.value.length}` },
      { label: '在线设备', value: `${online}` },
      { label: '待鉴权', value: `${pending}` },
      { label: '当前教师', value: currentAccount.value }
    ]
  }

  const abnormal = FITNESS_SCORE_SUMMARY_RECORDS.filter((item) => item.status !== '正常').length
  const online = deviceRows.value.filter((item) => item.status === '在线').length

  return [
    { label: '待处理批次', value: `${abnormal}` },
    { label: '视频源', value: `${videoRows.value.length}` },
    { label: '在线设备', value: `${online}` },
    { label: '当前教师', value: currentAccount.value }
  ]
})

const pendingScoreRows = computed(() => {
  return FITNESS_SCORE_SUMMARY_RECORDS.filter((item) => item.status !== '正常').slice(0, 6)
})

const filteredVideoRows = computed(() => {
  const keyword = videoKeyword.value.trim().toLowerCase()

  if (!keyword) {
    return videoRows.value
  }

  return videoRows.value.filter((item) => {
    return [item.zone, item.deviceName, item.status, item.storage].some((value) => value.toLowerCase().includes(keyword))
  })
})

const filteredDeviceRows = computed(() => {
  const keyword = deviceKeyword.value.trim().toLowerCase()

  if (!keyword) {
    return deviceRows.value
  }

  return deviceRows.value.filter((item) => {
    return [item.deviceName, item.ip, item.location, item.status, item.type].some((value) => value.toLowerCase().includes(keyword))
  })
})

const scoreProjectOptions = FITNESS_SCORE_PROJECT_OPTIONS
const scoreSourceOptions = FITNESS_SCORE_SOURCE_OPTIONS
const scoreStatusOptions = FITNESS_SCORE_STATUS_OPTIONS
const scoreDetailResultOptions = FITNESS_SCORE_DETAIL_RESULT_OPTIONS
const scoreDetailStatusOptions = FITNESS_SCORE_DETAIL_STATUS_OPTIONS
const scoreDetailClassOptions = computed(() => {
  if (!scoreDetailBatchId.value) {
    return []
  }

  return getFitnessScoreDetailClassOptions(scoreDetailBatchId.value)
})

const loadScoreRows = () => {
  scoreRows.value = queryFitnessScoreSummary({
    keyword: scoreKeyword.value,
    project: scoreProjectFilter.value,
    source: scoreSourceFilter.value,
    status: scoreStatusFilter.value
  })
}

const loadDeviceRows = () => {
  deviceRows.value = [...getFitnessDeviceRecords()]
}

const loadVideoRows = () => {
  videoRows.value = [...getFitnessVideoSummaryRecords()]
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

const handleSelect = (index: string) => {
  activeMenuId.value = index as TeacherMenuItem['id']
}

const resetScoreFilters = () => {
  scoreKeyword.value = ''
  scoreProjectFilter.value = ''
  scoreSourceFilter.value = ''
  scoreStatusFilter.value = ''
}

const openScoreDetail = (row: FitnessScoreSummaryRecord) => {
  scoreDetailBatchId.value = row.batchId
  scoreDetailTitle.value = `${row.project} 成绩明细`
  scoreDetailKeyword.value = ''
  scoreDetailClassFilter.value = ''
  scoreDetailResultFilter.value = ''
  scoreDetailStatusFilter.value = ''
  loadScoreDetailRows()
  scoreDetailVisible.value = true
}

const openVideoDetail = (row: FitnessVideoSummaryRecord) => {
  videoDetailTitle.value = `${row.deviceName} 视频片段`
  videoDetailRows.value = getFitnessVideoDetailRecords(row.videoId)
  currentVideoClip.value = videoDetailRows.value[0] ?? null
  videoDetailVisible.value = true
}

const playVideoClip = (row: FitnessVideoDetailRecord) => {
  currentVideoClip.value = row
}

const deviceTagType = (status: string) => {
  if (status === '在线') return 'success'
  if (status === '待鉴权') return 'warning'
  if (status === '离线') return 'danger'
  return 'info'
}

const authorizeDevice = async (row: FitnessDeviceRecord) => {
  let accessKey = ''

  try {
    const result = await ElMessageBox.prompt(`请输入 ${row.deviceName} 的访问密钥`, '设备鉴权', {
      confirmButtonText: '开始鉴权',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入访问密钥',
      inputValidator: (value) => {
        if (!value.trim()) {
          return '访问密钥不能为空'
        }

        return true
      }
    })

    accessKey = result.value
  } catch {
    return
  }

  const authResult = authenticateFitnessDevice(row.deviceId, accessKey)

  if (!authResult.success) {
    ElMessage.error(authResult.message)
    return
  }

  loadDeviceRows()
  ElMessage.success(authResult.message)
}

const syncDeviceStudents = async (row: FitnessDeviceRecord) => {
  try {
    await ElMessageBox.confirm(`确认将学生人脸同步到 ${row.deviceName} 吗？`, '同步人脸', {
      confirmButtonText: '开始同步',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  const syncResult = syncFitnessStudentsToDevice(row.deviceId)

  if (!syncResult.success) {
    ElMessage.error(syncResult.message)
    return
  }

  ElMessage.success(syncResult.message)
}

const goLogin = () => {
  void router.push('/fitness')
}

const logout = () => {
  sessionStorage.removeItem(FITNESS_STORAGE_ROLE)
  sessionStorage.removeItem(FITNESS_STORAGE_ACCOUNT)
  ElMessage.success('已退出体育教师工作台')
  void router.push('/fitness')
}

onMounted(() => {
  const role = sessionStorage.getItem(FITNESS_STORAGE_ROLE)

  if (role !== 'teacher') {
    ElMessage.warning('请先使用体育教师账号登录')
    void router.replace('/fitness')
    return
  }

  loadScoreRows()
  loadDeviceRows()
  loadVideoRows()
})

watch([scoreKeyword, scoreProjectFilter, scoreSourceFilter, scoreStatusFilter], () => {
  loadScoreRows()
})

watch([scoreDetailKeyword, scoreDetailClassFilter, scoreDetailResultFilter, scoreDetailStatusFilter], () => {
  if (scoreDetailVisible.value) {
    loadScoreDetailRows()
  }
})
</script>

<style scoped>
.fitness-teacher-page {
  min-height: calc(100vh - 96px);
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
}

.fitness-teacher-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 20px;
  border-radius: 26px;
  background: linear-gradient(165deg, #0f172a 0%, #155e75 58%, #0ea5e9 100%);
  color: #f8fafc;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.16);
}

.fitness-teacher-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.82;
}

.fitness-teacher-brand h1 {
  margin-top: 8px;
  font-size: 30px;
  line-height: 1.12;
}

.fitness-teacher-brand p:last-child {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(248, 250, 252, 0.88);
}

.fitness-teacher-user {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
}

.fitness-teacher-user span,
.fitness-teacher-user strong {
  display: block;
}

.fitness-teacher-user span {
  font-size: 12px;
  opacity: 0.78;
}

.fitness-teacher-user strong {
  margin-top: 8px;
  font-size: 20px;
}

.fitness-teacher-menu {
  border: none;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.fitness-teacher-menu :deep(.el-menu-item) {
  color: #f8fafc;
  background: transparent;
}

.fitness-teacher-menu :deep(.el-menu-item.is-active) {
  color: #082f49;
  background: #e0f2fe;
}

.fitness-teacher-actions {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.fitness-teacher-ghost {
  border-color: rgba(255, 255, 255, 0.28);
  color: #f8fafc;
  background: transparent;
}

.fitness-teacher-main {
  display: grid;
  gap: 18px;
}

.fitness-teacher-header {
  padding: 24px 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.fitness-teacher-header-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0369a1;
}

.fitness-teacher-header h2 {
  margin-top: 8px;
  font-size: 32px;
  color: #0f172a;
}

.fitness-teacher-header-desc {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.8;
  color: #526173;
}

.fitness-teacher-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.fitness-teacher-stat-card {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(224, 242, 254, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.fitness-teacher-stat-card span,
.fitness-teacher-stat-card strong {
  display: block;
}

.fitness-teacher-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.fitness-teacher-stat-card strong {
  margin-top: 10px;
  font-size: 28px;
  color: #0f172a;
  word-break: break-word;
}

.fitness-teacher-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 18px;
}

.fitness-teacher-panel {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
}

.fitness-teacher-panel-head h3 {
  font-size: 22px;
  color: #0f172a;
}

.fitness-teacher-panel-head p {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.fitness-teacher-panel-head--toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fitness-teacher-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.fitness-teacher-search {
  width: 240px;
}

.fitness-teacher-filter {
  width: 150px;
}

.fitness-teacher-device-list {
  display: grid;
  gap: 12px;
}

.fitness-teacher-device-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 145, 178, 0.06);
}

.fitness-teacher-device-card strong {
  color: #0f172a;
}

.fitness-teacher-device-card p {
  margin-top: 6px;
  color: #64748b;
}

.fitness-teacher-row-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fitness-teacher-detail-toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.fitness-teacher-video-player-panel {
  margin-bottom: 18px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
}

.fitness-teacher-video-player-meta h4 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.fitness-teacher-video-player-meta p {
  margin: 8px 0 14px;
  color: #64748b;
}

.fitness-teacher-video-player {
  width: 100%;
  max-height: 420px;
  border-radius: 14px;
  background: #000;
}

@media (max-width: 1180px) {
  .fitness-teacher-page,
  .fitness-teacher-dashboard-grid {
    grid-template-columns: 1fr;
  }

  .fitness-teacher-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .fitness-teacher-stat-grid {
    grid-template-columns: 1fr;
  }

  .fitness-teacher-panel-head--toolbar,
  .fitness-teacher-toolbar,
  .fitness-teacher-detail-toolbar,
  .fitness-teacher-row-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .fitness-teacher-search,
  .fitness-teacher-filter {
    width: 100%;
  }

  .fitness-teacher-side,
  .fitness-teacher-header {
    padding: 18px;
  }

  .fitness-teacher-header h2 {
    font-size: 26px;
  }

  .fitness-teacher-device-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>