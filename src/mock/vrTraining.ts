import { reactive } from 'vue'

export type VrTrainingRole = 'teacher' | 'student'

export interface VrRoleOption {
  value: VrTrainingRole
  label: string
  description: string
}

export interface VrAccount {
  id: string
  role: VrTrainingRole
  roleLabel: string
  name: string
  account: string
  password: string
  unitName: string
  className?: string
  major?: string
  phone: string
  permissions: string[]
}

export interface VrMenuItem {
  key: string
  label: string
  group: string
  description: string
  permissions: string[]
}

export interface VrNotice {
  id: string
  title: string
  level: '高' | '中' | '低'
  publisher: string
  publishTime: string
  content: string
}

export interface VrStudentRow {
  id: string
  name: string
  gender: '男' | '女'
  className: string
  major: string
  phone: string
  teamName: string
  trainingHours: number
  examStatus: '未开始' | '训练中' | '已考核'
  faceStatus: '已录入' | '待补录'
  averageScore: number
  lastLogin: string
}

export interface VrGroupRow {
  id: string
  teamName: string
  captain: string
  memberCount: number
  instructor: string
  project: string
  currentStage: string
  bestScore: number
}

export interface VrQuestionRow {
  id: string
  title: string
  scene: string
  type: '单选题' | '多选题' | '判断题' | '实操题'
  difficulty: '基础' | '进阶' | '综合'
  score: number
  status: '启用' | '草稿'
  updatedAt: string
  creator: string
}

export interface VrTaskRow {
  id: string
  taskName: string
  module: string
  targetClass: string
  mode: '课后训练' | '模拟考试' | '竞赛集训'
  openTime: string
  deadline: string
  passLine: number
  status: '进行中' | '待开始' | '已截止'
}

export interface VrGradingRow {
  id: string
  examName: string
  className: string
  participants: number
  pendingReview: number
  autoScore: number
  status: '待阅卷' | '阅卷中' | '已完成'
  latestSubmitTime: string
}

export interface VrScoreRow {
  id: string
  studentName: string
  studentId: string
  className: string
  trainingName: string
  practiceScore: number
  examScore: number
  finalScore: number
  skillLevel: '优秀' | '良好' | '合格' | '待提升'
  teacherComment: string
  updatedAt: string
}

export interface VrTrainingRow {
  id: string
  module: string
  stage: string
  progress: number
  duration: string
  score: number
  status: '未开始' | '进行中' | '已完成'
  deadline: string
}

export interface VrCompetitionRow {
  id: string
  teamName: string
  eventName: string
  stage: string
  schedule: string
  rank: number
  score: number
  status: '报名成功' | '进行中' | '已结束'
}

export interface VrExamRow {
  id: string
  examName: string
  type: '阶段考核' | '期末考核' | '竞赛选拔'
  publishTime: string
  deadline: string
  duration: string
  result: string
  status: '未开始' | '待作答' | '已完成'
}

export interface VrAnswerRow {
  id: string
  examName: string
  submittedAt: string
  objectiveScore: number
  reviewScore: number
  finalScore: number
  answerStatus: '待批阅' | '已批阅'
  note: string
}

export const VR_ROLE_OPTIONS: VrRoleOption[] = [
  {
    value: 'teacher',
    label: '教师用户',
    description: '负责学生管理、班组管理、试题维护、任务配置、成绩管理和集中阅卷。'
  },
  {
    value: 'student',
    label: '学生用户',
    description: '参加 5G 仿真实训、小组竞赛、技能考核，并查看参考答案与成绩分析。'
  }
]

export const VR_PERMISSION_LABELS: Record<string, string> = {
  dashboard: '工作台总览',
  student_manage: '学生管理',
  team_manage: '班组管理',
  question_manage: '试题管理',
  task_manage: '任务配置',
  grading_manage: '集中阅卷',
  score_manage: '成绩管理',
  training_access: '仿真实训',
  competition_access: '小组竞赛',
  assessment_access: '技能考核',
  answer_access: '参考答案',
  analysis_access: '成绩分析',
  profile_access: '个人中心'
}

const teacherPermissions = [
  'dashboard',
  'student_manage',
  'team_manage',
  'question_manage',
  'task_manage',
  'grading_manage',
  'score_manage'
]

const studentPermissions = [
  'dashboard',
  'training_access',
  'competition_access',
  'assessment_access',
  'answer_access',
  'analysis_access',
  'profile_access'
]

export const VR_LOGIN_ACCOUNTS = reactive<VrAccount[]>([
  {
    id: 'vr-teacher-001',
    role: 'teacher',
    roleLabel: '教师用户',
    name: '张海峰',
    account: '5g_teacher01',
    password: '5g_teacher01',
    unitName: '信息工程学院',
    phone: '13821004561',
    permissions: [...teacherPermissions]
  },
  {
    id: 'vr-teacher-002',
    role: 'teacher',
    roleLabel: '教师用户',
    name: '李佳宁',
    account: '5g_teacher02',
    password: '5g_teacher02',
    unitName: '现代通信产业学院',
    phone: '13941002768',
    permissions: [...teacherPermissions]
  },
  {
    id: 'vr-student-001',
    role: 'student',
    roleLabel: '学生用户',
    name: '王泽宇',
    account: '202320501021',
    password: '202320501021',
    unitName: '信息工程学院',
    className: '5G通信231班',
    major: '现代移动通信技术',
    phone: '13766540128',
    permissions: [...studentPermissions]
  },
  {
    id: 'vr-student-002',
    role: 'student',
    roleLabel: '学生用户',
    name: '陈语彤',
    account: '202320501036',
    password: '202320501036',
    unitName: '信息工程学院',
    className: '5G通信231班',
    major: '现代移动通信技术',
    phone: '13690982214',
    permissions: [...studentPermissions]
  },
  {
    id: 'vr-student-003',
    role: 'student',
    roleLabel: '学生用户',
    name: '黄俊凯',
    account: '202320502014',
    password: '202320502014',
    unitName: '现代通信产业学院',
    className: '5G通信232班',
    major: '通信工程技术',
    phone: '13588234110',
    permissions: [...studentPermissions]
  }
])

export const VR_TEACHER_MENUS: VrMenuItem[] = [
  {
    key: 'overview',
    label: '工作台总览',
    group: '综合看板',
    description: '查看课程覆盖、实训完成率、考试达成率和待办事项。',
    permissions: ['dashboard']
  },
  {
    key: 'students',
    label: '学生管理',
    group: '教学组织',
    description: '维护学生账号、实训状态、人脸录入和最近登录情况。',
    permissions: ['student_manage']
  },
  {
    key: 'groups',
    label: '班组管理',
    group: '教学组织',
    description: '查看竞赛班组、组长、项目方向和阶段达成情况。',
    permissions: ['team_manage']
  },
  {
    key: 'questions',
    label: '试题管理',
    group: '教学资源',
    description: '管理工程勘察、容量规划、业务配置和故障排查题库。',
    permissions: ['question_manage']
  },
  {
    key: 'tasks',
    label: '任务配置',
    group: '教学资源',
    description: '配置训练任务、开放时间、达标线和适用班级。',
    permissions: ['task_manage']
  },
  {
    key: 'grading',
    label: '集中阅卷',
    group: '教学考核',
    description: '查看待阅卷考试、自动判分结果和阅卷完成进度。',
    permissions: ['grading_manage']
  },
  {
    key: 'scores',
    label: '成绩管理',
    group: '教学考核',
    description: '汇总训练成绩、考核成绩、等级评价和教师评语。',
    permissions: ['score_manage']
  }
]

export const VR_STUDENT_MENUS: VrMenuItem[] = [
  {
    key: 'overview',
    label: '学习总览',
    group: '学习中心',
    description: '查看个人实训进度、考试提醒、竞赛安排和成绩概览。',
    permissions: ['dashboard']
  },
  {
    key: 'trainings',
    label: '仿真实训',
    group: '学习中心',
    description: '完成 5G 站点建设与行业应用部署的分阶段训练任务。',
    permissions: ['training_access']
  },
  {
    key: 'competition',
    label: '小组竞赛',
    group: '竞赛考核',
    description: '查看竞赛编组、赛程安排、阶段排名与团队成绩。',
    permissions: ['competition_access']
  },
  {
    key: 'assessment',
    label: '技能考核',
    group: '竞赛考核',
    description: '参加阶段考核、期末考核和竞赛选拔测试。',
    permissions: ['assessment_access']
  },
  {
    key: 'answers',
    label: '参考答案',
    group: '学习支持',
    description: '查看已批阅试卷与实操考核的解析说明。',
    permissions: ['answer_access']
  },
  {
    key: 'analysis',
    label: '成绩分析',
    group: '学习支持',
    description: '按训练项目和考试类型查看个人成绩趋势与薄弱点。',
    permissions: ['analysis_access']
  },
  {
    key: 'profile',
    label: '个人中心',
    group: '学习支持',
    description: '查看个人账号、班级、联系方式和可访问权限。',
    permissions: ['profile_access']
  }
]

export const VR_NOTICES: VrNotice[] = [
  {
    id: 'notice-01',
    title: '5G 核心网初始化综合实训将于本周五开放',
    level: '高',
    publisher: '张海峰',
    publishTime: '2026-03-10 09:20',
    content: '面向 5G通信231班、232班开放，要求在 120 分钟内完成网络初始化、数据承载配置和业务连通测试。'
  },
  {
    id: 'notice-02',
    title: '智能交通业务配置竞赛分组已更新',
    level: '中',
    publisher: '李佳宁',
    publishTime: '2026-03-09 16:40',
    content: '根据前两次阶段成绩重新编组，新增“智联先锋队”和“路测协同队”两支队伍。'
  },
  {
    id: 'notice-03',
    title: '故障排查题库新增 18 道综合实操题',
    level: '低',
    publisher: '教务组',
    publishTime: '2026-03-08 14:15',
    content: '新增告警定位、射频链路异常、数据面吞吐抖动等场景题目，已加入周测范围。'
  }
]

export const VR_STUDENT_ROWS = reactive<VrStudentRow[]>([
  { id: '202320501001', name: '周子涵', gender: '男', className: '5G通信231班', major: '现代移动通信技术', phone: '13820011001', teamName: '无线规划一组', trainingHours: 42, examStatus: '已考核', faceStatus: '已录入', averageScore: 91, lastLogin: '2026-03-10 20:16' },
  { id: '202320501003', name: '刘晨曦', gender: '女', className: '5G通信231班', major: '现代移动通信技术', phone: '13820011003', teamName: '无线规划一组', trainingHours: 39, examStatus: '训练中', faceStatus: '已录入', averageScore: 88, lastLogin: '2026-03-10 21:08' },
  { id: '202320501006', name: '孙浩宇', gender: '男', className: '5G通信231班', major: '现代移动通信技术', phone: '13820011006', teamName: '核心网开局组', trainingHours: 35, examStatus: '训练中', faceStatus: '待补录', averageScore: 84, lastLogin: '2026-03-09 19:42' },
  { id: '202320501011', name: '林欣悦', gender: '女', className: '5G通信231班', major: '现代移动通信技术', phone: '13820011011', teamName: '核心网开局组', trainingHours: 44, examStatus: '已考核', faceStatus: '已录入', averageScore: 93, lastLogin: '2026-03-10 18:55' },
  { id: '202320501021', name: '王泽宇', gender: '男', className: '5G通信231班', major: '现代移动通信技术', phone: '13766540128', teamName: '智能交通专项组', trainingHours: 37, examStatus: '训练中', faceStatus: '已录入', averageScore: 86, lastLogin: '2026-03-10 22:01' },
  { id: '202320501036', name: '陈语彤', gender: '女', className: '5G通信231班', major: '现代移动通信技术', phone: '13690982214', teamName: '智能交通专项组', trainingHours: 41, examStatus: '已考核', faceStatus: '已录入', averageScore: 90, lastLogin: '2026-03-10 21:44' },
  { id: '202320502002', name: '吴昊然', gender: '男', className: '5G通信232班', major: '通信工程技术', phone: '13820012002', teamName: '智慧电力专项组', trainingHours: 32, examStatus: '未开始', faceStatus: '待补录', averageScore: 79, lastLogin: '2026-03-08 17:20' },
  { id: '202320502005', name: '郑诗涵', gender: '女', className: '5G通信232班', major: '通信工程技术', phone: '13820012005', teamName: '智慧电力专项组', trainingHours: 38, examStatus: '训练中', faceStatus: '已录入', averageScore: 85, lastLogin: '2026-03-10 19:18' },
  { id: '202320502009', name: '何嘉豪', gender: '男', className: '5G通信232班', major: '通信工程技术', phone: '13820012009', teamName: '故障排障快反队', trainingHours: 43, examStatus: '已考核', faceStatus: '已录入', averageScore: 92, lastLogin: '2026-03-10 20:30' },
  { id: '202320502014', name: '黄俊凯', gender: '男', className: '5G通信232班', major: '通信工程技术', phone: '13588234110', teamName: '故障排障快反队', trainingHours: 36, examStatus: '训练中', faceStatus: '已录入', averageScore: 87, lastLogin: '2026-03-10 22:16' },
  { id: '202320502019', name: '宋雨辰', gender: '女', className: '5G通信232班', major: '通信工程技术', phone: '13820012019', teamName: '高速下载业务组', trainingHours: 31, examStatus: '未开始', faceStatus: '待补录', averageScore: 78, lastLogin: '2026-03-07 15:08' },
  { id: '202320502022', name: '谢天宇', gender: '男', className: '5G通信232班', major: '通信工程技术', phone: '13820012022', teamName: '高速下载业务组', trainingHours: 40, examStatus: '已考核', faceStatus: '已录入', averageScore: 89, lastLogin: '2026-03-10 20:58' }
])

export const VR_GROUP_ROWS = reactive<VrGroupRow[]>([
  { id: 'team-01', teamName: '无线规划一组', captain: '周子涵', memberCount: 6, instructor: '张海峰', project: '站点工程勘察与容量规划', currentStage: '射频参数复核', bestScore: 94 },
  { id: 'team-02', teamName: '核心网开局组', captain: '林欣悦', memberCount: 6, instructor: '张海峰', project: '网络初始化与承载配置', currentStage: 'UPF 与 AMF 联调', bestScore: 92 },
  { id: 'team-03', teamName: '智能交通专项组', captain: '王泽宇', memberCount: 5, instructor: '李佳宁', project: '智能交通业务配置', currentStage: '路侧单元接入验证', bestScore: 90 },
  { id: 'team-04', teamName: '智慧电力专项组', captain: '郑诗涵', memberCount: 5, instructor: '李佳宁', project: '智慧电力专网业务配置', currentStage: '切片策略调优', bestScore: 88 },
  { id: 'team-05', teamName: '故障排障快反队', captain: '何嘉豪', memberCount: 6, instructor: '张海峰', project: '故障排查与恢复', currentStage: '链路异常定位', bestScore: 93 },
  { id: 'team-06', teamName: '高速下载业务组', captain: '谢天宇', memberCount: 5, instructor: '李佳宁', project: '高速下载业务配置', currentStage: 'QoS 策略优化', bestScore: 87 }
])

export const VR_QUESTION_ROWS = reactive<VrQuestionRow[]>([
  { id: 'q-001', title: '5G 基站站点勘察流程排序', scene: '站点工程勘察', type: '单选题', difficulty: '基础', score: 5, status: '启用', updatedAt: '2026-03-09 15:10', creator: '张海峰' },
  { id: 'q-002', title: 'NR 小区容量规划关键参数判断', scene: '容量规划', type: '多选题', difficulty: '进阶', score: 8, status: '启用', updatedAt: '2026-03-10 10:35', creator: '张海峰' },
  { id: 'q-003', title: 'AAU 与 BBU 硬件连接检查', scene: '硬件配置', type: '判断题', difficulty: '基础', score: 4, status: '启用', updatedAt: '2026-03-08 11:20', creator: '李佳宁' },
  { id: 'q-004', title: '前传光纤与电源线缆连接实操', scene: '线缆连接', type: '实操题', difficulty: '综合', score: 15, status: '启用', updatedAt: '2026-03-10 13:42', creator: '李佳宁' },
  { id: 'q-005', title: '核心网初始化参数填报', scene: '网络初始化', type: '实操题', difficulty: '综合', score: 20, status: '启用', updatedAt: '2026-03-09 17:06', creator: '张海峰' },
  { id: 'q-006', title: '高速下载业务承载策略配置', scene: '高速下载业务', type: '实操题', difficulty: '进阶', score: 12, status: '启用', updatedAt: '2026-03-10 09:58', creator: '李佳宁' },
  { id: 'q-007', title: '智能交通业务终端接入流程', scene: '智能交通业务', type: '多选题', difficulty: '进阶', score: 8, status: '启用', updatedAt: '2026-03-09 21:14', creator: '李佳宁' },
  { id: 'q-008', title: '智慧电力切片业务可靠性验证', scene: '智慧电力业务', type: '实操题', difficulty: '综合', score: 18, status: '启用', updatedAt: '2026-03-10 14:26', creator: '张海峰' },
  { id: 'q-009', title: '应用功能测试日志判断', scene: '应用功能测试', type: '判断题', difficulty: '基础', score: 4, status: '草稿', updatedAt: '2026-03-07 19:40', creator: '张海峰' },
  { id: 'q-010', title: '网络性能测试吞吐指标分析', scene: '网络性能测试', type: '单选题', difficulty: '进阶', score: 6, status: '启用', updatedAt: '2026-03-10 16:12', creator: '李佳宁' },
  { id: 'q-011', title: '切换失败故障定位', scene: '故障排查', type: '实操题', difficulty: '综合', score: 16, status: '启用', updatedAt: '2026-03-10 18:00', creator: '张海峰' },
  { id: 'q-012', title: '告警压制策略适用场景', scene: '故障排查', type: '多选题', difficulty: '进阶', score: 8, status: '草稿', updatedAt: '2026-03-08 09:16', creator: '李佳宁' }
])

export const VR_TASK_ROWS = reactive<VrTaskRow[]>([
  { id: 'task-01', taskName: '5G 站点勘察标准流程训练', module: '站点工程勘察', targetClass: '5G通信231班', mode: '课后训练', openTime: '2026-03-04 08:00', deadline: '2026-03-14 23:59', passLine: 80, status: '进行中' },
  { id: 'task-02', taskName: '容量规划参数计算周测', module: '容量规划', targetClass: '5G通信231班', mode: '模拟考试', openTime: '2026-03-11 14:00', deadline: '2026-03-11 16:00', passLine: 75, status: '待开始' },
  { id: 'task-03', taskName: '硬件配置与上电检查训练', module: '硬件配置', targetClass: '5G通信232班', mode: '课后训练', openTime: '2026-03-03 08:00', deadline: '2026-03-13 23:59', passLine: 78, status: '进行中' },
  { id: 'task-04', taskName: '线缆连接工艺仿真实训', module: '线缆连接', targetClass: '5G通信232班', mode: '课后训练', openTime: '2026-03-01 09:00', deadline: '2026-03-09 23:59', passLine: 80, status: '已截止' },
  { id: 'task-05', taskName: '核心网初始化综合实训', module: '网络初始化', targetClass: '5G通信231班, 232班', mode: '模拟考试', openTime: '2026-03-15 09:00', deadline: '2026-03-15 11:00', passLine: 82, status: '待开始' },
  { id: 'task-06', taskName: '高速下载业务配置冲刺训练', module: '高速下载业务', targetClass: '5G通信232班', mode: '竞赛集训', openTime: '2026-03-06 19:00', deadline: '2026-03-18 23:59', passLine: 85, status: '进行中' },
  { id: 'task-07', taskName: '智能交通边缘业务部署训练', module: '智能交通业务', targetClass: '5G通信231班', mode: '竞赛集训', openTime: '2026-03-05 19:00', deadline: '2026-03-16 23:59', passLine: 85, status: '进行中' },
  { id: 'task-08', taskName: '智慧电力切片保障专项训练', module: '智慧电力业务', targetClass: '5G通信232班', mode: '竞赛集训', openTime: '2026-03-07 19:30', deadline: '2026-03-17 23:59', passLine: 85, status: '进行中' }
])

export const VR_GRADING_ROWS = reactive<VrGradingRow[]>([
  { id: 'grade-01', examName: '容量规划阶段考核', className: '5G通信231班', participants: 38, pendingReview: 6, autoScore: 78, status: '阅卷中', latestSubmitTime: '2026-03-10 18:22' },
  { id: 'grade-02', examName: '线缆连接工艺测验', className: '5G通信232班', participants: 36, pendingReview: 0, autoScore: 81, status: '已完成', latestSubmitTime: '2026-03-09 16:50' },
  { id: 'grade-03', examName: '智能交通业务配置周测', className: '5G通信231班', participants: 38, pendingReview: 12, autoScore: 74, status: '待阅卷', latestSubmitTime: '2026-03-10 20:06' },
  { id: 'grade-04', examName: '故障排查综合测验', className: '5G通信232班', participants: 36, pendingReview: 4, autoScore: 80, status: '阅卷中', latestSubmitTime: '2026-03-10 21:12' }
])

export const VR_SCORE_ROWS = reactive<VrScoreRow[]>([
  { id: 'score-01', studentName: '周子涵', studentId: '202320501001', className: '5G通信231班', trainingName: '站点工程勘察', practiceScore: 93, examScore: 90, finalScore: 91, skillLevel: '优秀', teacherComment: '勘察流程完整，参数核验准确。', updatedAt: '2026-03-10 18:28' },
  { id: 'score-02', studentName: '刘晨曦', studentId: '202320501003', className: '5G通信231班', trainingName: '容量规划', practiceScore: 89, examScore: 86, finalScore: 87, skillLevel: '良好', teacherComment: '容量测算正确率较高，仍需关注边界场景。', updatedAt: '2026-03-10 18:40' },
  { id: 'score-03', studentName: '林欣悦', studentId: '202320501011', className: '5G通信231班', trainingName: '网络初始化', practiceScore: 95, examScore: 92, finalScore: 93, skillLevel: '优秀', teacherComment: '核心网开局流程熟练，日志分析能力强。', updatedAt: '2026-03-10 19:05' },
  { id: 'score-04', studentName: '王泽宇', studentId: '202320501021', className: '5G通信231班', trainingName: '智能交通业务', practiceScore: 87, examScore: 85, finalScore: 86, skillLevel: '良好', teacherComment: '业务链路连通正常，可继续优化调测效率。', updatedAt: '2026-03-10 19:28' },
  { id: 'score-05', studentName: '陈语彤', studentId: '202320501036', className: '5G通信231班', trainingName: '智能交通业务', practiceScore: 91, examScore: 89, finalScore: 90, skillLevel: '优秀', teacherComment: '边缘应用配置规范，输出文档完整。', updatedAt: '2026-03-10 19:36' },
  { id: 'score-06', studentName: '郑诗涵', studentId: '202320502005', className: '5G通信232班', trainingName: '智慧电力业务', practiceScore: 86, examScore: 84, finalScore: 85, skillLevel: '良好', teacherComment: '切片策略理解到位，故障回退流程仍可加强。', updatedAt: '2026-03-10 20:01' },
  { id: 'score-07', studentName: '何嘉豪', studentId: '202320502009', className: '5G通信232班', trainingName: '故障排查', practiceScore: 94, examScore: 91, finalScore: 92, skillLevel: '优秀', teacherComment: '定位思路清晰，恢复验证闭环完整。', updatedAt: '2026-03-10 20:15' },
  { id: 'score-08', studentName: '黄俊凯', studentId: '202320502014', className: '5G通信232班', trainingName: '故障排查', practiceScore: 88, examScore: 86, finalScore: 87, skillLevel: '良好', teacherComment: '基础扎实，需提升跨模块联动分析能力。', updatedAt: '2026-03-10 20:26' },
  { id: 'score-09', studentName: '谢天宇', studentId: '202320502022', className: '5G通信232班', trainingName: '高速下载业务', practiceScore: 90, examScore: 88, finalScore: 89, skillLevel: '良好', teacherComment: 'QoS 参数配置准确，测试记录较完整。', updatedAt: '2026-03-10 20:40' }
])

export const VR_STUDENT_TRAININGS = reactive<Record<string, VrTrainingRow[]>>({
  '202320501021': [
    { id: 'stu-train-01', module: '站点工程勘察', stage: '站点基础信息采集', progress: 100, duration: '2.5 学时', score: 88, status: '已完成', deadline: '2026-03-05 23:59' },
    { id: 'stu-train-02', module: '容量规划', stage: '小区容量参数测算', progress: 92, duration: '3.0 学时', score: 86, status: '进行中', deadline: '2026-03-12 23:59' },
    { id: 'stu-train-03', module: '网络初始化', stage: '核心网网元开局', progress: 74, duration: '3.5 学时', score: 84, status: '进行中', deadline: '2026-03-15 11:00' },
    { id: 'stu-train-04', module: '智能交通业务', stage: 'RSU 接入与业务验证', progress: 100, duration: '4.0 学时', score: 90, status: '已完成', deadline: '2026-03-09 23:59' },
    { id: 'stu-train-05', module: '故障排查', stage: '切换失败告警定位', progress: 35, duration: '1.5 学时', score: 79, status: '进行中', deadline: '2026-03-18 23:59' }
  ],
  '202320501036': [
    { id: 'stu-train-06', module: '站点工程勘察', stage: '机房与天面联合勘察', progress: 100, duration: '2.5 学时', score: 91, status: '已完成', deadline: '2026-03-05 23:59' },
    { id: 'stu-train-07', module: '容量规划', stage: '业务模型参数配置', progress: 100, duration: '3.0 学时', score: 89, status: '已完成', deadline: '2026-03-12 23:59' },
    { id: 'stu-train-08', module: '智能交通业务', stage: '边缘计算业务部署', progress: 100, duration: '4.0 学时', score: 92, status: '已完成', deadline: '2026-03-09 23:59' }
  ],
  '202320502014': [
    { id: 'stu-train-09', module: '硬件配置', stage: 'AAU/BBU 硬件核验', progress: 100, duration: '2.0 学时', score: 87, status: '已完成', deadline: '2026-03-03 23:59' },
    { id: 'stu-train-10', module: '高速下载业务', stage: '承载策略与 QoS 优化', progress: 78, duration: '3.5 学时', score: 85, status: '进行中', deadline: '2026-03-18 23:59' },
    { id: 'stu-train-11', module: '故障排查', stage: '传输链路异常恢复', progress: 82, duration: '2.5 学时', score: 88, status: '进行中', deadline: '2026-03-16 23:59' }
  ]
})

export const VR_STUDENT_COMPETITIONS = reactive<Record<string, VrCompetitionRow[]>>({
  '202320501021': [
    { id: 'stu-comp-01', teamName: '智能交通专项组', eventName: '5G 行业应用部署赛', stage: '校内选拔', schedule: '2026-03-18 14:00', rank: 2, score: 89, status: '进行中' },
    { id: 'stu-comp-02', teamName: '智能交通专项组', eventName: '5G 网络优化团体赛', stage: '集训阶段', schedule: '2026-03-25 09:00', rank: 0, score: 0, status: '报名成功' }
  ],
  '202320501036': [
    { id: 'stu-comp-03', teamName: '智能交通专项组', eventName: '5G 行业应用部署赛', stage: '校内选拔', schedule: '2026-03-18 14:00', rank: 2, score: 89, status: '进行中' }
  ],
  '202320502014': [
    { id: 'stu-comp-04', teamName: '故障排障快反队', eventName: '5G 网络故障快排赛', stage: '校内选拔', schedule: '2026-03-19 15:00', rank: 1, score: 92, status: '进行中' }
  ]
})

export const VR_STUDENT_EXAMS = reactive<Record<string, VrExamRow[]>>({
  '202320501021': [
    { id: 'stu-exam-01', examName: '容量规划阶段考核', type: '阶段考核', publishTime: '2026-03-10 09:00', deadline: '2026-03-11 16:00', duration: '90 分钟', result: '待公布', status: '待作答' },
    { id: 'stu-exam-02', examName: '智能交通业务配置周测', type: '阶段考核', publishTime: '2026-03-08 09:00', deadline: '2026-03-08 20:00', duration: '60 分钟', result: '85 分', status: '已完成' },
    { id: 'stu-exam-03', examName: '核心网初始化综合考核', type: '期末考核', publishTime: '2026-03-15 09:00', deadline: '2026-03-15 11:00', duration: '120 分钟', result: '未开始', status: '未开始' }
  ],
  '202320501036': [
    { id: 'stu-exam-04', examName: '智能交通业务配置周测', type: '阶段考核', publishTime: '2026-03-08 09:00', deadline: '2026-03-08 20:00', duration: '60 分钟', result: '89 分', status: '已完成' }
  ],
  '202320502014': [
    { id: 'stu-exam-05', examName: '故障排查综合测验', type: '阶段考核', publishTime: '2026-03-10 10:00', deadline: '2026-03-10 21:30', duration: '80 分钟', result: '86 分', status: '已完成' },
    { id: 'stu-exam-06', examName: '高速下载业务专项选拔', type: '竞赛选拔', publishTime: '2026-03-17 09:00', deadline: '2026-03-17 10:30', duration: '90 分钟', result: '未开始', status: '未开始' }
  ]
})

export const VR_STUDENT_ANSWERS = reactive<Record<string, VrAnswerRow[]>>({
  '202320501021': [
    { id: 'stu-answer-01', examName: '智能交通业务配置周测', submittedAt: '2026-03-08 18:22', objectiveScore: 48, reviewScore: 37, finalScore: 85, answerStatus: '已批阅', note: '业务编排正确，实操步骤可进一步精简。' },
    { id: 'stu-answer-02', examName: '容量规划阶段考核', submittedAt: '2026-03-11 15:46', objectiveScore: 52, reviewScore: 0, finalScore: 52, answerStatus: '待批阅', note: '实操题待教师完成评分。' }
  ],
  '202320501036': [
    { id: 'stu-answer-03', examName: '智能交通业务配置周测', submittedAt: '2026-03-08 17:58', objectiveScore: 51, reviewScore: 38, finalScore: 89, answerStatus: '已批阅', note: '边缘节点配置规范，日志截图完整。' }
  ],
  '202320502014': [
    { id: 'stu-answer-04', examName: '故障排查综合测验', submittedAt: '2026-03-10 20:40', objectiveScore: 49, reviewScore: 37, finalScore: 86, answerStatus: '已批阅', note: '排障过程完整，恢复验证可再严谨。' }
  ]
})

export function getVrPermissionsByRole(role: VrTrainingRole): string[] {
  return role === 'teacher' ? [...teacherPermissions] : [...studentPermissions]
}

export function getVrMenusByRole(role: VrTrainingRole): VrMenuItem[] {
  return role === 'teacher' ? VR_TEACHER_MENUS : VR_STUDENT_MENUS
}

export function findVrAccount(role: VrTrainingRole, account: string, password: string): VrAccount | undefined {
  return VR_LOGIN_ACCOUNTS.find((item) => item.role === role && item.account === account && item.password === password)
}

export function getVrAccountByAccount(account: string): VrAccount | undefined {
  return VR_LOGIN_ACCOUNTS.find((item) => item.account === account)
}

export function registerVrAccount(payload: {
  role: VrTrainingRole
  name: string
  account: string
  password: string
  unitName: string
  className?: string
  major?: string
  phone: string
}): { ok: boolean; message: string; account?: VrAccount } {
  const existed = VR_LOGIN_ACCOUNTS.find((item) => item.account === payload.account)

  if (existed) {
    return { ok: false, message: '该账号已存在，请更换账号后重试' }
  }

  const roleLabel = payload.role === 'teacher' ? '教师用户' : '学生用户'
  const account: VrAccount = {
    id: `vr-${payload.role}-${Date.now()}`,
    role: payload.role,
    roleLabel,
    name: payload.name,
    account: payload.account,
    password: payload.password,
    unitName: payload.unitName,
    className: payload.className,
    major: payload.major,
    phone: payload.phone,
    permissions: getVrPermissionsByRole(payload.role)
  }

  VR_LOGIN_ACCOUNTS.push(account)

  if (payload.role === 'student') {
    VR_STUDENT_ROWS.unshift({
      id: payload.account,
      name: payload.name,
      gender: '男',
      className: payload.className || '待分班',
      major: payload.major || '现代移动通信技术',
      phone: payload.phone,
      teamName: '待分组',
      trainingHours: 0,
      examStatus: '未开始',
      faceStatus: '待补录',
      averageScore: 0,
      lastLogin: '首次注册'
    })
    VR_STUDENT_TRAININGS[payload.account] = []
    VR_STUDENT_COMPETITIONS[payload.account] = []
    VR_STUDENT_EXAMS[payload.account] = []
    VR_STUDENT_ANSWERS[payload.account] = []
  }

  return { ok: true, message: '注册成功，可直接使用新账号登录系统', account }
}

export function getPermissionLabels(permissions: string[]): string[] {
  return permissions.map((item) => VR_PERMISSION_LABELS[item] ?? item)
}

export function getStudentTrainingRows(account: string): VrTrainingRow[] {
  return VR_STUDENT_TRAININGS[account] ?? []
}

export function getStudentCompetitionRows(account: string): VrCompetitionRow[] {
  return VR_STUDENT_COMPETITIONS[account] ?? []
}

export function getStudentExamRows(account: string): VrExamRow[] {
  return VR_STUDENT_EXAMS[account] ?? []
}

export function getStudentAnswerRows(account: string): VrAnswerRow[] {
  return VR_STUDENT_ANSWERS[account] ?? []
}