<template>
  <section class="fitness-login-page">
    <div class="fitness-orb fitness-orb--a"></div>
    <div class="fitness-orb fitness-orb--b"></div>
    <div class="fitness-grid">
      <section class="fitness-intro-panel">
        <div class="fitness-brand-row">
          <div class="fitness-brand-mark">
            <span></span>
          </div>
          <div>
            <p class="fitness-brand-kicker">Smart PE OS</p>
            <h1 class="fitness-brand-title">智慧体测平台</h1>
          </div>
        </div>

        <p class="fitness-brand-subtitle">
          以 AI 训练数字化为核心，面向教师、学生、班主任和平台管理员构建统一认证入口。
        </p>

        <div class="fitness-metric-row">
          <article v-for="item in metrics" :key="item.label" class="fitness-metric-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>

        <div class="fitness-role-section">
          <div class="fitness-section-head">
            <h2>平台用户分析</h2>
            <p>先把高频使用者分清楚，后续权限模型和工作台才不会混乱。</p>
          </div>

          <article v-for="role in roles" :key="role.id" class="fitness-role-card">
            <div class="fitness-role-header">
              <div>
                <p class="fitness-role-badge">{{ role.badge }}</p>
                <h3>{{ role.name }}</h3>
              </div>
              <span class="fitness-role-short">{{ role.shortName }}</span>
            </div>
            <p class="fitness-role-audience">{{ role.audience }}</p>
            <div class="fitness-tag-row">
              <span v-for="item in role.responsibilities" :key="item" class="fitness-tag">{{ item }}</span>
            </div>
          </article>
        </div>

        <ul class="fitness-note-list">
          <li v-for="item in notes" :key="item">{{ item }}</li>
        </ul>
      </section>

      <el-card class="fitness-login-card" shadow="never">
        <div class="fitness-login-head">
          <p class="fitness-login-kicker">统一身份认证</p>
          <h2>多角色登录入口</h2>
          <p>当前先设计标准账号密码登录，后续可继续接入微信、小程序采集端与人脸核验流程。</p>
        </div>

        <div class="fitness-role-switcher">
          <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            :class="['fitness-role-switch', { 'is-active': role.id === activeRole }]"
            @click="switchRole(role.id)"
          >
            <span>{{ role.name }}</span>
            <small>{{ role.shortName }}</small>
          </button>
        </div>

        <div class="fitness-active-role-panel">
          <p class="fitness-active-title">当前角色</p>
          <div class="fitness-active-header">
            <h3>{{ activeRoleProfile.name }}</h3>
            <span>{{ activeRoleProfile.badge }}</span>
          </div>
          <p class="fitness-active-desc">{{ activeRoleProfile.audience }}</p>
          <div class="fitness-permission-list">
            <div v-for="item in activeRoleProfile.permissions" :key="item" class="fitness-permission-item">
              {{ item }}
            </div>
          </div>
        </div>

        <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top" class="fitness-form">
          <el-form-item label="组织编码" prop="campusCode">
            <el-input v-model="loginForm.campusCode" placeholder="请输入学校或机构编码" clearable />
          </el-form-item>

          <el-form-item :label="activeRoleProfile.accountLabel" prop="account">
            <el-input v-model="loginForm.account" :placeholder="activeRoleProfile.accountPlaceholder" clearable />
          </el-form-item>

          <el-form-item :label="activeRoleProfile.passwordLabel" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入登录密码"
              show-password
              clearable
            />
          </el-form-item>

          <div class="fitness-option-row">
            <el-checkbox v-model="loginForm.remember">7 天内记住本机</el-checkbox>
            <button type="button" class="fitness-text-button">忘记密码</button>
          </div>

          <div class="fitness-action-row">
            <el-button type="primary" class="fitness-submit-btn" @click="submitLogin">进入平台</el-button>
            <el-button class="fitness-secondary-btn" @click="fillDemoAccount">填充演示账号</el-button>
            <el-button class="fitness-secondary-btn" @click="goHome">返回首页</el-button>
          </div>
        </el-form>

        <div class="fitness-demo-box">
          <p>演示账号</p>
          <strong>{{ activeRoleProfile.demoAccount }}</strong>
          <span>密码：{{ activeRoleProfile.demoPassword }}</span>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  FITNESS_PLATFORM_METRICS,
  FITNESS_PLATFORM_NOTES,
  FITNESS_ROLE_PROFILES,
  type FitnessRole
} from '@/mock/fitnessPlatform'

const router = useRouter()

const roles = FITNESS_ROLE_PROFILES
const metrics = FITNESS_PLATFORM_METRICS
const notes = FITNESS_PLATFORM_NOTES

const formRef = ref<FormInstance>()
const activeRole = ref<FitnessRole>('teacher')

const loginForm = reactive({
  campusCode: 'CAMPUS-PE',
  account: '',
  password: '',
  remember: true
})

const activeRoleProfile = computed(() => {
  return roles.find((item) => item.id === activeRole.value) ?? roles[0]
})

const rules = computed<FormRules>(() => ({
  campusCode: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
  account: [{ required: true, message: `请输入${activeRoleProfile.value.accountLabel}`, trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
}))

const fillDemoAccount = () => {
  loginForm.account = activeRoleProfile.value.demoAccount
  loginForm.password = activeRoleProfile.value.demoPassword
}

const switchRole = (role: FitnessRole) => {
  activeRole.value = role
  fillDemoAccount()
}

const submitLogin = async () => {
  const valid = await formRef.value?.validate().catch(() => false)

  if (!valid) {
    return
  }

  const isMatch =
    loginForm.account === activeRoleProfile.value.demoAccount &&
    loginForm.password === activeRoleProfile.value.demoPassword

  if (!isMatch) {
    ElMessage.error('账号或密码错误，请使用当前角色对应的演示账号')
    return
  }

  sessionStorage.setItem('fitness_role', activeRole.value)
  sessionStorage.setItem('fitness_account', loginForm.account)
  ElMessage.success(`${activeRoleProfile.value.name}登录成功，平台工作台正在规划中`)
}

const goHome = () => {
  void router.push('/')
}

fillDemoAccount()
</script>

<style scoped>
.fitness-login-page {
  --fitness-ink: #122033;
  --fitness-sub: #506072;
  --fitness-line: rgba(148, 163, 184, 0.26);

  position: relative;
  min-height: calc(100vh - 96px);
  overflow: hidden;
  padding: 12px 0;
}

.fitness-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
}

.fitness-orb--a {
  top: -90px;
  left: -100px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle at center, rgba(20, 184, 166, 0.26), rgba(20, 184, 166, 0));
}

.fitness-orb--b {
  right: -80px;
  bottom: 12%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at center, rgba(249, 115, 22, 0.18), rgba(249, 115, 22, 0));
}

.fitness-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.82fr);
  gap: 26px;
  align-items: start;
}

.fitness-intro-panel {
  padding: 28px 10px 18px;
}

.fitness-brand-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.fitness-brand-mark {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border-radius: 22px;
  background: linear-gradient(150deg, #0f766e 0%, #0ea5a3 58%, #f59e0b 100%);
  box-shadow: 0 18px 36px rgba(15, 118, 110, 0.24);
}

.fitness-brand-mark span {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 10px 10px;
  border: 4px solid rgba(255, 255, 255, 0.94);
  border-bottom-width: 8px;
  transform: rotate(45deg);
}

.fitness-brand-kicker {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0f766e;
}

.fitness-brand-title {
  margin-top: 6px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.08;
  color: var(--fitness-ink);
}

.fitness-brand-subtitle {
  max-width: 720px;
  margin-top: 18px;
  font-size: 16px;
  line-height: 1.8;
  color: var(--fitness-sub);
}

.fitness-metric-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.fitness-metric-card {
  padding: 18px 18px 16px;
  border-radius: 20px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.84), rgba(240, 253, 250, 0.9));
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
}

.fitness-metric-card strong {
  display: block;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: 28px;
  line-height: 1;
  color: #0f172a;
}

.fitness-metric-card span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #526173;
}

.fitness-role-section {
  margin-top: 28px;
}

.fitness-section-head h2 {
  font-size: 24px;
  color: var(--fitness-ink);
}

.fitness-section-head p {
  margin-top: 6px;
  font-size: 14px;
  color: var(--fitness-sub);
}

.fitness-role-card {
  margin-top: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--fitness-line);
  backdrop-filter: blur(10px);
}

.fitness-role-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.fitness-role-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #0f766e;
  background: rgba(20, 184, 166, 0.12);
}

.fitness-role-header h3 {
  margin-top: 8px;
  font-size: 20px;
  color: var(--fitness-ink);
}

.fitness-role-short {
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.fitness-role-audience {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--fitness-sub);
}

.fitness-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.fitness-tag {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #172554;
  background: rgba(219, 234, 254, 0.65);
}

.fitness-note-list {
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.fitness-note-list li {
  padding: 12px 14px 12px 42px;
  border-radius: 16px;
  position: relative;
  font-size: 13px;
  line-height: 1.7;
  color: #374151;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.fitness-note-list li::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 18px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(145deg, #14b8a6, #f59e0b);
}

.fitness-login-card {
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 26px 54px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(14px);
}

.fitness-login-card :deep(.el-card__body) {
  padding: 28px;
}

.fitness-login-head h2 {
  margin-top: 6px;
  font-size: 28px;
  color: var(--fitness-ink);
}

.fitness-login-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f766e;
}

.fitness-login-head p:last-child {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--fitness-sub);
}

.fitness-role-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.fitness-role-switch {
  padding: 14px 16px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.86);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.fitness-role-switch span,
.fitness-role-switch small {
  display: block;
}

.fitness-role-switch span {
  font-size: 15px;
  font-weight: 600;
  color: #122033;
}

.fitness-role-switch small {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fitness-role-switch:hover,
.fitness-role-switch.is-active {
  transform: translateY(-2px);
  border-color: rgba(15, 118, 110, 0.46);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.fitness-role-switch.is-active {
  background: linear-gradient(145deg, rgba(240, 253, 250, 0.95), rgba(255, 247, 237, 0.95));
}

.fitness-active-role-panel {
  margin-top: 20px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(15, 118, 110, 0.08), rgba(249, 115, 22, 0.08));
}

.fitness-active-title {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0f766e;
}

.fitness-active-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.fitness-active-header h3 {
  font-size: 22px;
  color: var(--fitness-ink);
}

.fitness-active-header span {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #92400e;
  background: rgba(251, 191, 36, 0.2);
}

.fitness-active-desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--fitness-sub);
}

.fitness-permission-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.fitness-permission-item {
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.72);
}

.fitness-form {
  margin-top: 22px;
}

.fitness-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.fitness-form :deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 14px;
}

.fitness-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: -2px;
}

.fitness-text-button {
  border: none;
  padding: 0;
  background: transparent;
  font-size: 13px;
  color: #0f766e;
  cursor: pointer;
}

.fitness-action-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 18px;
}

.fitness-submit-btn,
.fitness-secondary-btn {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
}

.fitness-submit-btn {
  border: none;
  background: linear-gradient(135deg, #0f766e 0%, #0ea5a3 55%, #f59e0b 100%);
}

.fitness-demo-box {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  background: #122033;
  color: #f8fafc;
}

.fitness-demo-box p {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}

.fitness-demo-box strong,
.fitness-demo-box span {
  display: block;
  margin-top: 8px;
}

.fitness-demo-box strong {
  font-size: 22px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

.fitness-demo-box span {
  font-size: 13px;
  opacity: 0.88;
}

@media (max-width: 1100px) {
  .fitness-grid {
    grid-template-columns: 1fr;
  }

  .fitness-intro-panel {
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .fitness-login-page {
    min-height: auto;
  }

  .fitness-metric-row,
  .fitness-role-switcher {
    grid-template-columns: 1fr;
  }

  .fitness-login-card :deep(.el-card__body) {
    padding: 22px 18px;
  }

  .fitness-brand-row {
    align-items: flex-start;
  }

  .fitness-brand-title {
    font-size: 32px;
  }
}
</style>
