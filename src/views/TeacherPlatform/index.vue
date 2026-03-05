<template>
  <div class="tp-root">
    <div class="tp-orb tp-orb-a"></div>
    <div class="tp-orb tp-orb-b"></div>

    <div class="tp-shell">
      <section class="tp-side">
        <div class="tp-brand-row">
          <svg viewBox="0 0 64 64" class="tp-logo" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#0ea5e9" />
            <path d="M16 42 L32 20 L48 42 Z" fill="#fff" opacity="0.95" />
            <circle cx="32" cy="40" r="4" fill="#0ea5e9" />
          </svg>
          <span class="tp-badge">Teacher Cloud</span>
        </div>

        <h2 class="tp-side-title">师资管理应用服务云平台</h2>
        <p class="tp-side-subtitle">统一身份认证入口，支持教师与管理员双角色登录。</p>

        <ul class="tp-feature-list">
          <li>教师画像与履历信息一体化管理</li>
          <li>教研成果与项目过程数据可追踪</li>
          <li>安全认证与统一权限治理体系</li>
        </ul>
      </section>

      <el-card class="tp-form-card" shadow="never">
        <div class="tp-form-head">
          <h3>账号登录</h3>
          <p>请选择身份并填写信息后进入平台</p>
        </div>

        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="教师登录" name="teacher">
            <el-form
              :model="teacherForm"
              :rules="teacherRules"
              ref="teacherRef"
              label-position="top"
              class="tp-form"
            >
              <el-form-item label="工号" prop="jobId">
                <el-input v-model="teacherForm.jobId" placeholder="请输入工号" clearable />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="teacherForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable
                />
              </el-form-item>
              <el-form-item class="tp-action-row">
                <el-button type="primary" class="tp-btn" @click="submitTeacher">教师登录</el-button>
                <el-button class="tp-reset-btn" @click="resetTeacher">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="管理员登录" name="admin">
            <el-form
              :model="adminForm"
              :rules="adminRules"
              ref="adminRef"
              label-position="top"
              class="tp-form"
            >
              <el-form-item label="账号" prop="account">
                <el-input v-model="adminForm.account" placeholder="请输入管理员账号" clearable />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="adminForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable
                />
              </el-form-item>
              <el-form-item class="tp-action-row">
                <el-button type="primary" class="tp-btn" @click="submitAdmin">管理员登录</el-button>
                <el-button class="tp-reset-btn" @click="resetAdmin">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <p class="tp-form-foot">如遇登录问题，请联系信息中心运维团队。</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('teacher')

const teacherRef = ref()
const adminRef = ref()

const teacherForm = reactive({ jobId: '', password: '' })
const adminForm = reactive({ account: '', password: '' })

const teacherRules = {
  jobId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const adminRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function submitTeacher() {
  teacherRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用真实登录接口
      ElMessage.success(`教师 ${teacherForm.jobId} 登录成功`)
      router.push({ path: '/teacher' })
    }
  })
}

function resetTeacher() {
  teacherRef.value.resetFields()
}

function submitAdmin() {
  adminRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用真实登录接口
      ElMessage.success(`管理员 ${adminForm.account} 登录成功`)
      router.push({ path: '/' })
    }
  })
}

function resetAdmin() {
  adminRef.value.resetFields()
}
</script>

<style scoped>
.tp-root {
  --tp-primary: #0f766e;
  --tp-primary-strong: #0e7490;
  --tp-text: #0f172a;
  --tp-subtext: #475569;
  --tp-surface: rgba(255, 255, 255, 0.82);

  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 116, 144, 0.2), transparent 42%),
    radial-gradient(circle at 80% 85%, rgba(16, 185, 129, 0.22), transparent 36%),
    linear-gradient(145deg, #e6f5ff 0%, #f7fffb 48%, #ffffff 100%);
  padding: 28px;
}

.tp-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  pointer-events: none;
}

.tp-orb-a {
  width: 260px;
  height: 260px;
  top: 8%;
  left: -80px;
  background: radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.35), rgba(14, 165, 233, 0.05));
  animation: driftA 9s ease-in-out infinite;
}

.tp-orb-b {
  width: 320px;
  height: 320px;
  right: -120px;
  bottom: -80px;
  background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.35), rgba(16, 185, 129, 0.05));
  animation: driftB 10s ease-in-out infinite;
}

.tp-shell {
  display: flex;
  width: min(1000px, 96%);
  border-radius: 24px;
  overflow: hidden;
  background: var(--tp-surface);
  border: 1px solid rgba(148, 163, 184, 0.32);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(10px);
  animation: riseIn 0.6s ease-out both;
}

.tp-side {
  width: 43%;
  color: #f8fafc;
  background:
    linear-gradient(145deg, rgba(15, 118, 110, 0.96) 0%, rgba(14, 116, 144, 0.94) 100%),
    linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04));
  padding: 38px 32px;
  position: relative;
}

.tp-side::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.04));
}

.tp-brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tp-logo {
  width: 54px;
  height: 54px;
}

.tp-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.tp-side-title {
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(24px, 2vw, 31px);
  line-height: 1.25;
  letter-spacing: 0.01em;
  font-weight: 700;
}

.tp-side-subtitle {
  color: rgba(241, 245, 249, 0.9);
  font-size: 14px;
  line-height: 1.7;
}

.tp-feature-list {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.tp-feature-list li {
  padding: 10px 12px 10px 36px;
  border-radius: 12px;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(248, 250, 252, 0.96);
  font-size: 13px;
  line-height: 1.6;
}

.tp-feature-list li::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  transform: translateY(-50%);
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.24);
}

.tp-form-card {
  width: 57%;
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 28px 28px 18px;
  box-sizing: border-box;
}

.tp-form-head {
  margin-bottom: 14px;
}

.tp-form-head h3 {
  color: var(--tp-text);
  font-size: 25px;
  margin-bottom: 6px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

.tp-form-head p {
  color: var(--tp-subtext);
  font-size: 14px;
}

.tp-form-card :deep(.el-tabs--border-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

.tp-form-card :deep(.el-tabs__header) {
  background: rgba(241, 245, 249, 0.92);
  border: none;
  border-radius: 12px;
  padding: 4px;
}

.tp-form-card :deep(.el-tabs__item) {
  border: none;
  border-radius: 8px;
  color: #334155;
  font-weight: 600;
  transition: all 0.2s ease;
}

.tp-form-card :deep(.el-tabs__item.is-active) {
  color: #0f172a;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.tp-form-card :deep(.el-tabs__content) {
  padding: 18px 4px 4px;
}

.tp-form-card :deep(.el-form-item__label) {
  color: #1e293b;
  font-weight: 600;
}

.tp-form-card :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 2px 12px;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.36) inset;
}

.tp-form-card :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(14, 116, 144, 0.5) inset;
}

.tp-form-card :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(14, 116, 144, 0.16) inset;
}

.tp-form {
  max-width: 420px;
}

.tp-action-row {
  margin-top: 8px;
}

.tp-btn {
  min-width: 160px;
  height: 42px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--tp-primary) 0%, var(--tp-primary-strong) 100%);
  box-shadow: 0 10px 20px rgba(14, 116, 144, 0.2);
}

.tp-btn:hover {
  transform: translateY(-1px);
}

.tp-reset-btn {
  height: 42px;
  border-radius: 10px;
}

.tp-form-foot {
  margin: 14px 0 4px;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 720px) {
  .tp-root {
    padding: 16px;
  }

  .tp-shell {
    flex-direction: column;
    border-radius: 18px;
  }

  .tp-side,
  .tp-form-card {
    width: 100%;
  }

  .tp-side {
    padding: 24px 20px;
  }

  .tp-side-title {
    font-size: 23px;
  }

  .tp-form-card {
    padding: 20px 16px 14px;
  }

  .tp-btn {
    min-width: 130px;
  }
}

@keyframes riseIn {
  from {
    transform: translateY(14px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes driftA {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes driftB {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(14px);
  }
}
</style>
