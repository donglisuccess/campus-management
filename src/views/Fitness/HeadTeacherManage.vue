<template>
  <section class="fitness-head-page">
    <aside class="fitness-head-side">
      <div class="fitness-head-brand">
        <p class="fitness-head-kicker">Smart PE Head Teacher</p>
        <h1>班主任班级跟踪台</h1>
        <p>聚焦班级训练参与率、照片补采和成绩异常跟进。</p>
      </div>

      <div class="fitness-head-user">
        <span>当前班主任账号</span>
        <strong>{{ currentAccount }}</strong>
        <em>{{ managedClassName }}</em>
      </div>

      <el-menu :default-active="activeMenuId" class="fitness-head-menu" @select="handleSelect">
        <el-menu-item v-for="item in menuItems" :key="item.id" :index="item.id">
          {{ item.title }}
        </el-menu-item>
      </el-menu>

      <div class="fitness-head-actions">
        <el-button class="fitness-head-ghost" @click="goLogin">返回登录页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="fitness-head-main">
      <header class="fitness-head-header">
        <p class="fitness-head-header-kicker">{{ activeMenu.subtitle }}</p>
        <h2>{{ activeMenu.title }}</h2>
        <p class="fitness-head-header-desc">{{ activeMenu.description }}</p>
      </header>

      <section class="fitness-head-stat-grid">
        <article v-for="item in activeStats" :key="item.label" class="fitness-head-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section v-if="activeMenuId === 'dashboard'" class="fitness-head-dashboard-grid">
        <el-card class="fitness-head-panel" shadow="never">
          <template #header>
            <div class="fitness-head-panel-head">
              <div>
                <h3>待补采与待审核</h3>
                <p>班主任优先处理人脸状态未完成的学生。</p>
              </div>
            </div>
          </template>

          <el-table :data="faceAlertRows" border stripe>
            <el-table-column prop="studentId" label="学号" min-width="130" />
            <el-table-column prop="studentName" label="姓名" min-width="100" />
            <el-table-column prop="faceStatus" label="人脸状态" min-width="110" />
            <el-table-column prop="quality" label="照片质量" min-width="120" />
            <el-table-column prop="updatedAt" label="最近更新" min-width="170" />
          </el-table>
        </el-card>

        <el-card class="fitness-head-panel" shadow="never">
          <template #header>
            <div class="fitness-head-panel-head">
              <div>
                <h3>成绩等级分布</h3>
                <p>查看本班当前成绩结构，便于提醒训练薄弱学生。</p>
              </div>
            </div>
          </template>

          <div class="fitness-head-level-grid">
            <article v-for="item in scoreLevelCards" :key="item.label" class="fitness-head-level-card">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
        </el-card>
      </section>

      <el-card v-else-if="activeMenuId === 'students'" class="fitness-head-panel" shadow="never">
        <template #header>
          <div class="fitness-head-panel-head fitness-head-panel-head--toolbar">
            <div>
              <h3>班级学生台账</h3>
              <p>按学号、姓名、人脸状态快速筛选当前班级学生。</p>
            </div>

            <div class="fitness-head-toolbar">
              <el-input v-model="studentKeyword" placeholder="搜索学号、姓名" clearable class="fitness-head-search" />
              <el-select v-model="studentFaceStatusFilter" placeholder="人脸状态" clearable class="fitness-head-filter">
                <el-option v-for="item in studentFaceStatusOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="studentQualityFilter" placeholder="照片质量" clearable class="fitness-head-filter">
                <el-option v-for="item in studentQualityOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-button @click="resetStudentFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredStudents" border stripe>
          <el-table-column prop="studentId" label="学号" min-width="140" />
          <el-table-column prop="studentName" label="姓名" min-width="100" />
          <el-table-column prop="gender" label="性别" min-width="80" />
          <el-table-column prop="facePhotoUrl" label="人脸照片" min-width="110">
            <template #default="scope">
              <div class="fitness-head-photo-cell">
                <el-image
                  :src="scope.row.facePhotoUrl"
                  fit="cover"
                  :preview-src-list="[scope.row.facePhotoUrl]"
                  preview-teleported
                  class="fitness-head-photo-image"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="faceStatus" label="人脸状态" min-width="120" />
          <el-table-column prop="quality" label="照片质量" min-width="130" />
          <el-table-column prop="captureChannel" label="采集方式" min-width="110" />
          <el-table-column prop="updatedAt" label="最近更新" min-width="170" />
        </el-table>
      </el-card>

      <el-card v-else-if="activeMenuId === 'photos'" class="fitness-head-panel" shadow="never">
        <template #header>
          <div class="fitness-head-panel-head fitness-head-panel-head--toolbar">
            <div>
              <h3>照片补采跟进</h3>
              <p>集中查看待重采、待审核和质量异常学生。</p>
            </div>

            <div class="fitness-head-toolbar">
              <el-input v-model="photoKeyword" placeholder="搜索学号、姓名" clearable class="fitness-head-search" />
              <el-button @click="photoKeyword = ''">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredPhotoRows" border stripe>
          <el-table-column prop="studentId" label="学号" min-width="140" />
          <el-table-column prop="studentName" label="姓名" min-width="100" />
          <el-table-column prop="facePhotoUrl" label="当前照片" min-width="110">
            <template #default="scope">
              <div class="fitness-head-photo-cell">
                <el-image
                  :src="scope.row.facePhotoUrl"
                  fit="cover"
                  :preview-src-list="[scope.row.facePhotoUrl]"
                  preview-teleported
                  class="fitness-head-photo-image"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="faceStatus" label="人脸状态" min-width="120" />
          <el-table-column prop="quality" label="质量问题" min-width="130" />
          <el-table-column prop="updatedAt" label="最近更新" min-width="170" />
        </el-table>
      </el-card>

      <el-card v-else class="fitness-head-panel" shadow="never">
        <template #header>
          <div class="fitness-head-panel-head fitness-head-panel-head--toolbar">
            <div>
              <h3>班级成绩跟踪</h3>
              <p>查看本班学生训练成绩明细并定位待复核记录。</p>
            </div>

            <div class="fitness-head-toolbar">
              <el-input v-model="scoreKeyword" placeholder="搜索学号、姓名" clearable class="fitness-head-search" />
              <el-select v-model="scoreResultFilter" placeholder="等级筛选" clearable class="fitness-head-filter">
                <el-option v-for="item in scoreResultOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="scoreStatusFilter" placeholder="入库状态" clearable class="fitness-head-filter">
                <el-option v-for="item in scoreStatusOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-button @click="resetScoreFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="filteredScores" border stripe>
          <el-table-column prop="studentId" label="学号" min-width="140" />
          <el-table-column prop="studentName" label="姓名" min-width="100" />
          <el-table-column prop="score" label="成绩" min-width="90" />
          <el-table-column prop="resultLevel" label="等级" min-width="100" />
          <el-table-column prop="scoreStatus" label="入库状态" min-width="110" />
          <el-table-column prop="uploadTime" label="上传时间" min-width="170" />
        </el-table>
      </el-card>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  FITNESS_STUDENT_FACE_STATUS_OPTIONS,
  FITNESS_STUDENT_QUALITY_OPTIONS,
  FITNESS_STUDENT_RECORDS,
  type FitnessStudentRecord
} from '@/mock/fitnessStudents'
import {
  FITNESS_SCORE_DETAIL_RECORDS,
  FITNESS_SCORE_DETAIL_RESULT_OPTIONS,
  FITNESS_SCORE_DETAIL_STATUS_OPTIONS,
  type FitnessScoreDetailRecord
} from '@/mock/fitnessScores'
import { FITNESS_STORAGE_ACCOUNT, FITNESS_STORAGE_ROLE } from '@/mock/fitnessPlatform'

interface HeadTeacherMenuItem {
  id: 'dashboard' | 'students' | 'photos' | 'scores'
  title: string
  subtitle: string
  description: string
}

const router = useRouter()

const menuItems: HeadTeacherMenuItem[] = [
  {
    id: 'dashboard',
    title: '班级总览',
    subtitle: 'Class Overview',
    description: '查看本班学生规模、照片采集状态和成绩异常分布。'
  },
  {
    id: 'students',
    title: '学生台账',
    subtitle: 'Student Ledger',
    description: '按学号、姓名和人脸状态查看班级学生档案。'
  },
  {
    id: 'photos',
    title: '照片补采',
    subtitle: 'Photo Follow-up',
    description: '聚焦待重采、待审核和质量异常照片。'
  },
  {
    id: 'scores',
    title: '成绩跟踪',
    subtitle: 'Score Tracking',
    description: '跟踪班级训练成绩，定位待复核与异常数据。'
  }
]

const activeMenuId = ref<HeadTeacherMenuItem['id']>('dashboard')
const studentKeyword = ref('')
const studentFaceStatusFilter = ref('')
const studentQualityFilter = ref('')
const photoKeyword = ref('')
const scoreKeyword = ref('')
const scoreResultFilter = ref('')
const scoreStatusFilter = ref('')

const currentAccount = computed(() => sessionStorage.getItem(FITNESS_STORAGE_ACCOUNT) ?? 'class_master_03')

const managedClassName = computed(() => {
  const match = currentAccount.value.match(/(\d+)$/)
  const classNo = match ? Number(match[1]) : 3
  const normalizedClassNo = classNo > 0 ? ((classNo - 1) % 58) + 1 : 3
  return `七年级${normalizedClassNo}班`
})

const activeMenu = computed(() => menuItems.find((item) => item.id === activeMenuId.value) ?? menuItems[0])

const classStudents = computed(() => {
  return FITNESS_STUDENT_RECORDS.filter((item) => item.className === managedClassName.value)
})

const classStudentIdSet = computed(() => new Set(classStudents.value.map((item) => item.studentId)))

const classScores = computed(() => {
  return FITNESS_SCORE_DETAIL_RECORDS.filter((item) => classStudentIdSet.value.has(item.studentId))
})

const faceAlertRows = computed(() => {
  return classStudents.value
    .filter((item) => item.faceStatus === '待重采' || item.faceStatus === '待审核' || item.quality !== '合格')
    .slice(0, 10)
})

const scoreLevelCards = computed(() => {
  const excellent = classScores.value.filter((item) => item.resultLevel === '优秀').length
  const good = classScores.value.filter((item) => item.resultLevel === '良好').length
  const pass = classScores.value.filter((item) => item.resultLevel === '及格').length
  const pending = classScores.value.filter((item) => item.resultLevel === '待复核').length

  return [
    { label: '优秀', value: `${excellent}` },
    { label: '良好', value: `${good}` },
    { label: '及格', value: `${pass}` },
    { label: '待复核', value: `${pending}` }
  ]
})

const activeStats = computed(() => {
  if (activeMenuId.value === 'students') {
    return [
      { label: '班级人数', value: `${classStudents.value.length}` },
      { label: '已采集', value: `${classStudents.value.filter((item) => item.faceStatus === '已同步设备' || item.faceStatus === '已入库').length}` },
      { label: '待补采', value: `${classStudents.value.filter((item) => item.faceStatus === '待重采').length}` },
      { label: '待审核', value: `${classStudents.value.filter((item) => item.faceStatus === '待审核').length}` }
    ]
  }

  if (activeMenuId.value === 'photos') {
    return [
      { label: '待重采', value: `${classStudents.value.filter((item) => item.faceStatus === '待重采').length}` },
      { label: '待审核', value: `${classStudents.value.filter((item) => item.faceStatus === '待审核').length}` },
      { label: '像素不足', value: `${classStudents.value.filter((item) => item.quality === '像素不足').length}` },
      { label: '照片模糊', value: `${classStudents.value.filter((item) => item.quality === '照片模糊').length}` }
    ]
  }

  if (activeMenuId.value === 'scores') {
    return [
      { label: '成绩记录', value: `${classScores.value.length}` },
      { label: '已入库', value: `${classScores.value.filter((item) => item.scoreStatus === '已入库').length}` },
      { label: '待复核', value: `${classScores.value.filter((item) => item.scoreStatus === '待复核').length}` },
      { label: '异常记录', value: `${classScores.value.filter((item) => item.scoreStatus === '异常').length}` }
    ]
  }

  return [
    { label: '班级人数', value: `${classStudents.value.length}` },
    { label: '待补采', value: `${classStudents.value.filter((item) => item.faceStatus === '待重采').length}` },
    { label: '质量异常', value: `${classStudents.value.filter((item) => item.quality !== '合格').length}` },
    { label: '成绩待复核', value: `${classScores.value.filter((item) => item.scoreStatus !== '已入库').length}` }
  ]
})

const filteredStudents = computed(() => {
  const keyword = studentKeyword.value.trim().toLowerCase()

  return classStudents.value.filter((item) => {
    if (studentFaceStatusFilter.value && item.faceStatus !== studentFaceStatusFilter.value) {
      return false
    }

    if (studentQualityFilter.value && item.quality !== studentQualityFilter.value) {
      return false
    }

    if (!keyword) {
      return true
    }

    return item.studentId.toLowerCase().includes(keyword) || item.studentName.toLowerCase().includes(keyword)
  })
})

const filteredPhotoRows = computed(() => {
  const keyword = photoKeyword.value.trim().toLowerCase()

  return classStudents.value.filter((item) => {
    const shouldDisplay = item.faceStatus === '待重采' || item.faceStatus === '待审核' || item.quality !== '合格'

    if (!shouldDisplay) {
      return false
    }

    if (!keyword) {
      return true
    }

    return item.studentId.toLowerCase().includes(keyword) || item.studentName.toLowerCase().includes(keyword)
  })
})

const filteredScores = computed(() => {
  const keyword = scoreKeyword.value.trim().toLowerCase()

  return classScores.value.filter((item) => {
    if (scoreResultFilter.value && item.resultLevel !== scoreResultFilter.value) {
      return false
    }

    if (scoreStatusFilter.value && item.scoreStatus !== scoreStatusFilter.value) {
      return false
    }

    if (!keyword) {
      return true
    }

    return item.studentId.toLowerCase().includes(keyword) || item.studentName.toLowerCase().includes(keyword)
  })
})

const studentFaceStatusOptions = FITNESS_STUDENT_FACE_STATUS_OPTIONS.filter((item) => item !== '全部')
const studentQualityOptions = FITNESS_STUDENT_QUALITY_OPTIONS.filter((item) => item !== '全部')
const scoreResultOptions = FITNESS_SCORE_DETAIL_RESULT_OPTIONS
const scoreStatusOptions = FITNESS_SCORE_DETAIL_STATUS_OPTIONS

const handleSelect = (index: string) => {
  activeMenuId.value = index as HeadTeacherMenuItem['id']
}

const resetStudentFilters = () => {
  studentKeyword.value = ''
  studentFaceStatusFilter.value = ''
  studentQualityFilter.value = ''
}

const resetScoreFilters = () => {
  scoreKeyword.value = ''
  scoreResultFilter.value = ''
  scoreStatusFilter.value = ''
}

const goLogin = () => {
  void router.push('/fitness')
}

const logout = () => {
  sessionStorage.removeItem(FITNESS_STORAGE_ROLE)
  sessionStorage.removeItem(FITNESS_STORAGE_ACCOUNT)
  ElMessage.success('已退出班主任跟踪台')
  void router.push('/fitness')
}

onMounted(() => {
  const role = sessionStorage.getItem(FITNESS_STORAGE_ROLE)

  if (role !== 'headTeacher') {
    ElMessage.warning('请先使用班主任账号登录')
    void router.replace('/fitness')
  }
})
</script>

<style scoped>
.fitness-head-page {
  min-height: calc(100vh - 96px);
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
}

.fitness-head-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 20px;
  border-radius: 26px;
  background: linear-gradient(165deg, #312e81 0%, #1d4ed8 60%, #22c55e 100%);
  color: #f8fafc;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.16);
}

.fitness-head-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.82;
}

.fitness-head-brand h1 {
  margin-top: 8px;
  font-size: 30px;
  line-height: 1.12;
}

.fitness-head-brand p:last-child {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(248, 250, 252, 0.88);
}

.fitness-head-user {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
}

.fitness-head-user span,
.fitness-head-user strong,
.fitness-head-user em {
  display: block;
}

.fitness-head-user span {
  font-size: 12px;
  opacity: 0.78;
}

.fitness-head-user strong {
  margin-top: 8px;
  font-size: 20px;
  font-style: normal;
}

.fitness-head-user em {
  margin-top: 6px;
  font-style: normal;
  color: rgba(248, 250, 252, 0.86);
}

.fitness-head-menu {
  border: none;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.fitness-head-menu :deep(.el-menu-item) {
  color: #f8fafc;
  background: transparent;
}

.fitness-head-menu :deep(.el-menu-item.is-active) {
  color: #1e1b4b;
  background: #e0e7ff;
}

.fitness-head-actions {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.fitness-head-ghost {
  border-color: rgba(255, 255, 255, 0.28);
  color: #f8fafc;
  background: transparent;
}

.fitness-head-main {
  display: grid;
  gap: 18px;
}

.fitness-head-header {
  padding: 24px 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.fitness-head-header-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.fitness-head-header h2 {
  margin-top: 8px;
  font-size: 32px;
  color: #0f172a;
}

.fitness-head-header-desc {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.8;
  color: #526173;
}

.fitness-head-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.fitness-head-stat-card {
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(238, 242, 255, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.fitness-head-stat-card span,
.fitness-head-stat-card strong {
  display: block;
}

.fitness-head-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.fitness-head-stat-card strong {
  margin-top: 10px;
  font-size: 28px;
  color: #0f172a;
}

.fitness-head-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 18px;
}

.fitness-head-panel {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
}

.fitness-head-panel-head h3 {
  font-size: 22px;
  color: #0f172a;
}

.fitness-head-panel-head p {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.fitness-head-panel-head--toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fitness-head-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.fitness-head-search {
  width: 240px;
}

.fitness-head-filter {
  width: 150px;
}

.fitness-head-level-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.fitness-head-level-card {
  padding: 18px;
  border-radius: 18px;
  background: rgba(29, 78, 216, 0.06);
}

.fitness-head-level-card span,
.fitness-head-level-card strong {
  display: block;
}

.fitness-head-level-card span {
  color: #64748b;
}

.fitness-head-level-card strong {
  margin-top: 8px;
  font-size: 24px;
  color: #0f172a;
}

.fitness-head-photo-cell {
  display: flex;
  justify-content: center;
}

.fitness-head-photo-image {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.26);
}

@media (max-width: 1180px) {
  .fitness-head-page,
  .fitness-head-dashboard-grid {
    grid-template-columns: 1fr;
  }

  .fitness-head-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .fitness-head-stat-grid,
  .fitness-head-level-grid {
    grid-template-columns: 1fr;
  }

  .fitness-head-panel-head--toolbar,
  .fitness-head-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .fitness-head-search,
  .fitness-head-filter {
    width: 100%;
  }

  .fitness-head-side,
  .fitness-head-header {
    padding: 18px;
  }

  .fitness-head-header h2 {
    font-size: 26px;
  }
}
</style>