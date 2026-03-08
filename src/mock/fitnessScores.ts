export interface FitnessScoreSummaryRecord {
  batchId: string
  project: string
  source: string
  count: string
  status: string
  updatedAt: string
  actions: string
}

export interface FitnessScoreDetailRecord {
  batchId: string
  studentId: string
  studentName: string
  gender: '男' | '女'
  className: string
  score: number
  resultLevel: '优秀' | '良好' | '及格' | '待复核'
  scoreStatus: '已入库' | '待复核' | '异常'
  uploadTime: string
}

export interface FitnessScoreSummaryQuery {
  keyword?: string
  project?: string
  source?: string
  status?: string
}

export interface FitnessScoreDetailQuery {
  batchId: string
  keyword?: string
  className?: string
  resultLevel?: string
  scoreStatus?: string
}

const projects = ['50 米跑', '立定跳远', '仰卧起坐', '肺活量', '坐位体前屈', '引体向上']
const sources = ['设备回传', '表格导入', '人工补录']
const statuses = ['正常', '待复核', '部分中断']
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

const buildSummaryTime = (seed: number) => {
  const day = (seed % 8) + 1
  const hour = 9 + (seed % 9)
  const minute = (seed * 11) % 60
  return `2026-03-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const buildDetailTime = (seed: number) => {
  const day = (seed % 8) + 1
  const hour = 8 + (seed % 10)
  const minute = (seed * 7) % 60
  return `2026-03-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const FITNESS_SCORE_COLUMNS = [
  { prop: 'project', label: '训练项目', minWidth: 140 },
  { prop: 'source', label: '数据来源', minWidth: 120 },
  { prop: 'count', label: '记录数', minWidth: 120 },
  { prop: 'status', label: '处理状态', minWidth: 120 },
  { prop: 'updatedAt', label: '最近更新时间', minWidth: 180 },
  { prop: 'actions', label: '操作', minWidth: 120 }
] as const

export const FITNESS_SCORE_DETAIL_COLUMNS = [
  { prop: 'studentId', label: '学号', minWidth: 140 },
  { prop: 'studentName', label: '姓名', minWidth: 110 },
  { prop: 'gender', label: '性别', minWidth: 80 },
  { prop: 'className', label: '班级', minWidth: 140 },
  { prop: 'score', label: '成绩', minWidth: 100 },
  { prop: 'resultLevel', label: '等级', minWidth: 100 },
  { prop: 'scoreStatus', label: '入库状态', minWidth: 120 },
  { prop: 'uploadTime', label: '上传时间', minWidth: 180 }
] as const

export const FITNESS_SCORE_PROJECT_OPTIONS = [...projects]
export const FITNESS_SCORE_SOURCE_OPTIONS = [...sources]
export const FITNESS_SCORE_STATUS_OPTIONS = [...statuses]
export const FITNESS_SCORE_DETAIL_RESULT_OPTIONS = ['优秀', '良好', '及格', '待复核']
export const FITNESS_SCORE_DETAIL_STATUS_OPTIONS = ['已入库', '待复核', '异常']

const createScoreSummaryRecords = () => {
  const records: FitnessScoreSummaryRecord[] = []
  let seed = 0

  for (const project of projects) {
    for (const source of sources) {
      seed += 1
      const count = 1800 + seed * 137
      const status = statuses[seed % statuses.length]
      records.push({
        batchId: `score_batch_${String(seed).padStart(3, '0')}`,
        project,
        source,
        count: `${count.toLocaleString('zh-CN')}`,
        status,
        updatedAt: buildSummaryTime(seed),
        actions: '查看详情'
      })
    }
  }

  return records
}

const createScoreDetailRecords = (summaries: FitnessScoreSummaryRecord[]) => {
  const records: FitnessScoreDetailRecord[] = []
  let seed = 0

  for (const summary of summaries) {
    for (let index = 1; index <= 42; index += 1) {
      seed += 1
      const gradeName = gradeNames[seed % gradeNames.length]
      const classNo = (seed % 18) + 1
      const numericScore = 58 + (seed % 43)
      const scoreStatus = summary.status === '待复核' ? '待复核' : seed % 17 === 0 ? '异常' : '已入库'
      const resultLevel =
        scoreStatus === '待复核'
          ? '待复核'
          : numericScore >= 90
            ? '优秀'
            : numericScore >= 80
              ? '良好'
              : '及格'

      records.push({
        batchId: summary.batchId,
        studentId: `2026${String(seed).padStart(8, '0')}`,
        studentName: buildName(seed),
        gender: seed % 2 === 0 ? '男' : '女',
        className: `${gradeName}${classNo}班`,
        score: numericScore,
        resultLevel,
        scoreStatus,
        uploadTime: buildDetailTime(seed)
      })
    }
  }

  return records
}

export const FITNESS_SCORE_SUMMARY_RECORDS = createScoreSummaryRecords()
export const FITNESS_SCORE_DETAIL_RECORDS = createScoreDetailRecords(FITNESS_SCORE_SUMMARY_RECORDS)

export const FITNESS_SCORE_HIGHLIGHTS = [
  '支持训练站自动回传、表格导入与人工补录三类来源统一查询。',
  '主列表支持按项目、来源、处理状态筛选，并可快速进入批次明细。',
  '详情弹窗按学生维度展示成绩，并支持按班级、等级、入库状态二次筛选。'
]

export const FITNESS_SCORE_STATS = (() => {
  const total = FITNESS_SCORE_DETAIL_RECORDS.length
  const today = FITNESS_SCORE_DETAIL_RECORDS.filter((item) => item.uploadTime.startsWith('2026-03-08')).length
  const importTask = FITNESS_SCORE_SUMMARY_RECORDS.filter((item) => item.source === '表格导入').length
  const pending = FITNESS_SCORE_DETAIL_RECORDS.filter((item) => item.scoreStatus === '待复核' || item.scoreStatus === '异常').length

  return [
    { label: '成绩累计', value: `${total.toLocaleString('zh-CN')}` },
    { label: '今日新增', value: `${today.toLocaleString('zh-CN')}` },
    { label: '导入任务', value: `${importTask}` },
    { label: '异常待复核', value: `${pending}` }
  ]
})()

export const queryFitnessScoreSummary = (query: FitnessScoreSummaryQuery) => {
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const project = query.project ?? ''
  const source = query.source ?? ''
  const status = query.status ?? ''

  return FITNESS_SCORE_SUMMARY_RECORDS.filter((item) => {
    if (project && item.project !== project) return false
    if (source && item.source !== source) return false
    if (status && item.status !== status) return false

    if (!keyword) {
      return true
    }

    return [item.project, item.source, item.status, item.updatedAt].some((value) => value.toLowerCase().includes(keyword))
  })
}

export const getFitnessScoreDetailClassOptions = (batchId: string) => {
  return Array.from(new Set(FITNESS_SCORE_DETAIL_RECORDS.filter((item) => item.batchId === batchId).map((item) => item.className)))
}

export const queryFitnessScoreDetails = (query: FitnessScoreDetailQuery) => {
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const className = query.className ?? ''
  const resultLevel = query.resultLevel ?? ''
  const scoreStatus = query.scoreStatus ?? ''

  return FITNESS_SCORE_DETAIL_RECORDS.filter((item) => {
    if (item.batchId !== query.batchId) return false
    if (className && item.className !== className) return false
    if (resultLevel && item.resultLevel !== resultLevel) return false
    if (scoreStatus && item.scoreStatus !== scoreStatus) return false

    if (!keyword) {
      return true
    }

    return [item.studentId, item.studentName, item.className, item.resultLevel, item.scoreStatus].some((value) => {
      return value.toLowerCase().includes(keyword)
    })
  })
}