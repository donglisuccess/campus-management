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

      <section v-if="canLaunchEvent" class="cp-launch-panel">
        <div class="cp-launch-head">
          <h4>赛事活动发起</h4>
          <p>支持学校发起赛事活动，可配置活动时间与分组信息。</p>
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

        <el-table :data="eventList" border stripe class="cp-event-table">
          <el-table-column prop="title" label="活动名称" min-width="180" />
          <el-table-column prop="school" label="发起学校" min-width="180" />
          <el-table-column prop="group" label="活动分组" min-width="140" />
          <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
          <el-table-column prop="status" label="状态" min-width="100" />
        </el-table>
      </section>

      <el-row :gutter="16" class="cp-role-grid">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in roleConfig[currentRole].features" :key="item">
          <div class="cp-role-feature-item">{{ item }}</div>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

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

interface EventRecord {
  title: string
  school: string
  group: string
  dateRangeText: string
  status: string
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

const eventList = ref<EventRecord[]>([
  {
    title: '2026校园创新作品评比活动',
    school: '南城一中',
    group: '高中组',
    dateRangeText: '2026-03-01 至 2026-03-20',
    status: '进行中'
  }
])

const serviceFeatures = [
  { no: '01', text: '赛事活动发起，支持学校可发起赛事活动。' },
  { no: '02', text: '支持建立分组，可选择分组发起活动。' },
  { no: '03', text: '支持教师/学生在线上传竞赛材料，支持在线预览并限制附件大小。' },
  { no: '04', text: '支持以学校为主体发起赛事活动，每所学校上传材料，评委可对学校评分。' },
  { no: '05', text: '支持管理人员将作品打包导出或下载。' },
  { no: '06', text: '支持单个文件、单个作品集、学校作品集上传及浏览、点评、打分。' },
  { no: '07', text: '支持自定义打分模式与比例，并支持配置是否显示得分情况。' },
  { no: '08', text: '支持配置是否允许下载单个作品或仅浏览作品。' }
]

const testAccounts = [
  '平台管理员：platformAdmin/platformAdmin',
  '学校管理员：schoolAdmin/schoolAdmin',
  '评委：pingwei/pingwei',
  '教师：teacher001/teacher001',
  '学生：student001/student001'
]

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

const canLaunchEvent = computed(() => currentRole.value === 'platformAdmin' || currentRole.value === 'schoolAdmin')

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

.cp-launch-panel {
  margin-top: 18px;
  border: 1px solid #dbe8f4;
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(150deg, rgba(248, 252, 255, 0.95), rgba(241, 250, 245, 0.94));
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

.cp-event-table {
  margin-top: 8px;
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
}
</style>
