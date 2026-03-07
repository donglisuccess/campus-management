export type FitnessRole = 'admin' | 'teacher' | 'headTeacher' | 'student'

export interface FitnessRoleProfile {
  id: FitnessRole
  name: string
  shortName: string
  badge: string
  audience: string
  responsibilities: string[]
  permissions: string[]
  accountLabel: string
  accountPlaceholder: string
  passwordLabel: string
  demoAccount: string
  demoPassword: string
}

export const FITNESS_ROLE_PROFILES: FitnessRoleProfile[] = [
  {
    id: 'admin',
    name: '平台管理员',
    shortName: 'Admin',
    badge: '全局治理',
    audience: '面向信息中心、体育教研室管理员，负责平台配置与跨角色权限管理。',
    responsibilities: ['组织架构配置', '账号权限治理', '设备鉴权与同步'],
    permissions: ['管理多级账号', '维护设备参数与访问密钥', '查看全校训练与视频留存情况'],
    accountLabel: '管理员账号',
    accountPlaceholder: '请输入管理员账号',
    passwordLabel: '登录密码',
    demoAccount: 'fitness_admin',
    demoPassword: 'Admin@2026'
  },
  {
    id: 'teacher',
    name: '体育教师',
    shortName: 'Teacher',
    badge: '训练执行',
    audience: '面向体育任课教师，负责训练计划、成绩记录、设备联动与教学反馈。',
    responsibilities: ['训练任务发布', '训练成绩复核', '人脸与设备联动'],
    permissions: ['接收训练站成绩', '批量导入训练成绩', '查看学生训练视频与过程数据'],
    accountLabel: '教师工号',
    accountPlaceholder: '请输入体育教师工号',
    passwordLabel: '登录密码',
    demoAccount: 'pe_teacher_01',
    demoPassword: 'Teacher@2026'
  },
  {
    id: 'headTeacher',
    name: '班主任',
    shortName: 'Head Teacher',
    badge: '班级跟踪',
    audience: '面向班主任，关注班级整体训练参与率、成绩分布与照片采集完成度。',
    responsibilities: ['班级训练进度跟踪', '学生照片状态核对', '异常数据催办'],
    permissions: ['按班级查看学生', '查询成绩与照片完成情况', '导出班级训练明细'],
    accountLabel: '班主任账号',
    accountPlaceholder: '请输入班主任账号',
    passwordLabel: '登录密码',
    demoAccount: 'class_master_03',
    demoPassword: 'Head@2026'
  },
  {
    id: 'student',
    name: '学生',
    shortName: 'Student',
    badge: '个人训练',
    audience: '面向学生本人，完成人脸采集、训练签到、成绩查询与视频回看。',
    responsibilities: ['个人成绩查询', '人脸照片采集', '训练视频回看'],
    permissions: ['查看个人成绩趋势', '提交 H5/小程序人脸照片', '接收训练提醒与反馈'],
    accountLabel: '学号',
    accountPlaceholder: '请输入学号',
    passwordLabel: '登录密码',
    demoAccount: '2026000188',
    demoPassword: 'Student@2026'
  }
]

export const FITNESS_PLATFORM_METRICS = [
  { label: '学生档案容量', value: '20,000+' },
  { label: '训练成绩容量', value: '10,000,000+' },
  { label: '视频留存能力', value: '15,000 min' }
]

export const FITNESS_PLATFORM_NOTES = [
  '学校管理者与监管机构更适合通过驾驶舱或监管看板访问核心指标，不建议直接复用业务登录入口。',
  '首期登录入口聚焦 4 类高频角色：管理员、体育教师、班主任、学生。',
  '采集侧支持 H5 与小程序，登录页保留统一身份认证入口，便于后续接入 SSO。'
]