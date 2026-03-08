import {
  FITNESS_ACCOUNT_COLUMNS,
  FITNESS_ACCOUNT_HIGHLIGHTS,
  FITNESS_ACCOUNT_STATS
} from './fitnessAccounts'
import {
  FITNESS_STUDENT_COLUMNS,
  FITNESS_STUDENT_HIGHLIGHTS,
  getFitnessStudentMenuStats
} from './fitnessStudents'
import {
  FITNESS_SCORE_COLUMNS,
  FITNESS_SCORE_HIGHLIGHTS,
  FITNESS_SCORE_STATS,
  queryFitnessScoreSummary
} from './fitnessScores'
import {
  FITNESS_VIDEO_COLUMNS,
  FITNESS_VIDEO_HIGHLIGHTS,
  FITNESS_VIDEO_STATS,
  getFitnessVideoSummaryRecords
} from './fitnessVideos'

export type FitnessRole = 'admin' | 'teacher' | 'headTeacher' | 'student'

export interface FitnessAdminStat {
  label: string
  value: string
}

export interface FitnessAdminTableColumn {
  prop: string
  label: string
  minWidth?: number
}

export interface FitnessAdminMenuItem {
  id: string
  group: string
  title: string
  description: string
  stats: FitnessAdminStat[]
  highlights: string[]
  columns: FitnessAdminTableColumn[]
  rows: Record<string, string>[]
}

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

export const FITNESS_STORAGE_ROLE = 'fitness_role'
export const FITNESS_STORAGE_ACCOUNT = 'fitness_account'

export const FITNESS_ADMIN_MENU_ITEMS: FitnessAdminMenuItem[] = [
  {
    id: 'dashboard',
    group: '工作台',
    title: '管理员工作台',
    description: '集中查看设备在线情况、采集质量、成绩回传和视频存储健康度。',
    stats: [
      { label: '在线设备', value: '126 / 132' },
      { label: '今日成绩', value: '48,296' },
      { label: '异常告警', value: '12' },
      { label: '视频占用', value: '11,420 min' }
    ],
    highlights: [
      '优先处理离线设备和访问密钥失效设备，避免成绩中断。',
      '关注人脸采集未通过学生，及时下发班级补采任务。',
      '视频剩余容量低于 25% 时应启动归档与清理策略。'
    ],
    columns: [
      { prop: 'module', label: '监控模块', minWidth: 160 },
      { prop: 'status', label: '状态', minWidth: 120 },
      { prop: 'detail', label: '说明', minWidth: 260 },
      { prop: 'owner', label: '责任角色', minWidth: 140 }
    ],
    rows: [
      { module: '设备联网', status: '高风险', detail: '南校区立定跳远设备离线 15 分钟以上', owner: '设备管理员' },
      { module: '照片采集', status: '处理中', detail: '七年级 2 班 41 名学生待重采', owner: '班主任' },
      { module: '成绩回传', status: '正常', detail: '今日 93% 成绩已自动回传', owner: '体育教师' },
      { module: '视频留存', status: '预警', detail: '剩余存储空间仅 23.9%', owner: '平台管理员' }
    ]
  },
  {
    id: 'accounts',
    group: '基础管理',
    title: '账号与权限',
    description: '管理管理员、体育教师、班主任、学生账号，并按学校、年级、班级配置权限范围。',
    stats: FITNESS_ACCOUNT_STATS,
    highlights: FITNESS_ACCOUNT_HIGHLIGHTS,
    columns: [...FITNESS_ACCOUNT_COLUMNS],
    rows: []
  },
  {
    id: 'students',
    group: '基础管理',
    title: '学生与人脸库',
    description: '查看学生档案、人脸照片状态、照片质量检测结果和按班级的采集完成情况。',
    stats: getFitnessStudentMenuStats(),
    highlights: FITNESS_STUDENT_HIGHLIGHTS,
    columns: [...FITNESS_STUDENT_COLUMNS],
    rows: []
  },
  {
    id: 'scores',
    group: '业务中心',
    title: '训练成绩管理',
    description: '管理训练站自动回传成绩、表格导入成绩、异常成绩修正和统计汇总。',
    stats: FITNESS_SCORE_STATS,
    highlights: FITNESS_SCORE_HIGHLIGHTS,
    columns: [...FITNESS_SCORE_COLUMNS],
    rows: []
  },
  {
    id: 'devices',
    group: '设备中心',
    title: '智能设备管理',
    description: '维护体测设备档案、IP、项目类型、访问密钥，并查看设备在线与空间使用情况。',
    stats: [
      { label: '设备总数', value: '132' },
      { label: '在线设备', value: '126' },
      { label: '离线设备', value: '6' },
      { label: '待鉴权', value: '3' }
    ],
    highlights: [
      '支持新增、删除、修改体测设备。',
      '支持访问密钥鉴权和参数配置。',
      '支持查看人脸数、成绩数和视频数量。'
    ],
    columns: [
      { prop: 'deviceName', label: '设备名称', minWidth: 150 },
      { prop: 'ip', label: 'IP 地址', minWidth: 140 },
      { prop: 'type', label: '训练项目', minWidth: 120 },
      { prop: 'status', label: '在线状态', minWidth: 120 },
      { prop: 'storage', label: '存储空间', minWidth: 120 }
    ],
    rows: [
      { deviceName: '50 米跑 A-01', ip: '10.10.1.21', type: '短跑', status: '在线', storage: '68%' },
      { deviceName: '立定跳远 C-02', ip: '10.10.3.18', type: '跳远', status: '离线', storage: '92%' },
      { deviceName: '仰卧起坐 B-03', ip: '10.10.2.26', type: '力量', status: '在线', storage: '74%' },
      { deviceName: '肺活量 D-05', ip: '10.10.4.09', type: '肺活量', status: '在线', storage: '57%' }
    ]
  },
  {
    id: 'sync',
    group: '设备中心',
    title: '设备数据同步',
    description: '管理人脸下发、设备端人脸增删改、成绩回传和同步失败重试。',
    stats: [
      { label: '今日同步任务', value: '214' },
      { label: '成功任务', value: '198' },
      { label: '失败任务', value: '16' },
      { label: '待重试', value: '9' }
    ],
    highlights: [
      '建立通信后自动同步学生人脸至设备。',
      '同步失败任务支持按设备重试。',
      '所有同步记录保留时间戳与结果明细。'
    ],
    columns: [
      { prop: 'taskType', label: '任务类型', minWidth: 150 },
      { prop: 'deviceName', label: '设备名称', minWidth: 150 },
      { prop: 'result', label: '执行结果', minWidth: 120 },
      { prop: 'count', label: '数量', minWidth: 100 },
      { prop: 'time', label: '执行时间', minWidth: 180 }
    ],
    rows: [
      { taskType: '人脸下发', deviceName: '50 米跑 A-01', result: '成功', count: '214', time: '2026-03-07 12:10' },
      { taskType: '人脸删除', deviceName: '立定跳远 C-02', result: '失败', count: '18', time: '2026-03-07 12:22' },
      { taskType: '成绩回传', deviceName: '仰卧起坐 B-03', result: '成功', count: '2,118', time: '2026-03-07 14:05' },
      { taskType: '视频索引同步', deviceName: '肺活量 D-05', result: '待重试', count: '86', time: '2026-03-07 13:48' }
    ]
  },
  {
    id: 'videos',
    group: '业务中心',
    title: '视频与存储管理',
    description: '管理训练视频留存策略、空间占用、抽检视频锁定和归档清理。',
    stats: FITNESS_VIDEO_STATS,
    highlights: FITNESS_VIDEO_HIGHLIGHTS,
    columns: [...FITNESS_VIDEO_COLUMNS],
    rows: getFitnessVideoSummaryRecords()
  },
  {
    id: 'monitor',
    group: '监管中心',
    title: '监控与日志',
    description: '查看实时状态、操作日志、设备通信日志和系统审计记录。',
    stats: [
      { label: '实时告警', value: '12' },
      { label: '操作日志', value: '8,214' },
      { label: '通信异常', value: '37' },
      { label: '审计事件', value: '214' }
    ],
    highlights: [
      '支持查看设备在线状态与异常日志。',
      '支持追踪照片修改、成绩修正、密钥更新。',
      '支持按时间、人员、模块检索日志。'
    ],
    columns: [
      { prop: 'time', label: '时间', minWidth: 180 },
      { prop: 'module', label: '模块', minWidth: 140 },
      { prop: 'operator', label: '操作人', minWidth: 120 },
      { prop: 'action', label: '操作内容', minWidth: 220 },
      { prop: 'result', label: '结果', minWidth: 120 }
    ],
    rows: [
      { time: '2026-03-07 14:26', module: '设备管理', operator: '王宁', action: '更新立定跳远 C-02 访问密钥', result: '成功' },
      { time: '2026-03-07 14:12', module: '学生与人脸库', operator: '李悦', action: '退回 7 年级 2 班 41 份照片重采', result: '成功' },
      { time: '2026-03-07 13:48', module: '视频管理', operator: '系统任务', action: '视频归档任务执行', result: '部分失败' },
      { time: '2026-03-07 13:21', module: '训练成绩', operator: '赵晨', action: '批量导入仰卧起坐成绩', result: '待复核' }
    ]
  },
  {
    id: 'settings',
    group: '系统设置',
    title: '系统设置',
    description: '管理组织编码、采集规则、存储策略、告警阈值和统一认证配置。',
    stats: [
      { label: '组织编码', value: 'CAMPUS-PE' },
      { label: '采集规则', value: '6 项' },
      { label: '告警阈值', value: '9 项' },
      { label: '接口配置', value: '4 项' }
    ],
    highlights: [
      '支持人脸像素、人脸占比、多人脸、模糊检测规则配置。',
      '支持视频留存分钟数和容量阈值调整。',
      '支持后续接入统一认证和微信端入口。'
    ],
    columns: [
      { prop: 'item', label: '配置项', minWidth: 180 },
      { prop: 'value', label: '当前值', minWidth: 180 },
      { prop: 'scope', label: '作用范围', minWidth: 160 },
      { prop: 'updatedBy', label: '最近修改人', minWidth: 140 }
    ],
    rows: [
      { item: '最小人脸像素', value: '500 x 500', scope: '全平台', updatedBy: '王宁' },
      { item: '视频留存阈值', value: '15,000 分钟', scope: '全平台', updatedBy: '王宁' },
      { item: '默认组织编码', value: 'CAMPUS-PE', scope: '本校区', updatedBy: '系统初始化' },
      { item: '统一认证开关', value: '预留未启用', scope: '登录入口', updatedBy: '平台管理员' }
    ]
  }
]