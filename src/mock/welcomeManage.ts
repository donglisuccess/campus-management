export type WelcomeManageMenuKey =
  | 'dashboard'
  | 'department'
  | 'user'
  | 'student'
  | 'access'
  | 'precheckin'
  | 'health'
  | 'dispatch'
  | 'notice'
  | 'guide'
  | 'map'
  | 'stats'
  | 'device'
  | 'system'
  | 'profile'
  | 'logout'

export type WelcomeManageRole = 'super-admin' | 'checkin-admin' | 'security-admin' | 'content-admin'

export interface WelcomeRoleOption {
  label: string
  value: WelcomeManageRole
  description: string
}

export interface WelcomeLoginAccount {
  role: WelcomeManageRole
  roleLabel: string
  name: string
  account: string
  password: string
  permissions: WelcomeManageMenuKey[]
}

export interface WelcomeManageMenuItem {
  key: WelcomeManageMenuKey
  label: string
  group: '工作台' | '迎新业务' | '运行保障' | '个人中心'
}

export interface WelcomeDashboardStat {
  label: string
  value: string
  accent: string
  note: string
}

export interface WelcomeTodoItem {
  title: string
  level: '高' | '中' | '低'
  owner: string
  deadline: string
}

export interface WelcomeDepartmentRow {
  id: number
  name: string
  leader: string
  phone: string
  members: number
  status: '运行中' | '待完善'
  remark: string
}

export interface WelcomeUserRow {
  id: number
  name: string
  department: string
  role: string
  phone: string
  status: '启用' | '停用'
  lastLogin: string
}

export interface WelcomeStudentRow {
  id: string
  name: string
  gender: '男' | '女'
  college: string
  major: string
  className: string
  origin: string
  status: '已报到' | '预报到' | '未到校'
  dormitory: string
}

export interface WelcomeAccessRow {
  id: number
  studentName: string
  gate: string
  direction: '入校' | '离校'
  result: '通过' | '预警'
  temperature: string
  time: string
}

export interface WelcomePreCheckinRow {
  id: number
  studentName: string
  college: string
  arrivalPlan: string
  travelMode: string
  baggage: string
  status: '已提交' | '待补充' | '已审核'
}

export interface WelcomeHealthRow {
  id: number
  studentName: string
  healthCode: '绿码' | '黄码'
  symptom: string
  clockTime: string
  status: '正常' | '待关注'
}

export interface WelcomeDispatchRow {
  id: number
  event: string
  level: '一级' | '二级' | '三级'
  location: string
  owner: string
  status: '处理中' | '待派发' | '已完成'
  updateTime: string
}

export interface WelcomeNoticeRow {
  id: number
  title: string
  audience: string
  publisher: string
  publishTime: string
  content: string
  status: '已发布' | '草稿'
}

export interface WelcomeGuideRow {
  id: number
  title: string
  location: string
  window: string
  owner: string
  status: '启用中' | '优化中'
}

export interface WelcomeMapSpotRow {
  id: number
  name: string
  category: string
  coordinate: string
  crowdLevel: '高' | '中' | '低'
  manager: string
}

export interface WelcomeDeviceRow {
  id: number
  name: string
  type: string
  location: string
  onlineRate: string
  status: '在线' | '维护中' | '离线'
}

export interface WelcomeSystemSettingRow {
  id: number
  name: string
  value: string
  scope: string
  status: '生效中' | '待发布'
}

export interface WelcomeProfile {
  name: string
  role: string
  department: string
  phone: string
  email: string
  lastLogin: string
}

export const WELCOME_PHASE_ONE_MENU_KEYS: WelcomeManageMenuKey[] = [
  'dashboard',
  'student',
  'precheckin',
  'access',
  'health',
  'dispatch',
  'notice'
]

export const WELCOME_MANAGE_MENUS: WelcomeManageMenuItem[] = [
  { key: 'dashboard', label: '首页', group: '工作台' },
  { key: 'department', label: '部门管理', group: '工作台' },
  { key: 'user', label: '用户管理', group: '工作台' },
  { key: 'student', label: '学生管理', group: '迎新业务' },
  { key: 'access', label: '防疫门禁', group: '迎新业务' },
  { key: 'precheckin', label: '预报到', group: '迎新业务' },
  { key: 'health', label: '健康打卡', group: '迎新业务' },
  { key: 'dispatch', label: '紧急调度', group: '迎新业务' },
  { key: 'notice', label: '校园公告管理', group: '运行保障' },
  { key: 'guide', label: '报到指引', group: '运行保障' },
  { key: 'map', label: '校园地图', group: '运行保障' },
  { key: 'stats', label: '学生统计', group: '运行保障' },
  { key: 'device', label: '设备管理', group: '运行保障' },
  { key: 'system', label: '系统管理', group: '个人中心' },
  { key: 'profile', label: '我的信息', group: '个人中心' },
  { key: 'logout', label: '退出登录', group: '个人中心' }
]

export const WELCOME_ROLE_OPTIONS: WelcomeRoleOption[] = [
  {
    label: '超级管理员',
    value: 'super-admin',
    description: '可访问一期全部后台模块与公告发布能力'
  },
  {
    label: '报到管理员',
    value: 'checkin-admin',
    description: '负责新生档案、预报到信息与现场报到进度维护'
  },
  {
    label: '防疫门禁管理员',
    value: 'security-admin',
    description: '负责门禁核验、健康打卡与异常事件处置'
  },
  {
    label: '宣传公告管理员',
    value: 'content-admin',
    description: '负责首页概览查看与校园公告发布维护'
  }
]

export const WELCOME_LOGIN_ACCOUNTS: WelcomeLoginAccount[] = [
  {
    role: 'super-admin',
    roleLabel: '超级管理员',
    name: '陈丽华',
    account: 'welcome_admin',
    password: '123456',
    permissions: [...WELCOME_PHASE_ONE_MENU_KEYS, 'profile', 'logout']
  },
  {
    role: 'checkin-admin',
    roleLabel: '报到管理员',
    name: '周明睿',
    account: 'welcome_checkin',
    password: '123456',
    permissions: ['dashboard', 'student', 'precheckin', 'dispatch', 'profile', 'logout']
  },
  {
    role: 'security-admin',
    roleLabel: '防疫门禁管理员',
    name: '许嘉怡',
    account: 'welcome_security',
    password: '123456',
    permissions: ['dashboard', 'access', 'health', 'dispatch', 'profile', 'logout']
  },
  {
    role: 'content-admin',
    roleLabel: '宣传公告管理员',
    name: '韩雨晨',
    account: 'welcome_notice',
    password: '123456',
    permissions: ['dashboard', 'notice', 'profile', 'logout']
  }
]

export const findWelcomeAccount = (
  role: WelcomeManageRole,
  account: string,
  password: string
) => {
  return WELCOME_LOGIN_ACCOUNTS.find(
    (item) => item.role === role && item.account === account && item.password === password
  )
}

export const getWelcomeRoleMenus = (role: WelcomeManageRole) => {
  const account = WELCOME_LOGIN_ACCOUNTS.find((item) => item.role === role)
  return account?.permissions ?? []
}

export const WELCOME_DASHBOARD_STATS: WelcomeDashboardStat[] = [
  { label: '当日到校', value: '3826 人', accent: '#0ea5e9', note: '较昨日同时段 +8.4%' },
  { label: '预报到完成率', value: '94.1%', accent: '#22c55e', note: '剩余 247 人待补录' },
  { label: '门禁预警', value: '12 条', accent: '#f97316', note: '集中在南门与东门' },
  { label: '应急工单', value: '5 单', accent: '#e11d48', note: '2 单处理中，3 单已闭环' }
]

export const WELCOME_DASHBOARD_TODOS: WelcomeTodoItem[] = [
  { title: '更新南门分流公告', level: '高', owner: '宣传组', deadline: '16:10' },
  { title: '核验兰苑剩余床位数据', level: '中', owner: '宿舍组', deadline: '16:20' },
  { title: '复核黄码学生留观流程', level: '高', owner: '防疫组', deadline: '16:30' },
  { title: '补录汽车工程学院迟到名单', level: '低', owner: '学院秘书', deadline: '17:00' }
]

export const WELCOME_DEPARTMENT_ROWS: WelcomeDepartmentRow[] = [
  { id: 1, name: '迎新综合协调组', leader: '陈丽华', phone: '13800112001', members: 12, status: '运行中', remark: '统筹迎新调度与督办' },
  { id: 2, name: '学生报到组', leader: '周明睿', phone: '13800112002', members: 18, status: '运行中', remark: '学院报到窗口与资料核验' },
  { id: 3, name: '宿舍服务组', leader: '梁晓峰', phone: '13800112003', members: 16, status: '运行中', remark: '床位分配与入住办理' },
  { id: 4, name: '防疫门禁组', leader: '许嘉怡', phone: '13800112004', members: 10, status: '运行中', remark: '入校测温、门禁审核' },
  { id: 5, name: '宣传公告组', leader: '韩雨晨', phone: '13800112005', members: 7, status: '待完善', remark: '通知编发与现场导视' }
]

export const WELCOME_USER_ROWS: WelcomeUserRow[] = [
  { id: 1, name: '陈丽华', department: '迎新综合协调组', role: '超级管理员', phone: '13800113001', status: '启用', lastLogin: '2026-03-08 15:32' },
  { id: 2, name: '周明睿', department: '学生报到组', role: '报到管理员', phone: '13800113002', status: '启用', lastLogin: '2026-03-08 15:28' },
  { id: 3, name: '梁晓峰', department: '宿舍服务组', role: '宿舍管理员', phone: '13800113003', status: '启用', lastLogin: '2026-03-08 15:16' },
  { id: 4, name: '许嘉怡', department: '防疫门禁组', role: '防疫管理员', phone: '13800113004', status: '启用', lastLogin: '2026-03-08 15:11' },
  { id: 5, name: '韩雨晨', department: '宣传公告组', role: '内容管理员', phone: '13800113005', status: '停用', lastLogin: '2026-03-07 18:02' }
]

const WELCOME_STUDENT_BASE_ROWS: WelcomeStudentRow[] = [
  { id: '20260001', name: '李俊豪', gender: '男', college: '智能制造学院', major: '机电一体化技术', className: '机电 2401', origin: '河南郑州', status: '已报到', dormitory: '兰苑 2-315' },
  { id: '20260002', name: '周雨桐', gender: '女', college: '医护学院', major: '护理', className: '护理 2403', origin: '湖南长沙', status: '已报到', dormitory: '梅苑 1-208' },
  { id: '20260003', name: '郭嘉铭', gender: '男', college: '信息工程学院', major: '大数据技术', className: '大数据 2402', origin: '山东济南', status: '预报到', dormitory: '待分配' },
  { id: '20260004', name: '宋婉清', gender: '女', college: '建筑工程学院', major: '建筑室内设计', className: '室内 2401', origin: '浙江温州', status: '未到校', dormitory: '待分配' },
  { id: '20260005', name: '吕承泽', gender: '男', college: '汽车工程学院', major: '汽车检测与维修技术', className: '汽修 2402', origin: '河南洛阳', status: '已报到', dormitory: '竹苑 5-406' }
]

const STUDENT_NAME_POOL = [
  '王可欣', '黄子辰', '林嘉怡', '莫欣妍', '陈思远', '赵文博', '许诺然', '彭思琪', '唐宇航', '曹佳宁',
  '邓启明', '冯泽楷', '梁舒雅', '韩睿哲', '沈若溪', '罗子昂', '谢清妍', '苏铭泽', '何语彤', '宋嘉佑',
  '蒋安琪', '顾晨熙', '叶知远', '高语晴', '温浩然', '姚星妍', '任奕辰', '陆诗涵', '段柏霖', '郑欣怡'
]

const STUDENT_COLLEGE_CONFIG = [
  { college: '智能制造学院', major: '机电一体化技术', prefix: '机电' },
  { college: '医护学院', major: '护理', prefix: '护理' },
  { college: '信息工程学院', major: '大数据技术', prefix: '大数据' },
  { college: '建筑工程学院', major: '建筑室内设计', prefix: '室内' },
  { college: '汽车工程学院', major: '汽车检测与维修技术', prefix: '汽修' },
  { college: '电子工程学院', major: '应用电子技术', prefix: '电子' },
  { college: '经济管理学院', major: '电子商务', prefix: '电商' }
] as const

const STUDENT_ORIGIN_POOL = [
  '河南郑州', '湖南长沙', '山东济南', '浙江温州', '河南洛阳', '广东佛山', '广西南宁', '福建泉州',
  '湖北武汉', '江西南昌', '江苏盐城', '河北石家庄', '四川绵阳', '陕西西安', '云南昆明', '重庆',
  '安徽合肥', '贵州贵阳', '山西太原', '海南海口'
]

const DORMITORY_AREAS = ['兰苑', '竹苑', '梅苑', '桂苑']
const PRECHECKIN_TRANSPORTS = ['高铁', '自驾', '大巴', '飞机', '火车'] as const
const ACCESS_GATES = ['南门', '东门', '西门', '北门'] as const
const DISPATCH_LOCATIONS = ['南门迎新主入口', '图文信息中心', '体育馆服务区', '兰苑 2 栋前坪', '竹苑宿舍区', '学生活动中心']
const DISPATCH_OWNERS = ['综合协调组', '学生报到组', '宿舍服务组', '防疫门禁组', '宣传公告组', '后勤保障组']
const DISPATCH_EVENT_TEMPLATES = ['排队拥堵', '行李车不足', '咨询集中', '体温异常复核', '打印终端故障', '宿舍分配冲突']
const NOTICE_AUDIENCE_POOL = ['全体新生', '全体新生及家长', '医护学院新生', '信息工程学院新生', '各学院志愿者', '报到工作人员']
const NOTICE_PUBLISHERS = ['宣传公告组', '学生报到组', '防疫门禁组', '宿舍服务组']
const NOTICE_TOPICS = ['车辆分流', '窗口迁移', '入住提示', '报到提醒', '志愿者排班', '校门通行']
const NOTICE_CONTENT_TEMPLATES = [
  '<p><strong>请新生及家长注意：</strong>现场路线已按实时人流进行调整，请服从志愿者引导。</p><p>如需帮助，可前往综合服务区咨询台办理。</p>',
  '<p><strong>相关学院报到点已调整。</strong></p><ul><li>请携带身份证和录取通知书</li><li>优先前往最新分配窗口办理</li></ul>',
  '<p>宿舍入住高峰期间，请按宿舍区分时段错峰办理。</p><p><em>建议先完成学院报到后再前往宿舍区。</em></p>',
  '<p>请未完成预报到的新生尽快在小程序端补全到校计划、同行人员和行李信息。</p>',
  '<p>志愿者请按排班表提前 15 分钟到岗，统一佩戴证件并保持通信畅通。</p>',
  '<p>校门通行高峰已开启分流通道。</p><p>车辆请按照现场指示进入临时停车区。</p>'
]

const padValue = (value: number, length: number) => String(value).padStart(length, '0')

const buildStudentRow = (index: number): WelcomeStudentRow => {
  const collegeConfig = STUDENT_COLLEGE_CONFIG[index % STUDENT_COLLEGE_CONFIG.length]
  const name = `${STUDENT_NAME_POOL[index % STUDENT_NAME_POOL.length]}${index >= STUDENT_NAME_POOL.length ? padValue((index % 18) + 1, 2) : ''}`
  const statusList: WelcomeStudentRow['status'][] = ['已报到', '已报到', '预报到', '未到校']
  const status = statusList[index % statusList.length]
  const gender: WelcomeStudentRow['gender'] = index % 2 === 0 ? '男' : '女'
  const gradeSuffix = 2401 + (index % 6)
  const dormitory = status === '未到校'
    ? '待分配'
    : `${DORMITORY_AREAS[index % DORMITORY_AREAS.length]} ${1 + (index % 6)}-${200 + ((index * 7) % 220)}`

  return {
    id: `2026${padValue(index + 1, 4)}`,
    name,
    gender,
    college: collegeConfig.college,
    major: collegeConfig.major,
    className: `${collegeConfig.prefix} ${gradeSuffix}`,
    origin: STUDENT_ORIGIN_POOL[index % STUDENT_ORIGIN_POOL.length],
    status,
    dormitory
  }
}

export const WELCOME_STUDENT_ROWS: WelcomeStudentRow[] = Array.from({ length: 180 }, (_, index) => {
  if (index < WELCOME_STUDENT_BASE_ROWS.length) {
    return WELCOME_STUDENT_BASE_ROWS[index]
  }

  return buildStudentRow(index)
})

export const WELCOME_ACCESS_ROWS: WelcomeAccessRow[] = Array.from({ length: 120 }, (_, index) => {
  const student = WELCOME_STUDENT_ROWS[index]
  const isWarning = index % 9 === 2 || index % 17 === 6
  const temperatureValue = isWarning ? 37 + (index % 4) * 0.1 : 36.3 + (index % 5) * 0.1

  return {
    id: index + 1,
    studentName: student.name,
    gate: ACCESS_GATES[index % ACCESS_GATES.length],
    direction: index % 11 === 0 ? '离校' : '入校',
    result: isWarning ? '预警' : '通过',
    temperature: `${temperatureValue.toFixed(1)}℃`,
    time: `15:${padValue((58 - (index % 43) + 60) % 60, 2)}:${padValue((index * 7) % 60, 2)}`
  }
})

export const WELCOME_PRECHECKIN_ROWS: WelcomePreCheckinRow[] = Array.from({ length: 96 }, (_, index) => {
  const student = WELCOME_STUDENT_ROWS[index + 2]
  const statusList: WelcomePreCheckinRow['status'][] = ['已提交', '待补充', '已审核', '已审核']

  return {
    id: index + 1,
    studentName: student.name,
    college: student.college,
    arrivalPlan: `2026-03-${padValue(8 + (index % 3), 2)} ${padValue(8 + (index % 10), 2)}:${index % 2 === 0 ? '20' : '50'}`,
    travelMode: PRECHECKIN_TRANSPORTS[index % PRECHECKIN_TRANSPORTS.length],
    baggage: `${1 + (index % 4)} 件`,
    status: statusList[index % statusList.length]
  }
})

export const WELCOME_HEALTH_ROWS: WelcomeHealthRow[] = Array.from({ length: 88 }, (_, index) => {
  const student = WELCOME_STUDENT_ROWS[index + 1]
  const hasIssue = index % 10 === 3 || index % 16 === 7

  return {
    id: index + 1,
    studentName: student.name,
    healthCode: hasIssue ? '黄码' : '绿码',
    symptom: hasIssue ? (index % 2 === 0 ? '轻微发热' : '咽痛待复核') : '无',
    clockTime: `2026-03-08 0${7 + (index % 3)}:${padValue((index * 6) % 60, 2)}`,
    status: hasIssue ? '待关注' : '正常'
  }
})

export const WELCOME_DISPATCH_ROWS: WelcomeDispatchRow[] = Array.from({ length: 72 }, (_, index) => {
  const levelList: WelcomeDispatchRow['level'][] = ['一级', '二级', '三级']
  const statusList: WelcomeDispatchRow['status'][] = ['处理中', '待派发', '已完成', '处理中']
  const location = DISPATCH_LOCATIONS[index % DISPATCH_LOCATIONS.length]

  return {
    id: index + 1,
    event: `${location}${DISPATCH_EVENT_TEMPLATES[index % DISPATCH_EVENT_TEMPLATES.length]}`,
    level: levelList[index % levelList.length],
    location,
    owner: DISPATCH_OWNERS[index % DISPATCH_OWNERS.length],
    status: statusList[index % statusList.length],
    updateTime: `${padValue(8 + (index % 10), 2)}:${padValue((index * 9) % 60, 2)}`
  }
})

export const WELCOME_NOTICE_ROWS: WelcomeNoticeRow[] = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  title: `${NOTICE_TOPICS[index % NOTICE_TOPICS.length]}通知第 ${index + 1} 期`,
  audience: NOTICE_AUDIENCE_POOL[index % NOTICE_AUDIENCE_POOL.length],
  publisher: NOTICE_PUBLISHERS[index % NOTICE_PUBLISHERS.length],
  publishTime: index % 5 === 0 ? '待发布' : `2026-03-08 ${padValue(9 + (index % 8), 2)}:${padValue((index * 11) % 60, 2)}`,
  content: NOTICE_CONTENT_TEMPLATES[index % NOTICE_CONTENT_TEMPLATES.length],
  status: index % 5 === 0 ? '草稿' : '已发布'
}))

export const WELCOME_GUIDE_ROWS: WelcomeGuideRow[] = [
  { id: 1, title: '校门核验', location: '南门迎新主入口', window: '6 个通道', owner: '防疫门禁组', status: '启用中' },
  { id: 2, title: '学院报到', location: '图文信息中心', window: '12 个窗口', owner: '学生报到组', status: '启用中' },
  { id: 3, title: '宿舍入住', location: '兰苑 / 竹苑宿舍区', window: '8 个服务点', owner: '宿舍服务组', status: '优化中' }
]

export const WELCOME_MAP_SPOTS: WelcomeMapSpotRow[] = [
  { id: 1, name: '南门迎新主入口', category: '校门', coordinate: 'X: 124, Y: 361', crowdLevel: '高', manager: '许嘉怡' },
  { id: 2, name: '图文信息中心', category: '报到点', coordinate: 'X: 302, Y: 242', crowdLevel: '中', manager: '周明睿' },
  { id: 3, name: '体育馆综合服务区', category: '服务点', coordinate: 'X: 464, Y: 286', crowdLevel: '中', manager: '陈丽华' },
  { id: 4, name: '兰苑 1-4 栋', category: '宿舍区', coordinate: 'X: 666, Y: 156', crowdLevel: '高', manager: '梁晓峰' }
]

export const WELCOME_DEVICE_ROWS: WelcomeDeviceRow[] = [
  { id: 1, name: '南门闸机 A01', type: '门禁闸机', location: '南门', onlineRate: '99.8%', status: '在线' },
  { id: 2, name: '东门热成像 T02', type: '测温设备', location: '东门', onlineRate: '98.6%', status: '在线' },
  { id: 3, name: '报到窗口打印机 P05', type: '打印终端', location: '图文信息中心', onlineRate: '87.4%', status: '维护中' },
  { id: 4, name: '宿舍刷卡机 C08', type: '刷卡终端', location: '兰苑 2 栋', onlineRate: '0%', status: '离线' }
]

export const WELCOME_SYSTEM_SETTINGS: WelcomeSystemSettingRow[] = [
  { id: 1, name: '驾驶舱自动刷新周期', value: '30 秒', scope: '大屏驾驶舱', status: '生效中' },
  { id: 2, name: '预报到表单必填校验', value: '启用', scope: '学生端', status: '生效中' },
  { id: 3, name: '门禁异常短信提醒', value: '管理员 + 防疫组', scope: '通知服务', status: '待发布' }
]

export const WELCOME_PROFILE: WelcomeProfile = {
  name: '陈丽华',
  role: '迎新综合平台主管',
  department: '迎新综合协调组',
  phone: '13800113001',
  email: 'chenlihua@campus.edu.cn',
  lastLogin: '2026-03-08 15:32:18'
}