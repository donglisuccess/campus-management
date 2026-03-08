export type FitnessAccountRoleLabel = '平台管理员' | '体育教师' | '班主任' | '学生'

export type FitnessAccountStatus = '启用' | '禁用'

export interface FitnessAccountRecord {
  account: string
  name: string
  role: FitnessAccountRoleLabel
  department: string
  scope: string
  status: FitnessAccountStatus
  lastLogin: string
}

export interface FitnessAccountQuery {
  keyword?: string
  role?: FitnessAccountRoleLabel | ''
  status?: FitnessAccountStatus | ''
  page: number
  pageSize: number
}

const TOTAL_ADMIN_ACCOUNTS = 16
const TOTAL_TEACHER_ACCOUNTS = 384
const TOTAL_HEAD_TEACHER_ACCOUNTS = 600
const TOTAL_STUDENT_ACCOUNTS = 19000

const campusNames = ['东校区', '西校区', '南校区', '北校区']
const gradeNames = ['七年级', '八年级', '九年级', '高一', '高二', '高三']
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林']
const givenNameA = ['宇', '晨', '嘉', '梓', '浩', '沐', '依', '可', '一', '子', '思', '若', '欣', '佳', '文', '俊']
const givenNameB = ['轩', '宁', '然', '菲', '辰', '航', '妍', '彤', '泽', '逸', '恩', '琪', '睿', '婷', '博', '瑶']

const buildName = (seed: number) => {
  const surname = surnames[seed % surnames.length]
  const nameA = givenNameA[Math.floor(seed / 3) % givenNameA.length]
  const nameB = givenNameB[Math.floor(seed / 5) % givenNameB.length]
  return `${surname}${nameA}${nameB}`
}

const buildTimestamp = (seed: number) => {
  const day = (seed % 28) + 1
  const hour = 7 + (seed % 12)
  const minute = (seed * 13) % 60
  return `2026-03-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const buildStatus = (seed: number): FitnessAccountStatus => {
  return seed % 19 === 0 ? '禁用' : '启用'
}

export const FITNESS_ACCOUNT_ROLE_OPTIONS: FitnessAccountRoleLabel[] = ['平台管理员', '体育教师', '班主任', '学生']
export const FITNESS_ACCOUNT_STATUS_OPTIONS: FitnessAccountStatus[] = ['启用', '禁用']

export const FITNESS_ACCOUNT_COLUMNS = [
  { prop: 'account', label: '账号', minWidth: 150 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 120 },
  { prop: 'department', label: '所属组织', minWidth: 160 },
  { prop: 'scope', label: '权限范围', minWidth: 220 },
  { prop: 'status', label: '账号状态', minWidth: 120 },
  { prop: 'lastLogin', label: '最近登录', minWidth: 180 }
] as const

const createFitnessAccounts = () => {
  const records: FitnessAccountRecord[] = []
  let seed = 0

  for (let index = 1; index <= TOTAL_ADMIN_ACCOUNTS; index += 1) {
    seed += 1
    const campus = campusNames[(index - 1) % campusNames.length]
    records.push({
      account: `fitness_admin_${String(index).padStart(3, '0')}`,
      name: buildName(seed),
      role: '平台管理员',
      department: `${campus}信息中心`,
      scope: campus === '东校区' ? '全校配置、设备鉴权与审计日志' : `${campus}数据与跨校区汇总`,
      status: buildStatus(seed),
      lastLogin: buildTimestamp(seed)
    })
  }

  for (let index = 1; index <= TOTAL_TEACHER_ACCOUNTS; index += 1) {
    seed += 1
    const campus = campusNames[(index - 1) % campusNames.length]
    const gradeName = gradeNames[(index - 1) % gradeNames.length]
    records.push({
      account: `pe_teacher_${String(index).padStart(4, '0')}`,
      name: buildName(seed),
      role: '体育教师',
      department: `${campus}体育教研组`,
      scope: `${gradeName}体育课堂、训练成绩与视频回看`,
      status: buildStatus(seed),
      lastLogin: buildTimestamp(seed)
    })
  }

  for (let index = 1; index <= TOTAL_HEAD_TEACHER_ACCOUNTS; index += 1) {
    seed += 1
    const gradeName = gradeNames[(index - 1) % gradeNames.length]
    const classNo = ((index - 1) % 50) + 1
    const campus = campusNames[(index - 1) % campusNames.length]
    records.push({
      account: `head_teacher_${String(index).padStart(4, '0')}`,
      name: buildName(seed),
      role: '班主任',
      department: `${campus}${gradeName}${classNo}班`,
      scope: `${gradeName}${classNo}班学生档案、照片状态与成绩跟踪`,
      status: buildStatus(seed),
      lastLogin: buildTimestamp(seed)
    })
  }

  for (let index = 1; index <= TOTAL_STUDENT_ACCOUNTS; index += 1) {
    seed += 1
    const gradeName = gradeNames[(index - 1) % gradeNames.length]
    const classNo = ((index - 1) % 50) + 1
    records.push({
      account: `2026${String(index).padStart(6, '0')}`,
      name: buildName(seed),
      role: '学生',
      department: `${gradeName}${classNo}班`,
      scope: '个人档案、训练成绩与训练视频',
      status: buildStatus(seed),
      lastLogin: buildTimestamp(seed)
    })
  }

  return records
}

export const FITNESS_ACCOUNT_RECORDS = createFitnessAccounts()
export const FITNESS_ACCOUNT_TOTAL = FITNESS_ACCOUNT_RECORDS.length

export const FITNESS_ACCOUNT_STATS = [
  { label: '管理员账号', value: `${TOTAL_ADMIN_ACCOUNTS}` },
  { label: '体育教师', value: `${TOTAL_TEACHER_ACCOUNTS}` },
  { label: '班主任', value: `${TOTAL_HEAD_TEACHER_ACCOUNTS}` },
  { label: '学生账号', value: `${TOTAL_STUDENT_ACCOUNTS}` }
]

export const FITNESS_ACCOUNT_HIGHLIGHTS = [
  '账号列表接入 mock 数据，共 20,000 条，可按关键词快速检索。',
  '支持管理员、体育教师、班主任、学生四类角色的权限范围展示。',
  '列表支持角色、状态筛选，并可直接在表格中切换启用或禁用。'
]

export const queryFitnessAccounts = (query: FitnessAccountQuery) => {
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const role = query.role ?? ''
  const status = query.status ?? ''

  const filtered = FITNESS_ACCOUNT_RECORDS.filter((item) => {
    if (role && item.role !== role) {
      return false
    }

    if (status && item.status !== status) {
      return false
    }

    if (!keyword) {
      return true
    }

    return [item.account, item.name, item.role, item.department, item.scope, item.status].some((value) => {
      return value.toLowerCase().includes(keyword)
    })
  })

  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize

  return {
    total: filtered.length,
    list: filtered.slice(start, end)
  }
}

export const updateFitnessAccountStatus = (account: string, status: FitnessAccountStatus) => {
  const target = FITNESS_ACCOUNT_RECORDS.find((item) => item.account === account)

  if (!target) {
    return false
  }

  target.status = status
  return true
}