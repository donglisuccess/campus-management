<template>
  <div class="welcome-login-page">
    <div class="welcome-login-halo halo-a"></div>
    <div class="welcome-login-halo halo-b"></div>

    <div class="welcome-login-shell">
      <section class="welcome-login-side">
        <span class="welcome-side-tag">Welcome Hub</span>
        <h1>智慧校园迎新管理后台</h1>
        <p>
          支撑迎新办、学院报到点、防疫门禁组和宣传公告组的统一协同入口，覆盖报到前准备、到校核验、异常处置和内容发布。
        </p>

        <div class="welcome-side-points">
          <article v-for="item in sidePoints" :key="item.title" class="welcome-side-point">
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </article>
        </div>
      </section>

      <el-card class="welcome-login-card" shadow="never">
        <div class="welcome-login-head">
          <p class="welcome-login-kicker">统一身份认证</p>
          <h2>登录迎新后台</h2>
          <p>选择角色并输入演示账号后进入一期管理模块。</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="welcome-login-form">
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择后台角色" class="welcome-form-field" @change="handleRoleChange">
              <el-option
                v-for="item in WELCOME_ROLE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <div class="welcome-role-option">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.description }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入账号" clearable class="welcome-form-field" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
              class="welcome-form-field"
              @keyup.enter="submitLogin"
            />
          </el-form-item>

          <div class="welcome-demo-box">
            <p class="welcome-demo-title">当前演示账号</p>
            <template v-if="activeDemoAccount">
              <p>{{ activeDemoAccount.roleLabel }} / {{ activeDemoAccount.name }}</p>
              <p>账号：{{ activeDemoAccount.account }}</p>
              <p>密码：{{ activeDemoAccount.password }}</p>
            </template>
            <p v-else>先选择角色，再查看对应演示账号。</p>
          </div>

          <div class="welcome-login-actions">
            <el-button type="primary" class="welcome-submit-btn" @click="submitLogin">登录系统</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button text @click="goHome">返回首页</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  WELCOME_LOGIN_ACCOUNTS,
  WELCOME_ROLE_OPTIONS,
  findWelcomeAccount,
  type WelcomeManageRole
} from '@/mock/welcomeManage'

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  role: '' as WelcomeManageRole | '',
  account: '',
  password: ''
})

const rules: FormRules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const sidePoints = [
  {
    title: '学生主数据统一管理',
    description: '支持学生信息、预报到状态和报到进度集中核验。'
  },
  {
    title: '迎新现场实时调度',
    description: '联动门禁、健康打卡、紧急事件与现场处置闭环。'
  },
  {
    title: '多角色权限分流',
    description: '按迎新办、报到组、防疫组、宣传组提供差异化菜单访问。'
  }
]

const activeDemoAccount = computed(() => {
  if (!form.role) {
    return null
  }

  return WELCOME_LOGIN_ACCOUNTS.find((item) => item.role === form.role) ?? null
})

const handleRoleChange = () => {
  form.account = ''
  form.password = ''
}

const resetForm = () => {
  formRef.value?.resetFields()
}

const goHome = () => {
  void router.push('/')
}

const submitLogin = () => {
  formRef.value?.validate((valid) => {
    if (!valid || !form.role) {
      return
    }

    const matchedAccount = findWelcomeAccount(form.role, form.account, form.password)

    if (!matchedAccount) {
      ElMessage.error('账号、密码或角色不匹配')
      return
    }

    sessionStorage.setItem('welcome_auth', '1')
    sessionStorage.setItem('welcome_role', matchedAccount.role)
    sessionStorage.setItem('welcome_role_label', matchedAccount.roleLabel)
    sessionStorage.setItem('welcome_name', matchedAccount.name)
    sessionStorage.setItem('welcome_account', matchedAccount.account)
    sessionStorage.setItem('welcome_permissions', matchedAccount.permissions.join(','))

    ElMessage.success(`${matchedAccount.roleLabel}登录成功，正在进入后台`)
    void router.push('/welcome/manage')
  })
}
</script>

<style scoped>
.welcome-login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 30px;
  background:
    radial-gradient(circle at 16% 20%, rgba(249, 115, 22, 0.18), transparent 34%),
    radial-gradient(circle at 84% 78%, rgba(14, 165, 233, 0.18), transparent 30%),
    linear-gradient(145deg, #fff7ed 0%, #fffdf7 44%, #eff6ff 100%);
}

.welcome-login-halo {
  position: absolute;
  border-radius: 999px;
}

.halo-a {
  top: -80px;
  left: -70px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.2), rgba(251, 146, 60, 0));
}

.halo-b {
  right: -80px;
  bottom: -80px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0));
}

.welcome-login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(340px, 1fr) minmax(360px, 0.9fr);
  width: min(1100px, 100%);
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(12px);
}

.welcome-login-side {
  padding: 42px 34px;
  color: #fff7ed;
  background:
    radial-gradient(circle at 18% 24%, rgba(253, 186, 116, 0.26), rgba(253, 186, 116, 0)),
    linear-gradient(155deg, #9a3412 0%, #c2410c 48%, #0f766e 100%);
}

.welcome-side-tag {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 247, 237, 0.16);
  border: 1px solid rgba(255, 247, 237, 0.24);
}

.welcome-login-side h1 {
  margin-top: 22px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(30px, 2.5vw, 40px);
  line-height: 1.2;
}

.welcome-login-side > p {
  margin-top: 14px;
  max-width: 460px;
  line-height: 1.85;
  color: rgba(255, 247, 237, 0.88);
}

.welcome-side-points {
  margin-top: 30px;
  display: grid;
  gap: 14px;
}

.welcome-side-point {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 247, 237, 0.1);
  border: 1px solid rgba(255, 247, 237, 0.14);
}

.welcome-side-point span {
  color: rgba(255, 247, 237, 0.82);
  line-height: 1.7;
}

.welcome-login-card {
  border: none;
  border-radius: 0;
  background: transparent;
}

.welcome-login-card :deep(.el-card__body) {
  padding: 38px 34px 34px;
}

.welcome-login-kicker {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c2410c;
  background: rgba(249, 115, 22, 0.12);
}

.welcome-login-head h2 {
  margin-top: 10px;
  font-size: 30px;
  color: #0f172a;
}

.welcome-login-head p {
  margin-top: 8px;
  line-height: 1.75;
  color: #475569;
}

.welcome-login-form {
  margin-top: 24px;
}

.welcome-form-field {
  width: 100%;
}

.welcome-role-option {
  display: grid;
  gap: 2px;
}

.welcome-role-option span {
  font-size: 12px;
  color: #64748b;
}

.welcome-demo-box {
  margin-top: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 247, 237, 0.92), rgba(239, 246, 255, 0.92));
  border: 1px solid rgba(251, 146, 60, 0.2);
  color: #334155;
  line-height: 1.7;
}

.welcome-demo-title {
  margin-bottom: 6px;
  font-weight: 600;
  color: #9a3412;
}

.welcome-login-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.welcome-submit-btn {
  min-width: 132px;
}

@media (max-width: 960px) {
  .welcome-login-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .welcome-login-page {
    padding: 16px;
  }

  .welcome-login-side,
  .welcome-login-card :deep(.el-card__body) {
    padding: 24px 20px;
  }
}
</style>