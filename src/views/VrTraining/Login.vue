<template>
  <div class="vr-login-page">
    <div class="vr-glow vr-glow-a"></div>
    <div class="vr-glow vr-glow-b"></div>

    <div class="vr-login-shell">
      <section class="vr-login-side">
        <span class="vr-side-tag">5G Private Cloud</span>
        <h1>5G虚拟仿真实训系统</h1>
        <p>
          基于 5G 专网和纯 B/S 架构，覆盖站点勘察、容量规划、硬件配置、业务部署、网络测试、故障排查等全业务链实训。
        </p>

        <div class="vr-side-points">
          <article v-for="item in sidePoints" :key="item.title" class="vr-side-point">
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </article>
        </div>
      </section>

      <el-card class="vr-login-card" shadow="never">
        <div class="vr-login-head">
          <p class="vr-login-kicker">统一身份认证</p>
          <h2>登录或注册平台账号</h2>
          <p>教师可进入教学管理后台，学生可进入实训学习中心。所有数据使用本地 mock 演示。</p>
        </div>

        <el-tabs v-model="activeTab" class="vr-tabs">
          <el-tab-pane label="登录系统" name="login">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top" class="vr-form">
              <el-form-item label="身份角色" prop="role">
                <el-select v-model="loginForm.role" placeholder="请选择角色" class="vr-field" @change="resetLoginCredentials">
                  <el-option v-for="item in VR_ROLE_OPTIONS" :key="item.value" :label="item.label" :value="item.value">
                    <div class="vr-role-option">
                      <strong>{{ item.label }}</strong>
                      <span>{{ item.description }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="账号" prop="account">
                <el-input v-model="loginForm.account" placeholder="请输入账号" clearable class="vr-field" />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable
                  class="vr-field"
                  @keyup.enter="submitLogin"
                />
              </el-form-item>

              <div class="vr-demo-box">
                <p class="vr-demo-title">当前演示账号</p>
                <template v-if="activeDemoAccount">
                  <p>{{ activeDemoAccount.roleLabel }} / {{ activeDemoAccount.name }}</p>
                  <p>账号：{{ activeDemoAccount.account }}</p>
                  <p>密码：{{ activeDemoAccount.password }}</p>
                </template>
                <p v-else>先选择角色，再查看默认演示账号。</p>
              </div>

              <div class="vr-actions">
                <el-button type="primary" class="vr-submit" @click="submitLogin">登录系统</el-button>
                <el-button @click="resetLoginForm">重置</el-button>
                <el-button text @click="goHome">返回首页</el-button>
              </div>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="注册账号" name="register">
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top" class="vr-form">
              <el-form-item label="身份角色" prop="role">
                <el-radio-group v-model="registerForm.role">
                  <el-radio-button label="teacher">教师用户</el-radio-button>
                  <el-radio-button label="student">学生用户</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <div class="vr-register-grid">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="registerForm.name" placeholder="请输入真实姓名" clearable />
                </el-form-item>

                <el-form-item :label="registerForm.role === 'teacher' ? '工号' : '学号'" prop="account">
                  <el-input v-model="registerForm.account" :placeholder="registerForm.role === 'teacher' ? '请输入工号' : '请输入学号'" clearable />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input v-model="registerForm.password" type="password" show-password placeholder="不少于 6 位" clearable />
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="registerForm.confirmPassword" type="password" show-password placeholder="请再次输入密码" clearable />
                </el-form-item>

                <el-form-item :label="registerForm.role === 'teacher' ? '所属院系/部门' : '所属学院'" prop="unitName">
                  <el-input v-model="registerForm.unitName" placeholder="请输入所属单位" clearable />
                </el-form-item>

                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="registerForm.phone" placeholder="请输入手机号" clearable />
                </el-form-item>

                <el-form-item v-if="registerForm.role === 'student'" label="班级" prop="className">
                  <el-input v-model="registerForm.className" placeholder="例如：5G通信231班" clearable />
                </el-form-item>

                <el-form-item v-if="registerForm.role === 'student'" label="专业" prop="major">
                  <el-input v-model="registerForm.major" placeholder="例如：现代移动通信技术" clearable />
                </el-form-item>
              </div>

              <div class="vr-register-tip">
                注册成功后会自动写入 mock 账号库。学生账号会同步进入学生管理列表，教师账号会继承教学管理权限。
              </div>

              <div class="vr-actions">
                <el-button type="primary" class="vr-submit" @click="submitRegister">注册账号</el-button>
                <el-button @click="resetRegisterForm">重置</el-button>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  VR_LOGIN_ACCOUNTS,
  VR_ROLE_OPTIONS,
  findVrAccount,
  getVrPermissionsByRole,
  registerVrAccount,
  type VrTrainingRole
} from '@/mock/vrTraining'

const router = useRouter()
const activeTab = ref('login')
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

const sidePoints = [
  {
    title: '教学全流程在线实训',
    description: '覆盖 5G 网络建设、行业应用部署、测试验证与故障排查。'
  },
  {
    title: '教师双重教学管理能力',
    description: '支持试题、任务、成绩、阅卷、学生与班组的集中管理。'
  },
  {
    title: '学生训练竞赛一体化',
    description: '可参与实训、模拟考试、小组竞赛，并查看答案与成绩分析。'
  }
]

const loginForm = reactive({
  role: '' as VrTrainingRole | '',
  account: '',
  password: ''
})

const registerForm = reactive({
  role: 'student' as VrTrainingRole,
  name: '',
  account: '',
  password: '',
  confirmPassword: '',
  unitName: '',
  className: '',
  major: '',
  phone: ''
})

const loginRules: FormRules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerRules: FormRules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  unitName: [{ required: true, message: '请输入所属单位', trigger: 'blur' }],
  className: [
    {
      validator: (_rule, value, callback) => {
        if (registerForm.role === 'student' && !value) {
          callback(new Error('请输入班级'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  major: [
    {
      validator: (_rule, value, callback) => {
        if (registerForm.role === 'student' && !value) {
          callback(new Error('请输入专业'))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入 11 位手机号', trigger: 'blur' }
  ]
}

const activeDemoAccount = computed(() => {
  if (!loginForm.role) {
    return null
  }

  return VR_LOGIN_ACCOUNTS.find((item) => item.role === loginForm.role) ?? null
})

const writeSession = (payload: {
  role: VrTrainingRole
  roleLabel: string
  name: string
  account: string
  unitName: string
  className?: string
  major?: string
  permissions: string[]
}) => {
  sessionStorage.setItem('vr_auth', '1')
  sessionStorage.setItem('vr_role', payload.role)
  sessionStorage.setItem('vr_role_label', payload.roleLabel)
  sessionStorage.setItem('vr_name', payload.name)
  sessionStorage.setItem('vr_account', payload.account)
  sessionStorage.setItem('vr_unit_name', payload.unitName)
  sessionStorage.setItem('vr_class_name', payload.className ?? '')
  sessionStorage.setItem('vr_major', payload.major ?? '')
  sessionStorage.setItem('vr_permissions', payload.permissions.join(','))
}

const resetLoginCredentials = () => {
  loginForm.account = ''
  loginForm.password = ''
}

const resetLoginForm = () => {
  loginFormRef.value?.resetFields()
}

const resetRegisterForm = () => {
  registerFormRef.value?.resetFields()
  registerForm.role = 'student'
}

const goHome = () => {
  void router.push('/')
}

const submitLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (!valid || !loginForm.role) {
      return
    }

    const matchedAccount = findVrAccount(loginForm.role, loginForm.account, loginForm.password)

    if (!matchedAccount) {
      ElMessage.error('账号、密码或角色不匹配')
      return
    }

    writeSession(matchedAccount)
    ElMessage.success(`${matchedAccount.roleLabel}登录成功，正在进入平台`)
    void router.push('/vr-training')
  })
}

const submitRegister = () => {
  registerFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }

    const result = registerVrAccount({
      role: registerForm.role,
      name: registerForm.name,
      account: registerForm.account,
      password: registerForm.password,
      unitName: registerForm.unitName,
      className: registerForm.role === 'student' ? registerForm.className : undefined,
      major: registerForm.role === 'student' ? registerForm.major : undefined,
      phone: registerForm.phone
    })

    if (!result.ok || !result.account) {
      ElMessage.error(result.message)
      return
    }

    loginForm.role = result.account.role
    loginForm.account = result.account.account
    loginForm.password = result.account.password
    activeTab.value = 'login'
    ElMessage.success(result.message)
  })
}
</script>

<style scoped>
.vr-login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 28px;
  background:
    radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.18), transparent 34%),
    radial-gradient(circle at 82% 82%, rgba(34, 197, 94, 0.16), transparent 32%),
    linear-gradient(145deg, #eff6ff 0%, #f8fafc 44%, #ecfeff 100%);
}

.vr-glow {
  position: absolute;
  border-radius: 999px;
}

.vr-glow-a {
  top: -90px;
  left: -90px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.22), rgba(14, 165, 233, 0));
}

.vr-glow-b {
  right: -80px;
  bottom: -90px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0));
}

.vr-login-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(340px, 1fr) minmax(380px, 1fr);
  width: min(1160px, 100%);
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(14px);
}

.vr-login-side {
  padding: 42px 34px;
  color: #e0f2fe;
  background:
    radial-gradient(circle at 18% 22%, rgba(125, 211, 252, 0.18), rgba(125, 211, 252, 0)),
    linear-gradient(160deg, #0f172a 0%, #0f766e 55%, #0369a1 100%);
}

.vr-side-tag {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid rgba(224, 242, 254, 0.22);
  background: rgba(224, 242, 254, 0.1);
}

.vr-login-side h1 {
  margin-top: 22px;
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(30px, 2.6vw, 40px);
  line-height: 1.2;
}

.vr-login-side > p {
  margin-top: 14px;
  line-height: 1.8;
  color: rgba(224, 242, 254, 0.88);
}

.vr-side-points {
  margin-top: 30px;
  display: grid;
  gap: 14px;
}

.vr-side-point {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(224, 242, 254, 0.08);
  border: 1px solid rgba(224, 242, 254, 0.14);
}

.vr-side-point span {
  line-height: 1.7;
  color: rgba(224, 242, 254, 0.8);
}

.vr-login-card {
  border: none;
  border-radius: 0;
  background: transparent;
}

.vr-login-card :deep(.el-card__body) {
  padding: 34px 34px 30px;
}

.vr-login-kicker {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0369a1;
  background: rgba(14, 165, 233, 0.12);
}

.vr-login-head h2 {
  margin-top: 10px;
  font-size: 30px;
  color: #0f172a;
}

.vr-login-head p {
  margin-top: 8px;
  line-height: 1.75;
  color: #475569;
}

.vr-tabs {
  margin-top: 24px;
}

.vr-form {
  padding-top: 8px;
}

.vr-field {
  width: 100%;
}

.vr-role-option {
  display: grid;
  gap: 2px;
}

.vr-role-option span {
  font-size: 12px;
  color: #64748b;
}

.vr-demo-box,
.vr-register-tip {
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(226, 232, 240, 0.45), rgba(240, 249, 255, 0.9));
  color: #334155;
}

.vr-demo-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: #0f172a;
}

.vr-register-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 14px;
}

.vr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.vr-submit {
  min-width: 140px;
}

@media (max-width: 960px) {
  .vr-login-shell {
    grid-template-columns: 1fr;
  }

  .vr-register-grid {
    grid-template-columns: 1fr;
  }
}
</style>