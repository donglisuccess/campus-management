<template>
  <section class="fitness-login-page">
    <div class="fitness-login-shell">
      <section class="fitness-hero-panel">
        <p class="fitness-login-kicker">Smart PE OS</p>
        <h1>智慧体测平台</h1>
        <p class="fitness-login-subtitle">统一身份认证入口，支持平台管理员、体育教师、班主任和学生登录。</p>

        <div class="fitness-hero-chip-row">
          <span class="fitness-hero-chip">AI 训练数字化</span>
          <span class="fitness-hero-chip">统一认证</span>
          <span class="fitness-hero-chip">多角色协同</span>
        </div>

        <div class="fitness-role-summary">
          <span class="fitness-role-badge">{{ activeRoleProfile.badge }}</span>
          <p>{{ activeRoleProfile.audience }}</p>
        </div>
      </section>

      <el-card class="fitness-login-card" shadow="never">
        <div class="fitness-form-head">
          <h2>账号登录</h2>
          <p>请选择身份并填写登录信息</p>
        </div>

        <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top" class="fitness-form">
          <el-form-item label="登录身份" prop="role">
            <el-select v-model="activeRole" class="fitness-full" @change="switchRole">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>

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
            <el-checkbox v-model="loginForm.remember">记住登录信息</el-checkbox>
            <button type="button" class="fitness-text-button" @click="fillDemoAccount">填充演示账号</button>
          </div>

          <el-button type="primary" class="fitness-submit-btn" @click="submitLogin">登录</el-button>
          <el-button class="fitness-back-btn" @click="goHome">返回首页</el-button>
        </el-form>

        <div class="fitness-demo-box">
          <span>演示账号：{{ activeRoleProfile.demoAccount }}</span>
          <span>演示密码：{{ activeRoleProfile.demoPassword }}</span>
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
  FITNESS_ROLE_PROFILES,
  FITNESS_STORAGE_ACCOUNT,
  FITNESS_STORAGE_ROLE,
  type FitnessRole
} from '@/mock/fitnessPlatform'

const router = useRouter()

const roles = FITNESS_ROLE_PROFILES
const formRef = ref<FormInstance>()
const activeRole = ref<FitnessRole>('teacher')

const loginForm = reactive({
  role: 'teacher',
  campusCode: 'CAMPUS-PE',
  account: '',
  password: '',
  remember: true
})

const activeRoleProfile = computed(() => {
  return roles.find((item) => item.id === activeRole.value) ?? roles[0]
})

const rules = computed<FormRules>(() => ({
  role: [{ required: true, message: '请选择登录身份', trigger: 'change' }],
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
  loginForm.role = role
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

  sessionStorage.setItem(FITNESS_STORAGE_ROLE, activeRole.value)
  sessionStorage.setItem(FITNESS_STORAGE_ACCOUNT, loginForm.account)

  if (activeRole.value === 'admin') {
    ElMessage.success('平台管理员登录成功，正在进入管理界面')
    void router.push('/fitness/manage')
    return
  }

  if (activeRole.value === 'teacher') {
    ElMessage.success('体育教师登录成功，正在进入工作台')
    void router.push('/fitness/teacher')
    return
  }

  if (activeRole.value === 'headTeacher') {
    ElMessage.success('班主任登录成功，正在进入班级跟踪界面')
    void router.push('/fitness/head-teacher')
    return
  }

  ElMessage.success(`${activeRoleProfile.value.name}登录成功，当前演示版暂未开放对应后台`) 
}

const goHome = () => {
  void router.push('/')
}

fillDemoAccount()
</script>

<style scoped>
.fitness-login-page {
  min-height: calc(100vh - 96px);
  margin: -40px -20px -56px;
  padding: 40px 20px 56px;
  background:
    radial-gradient(circle at left top, rgba(20, 184, 166, 0.16), rgba(20, 184, 166, 0) 36%),
    radial-gradient(circle at right bottom, rgba(14, 165, 233, 0.16), rgba(14, 165, 233, 0) 34%),
    linear-gradient(135deg, #eff6ff 0%, #f0fdf4 52%, #fff7ed 100%);
}

.fitness-login-shell {
  min-height: calc(100vh - 176px);
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
  gap: 24px;
}

.fitness-hero-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 54px;
  border-radius: 28px;
  background: linear-gradient(160deg, rgba(15, 118, 110, 0.94), rgba(14, 165, 163, 0.88));
  color: #f8fafc;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.16);
}

.fitness-login-kicker {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.82;
}

.fitness-hero-panel h1 {
  margin-top: 8px;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.08;
}

.fitness-login-subtitle {
  max-width: 560px;
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.8;
  color: rgba(248, 250, 252, 0.92);
}

.fitness-hero-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.fitness-hero-chip {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.14);
}

.fitness-role-summary {
  margin-top: 26px;
  padding: 20px 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
}

.fitness-role-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #ecfeff;
  background: rgba(255, 255, 255, 0.16);
}

.fitness-role-summary p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(248, 250, 252, 0.9);
}

.fitness-login-card {
  display: flex;
  align-items: center;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.1);
}

.fitness-login-card :deep(.el-card__body) {
  width: 100%;
  padding: 34px;
}

.fitness-form-head h2 {
  font-size: 28px;
  color: #0f172a;
}

.fitness-form-head p {
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
}

.fitness-form {
  margin-top: 22px;
}

.fitness-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.fitness-form :deep(.el-input__wrapper),
.fitness-form :deep(.el-select__wrapper) {
  min-height: 46px;
  border-radius: 14px;
}

.fitness-full {
  width: 100%;
}

.fitness-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.fitness-text-button {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 13px;
  color: #0f766e;
  cursor: pointer;
}

.fitness-submit-btn,
.fitness-back-btn {
  width: 100%;
  min-height: 46px;
  border-radius: 14px;
}

.fitness-submit-btn {
  border: none;
  background: linear-gradient(135deg, #0f766e, #0ea5a3);
}

.fitness-back-btn {
  margin-top: 10px;
}

.fitness-demo-box {
  display: grid;
  gap: 6px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .fitness-login-shell {
    min-height: auto;
    grid-template-columns: 1fr;
  }

  .fitness-hero-panel {
    padding: 34px 28px;
  }
}

@media (max-width: 768px) {
  .fitness-login-page {
    margin: -40px -20px -56px;
    padding: 16px 12px 28px;
  }

  .fitness-hero-panel {
    padding: 28px 22px;
  }

  .fitness-login-card :deep(.el-card__body) {
    padding: 24px 18px;
  }

  .fitness-option-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
