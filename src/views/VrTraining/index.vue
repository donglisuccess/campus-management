<template>
  <section class="vr-manage-page">
    <aside class="vr-manage-side">
      <div class="vr-manage-brand">
        <p class="vr-manage-kicker">5G Training Cloud</p>
        <h1>{{ currentRole === 'teacher' ? '教师教学管理台' : '学生实训学习中心' }}</h1>
        <p>{{ currentRole === 'teacher' ? '统一管理学生、班组、题库、任务、阅卷和成绩，服务课堂教学与考核闭环。' : '参与 5G 仿真实训、小组竞赛和技能考核，查看参考答案与个人成长分析。' }}</p>
      </div>

      <div class="vr-user-card">
        <span>当前登录</span>
        <strong>{{ currentAccount?.name }}</strong>
        <em>{{ currentAccount?.roleLabel }}</em>
        <p>{{ currentAccount?.unitName }}</p>
      </div>

      <el-menu :default-active="activeMenuKey" class="vr-side-menu" @select="handleSelectMenu">
        <el-sub-menu v-for="group in menuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
            {{ item.label }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="vr-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button @click="goLogin">切换账号</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="vr-manage-main">
      <header class="vr-main-header">
        <div>
          <p class="vr-header-kicker">{{ activeMenu?.group }}</p>
          <h2>{{ activeMenu?.label }}</h2>
          <p>{{ activeMenu?.description }}</p>
        </div>
        <div class="vr-header-side">
          <span>角色权限：{{ permissionSummary }}</span>
          <strong>{{ currentDateLabel }}</strong>
        </div>
      </header>

      <section class="vr-stat-grid">
        <article v-for="item in topStats" :key="item.label" class="vr-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <em>{{ item.note }}</em>
        </article>
      </section>

      <section class="vr-overview-grid">
        <el-card class="vr-panel" shadow="never">
          <template #header>
            <div class="vr-panel-head">
              <div>
                <h3>平台公告</h3>
                <p>结合实训安排、竞赛通知和题库更新情况同步发布。</p>
              </div>
            </div>
          </template>

          <div class="vr-notice-list">
            <article v-for="item in VR_NOTICES" :key="item.id" class="vr-notice-item">
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.publisher }} · {{ item.publishTime }}</span>
                <p>{{ item.content }}</p>
              </div>
              <el-tag :type="noticeTagType[item.level]" effect="light">{{ item.level }}</el-tag>
            </article>
          </div>
        </el-card>

        <el-card class="vr-panel" shadow="never">
          <template #header>
            <div class="vr-panel-head">
              <div>
                <h3>快捷入口</h3>
                <p>按当前权限展示可直接访问的功能模块。</p>
              </div>
            </div>
          </template>

          <div class="vr-quick-grid">
            <button
              v-for="item in quickMenus"
              :key="item.key"
              type="button"
              class="vr-quick-card"
              @click="activeMenuKey = item.key"
            >
              <strong>{{ item.label }}</strong>
              <span>{{ item.description }}</span>
            </button>
          </div>
        </el-card>
      </section>

      <el-card v-if="currentRole === 'teacher' && activeMenuKey === 'students'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head vr-panel-head--toolbar">
            <div>
              <h3>学生管理</h3>
              <p>维护学生账号、训练状态、人脸录入和最近登录数据。</p>
            </div>
            <div class="vr-toolbar-actions">
              <el-button @click="resetTeacherFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="vr-filter-grid vr-filter-grid--three">
          <el-form-item label="关键词">
            <el-input v-model="teacherFilters.keyword" placeholder="姓名 / 学号 / 班级" clearable />
          </el-form-item>
          <el-form-item label="班级">
            <el-select v-model="teacherFilters.className" placeholder="请选择班级" clearable>
              <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="考核状态">
            <el-select v-model="teacherFilters.examStatus" placeholder="请选择状态" clearable>
              <el-option label="未开始" value="未开始" />
              <el-option label="训练中" value="训练中" />
              <el-option label="已考核" value="已考核" />
            </el-select>
          </el-form-item>
        </el-form>

        <el-table :data="filteredStudents" border stripe row-key="id">
          <el-table-column prop="id" label="学号" min-width="130" />
          <el-table-column prop="name" label="姓名" min-width="100" />
          <el-table-column prop="className" label="班级" min-width="130" />
          <el-table-column prop="teamName" label="所在班组" min-width="140" />
          <el-table-column prop="trainingHours" label="训练学时" min-width="100" />
          <el-table-column prop="averageScore" label="平均分" min-width="90" />
          <el-table-column prop="faceStatus" label="人脸库" min-width="90" />
          <el-table-column prop="examStatus" label="考核状态" min-width="90" />
          <el-table-column prop="lastLogin" label="最近登录" min-width="150" />
          <el-table-column label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <el-button link @click="openDetails('学生详情', scope.row)">详情</el-button>
              <el-button link type="success" :disabled="scope.row.faceStatus === '已录入'" @click="markFaceReady(scope.row)">补录人脸</el-button>
              <el-button link type="primary" :disabled="scope.row.examStatus === '已考核'" @click="advanceExamStatus(scope.row)">推进状态</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'teacher' && activeMenuKey === 'groups'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>班组管理</h3>
              <p>按项目方向查看组长、人数、指导教师与阶段最优成绩。</p>
            </div>
          </div>
        </template>

        <el-table :data="VR_GROUP_ROWS" border stripe row-key="id">
          <el-table-column prop="teamName" label="班组名称" min-width="140" />
          <el-table-column prop="captain" label="组长" min-width="100" />
          <el-table-column prop="memberCount" label="人数" min-width="80" />
          <el-table-column prop="instructor" label="指导教师" min-width="110" />
          <el-table-column prop="project" label="项目方向" min-width="180" />
          <el-table-column prop="currentStage" label="当前阶段" min-width="150" />
          <el-table-column prop="bestScore" label="最高分" min-width="90" />
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'teacher' && activeMenuKey === 'questions'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head vr-panel-head--toolbar">
            <div>
              <h3>试题管理</h3>
              <p>管理多种场景题目与启用状态。</p>
            </div>
            <div class="vr-toolbar-actions">
              <el-button @click="toggleDraftQuestions">切换草稿状态</el-button>
            </div>
          </div>
        </template>

        <el-table :data="VR_QUESTION_ROWS" border stripe row-key="id">
          <el-table-column prop="title" label="题目名称" min-width="220" />
          <el-table-column prop="scene" label="所属场景" min-width="120" />
          <el-table-column prop="type" label="题型" min-width="90" />
          <el-table-column prop="difficulty" label="难度" min-width="90" />
          <el-table-column prop="score" label="分值" min-width="80" />
          <el-table-column prop="creator" label="创建人" min-width="100" />
          <el-table-column prop="updatedAt" label="更新时间" min-width="150" />
          <el-table-column label="状态" min-width="90">
            <template #default="scope">
              <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'" effect="light">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <el-button link @click="openDetails('试题详情', scope.row)">详情</el-button>
              <el-button link type="primary" @click="switchQuestionStatus(scope.row)">切换状态</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'teacher' && activeMenuKey === 'tasks'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>任务配置</h3>
              <p>查看开放时间、达标线和任务模式，并可快速顺延截止时间。</p>
            </div>
          </div>
        </template>

        <el-table :data="VR_TASK_ROWS" border stripe row-key="id">
          <el-table-column prop="taskName" label="任务名称" min-width="200" />
          <el-table-column prop="module" label="实训模块" min-width="140" />
          <el-table-column prop="targetClass" label="适用班级" min-width="150" />
          <el-table-column prop="mode" label="模式" min-width="100" />
          <el-table-column prop="openTime" label="开放时间" min-width="150" />
          <el-table-column prop="deadline" label="截止时间" min-width="150" />
          <el-table-column prop="passLine" label="达标线" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="90" />
          <el-table-column label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <el-button link @click="openDetails('任务详情', scope.row)">详情</el-button>
              <el-button link type="primary" @click="extendTaskDeadline(scope.row)">顺延一天</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'teacher' && activeMenuKey === 'grading'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>集中阅卷</h3>
              <p>查看待阅卷数量、自动评分均值和提交时间。</p>
            </div>
          </div>
        </template>

        <el-table :data="VR_GRADING_ROWS" border stripe row-key="id">
          <el-table-column prop="examName" label="考试名称" min-width="200" />
          <el-table-column prop="className" label="班级" min-width="130" />
          <el-table-column prop="participants" label="参考人数" min-width="100" />
          <el-table-column prop="pendingReview" label="待阅卷" min-width="90" />
          <el-table-column prop="autoScore" label="自动评分均值" min-width="120" />
          <el-table-column prop="latestSubmitTime" label="最近提交" min-width="150" />
          <el-table-column prop="status" label="状态" min-width="90" />
          <el-table-column label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <el-button link @click="openDetails('阅卷详情', scope.row)">详情</el-button>
              <el-button link type="success" :disabled="scope.row.status === '已完成'" @click="finishGrading(scope.row)">完成阅卷</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'teacher' && activeMenuKey === 'scores'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head vr-panel-head--toolbar">
            <div>
              <h3>成绩管理</h3>
              <p>汇总训练成绩、考核成绩和教师评语。</p>
            </div>
            <div class="vr-toolbar-actions">
              <el-button @click="refreshTeacherComments">刷新评语模板</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="vr-filter-grid vr-filter-grid--three">
          <el-form-item label="班级">
            <el-select v-model="teacherFilters.scoreClassName" placeholder="请选择班级" clearable>
              <el-option v-for="item in classOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="等级">
            <el-select v-model="teacherFilters.skillLevel" placeholder="请选择等级" clearable>
              <el-option label="优秀" value="优秀" />
              <el-option label="良好" value="良好" />
              <el-option label="合格" value="合格" />
              <el-option label="待提升" value="待提升" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="teacherFilters.scoreKeyword" placeholder="姓名 / 学号 / 模块" clearable />
          </el-form-item>
        </el-form>

        <el-table :data="filteredScores" border stripe row-key="id">
          <el-table-column prop="studentName" label="姓名" min-width="100" />
          <el-table-column prop="studentId" label="学号" min-width="130" />
          <el-table-column prop="className" label="班级" min-width="130" />
          <el-table-column prop="trainingName" label="模块" min-width="130" />
          <el-table-column prop="practiceScore" label="训练分" min-width="90" />
          <el-table-column prop="examScore" label="考核分" min-width="90" />
          <el-table-column prop="finalScore" label="总评" min-width="90" />
          <el-table-column prop="skillLevel" label="等级" min-width="90" />
          <el-table-column prop="teacherComment" label="教师评语" min-width="240" show-overflow-tooltip />
          <el-table-column prop="updatedAt" label="更新时间" min-width="150" />
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'trainings'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>仿真实训</h3>
              <p>分模块查看个人训练进度和当前得分。</p>
            </div>
          </div>
        </template>

        <el-table :data="studentTrainingRows" border stripe row-key="id">
          <el-table-column prop="module" label="训练模块" min-width="140" />
          <el-table-column prop="stage" label="训练阶段" min-width="180" />
          <el-table-column label="完成进度" min-width="140">
            <template #default="scope">
              <el-progress :percentage="scope.row.progress" :stroke-width="10" />
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="训练时长" min-width="100" />
          <el-table-column prop="score" label="当前得分" min-width="90" />
          <el-table-column prop="deadline" label="截止时间" min-width="150" />
          <el-table-column prop="status" label="状态" min-width="90" />
          <el-table-column label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <el-button link @click="openDetails('训练详情', scope.row)">详情</el-button>
              <el-button link type="primary" :disabled="scope.row.status === '已完成'" @click="continueTraining(scope.row)">继续训练</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'competition'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>小组竞赛</h3>
              <p>查看所在班组的竞赛赛程、阶段成绩与排名。</p>
            </div>
          </div>
        </template>

        <el-table :data="studentCompetitionRows" border stripe row-key="id">
          <el-table-column prop="teamName" label="班组" min-width="140" />
          <el-table-column prop="eventName" label="赛事" min-width="180" />
          <el-table-column prop="stage" label="阶段" min-width="100" />
          <el-table-column prop="schedule" label="时间" min-width="150" />
          <el-table-column prop="rank" label="排名" min-width="90" />
          <el-table-column prop="score" label="成绩" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="100" />
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'assessment'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>技能考核</h3>
              <p>参加阶段考核、期末考核和竞赛选拔。</p>
            </div>
          </div>
        </template>

        <el-table :data="studentExamRows" border stripe row-key="id">
          <el-table-column prop="examName" label="考试名称" min-width="200" />
          <el-table-column prop="type" label="类型" min-width="100" />
          <el-table-column prop="publishTime" label="发布时间" min-width="150" />
          <el-table-column prop="deadline" label="截止时间" min-width="150" />
          <el-table-column prop="duration" label="时长" min-width="100" />
          <el-table-column prop="result" label="成绩" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="90" />
          <el-table-column label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <el-button link @click="openDetails('考试详情', scope.row)">详情</el-button>
              <el-button link type="primary" :disabled="scope.row.status !== '待作答'" @click="startExam(scope.row)">开始作答</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'answers'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>参考答案</h3>
              <p>查看已批阅试卷及教师给出的解析意见。</p>
            </div>
          </div>
        </template>

        <el-table :data="studentAnswerRows" border stripe row-key="id">
          <el-table-column prop="examName" label="考试名称" min-width="200" />
          <el-table-column prop="submittedAt" label="提交时间" min-width="150" />
          <el-table-column prop="objectiveScore" label="客观题" min-width="90" />
          <el-table-column prop="reviewScore" label="主观题" min-width="90" />
          <el-table-column prop="finalScore" label="总分" min-width="90" />
          <el-table-column prop="answerStatus" label="批阅状态" min-width="90" />
          <el-table-column prop="note" label="解析说明" min-width="260" show-overflow-tooltip />
        </el-table>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'analysis'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>成绩分析</h3>
              <p>基于训练和考核记录生成个人学习画像。</p>
            </div>
          </div>
        </template>

        <div class="vr-analysis-grid">
          <article v-for="item in studentAnalysisCards" :key="item.label" class="vr-analysis-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <p>{{ item.note }}</p>
          </article>
        </div>
      </el-card>

      <el-card v-else-if="currentRole === 'student' && activeMenuKey === 'profile'" class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>个人中心</h3>
              <p>查看账号信息、所属班级和当前开放权限。</p>
            </div>
          </div>
        </template>

        <div class="vr-profile-grid">
          <article class="vr-profile-card">
            <span>姓名</span>
            <strong>{{ currentAccount?.name }}</strong>
          </article>
          <article class="vr-profile-card">
            <span>账号</span>
            <strong>{{ currentAccount?.account }}</strong>
          </article>
          <article class="vr-profile-card">
            <span>学院</span>
            <strong>{{ currentAccount?.unitName }}</strong>
          </article>
          <article class="vr-profile-card">
            <span>班级</span>
            <strong>{{ currentAccount?.className || '未设置' }}</strong>
          </article>
          <article class="vr-profile-card">
            <span>专业</span>
            <strong>{{ currentAccount?.major || '未设置' }}</strong>
          </article>
          <article class="vr-profile-card">
            <span>联系电话</span>
            <strong>{{ currentAccount?.phone }}</strong>
          </article>
        </div>

        <div class="vr-permission-tags">
          <el-tag v-for="item in permissionLabels" :key="item" effect="light">{{ item }}</el-tag>
        </div>
      </el-card>

      <el-card v-else class="vr-panel" shadow="never">
        <template #header>
          <div class="vr-panel-head">
            <div>
              <h3>{{ currentRole === 'teacher' ? '教学总览' : '学习总览' }}</h3>
              <p>基于当前角色展示关键业务摘要。</p>
            </div>
          </div>
        </template>

        <div class="vr-overview-summary">
          <article v-for="item in overviewCards" :key="item.label" class="vr-summary-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <p>{{ item.note }}</p>
          </article>
        </div>
      </el-card>
    </main>

    <el-drawer v-model="detailDrawerVisible" :title="detailDrawerTitle" size="420px">
      <div class="vr-detail-list">
        <article v-for="item in detailFields" :key="item.label" class="vr-detail-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
    </el-drawer>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  VR_GRADING_ROWS,
  VR_GROUP_ROWS,
  VR_NOTICES,
  VR_QUESTION_ROWS,
  VR_SCORE_ROWS,
  VR_STUDENT_MENUS,
  VR_STUDENT_ROWS,
  VR_TASK_ROWS,
  VR_TEACHER_MENUS,
  getPermissionLabels,
  getStudentAnswerRows,
  getStudentCompetitionRows,
  getStudentExamRows,
  getStudentTrainingRows,
  getVrAccountByAccount,
  type VrAccount,
  type VrStudentRow
} from '@/mock/vrTraining'

const router = useRouter()

const currentRole = (sessionStorage.getItem('vr_role') || 'student') as 'teacher' | 'student'
const currentAccount = computed<VrAccount | undefined>(() => getVrAccountByAccount(sessionStorage.getItem('vr_account') || ''))
const permissionLabels = computed(() => getPermissionLabels((sessionStorage.getItem('vr_permissions') || '').split(',').filter(Boolean)))
const permissionSummary = computed(() => permissionLabels.value.join('、') || '未配置')
const currentDateLabel = new Date().toLocaleString('zh-CN', { hour12: false })
const activeMenuKey = ref((currentRole === 'teacher' ? VR_TEACHER_MENUS[0] : VR_STUDENT_MENUS[0]).key)

const detailDrawerVisible = ref(false)
const detailDrawerTitle = ref('详情')
const detailFields = ref<Array<{ label: string; value: string }>>([])

const teacherFilters = reactive({
  keyword: '',
  className: '',
  examStatus: '',
  scoreClassName: '',
  skillLevel: '',
  scoreKeyword: ''
})

const noticeTagType: Record<'高' | '中' | '低', 'danger' | 'warning' | 'info'> = {
  高: 'danger',
  中: 'warning',
  低: 'info'
}

const menus = computed(() => (currentRole === 'teacher' ? VR_TEACHER_MENUS : VR_STUDENT_MENUS))
const menuGroups = computed(() => {
  const groupMap = new Map<string, typeof menus.value>()

  for (const item of menus.value) {
    const groupItems = groupMap.get(item.group) ?? []
    groupItems.push(item)
    groupMap.set(item.group, groupItems)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const activeMenu = computed(() => menus.value.find((item) => item.key === activeMenuKey.value) ?? menus.value[0])
const quickMenus = computed(() => menus.value.slice(0, 4))

const classOptions = computed(() => Array.from(new Set(VR_STUDENT_ROWS.map((item) => item.className))))

const filteredStudents = computed(() => {
  const keyword = teacherFilters.keyword.trim().toLowerCase()
  return VR_STUDENT_ROWS.filter((item) => {
    const keywordMatched = !keyword || [item.name, item.id, item.className].some((field) => field.toLowerCase().includes(keyword))
    const classMatched = !teacherFilters.className || item.className === teacherFilters.className
    const examMatched = !teacherFilters.examStatus || item.examStatus === teacherFilters.examStatus
    return keywordMatched && classMatched && examMatched
  })
})

const filteredScores = computed(() => {
  const keyword = teacherFilters.scoreKeyword.trim().toLowerCase()
  return VR_SCORE_ROWS.filter((item) => {
    const classMatched = !teacherFilters.scoreClassName || item.className === teacherFilters.scoreClassName
    const levelMatched = !teacherFilters.skillLevel || item.skillLevel === teacherFilters.skillLevel
    const keywordMatched =
      !keyword || [item.studentName, item.studentId, item.trainingName].some((field) => field.toLowerCase().includes(keyword))
    return classMatched && levelMatched && keywordMatched
  })
})

const studentTrainingRows = computed(() => getStudentTrainingRows(currentAccount.value?.account || ''))
const studentCompetitionRows = computed(() => getStudentCompetitionRows(currentAccount.value?.account || ''))
const studentExamRows = computed(() => getStudentExamRows(currentAccount.value?.account || ''))
const studentAnswerRows = computed(() => getStudentAnswerRows(currentAccount.value?.account || ''))

const topStats = computed(() => {
  if (currentRole === 'teacher') {
    const reviewedCount = VR_GRADING_ROWS.reduce((sum, item) => sum + item.pendingReview, 0)
    return [
      { label: '学生账号数', value: `${VR_STUDENT_ROWS.length} 人`, note: '已纳入实训管理的学生总数' },
      { label: '在运行任务', value: `${VR_TASK_ROWS.filter((item) => item.status === '进行中').length} 个`, note: '当前开放训练与竞赛任务' },
      { label: '待阅卷数量', value: `${reviewedCount} 份`, note: '需完成主观题或实操题评分' },
      { label: '优秀率', value: `${Math.round((VR_SCORE_ROWS.filter((item) => item.skillLevel === '优秀').length / VR_SCORE_ROWS.length) * 100)}%`, note: '按当前总评统计' }
    ]
  }

  const trainingCount = studentTrainingRows.value.length
  const completedCount = studentTrainingRows.value.filter((item) => item.status === '已完成').length
  const average = trainingCount > 0 ? Math.round(studentTrainingRows.value.reduce((sum, item) => sum + item.score, 0) / trainingCount) : 0
  return [
    { label: '训练项目', value: `${trainingCount} 个`, note: '当前已分配到个人的训练模块' },
    { label: '已完成项目', value: `${completedCount} 个`, note: '已完成并记录得分的训练模块' },
    { label: '平均成绩', value: `${average} 分`, note: '当前训练项目平均得分' },
    { label: '待办考试', value: `${studentExamRows.value.filter((item) => item.status === '待作答').length} 场`, note: '需要在截止前完成作答' }
  ]
})

const overviewCards = computed(() => {
  if (currentRole === 'teacher') {
    return [
      { label: '题库场景覆盖', value: '11 个模块', note: '站点工程勘察、容量规划、业务配置、网络测试、故障排查等均已接入。' },
      { label: '班组竞赛组织', value: `${VR_GROUP_ROWS.length} 个班组`, note: '已支持按项目方向分组教学和竞赛集训。' },
      { label: '成绩闭环', value: `${VR_SCORE_ROWS.length} 条成绩`, note: '训练、考核、等级评价与教师评语已打通。' }
    ]
  }

  return [
    { label: '当前最强模块', value: bestModule.value, note: '基于已完成训练分数最高模块自动识别。' },
    { label: '待提升能力', value: weakModule.value, note: '建议优先补练薄弱模块，提高综合评分。' },
    { label: '竞赛准备度', value: `${studentCompetitionRows.value.length > 0 ? '已入组' : '待分组'}`, note: '可继续参与团队赛前训练和模拟演练。' }
  ]
})

const bestModule = computed(() => {
  const rows = [...studentTrainingRows.value].sort((a, b) => b.score - a.score)
  return rows[0]?.module ?? '暂无数据'
})

const weakModule = computed(() => {
  const rows = [...studentTrainingRows.value].sort((a, b) => a.score - b.score)
  return rows[0]?.module ?? '暂无数据'
})

const studentAnalysisCards = computed(() => {
  const trainings = studentTrainingRows.value
  const exams = studentExamRows.value
  const answers = studentAnswerRows.value
  const averageTraining = trainings.length ? Math.round(trainings.reduce((sum, item) => sum + item.score, 0) / trainings.length) : 0
  const averageExam = exams.filter((item) => item.result.endsWith('分'))
  const examAverage = averageExam.length
    ? Math.round(averageExam.reduce((sum, item) => sum + Number.parseInt(item.result, 10), 0) / averageExam.length)
    : 0

  return [
    { label: '训练平均分', value: `${averageTraining} 分`, note: '建议保持 85 分以上以冲刺优秀等级。' },
    { label: '考试平均分', value: `${examAverage} 分`, note: '阶段考核和周测成绩综合统计。' },
    { label: '最优模块', value: bestModule.value, note: '当前表现最好的实训模块。' },
    { label: '待教师批阅', value: `${answers.filter((item) => item.answerStatus === '待批阅').length} 份`, note: '主观题或实操题评分尚未完成。' }
  ]
})

const openDetails = (title: string, row: Record<string, unknown>) => {
  detailDrawerTitle.value = title
  detailFields.value = Object.entries(row).map(([label, value]) => ({ label, value: String(value) }))
  detailDrawerVisible.value = true
}

const handleSelectMenu = (key: string) => {
  activeMenuKey.value = key
}

const resetTeacherFilters = () => {
  teacherFilters.keyword = ''
  teacherFilters.className = ''
  teacherFilters.examStatus = ''
}

const markFaceReady = (row: VrStudentRow) => {
  row.faceStatus = '已录入'
  ElMessage.success(`${row.name} 已完成人脸信息补录`)
}

const advanceExamStatus = (row: VrStudentRow) => {
  if (row.examStatus === '未开始') {
    row.examStatus = '训练中'
  } else if (row.examStatus === '训练中') {
    row.examStatus = '已考核'
    row.averageScore = Math.max(row.averageScore, 85)
  }
  ElMessage.success(`${row.name} 的考核状态已更新为 ${row.examStatus}`)
}

const switchQuestionStatus = (row: { status: '启用' | '草稿'; title: string }) => {
  row.status = row.status === '启用' ? '草稿' : '启用'
  ElMessage.success(`${row.title} 已切换为${row.status}`)
}

const toggleDraftQuestions = () => {
  VR_QUESTION_ROWS.filter((item) => item.status === '草稿').forEach((item) => {
    item.status = '启用'
  })
  ElMessage.success('所有草稿题目已批量启用')
}

const extendTaskDeadline = (row: { deadline: string; taskName: string }) => {
  const baseDate = new Date(row.deadline.replace(' ', 'T'))
  if (!Number.isNaN(baseDate.getTime())) {
    baseDate.setDate(baseDate.getDate() + 1)
    row.deadline = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')} ${String(baseDate.getHours()).padStart(2, '0')}:${String(baseDate.getMinutes()).padStart(2, '0')}`
  }
  ElMessage.success(`${row.taskName} 的截止时间已顺延一天`)
}

const finishGrading = (row: { status: '待阅卷' | '阅卷中' | '已完成'; pendingReview: number; examName: string }) => {
  row.status = '已完成'
  row.pendingReview = 0
  ElMessage.success(`${row.examName} 已完成阅卷`)
}

const refreshTeacherComments = () => {
  VR_SCORE_ROWS.forEach((item) => {
    if (item.skillLevel === '优秀') {
      item.teacherComment = '实操链路完整，关键指标稳定，建议承担组内示范任务。'
    }
  })
  ElMessage.success('优秀学生评语模板已更新')
}

const continueTraining = (row: { status: '未开始' | '进行中' | '已完成'; progress: number; score: number; module: string }) => {
  row.status = '进行中'
  row.progress = Math.min(row.progress + 10, 100)
  row.score = Math.min(row.score + 2, 100)
  if (row.progress === 100) {
    row.status = '已完成'
  }
  ElMessage.success(`已进入 ${row.module} 训练场景`)
}

const startExam = (row: { status: '未开始' | '待作答' | '已完成'; examName: string }) => {
  row.status = '已完成'
  row.result = '88 分'
  ElMessage.success(`${row.examName} 已完成模拟作答并生成成绩`)
}

const goHome = () => {
  void router.push('/')
}

const goLogin = () => {
  void router.push('/vr-training/login')
}

const logout = () => {
  sessionStorage.removeItem('vr_auth')
  sessionStorage.removeItem('vr_role')
  sessionStorage.removeItem('vr_role_label')
  sessionStorage.removeItem('vr_name')
  sessionStorage.removeItem('vr_account')
  sessionStorage.removeItem('vr_unit_name')
  sessionStorage.removeItem('vr_class_name')
  sessionStorage.removeItem('vr_major')
  sessionStorage.removeItem('vr_permissions')
  void router.push('/vr-training/login')
}
</script>

<style scoped>
.vr-manage-page {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
  min-height: calc(100vh - 110px);
}

.vr-manage-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  border-radius: 26px;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), rgba(56, 189, 248, 0)),
    linear-gradient(180deg, #0f172a 0%, #134e4a 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.vr-manage-brand {
  color: #e0f2fe;
}

.vr-manage-kicker,
.vr-header-kicker {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.vr-manage-kicker {
  color: #e0f2fe;
  border: 1px solid rgba(224, 242, 254, 0.2);
  background: rgba(224, 242, 254, 0.1);
}

.vr-manage-brand h1 {
  margin-top: 16px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: 30px;
  line-height: 1.2;
}

.vr-manage-brand p {
  margin-top: 12px;
  color: rgba(224, 242, 254, 0.82);
  line-height: 1.8;
}

.vr-user-card,
.vr-side-actions,
.vr-panel,
.vr-stat-card,
.vr-summary-card,
.vr-analysis-card,
.vr-profile-card,
.vr-quick-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.vr-user-card {
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

.vr-user-card span,
.vr-user-card p {
  color: rgba(226, 232, 240, 0.76);
}

.vr-user-card strong {
  font-size: 20px;
}

.vr-user-card em {
  font-style: normal;
  color: #7dd3fc;
}

.vr-side-menu {
  border: none;
  border-radius: 20px;
  overflow: hidden;
}

.vr-side-actions {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
}

.vr-manage-main {
  display: grid;
  gap: 18px;
}

.vr-main-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding: 26px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.95), rgba(236, 253, 245, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.vr-header-kicker {
  color: #0369a1;
  background: rgba(14, 165, 233, 0.12);
}

.vr-main-header h2 {
  margin-top: 10px;
  font-size: 30px;
  color: #0f172a;
}

.vr-main-header p {
  margin-top: 8px;
  color: #475569;
  line-height: 1.75;
}

.vr-header-side {
  display: grid;
  gap: 8px;
  justify-items: end;
  color: #334155;
}

.vr-stat-grid,
.vr-analysis-grid,
.vr-profile-grid,
.vr-overview-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.vr-stat-card,
.vr-summary-card,
.vr-analysis-card,
.vr-profile-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
}

.vr-stat-card span,
.vr-summary-card span,
.vr-analysis-card span,
.vr-profile-card span {
  color: #64748b;
}

.vr-stat-card strong,
.vr-summary-card strong,
.vr-analysis-card strong,
.vr-profile-card strong {
  font-size: 28px;
  color: #0f172a;
}

.vr-stat-card em,
.vr-summary-card p,
.vr-analysis-card p {
  font-style: normal;
  color: #475569;
  line-height: 1.7;
}

.vr-overview-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 18px;
}

.vr-panel {
  border-radius: 24px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
}

.vr-panel :deep(.el-card__header) {
  padding-bottom: 0;
  border-bottom: none;
}

.vr-panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.vr-panel-head--toolbar {
  align-items: flex-start;
}

.vr-panel-head h3 {
  font-size: 22px;
  color: #0f172a;
}

.vr-panel-head p {
  margin-top: 6px;
  color: #64748b;
  line-height: 1.7;
}

.vr-toolbar-actions {
  display: flex;
  gap: 12px;
}

.vr-notice-list {
  display: grid;
  gap: 14px;
}

.vr-notice-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(248, 250, 252, 0.92), rgba(240, 249, 255, 0.9));
}

.vr-notice-item strong {
  color: #0f172a;
}

.vr-notice-item span,
.vr-notice-item p {
  color: #64748b;
}

.vr-notice-item p {
  margin-top: 6px;
  line-height: 1.7;
}

.vr-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.vr-quick-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
  text-align: left;
  background: linear-gradient(145deg, rgba(236, 253, 245, 0.96), rgba(239, 246, 255, 0.96));
  cursor: pointer;
}

.vr-quick-card strong {
  color: #0f172a;
}

.vr-quick-card span {
  color: #475569;
  line-height: 1.7;
}

.vr-filter-grid {
  display: grid;
  gap: 16px;
}

.vr-filter-grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.vr-detail-list {
  display: grid;
  gap: 12px;
}

.vr-detail-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f8fafc;
}

.vr-detail-item span {
  color: #64748b;
}

.vr-detail-item strong {
  color: #0f172a;
  word-break: break-all;
}

.vr-permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .vr-stat-grid,
  .vr-analysis-grid,
  .vr-profile-grid,
  .vr-overview-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .vr-overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 960px) {
  .vr-manage-page {
    grid-template-columns: 1fr;
  }

  .vr-main-header {
    flex-direction: column;
  }

  .vr-header-side {
    justify-items: start;
  }

  .vr-filter-grid--three,
  .vr-quick-grid,
  .vr-stat-grid,
  .vr-analysis-grid,
  .vr-profile-grid,
  .vr-overview-summary {
    grid-template-columns: 1fr;
  }
}
</style>
