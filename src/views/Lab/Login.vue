<template>
  <div class="lab-login-page">
    <div class="lab-login-orb orb-a"></div>
    <div class="lab-login-orb orb-b"></div>

    <div class="lab-login-shell">
      <section class="lab-login-side">
        <div class="lab-brand-row">
          <div class="lab-brand-icon">
            <el-icon><Monitor /></el-icon>
          </div>
          <span class="lab-brand-badge">Lab Cloud</span>
        </div>

        <h1 class="lab-side-title">实验室综合管理云平台</h1>
        <p class="lab-side-subtitle">
          面向实验室建设、设备资产、易耗品流转、预约审核和统计上报的统一认证入口。
        </p>

        <div class="lab-side-points">
          <article v-for="item in sidePoints" :key="item.title" class="lab-side-point">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </section>

      <el-card class="lab-login-card" shadow="never">
        <div class="lab-login-head">
          <p class="lab-login-kicker">统一身份认证</p>
          <h2>登录平台</h2>
          <p>请选择用户角色，并输入对应账号与密码后进入系统。</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="lab-login-form">
          <el-form-item label="用户角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择用户角色" class="lab-form-field" @change="handleRoleChange">
              <el-option v-for="item in LAB_ROLE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入账号" clearable class="lab-form-field" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
              class="lab-form-field"
              @keyup.enter="submitLogin"
            />
          </el-form-item>

          <div class="lab-demo-box">
            <p class="lab-demo-title">当前演示账号</p>
            <template v-if="activeDemoAccount">
              <p>{{ activeDemoAccount.roleLabel }} / {{ activeDemoAccount.name }}</p>
              <p>账号：{{ activeDemoAccount.account }}</p>
              <p>密码：{{ activeDemoAccount.password }}</p>
            </template>
            <p v-else>选择角色后显示对应演示账号。</p>
          </div>

          <div class="lab-action-row">
            <el-button type="primary" class="lab-submit-btn" @click="submitLogin">登录系统</el-button>
            <el-button class="lab-reset-btn" @click="resetForm">重置</el-button>
            <el-button text class="lab-back-btn" @click="goHome">返回首页</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Monitor } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {
  LAB_ACCOUNT_LIST,
  LAB_ROLE_OPTIONS,
  findLabAccount,
  type LabAccountRoleOption
} from '@/mock/labAccounts'

type RoleValue = LabAccountRoleOption['value'] | ''

const router = useRouter()
const formRef = ref<FormInstance>()

const form = reactive({
  role: '' as RoleValue,
  account: '',
  password: ''
})

const rules: FormRules = {
  role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const sidePoints = [
  {
    title: '统一实验室资源管理',
    description: '覆盖教学楼、实训室、库房、门禁与专职管理人员信息维护。'
  },
  {
    title: '流程化审批与追踪',
    description: '支持设备、易耗品、预约等业务申请、审核、归还与全流程操作留痕。'
  },
  {
    title: '统计分析与数据上报',
    description: '面向智慧校园建设提供多维统计、导出上报与可视化决策支撑。'
  }
]

const activeDemoAccount = computed(() => {
  if (!form.role) {
    return null
  }

  return LAB_ACCOUNT_LIST.find((item) => item.role === form.role) ?? null
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

    const matchedAccount = findLabAccount(form.role, form.account, form.password)

    if (!matchedAccount) {
      ElMessage.error('账号、密码或角色不匹配')
      return
    }

    sessionStorage.setItem('lab_auth', '1')
    sessionStorage.setItem('lab_role', matchedAccount.role)
    sessionStorage.setItem('lab_role_label', matchedAccount.roleLabel)
    sessionStorage.setItem('lab_account', matchedAccount.account)
    sessionStorage.setItem('lab_name', matchedAccount.name)

    ElMessage.success(`${matchedAccount.roleLabel}登录成功，正在进入平台`)
    void router.push('/lab')
  })
}
</script>

<style scoped>
.lab-login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 28px;
  background:
    radial-gradient(circle at 15% 18%, rgba(34, 197, 94, 0.2), transparent 34%),
    radial-gradient(circle at 85% 82%, rgba(6, 182, 212, 0.18), transparent 32%),
    linear-gradient(145deg, #ecfdf5 0%, #eff6ff 52%, #fffbeb 100%);
}

.lab-login-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(2px);
}

.orb-a {
  top: -70px;
  left: -90px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.28), rgba(16, 185, 129, 0));
}

.orb-b {
  right: -90px;
  bottom: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.26), rgba(14, 165, 233, 0));
}

.lab-login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(360px, 0.82fr);
  width: min(1080px, 100%);
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(14px);
}

.lab-login-side {
  padding: 42px 34px;
  color: #f8fafc;
  background:
    linear-gradient(160deg, rgba(22, 101, 52, 0.96) 0%, rgba(13, 148, 136, 0.92) 55%, rgba(8, 145, 178, 0.9) 100%);
}

.lab-brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lab-brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.lab-brand-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: rgba(255, 255, 255, 0.12);
}

.lab-side-title {
  margin-top: 22px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(28px, 2.2vw, 38px);
  line-height: 1.2;
}

.lab-side-subtitle {
  margin-top: 14px;
  max-width: 470px;
  line-height: 1.8;
  color: rgba(240, 253, 250, 0.9);
}

.lab-side-points {
  margin-top: 28px;
  display: grid;
  gap: 14px;
}

.lab-side-point {
  padding: 16px 16px 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.lab-side-point h3 {
  font-size: 16px;
  margin-bottom: 6px;
}

.lab-side-point p {
  font-size: 13px;
  line-height: 1.75;
  color: rgba(240, 253, 250, 0.88);
}

.lab-login-card {
  border: none;
  border-radius: 0;
  background: transparent;
}

.lab-login-card :deep(.el-card__body) {
  padding: 38px 34px 34px;
}

.lab-login-head h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-login-head p {
  margin-top: 8px;
  color: #475569;
  line-height: 1.7;
}

.lab-login-kicker {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
  background: rgba(16, 185, 129, 0.12);
}

.lab-login-form {
  margin-top: 24px;
}

.lab-form-field {
  width: 100%;
}

.lab-demo-box {
  margin-top: 8px;
  padding: 14px 16px;
  border-radius: 16px;
  color: #334155;
  background: linear-gradient(180deg, rgba(241, 245, 249, 0.9), rgba(248, 250, 252, 0.95));
  border: 1px solid rgba(203, 213, 225, 0.7);
}

.lab-demo-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.lab-demo-box p + p {
  margin-top: 4px;
}

.lab-action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.lab-submit-btn,
.lab-reset-btn {
  min-width: 118px;
  height: 42px;
  border-radius: 999px;
}

.lab-submit-btn {
  border: none;
  background: linear-gradient(135deg, #059669, #0ea5e9);
}

.lab-back-btn {
  margin-left: auto;
}

@media (max-width: 920px) {
  .lab-login-shell {
    grid-template-columns: 1fr;
  }

  .lab-login-side {
    padding-bottom: 26px;
  }
}

@media (max-width: 640px) {
  .lab-login-page {
    padding: 16px;
  }

  .lab-login-card :deep(.el-card__body),
  .lab-login-side {
    padding: 26px 20px;
  }

  .lab-action-row {
    align-items: stretch;
  }

  .lab-submit-btn,
  .lab-reset-btn {
    flex: 1 1 100%;
  }

  .lab-back-btn {
    margin-left: 0;
    padding-left: 0;
  }
}
</style>