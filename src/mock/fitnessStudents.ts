export interface FitnessStudentRecord {
  studentId: string
  studentName: string
  gender: '男' | '女'
  gradeName: string
  className: string
  faceStatus: '已同步设备' | '已入库' | '待审核' | '待重采'
  quality: '合格' | '像素不足' | '人脸占比不足' | '多张人脸' | '照片模糊'
  captureChannel: 'H5采集' | '小程序采集' | '批量导入'
  updatedAt: string
}

export interface FitnessStudentQuery {
  keyword?: string
  gradeName?: string
  className?: string
  faceStatus?: string
  quality?: string
  page: number
  pageSize: number
}

const gradeConfigs = [
  { name: '七年级', code: '07', classCount: 58, studentCount: 58 },
  { name: '八年级', code: '08', classCount: 58, studentCount: 58 },
  { name: '九年级', code: '09', classCount: 58, studentCount: 58 },
  { name: '高一', code: '10', classCount: 58, studentCount: 62 },
  { name: '高二', code: '11', classCount: 58, studentCount: 62 },
  { name: '高三', code: '12', classCount: 58, studentCount: 62 }
]

const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林']
const givenNameA = ['宇', '晨', '嘉', '梓', '浩', '沐', '依', '可', '一', '子', '思', '若', '欣', '佳', '文', '俊']
const givenNameB = ['轩', '宁', '然', '菲', '辰', '航', '妍', '彤', '泽', '逸', '恩', '琪', '睿', '婷', '博', '瑶']

const buildStudentName = (seed: number) => {
  const surname = surnames[seed % surnames.length]
  const nameA = givenNameA[Math.floor(seed / 3) % givenNameA.length]
  const nameB = givenNameB[Math.floor(seed / 7) % givenNameB.length]
  return `${surname}${nameA}${nameB}`
}

const buildQuality = (seed: number): FitnessStudentRecord['quality'] => {
  if (seed % 37 === 0) return '照片模糊'
  if (seed % 31 === 0) return '多张人脸'
  if (seed % 23 === 0) return '人脸占比不足'
  if (seed % 19 === 0) return '像素不足'
  return '合格'
}

const buildFaceStatus = (quality: FitnessStudentRecord['quality'], seed: number): FitnessStudentRecord['faceStatus'] => {
  if (quality !== '合格') {
    return seed % 2 === 0 ? '待重采' : '待审核'
  }

  return seed % 5 === 0 ? '已入库' : '已同步设备'
}

const buildCaptureChannel = (seed: number): FitnessStudentRecord['captureChannel'] => {
  if (seed % 11 === 0) return '批量导入'
  return seed % 2 === 0 ? 'H5采集' : '小程序采集'
}

const buildTimestamp = (seed: number) => {
  const day = (seed % 28) + 1
  const hour = 8 + (seed % 11)
  const minute = (seed * 7) % 60
  return `2026-03-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const FITNESS_STUDENT_COLUMNS = [
  { prop: 'studentId', label: '学号', minWidth: 140 },
  { prop: 'studentName', label: '姓名', minWidth: 120 },
  { prop: 'gender', label: '性别', minWidth: 80 },
  { prop: 'gradeName', label: '年级', minWidth: 110 },
  { prop: 'className', label: '班级', minWidth: 130 },
  { prop: 'faceStatus', label: '人脸状态', minWidth: 120 },
  { prop: 'quality', label: '照片质量', minWidth: 130 },
  { prop: 'captureChannel', label: '采集方式', minWidth: 110 },
  { prop: 'updatedAt', label: '最近更新', minWidth: 170 }
] as const

const createStudents = () => {
  const records: FitnessStudentRecord[] = []
  let globalIndex = 0

  for (const grade of gradeConfigs) {
    for (let classIndex = 1; classIndex <= grade.classCount; classIndex += 1) {
      const className = `${grade.name}${classIndex}班`

      for (let studentIndex = 1; studentIndex <= grade.studentCount; studentIndex += 1) {
        globalIndex += 1
        const quality = buildQuality(globalIndex)
        records.push({
          studentId: `2026${grade.code}${String(classIndex).padStart(2, '0')}${String(studentIndex).padStart(2, '0')}`,
          studentName: buildStudentName(globalIndex),
          gender: globalIndex % 2 === 0 ? '男' : '女',
          gradeName: grade.name,
          className,
          faceStatus: buildFaceStatus(quality, globalIndex),
          quality,
          captureChannel: buildCaptureChannel(globalIndex),
          updatedAt: buildTimestamp(globalIndex)
        })
      }
    }
  }

  return records
}

export const FITNESS_STUDENT_RECORDS = createStudents()
export const FITNESS_STUDENT_TOTAL = FITNESS_STUDENT_RECORDS.length
export const FITNESS_STUDENT_GRADE_OPTIONS = ['全部', ...gradeConfigs.map((item) => item.name)]
export const FITNESS_STUDENT_FACE_STATUS_OPTIONS = ['全部', '已同步设备', '已入库', '待审核', '待重采']
export const FITNESS_STUDENT_QUALITY_OPTIONS = ['全部', '合格', '像素不足', '人脸占比不足', '多张人脸', '照片模糊']
export const FITNESS_STUDENT_CLASS_OPTIONS = ['全部', ...Array.from(new Set(FITNESS_STUDENT_RECORDS.map((item) => item.className)))]

export const FITNESS_STUDENT_STATS = (() => {
  const synced = FITNESS_STUDENT_RECORDS.filter((item) => item.faceStatus === '已同步设备').length
  const stored = FITNESS_STUDENT_RECORDS.filter((item) => item.faceStatus === '已入库').length
  const repick = FITNESS_STUDENT_RECORDS.filter((item) => item.faceStatus === '待重采').length
  const abnormal = FITNESS_STUDENT_RECORDS.filter((item) => item.quality !== '合格').length

  return {
    total: FITNESS_STUDENT_TOTAL,
    synced,
    stored,
    repick,
    abnormal
  }
})()

export const queryFitnessStudents = (query: FitnessStudentQuery) => {
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const gradeName = query.gradeName && query.gradeName !== '全部' ? query.gradeName : ''
  const className = query.className && query.className !== '全部' ? query.className : ''
  const faceStatus = query.faceStatus && query.faceStatus !== '全部' ? query.faceStatus : ''
  const quality = query.quality && query.quality !== '全部' ? query.quality : ''

  const filtered = FITNESS_STUDENT_RECORDS.filter((item) => {
    if (keyword) {
      const matchedKeyword =
        item.studentName.toLowerCase().includes(keyword) ||
        item.studentId.toLowerCase().includes(keyword) ||
        item.className.toLowerCase().includes(keyword)

      if (!matchedKeyword) {
        return false
      }
    }

    if (gradeName && item.gradeName !== gradeName) return false
    if (className && item.className !== className) return false
    if (faceStatus && item.faceStatus !== faceStatus) return false
    if (quality && item.quality !== quality) return false

    return true
  })

  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize

  return {
    total: filtered.length,
    list: filtered.slice(start, end)
  }
}