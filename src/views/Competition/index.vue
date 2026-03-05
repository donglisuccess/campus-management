<template>
  <section class="cp-page">
    <div class="cp-bg cp-bg-a"></div>
    <div class="cp-bg cp-bg-b"></div>

    <div v-if="!currentRole" class="cp-shell">
      <section class="cp-intro-panel">
        <div class="cp-intro-head">
          <p class="cp-kicker">Competition Activity Service</p>
          <h2>竞赛活动应用服务平台</h2>
          <p>支持线上作品评比竞赛与展示交流活动，覆盖“发起、上传、评审、导出”完整业务流程。</p>
        </div>

        <div class="cp-feature-grid">
          <article v-for="item in serviceFeatures" :key="item.no" class="cp-feature-card">
            <div class="cp-feature-no">{{ item.no }}</div>
            <p class="cp-feature-text">{{ item.text }}</p>
          </article>
        </div>
      </section>

      <el-card class="cp-login-card" shadow="never">
        <div class="cp-head">
          <h3>账号登录</h3>
          <p>请输入账号密码并选择身份后登录</p>
        </div>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="cp-form"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入" clearable />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="身份" prop="role">
            <el-radio-group v-model="loginForm.role" class="cp-role-group">
              <el-radio label="platformAdmin">平台管理员</el-radio>
              <el-radio label="schoolAdmin">学校管理员</el-radio>
              <el-radio label="judge">评委</el-radio>
              <el-radio label="teacher">教师</el-radio>
              <el-radio label="student">学生</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="cp-action-row">
            <el-button type="primary" class="cp-login-btn" @click="submitLogin">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <el-popover placement="top-start" trigger="hover" :width="380" popper-class="cp-account-popper">
          <template #reference>
            <el-button text class="cp-account-trigger">测试账号（悬停查看）</el-button>
          </template>
          <div class="cp-account-box">
            <p class="cp-account-title">测试账号</p>
            <p v-for="item in testAccounts" :key="item">{{ item }}</p>
          </div>
        </el-popover>
      </el-card>
    </div>

    <el-card v-else class="cp-role-card" shadow="never">
      <div class="cp-role-head">
        <div>
          <p class="cp-kicker">已登录</p>
          <h3>{{ roleConfig[currentRole].title }}</h3>
          <p class="cp-role-desc">{{ roleConfig[currentRole].desc }}</p>
        </div>
        <el-button @click="logout">退出登录</el-button>
      </div>

      <template v-if="isPlatformAdmin">
        <section class="cp-admin-layout">
          <aside class="cp-admin-side">
            <div class="cp-admin-side-title">平台管理员菜单</div>
            <el-menu :default-active="adminActiveModule" class="cp-admin-menu" @select="handleAdminMenuSelect">
              <el-menu-item index="overview">活动总览</el-menu-item>
              <el-menu-item index="launch">赛事活动发起</el-menu-item>
              <el-menu-item index="group">分组管理</el-menu-item>
              <el-menu-item index="upload">材料上传设置</el-menu-item>
              <el-menu-item index="schoolScore">学校评分</el-menu-item>
              <el-menu-item index="export">打包导出</el-menu-item>
              <el-menu-item index="portfolio">作品集管理</el-menu-item>
              <el-menu-item index="scoreMode">打分模式</el-menu-item>
              <el-menu-item index="permission">浏览下载权限</el-menu-item>
            </el-menu>
          </aside>

          <div class="cp-admin-content">
            <section v-if="adminActiveModule === 'overview'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>活动总览</h4>
                <p>展示当前活动运行状态与最新活动信息。</p>
              </div>

              <el-row :gutter="12" class="cp-stat-grid">
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>活动总数</p>
                    <h4>{{ adminStats.total }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>待发布</p>
                    <h4>{{ adminStats.pending }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>进行中</p>
                    <h4>{{ adminStats.running }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>已结束</p>
                    <h4>{{ adminStats.finished }}</h4>
                  </div>
                </el-col>
              </el-row>

              <el-table :data="pagedEventList" border stripe class="cp-event-table">
                <el-table-column prop="title" label="活动名称" min-width="220" />
                <el-table-column prop="school" label="发起学校" min-width="160" />
                <el-table-column prop="group" label="活动分组" min-width="120" />
                <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
                <el-table-column prop="status" label="状态" min-width="100" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="publishEvent(scope.row.id)">发布</el-button>
                    <el-button link type="danger" @click="deleteEvent(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.eventPage"
                :page-size="pagination.pageSize"
                :total="eventList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'launch'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>赛事活动发起</h4>
                <p>平台管理员可统一发起赛事活动并指派学校参与。</p>
              </div>
              <el-form :model="eventForm" :rules="eventRules" ref="eventFormRef" label-position="top" class="cp-launch-form">
                <el-form-item label="活动名称" prop="title">
                  <el-input v-model="eventForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="发起学校" prop="school">
                  <el-input v-model="eventForm.school" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动分组" prop="group">
                  <el-input v-model="eventForm.group" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动周期" prop="dateRange">
                  <el-date-picker
                    v-model="eventForm.dateRange"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="cp-date-range"
                  />
                </el-form-item>
                <el-form-item label="活动说明" prop="description" class="cp-launch-full">
                  <el-input v-model="eventForm.description" type="textarea" :rows="3" placeholder="请输入" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="submitEvent">发起活动</el-button>
                  <el-button @click="resetEventForm">重置</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'group'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>分组管理</h4>
                <p>创建活动分组并维护分组说明。</p>
              </div>
              <div class="cp-inline-row">
                <el-input v-model="groupDraft.name" placeholder="分组名称" clearable />
                <el-input v-model="groupDraft.description" placeholder="分组说明" clearable />
                <el-button type="primary" @click="addGroup">新增分组</el-button>
              </div>
              <el-table :data="pagedGroupList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="分组名称" min-width="160" />
                <el-table-column prop="description" label="分组说明" min-width="240" />
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="danger" @click="removeGroup(scope.row.name)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.groupPage"
                :page-size="pagination.pageSize"
                :total="groupList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'upload'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>上传策略设置</h4>
                <p>配置支持类型、附件大小与在线预览能力。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="支持文件类型" class="cp-launch-full">
                  <el-select v-model="uploadPolicy.fileTypes" multiple placeholder="请选择" class="cp-date-range">
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Word" value="docx" />
                    <el-option label="PPT" value="pptx" />
                    <el-option label="图片" value="image" />
                    <el-option label="视频" value="video" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单文件大小限制(MB)">
                  <el-input-number v-model="uploadPolicy.maxSizeMb" :min="1" :max="2048" />
                </el-form-item>
                <el-form-item label="是否允许在线预览">
                  <el-switch v-model="uploadPolicy.previewEnabled" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveUploadPolicy">保存设置</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'schoolScore'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>学校主体评分</h4>
                <p>评委可按学校维度进行打分。</p>
              </div>
              <el-table :data="pagedSchoolScoreList" border stripe class="cp-event-table">
                <el-table-column prop="school" label="学校" min-width="180" />
                <el-table-column prop="activity" label="活动" min-width="180" />
                <el-table-column label="评分" min-width="180">
                  <template #default="scope">
                    <el-rate v-model="scope.row.score" allow-half />
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="primary" @click="saveSchoolScore(scope.row)">保存</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolScorePage"
                :page-size="pagination.pageSize"
                :total="schoolScoreList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'export'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>打包导出管理</h4>
                <p>创建导出任务并跟踪任务状态。</p>
              </div>
              <div class="cp-inline-row">
                <el-input v-model="exportDraft.activity" placeholder="导出活动名称" clearable />
                <el-select v-model="exportDraft.type" placeholder="导出范围" style="width: 180px">
                  <el-option label="单作品" value="single" />
                  <el-option label="作品集" value="portfolio" />
                  <el-option label="学校作品集" value="school" />
                </el-select>
                <el-button type="primary" @click="createExportTask">创建导出任务</el-button>
              </div>
              <el-table :data="pagedExportTaskList" border stripe class="cp-event-table">
                <el-table-column prop="activity" label="活动" min-width="180" />
                <el-table-column prop="typeLabel" label="导出范围" min-width="120" />
                <el-table-column prop="status" label="状态" min-width="120" />
              </el-table>
              <el-pagination
                v-model:current-page="pagination.exportTaskPage"
                :page-size="pagination.pageSize"
                :total="exportTaskList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'portfolio'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>作品集管理</h4>
                <p>浏览单文件、单作品集、学校作品集并进行点评。</p>
              </div>
              <el-table :data="pagedPortfolioList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="作品名称" min-width="180" />
                <el-table-column prop="category" label="类别" min-width="120" />
                <el-table-column prop="school" label="学校" min-width="140" />
                <el-table-column prop="review" label="点评" min-width="220" />
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="primary" @click="openPortfolio(scope.row)">浏览</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.portfolioPage"
                :page-size="pagination.pageSize"
                :total="portfolioList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'scoreMode'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>打分模式与比例</h4>
                <p>配置评分模式、权重比例及是否展示得分。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="评分模式">
                  <el-select v-model="scoreMode.mode" placeholder="请选择" style="width: 220px">
                    <el-option label="百分制" value="percent" />
                    <el-option label="星级制" value="star" />
                    <el-option label="等级制" value="grade" />
                  </el-select>
                </el-form-item>
                <el-form-item label="创新性占比(%)">
                  <el-input-number v-model="scoreMode.innovationRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="完成度占比(%)">
                  <el-input-number v-model="scoreMode.completionRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="表现力占比(%)">
                  <el-input-number v-model="scoreMode.presentationRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="是否显示得分">
                  <el-switch v-model="scoreMode.showScore" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveScoreMode">保存评分模式</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'permission'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>浏览与下载权限</h4>
                <p>控制是否允许下载单个作品，或仅允许在线浏览。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="允许下载单个作品">
                  <el-switch v-model="accessPolicy.allowSingleDownload" />
                </el-form-item>
                <el-form-item label="允许在线浏览作品">
                  <el-switch v-model="accessPolicy.allowPreview" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveAccessPolicy">保存权限配置</el-button>
                </el-form-item>
              </el-form>
            </section>
          </div>
        </section>
      </template>

      <el-empty v-else description="当前仅开放平台管理员界面，其他身份后续开发。" />

      <el-dialog
        v-model="previewDialogVisible"
        title="作品预览"
        width="72%"
        destroy-on-close
      >
        <template v-if="previewingPortfolio">
          <p class="cp-preview-title">{{ previewingPortfolio.name }}</p>
          <iframe
            v-if="previewingPortfolio.previewType === 'pdf'"
            :src="previewingPortfolio.previewUrl"
            class="cp-preview-pdf"
            title="PDF预览"
          />
          <img
            v-else
            :src="previewingPortfolio.previewUrl"
            :alt="previewingPortfolio.name"
            class="cp-preview-image"
          />
        </template>
      </el-dialog>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  competitionMockEvents,
  competitionMockExportTasks,
  competitionMockGroups,
  competitionMockPortfolios,
  competitionMockSchoolScores,
  competitionServiceFeatures,
  competitionTestAccounts,
  type EventRecord,
  type PortfolioRecord
} from '@/mock/competitionPlatform'

type RoleKey = 'platformAdmin' | 'schoolAdmin' | 'judge' | 'teacher' | 'student'

interface LoginForm {
  username: string
  password: string
  role: RoleKey | ''
}

interface EventForm {
  title: string
  school: string
  group: string
  dateRange: string[]
  description: string
}

const formRef = ref()
const eventFormRef = ref()
const currentRole = ref<RoleKey | null>(null)

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  role: ''
})

const eventForm = reactive<EventForm>({
  title: '',
  school: '',
  group: '',
  dateRange: [],
  description: ''
})

const eventList = ref<EventRecord[]>([...competitionMockEvents])

const adminActiveModule = ref('overview')

const eventIdSeed = ref(Math.max(...competitionMockEvents.map((item) => item.id)) + 1)

const groupDraft = reactive({
  name: '',
  description: ''
})

const groupList = ref([...competitionMockGroups])

const uploadPolicy = reactive({
  fileTypes: ['pdf', 'docx', 'image'],
  maxSizeMb: 200,
  previewEnabled: true
})

const schoolScoreList = ref([...competitionMockSchoolScores])

const exportDraft = reactive<{ activity: string; type: 'single' | 'portfolio' | 'school' }>({
  activity: '',
  type: 'portfolio'
})

const exportTaskList = ref([...competitionMockExportTasks])

const portfolioList = ref([...competitionMockPortfolios])

const previewDialogVisible = ref(false)
const previewingPortfolio = ref<PortfolioRecord | null>(null)

const pagination = reactive({
  pageSize: 5,
  eventPage: 1,
  groupPage: 1,
  schoolScorePage: 1,
  exportTaskPage: 1,
  portfolioPage: 1
})

const scoreMode = reactive({
  mode: 'percent',
  innovationRatio: 40,
  completionRatio: 35,
  presentationRatio: 25,
  showScore: true
})

const accessPolicy = reactive({
  allowSingleDownload: true,
  allowPreview: true
})

const serviceFeatures = competitionServiceFeatures

const testAccounts = competitionTestAccounts

const roleConfig: Record<RoleKey, { title: string; desc: string; features: string[] }> = {
  platformAdmin: {
    title: '平台管理员工作台',
    desc: '你可以发起赛事活动、配置分组与评分规则、导出作品。',
    features: ['赛事活动发起', '分组管理', '评分规则配置', '作品批量导出', '下载权限控制', '结果发布']
  },
  schoolAdmin: {
    title: '学校管理员工作台',
    desc: '你可以代表学校上传作品集并管理本校参赛数据。',
    features: ['学校作品集上传', '学校材料管理', '活动进度查看', '评分结果查看', '作品浏览权限', '下载控制']
  },
  judge: {
    title: '评委工作台',
    desc: '你可以在线浏览作品、点评并按规则评分。',
    features: ['作品在线预览', '点评记录', '维度评分', '评分结果提交', '学校打分', '历史评审查询']
  },
  teacher: {
    title: '教师工作台',
    desc: '你可以上传单个文件、单个作品集并查看评审反馈。',
    features: ['单文件上传', '单作品集上传', '作品预览', '上传大小限制提醒', '评分反馈查看', '个人提交记录']
  },
  student: {
    title: '学生工作台',
    desc: '你可以提交参赛作品并查看评审状态与得分信息。',
    features: ['作品提交', '作品浏览', '活动报名', '点评查看', '得分查看开关', '参赛历史']
  }
}

const accountMap: Record<RoleKey, { username: string; password: string }> = {
  platformAdmin: { username: 'platformAdmin', password: 'platformAdmin' },
  schoolAdmin: { username: 'schoolAdmin', password: 'schoolAdmin' },
  judge: { username: 'pingwei', password: 'pingwei' },
  teacher: { username: 'teacher001', password: 'teacher001' },
  student: { username: 'student001', password: 'student001' }
}

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择身份', trigger: 'change' }]
}

const eventRules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  school: [{ required: true, message: '请输入发起学校', trigger: 'blur' }],
  group: [{ required: true, message: '请输入活动分组', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择活动周期', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动说明', trigger: 'blur' }]
}

const isPlatformAdmin = computed(() => currentRole.value === 'platformAdmin')

const adminStats = computed(() => {
  const total = eventList.value.length
  const pending = eventList.value.filter((item) => item.status === '待发布').length
  const running = eventList.value.filter((item) => item.status === '进行中').length
  const finished = eventList.value.filter((item) => item.status === '已结束').length
  return { total, pending, running, finished }
})

function paginateList<T>(list: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function normalizePage(total: number, currentPage: number): number {
  const maxPage = Math.max(1, Math.ceil(total / pagination.pageSize))
  return Math.min(currentPage, maxPage)
}

const pagedEventList = computed(() => paginateList(eventList.value, pagination.eventPage, pagination.pageSize))
const pagedGroupList = computed(() => paginateList(groupList.value, pagination.groupPage, pagination.pageSize))
const pagedSchoolScoreList = computed(() => paginateList(schoolScoreList.value, pagination.schoolScorePage, pagination.pageSize))
const pagedExportTaskList = computed(() => paginateList(exportTaskList.value, pagination.exportTaskPage, pagination.pageSize))
const pagedPortfolioList = computed(() => paginateList(portfolioList.value, pagination.portfolioPage, pagination.pageSize))

function submitLogin(): void {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return

    const role = loginForm.role as RoleKey
    const target = accountMap[role]

    if (loginForm.username === target.username && loginForm.password === target.password) {
      currentRole.value = role
      ElMessage.success(`${roleConfig[role].title} 登录成功`)
      return
    }

    ElMessage.error('账号、密码或身份不匹配，请检查后重试')
  })
}

function resetForm(): void {
  formRef.value.resetFields()
}

function logout(): void {
  currentRole.value = null
  resetForm()
  resetEventForm()
  ElMessage.success('已退出登录')
}

function submitEvent(): void {
  eventFormRef.value.validate((valid: boolean) => {
    if (!valid) return

    const [startDate, endDate] = eventForm.dateRange
    eventList.value.unshift({
      id: eventIdSeed.value++,
      title: eventForm.title,
      school: eventForm.school,
      group: eventForm.group,
      dateRangeText: `${startDate} 至 ${endDate}`,
      status: '待发布'
    })

    ElMessage.success('赛事活动发起成功')
    resetEventForm()
  })
}

function resetEventForm(): void {
  eventFormRef.value?.resetFields()
}

function publishEvent(id: number): void {
  const hit = eventList.value.find((item) => item.id === id)
  if (!hit) return
  hit.status = '进行中'
  ElMessage.success('活动已发布')
}

async function deleteEvent(id: number): Promise<void> {
  try {
    await ElMessageBox.confirm('确认删除该活动吗？删除后不可恢复。', '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    eventList.value = eventList.value.filter((item) => item.id !== id)
    pagination.eventPage = normalizePage(eventList.value.length, pagination.eventPage)
    ElMessage.success('活动已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function addGroup(): void {
  if (!groupDraft.name.trim()) {
    ElMessage.warning('请输入分组名称')
    return
  }

  groupList.value.unshift({
    name: groupDraft.name.trim(),
    description: groupDraft.description.trim() || '暂无说明'
  })
  groupDraft.name = ''
  groupDraft.description = ''
  ElMessage.success('分组新增成功')
}

async function removeGroup(name: string): Promise<void> {
  try {
    await ElMessageBox.confirm(`确认删除分组「${name}」吗？`, '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    groupList.value = groupList.value.filter((item) => item.name !== name)
    pagination.groupPage = normalizePage(groupList.value.length, pagination.groupPage)
    ElMessage.success('分组已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function saveUploadPolicy(): void {
  ElMessage.success('上传策略已保存')
}

function saveSchoolScore(_row: { school: string }): void {
  ElMessage.success('评分已保存')
}

function createExportTask(): void {
  if (!exportDraft.activity.trim()) {
    ElMessage.warning('请输入导出活动名称')
    return
  }

  const typeLabelMap = {
    single: '单作品',
    portfolio: '作品集',
    school: '学校作品集'
  } as const

  exportTaskList.value.unshift({
    activity: exportDraft.activity.trim(),
    typeLabel: typeLabelMap[exportDraft.type],
    status: '处理中'
  })
  exportDraft.activity = ''
  ElMessage.success('导出任务已创建')
}

function openPortfolio(row: PortfolioRecord): void {
  previewingPortfolio.value = row
  previewDialogVisible.value = true
}

function saveScoreMode(): void {
  const total = scoreMode.innovationRatio + scoreMode.completionRatio + scoreMode.presentationRatio
  if (total !== 100) {
    ElMessage.warning('评分比例总和需等于100%')
    return
  }
  ElMessage.success('评分模式已保存')
}

function saveAccessPolicy(): void {
  ElMessage.success('浏览下载权限已保存')
}

function handleAdminMenuSelect(key: string): void {
  adminActiveModule.value = key
}
</script>

<style scoped>
.cp-page {
  position: relative;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.cp-bg {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
}

.cp-bg-a {
  width: 320px;
  height: 320px;
  left: -120px;
  top: -90px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.26) 0%, rgba(56, 189, 248, 0) 70%);
  animation: cpFloatA 9s ease-in-out infinite;
}

.cp-bg-b {
  width: 360px;
  height: 360px;
  right: -130px;
  bottom: -120px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.26) 0%, rgba(52, 211, 153, 0) 70%);
  animation: cpFloatB 10s ease-in-out infinite;
}

.cp-shell {
  position: relative;
  z-index: 2;
  width: min(1200px, 98%);
  display: grid;
  grid-template-columns: 1.25fr 0.9fr;
  gap: 18px;
  animation: cpRiseIn 0.58s ease-out both;
}

.cp-intro-panel {
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.92), rgba(240, 253, 250, 0.88));
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.1);
  padding: 20px;
  animation: cpSlideLeft 0.52s ease-out both;
}

.cp-intro-head h2 {
  margin: 8px 0 6px;
  font-size: clamp(28px, 2.7vw, 36px);
  color: #0f172a;
}

.cp-intro-head p {
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.cp-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0e7490;
}

.cp-feature-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cp-feature-card {
  border-radius: 14px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #d9e8f7;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: cpCardIn 0.55s ease both;
}

.cp-feature-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.cp-feature-card:nth-child(1) { animation-delay: 0.06s; }
.cp-feature-card:nth-child(2) { animation-delay: 0.1s; }
.cp-feature-card:nth-child(3) { animation-delay: 0.14s; }
.cp-feature-card:nth-child(4) { animation-delay: 0.18s; }
.cp-feature-card:nth-child(5) { animation-delay: 0.22s; }
.cp-feature-card:nth-child(6) { animation-delay: 0.26s; }
.cp-feature-card:nth-child(7) { animation-delay: 0.3s; }
.cp-feature-card:nth-child(8) { animation-delay: 0.34s; }

.cp-feature-no {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: #0e7490;
  font-size: 12px;
  font-weight: 700;
  background: rgba(14, 165, 233, 0.15);
}

.cp-feature-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #1e293b;
}

.cp-login-card,
.cp-role-card {
  position: relative;
  z-index: 2;
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.1);
}

.cp-login-card {
  animation: cpSlideRight 0.56s ease-out both;
}

.cp-role-card {
  animation: cpRiseIn 0.45s ease-out both;
}

.cp-head h3 {
  margin: 2px 0 6px;
  font-size: 30px;
  color: #0f172a;
}

.cp-head p {
  margin: 0;
  color: #475569;
}

.cp-form {
  margin-top: 16px;
}

.cp-role-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 4px;
}

.cp-action-row {
  margin-top: 10px;
}

.cp-login-btn {
  min-width: 150px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cp-login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(14, 116, 144, 0.22);
}

.cp-account-box {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(241, 245, 249, 0.86);
  color: #334155;
  font-size: 13px;
  line-height: 1.7;
}

.cp-account-trigger {
  margin-top: 8px;
  padding-left: 2px;
  color: #0e7490;
  transition: color 0.2s ease, transform 0.2s ease;
}

.cp-account-trigger:hover {
  color: #0369a1;
  transform: translateX(2px);
}

.cp-account-title {
  font-weight: 700;
  color: #0f172a;
}

.cp-account-box p {
  margin: 0;
}

.cp-role-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.cp-role-head h3 {
  margin: 8px 0 6px;
  font-size: 28px;
  color: #0f172a;
}

.cp-role-desc {
  margin: 0;
  color: #475569;
}

.cp-role-grid {
  margin-top: 18px;
}

.cp-stat-grid {
  margin-top: 14px;
}

.cp-stat-card {
  border-radius: 12px;
  border: 1px solid #dbe6f2;
  background: #f8fbff;
  padding: 12px;
}

.cp-stat-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.cp-stat-card h4 {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 26px;
}

.cp-launch-panel {
  border: 1px solid #dbe8f4;
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(150deg, rgba(248, 252, 255, 0.95), rgba(241, 250, 245, 0.94));
}

.cp-admin-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
}

.cp-admin-side {
  border: 1px solid #dbe8f4;
  border-radius: 14px;
  background: linear-gradient(180deg, #0f2f49 0%, #123a59 100%);
  padding: 10px;
}

.cp-admin-side-title {
  color: #d9ebfd;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 4px 6px 10px;
}

.cp-admin-menu {
  border-right: none;
  background: transparent;
}

.cp-admin-menu :deep(.el-menu-item) {
  color: #d2e6fb;
  border-radius: 8px;
  margin-bottom: 4px;
}

.cp-admin-menu :deep(.el-menu-item:hover) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}

.cp-admin-menu :deep(.el-menu-item.is-active) {
  color: #ffffff;
  background: linear-gradient(90deg, rgba(30, 136, 229, 0.78), rgba(13, 148, 136, 0.72));
}

.cp-admin-content {
  min-width: 0;
}

.cp-launch-head h4 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.cp-launch-head p {
  margin: 6px 0 0;
  color: #475569;
}

.cp-launch-form {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 12px;
}

.cp-launch-full {
  grid-column: 1 / -1;
}

.cp-date-range {
  width: 100%;
}

.cp-inline-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin: 10px 0 12px;
}

.cp-event-table {
  margin-top: 8px;
}

.cp-pagination {
  margin-top: 12px;
  justify-content: flex-end;
}

.cp-preview-title {
  margin: 0 0 12px;
  color: #0f172a;
  font-weight: 600;
}

.cp-preview-pdf {
  width: 100%;
  height: min(72vh, 760px);
  border: 1px solid #dbe5f0;
  border-radius: 10px;
}

.cp-preview-image {
  display: block;
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border: 1px solid #dbe5f0;
  border-radius: 10px;
  background: #f8fafc;
}

.cp-role-feature-item {
  height: 100%;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid #dbe5f0;
  background: linear-gradient(140deg, #f8fbff 0%, #f8fffb 100%);
  color: #0f172a;
  font-size: 14px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.cp-role-feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 18px rgba(15, 23, 42, 0.08);
}

@keyframes cpRiseIn {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes cpSlideLeft {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes cpSlideRight {
  from {
    transform: translateX(10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes cpCardIn {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes cpFloatA {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes cpFloatB {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cp-bg-a,
  .cp-bg-b,
  .cp-shell,
  .cp-intro-panel,
  .cp-login-card,
  .cp-role-card,
  .cp-feature-card {
    animation: none !important;
  }
}

@media (max-width: 900px) {
  .cp-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .cp-feature-grid {
    grid-template-columns: 1fr;
  }

  .cp-role-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cp-role-head {
    flex-direction: column;
  }

  .cp-launch-form {
    grid-template-columns: 1fr;
  }

  .cp-admin-layout {
    grid-template-columns: 1fr;
  }

  .cp-inline-row {
    grid-template-columns: 1fr;
  }
}
</style>
