import { FITNESS_STUDENT_RECORDS } from './fitnessStudents'

export interface FitnessDeviceRecord extends Record<string, string> {
  deviceId: string
  deviceName: string
  ip: string
  type: string
  status: string
  storage: string
  secretKey: string
  location: string
  actions: string
}

export interface FitnessDeviceFaceRecord {
  faceId: string
  studentId: string
  studentName: string
  className: string
  facePhotoUrl: string
  syncStatus: '已同步' | '待更新'
  updatedAt: string
}

export interface FitnessDeviceFaceQuery {
  deviceId: string
  keyword?: string
  page: number
  pageSize: number
}

export const FITNESS_DEVICE_TYPE_OPTIONS = ['短跑', '跳远', '力量', '肺活量', '柔韧', '引体向上']
export const FITNESS_DEVICE_STATUS_OPTIONS = ['在线', '离线', '待鉴权', '维护中']

const FITNESS_DEVICE_RECORDS: FitnessDeviceRecord[] = [
  {
    deviceId: 'device_001',
    deviceName: '50 米跑 A-01',
    ip: '10.10.1.21',
    type: '短跑',
    status: '在线',
    storage: '68%',
    secretKey: 'SK-A01-2026',
    location: '东操场',
    actions: '管理'
  },
  {
    deviceId: 'device_002',
    deviceName: '立定跳远 C-02',
    ip: '10.10.3.18',
    type: '跳远',
    status: '离线',
    storage: '92%',
    secretKey: 'SK-C02-2026',
    location: '南校区',
    actions: '管理'
  },
  {
    deviceId: 'device_003',
    deviceName: '仰卧起坐 B-03',
    ip: '10.10.2.26',
    type: '力量',
    status: '在线',
    storage: '74%',
    secretKey: 'SK-B03-2026',
    location: '体育馆',
    actions: '管理'
  },
  {
    deviceId: 'device_004',
    deviceName: '肺活量 D-05',
    ip: '10.10.4.09',
    type: '肺活量',
    status: '待鉴权',
    storage: '57%',
    secretKey: 'SK-D05-2026',
    location: '综合馆',
    actions: '管理'
  }
]

const DEVICE_FACE_RECORDS = new Map<string, FitnessDeviceFaceRecord[]>()

export const FITNESS_DEVICE_COLUMNS = [
  { prop: 'deviceName', label: '设备名称', minWidth: 150 },
  { prop: 'ip', label: 'IP 地址', minWidth: 140 },
  { prop: 'type', label: '训练项目', minWidth: 120 },
  { prop: 'status', label: '在线状态', minWidth: 120 },
  { prop: 'storage', label: '存储空间', minWidth: 120 },
  { prop: 'actions', label: '操作', minWidth: 180 }
] as const

export const FITNESS_DEVICE_HIGHLIGHTS = [
  '支持新增、删除、修改体测设备。',
  '支持访问密钥鉴权和参数配置。',
  '支持查看设备位置、训练项目和存储占用情况。'
]

export const getFitnessDeviceMenuStats = () => {
  const total = FITNESS_DEVICE_RECORDS.length
  const online = FITNESS_DEVICE_RECORDS.filter((item) => item.status === '在线').length
  const offline = FITNESS_DEVICE_RECORDS.filter((item) => item.status === '离线').length
  const pending = FITNESS_DEVICE_RECORDS.filter((item) => item.status === '待鉴权').length

  return [
    { label: '设备总数', value: `${total}` },
    { label: '在线设备', value: `${online}` },
    { label: '离线设备', value: `${offline}` },
    { label: '待鉴权', value: `${pending}` }
  ]
}

export const getFitnessDeviceRecords = () => FITNESS_DEVICE_RECORDS

const buildDeviceFaceRecord = (deviceId: string, student: (typeof FITNESS_STUDENT_RECORDS)[number], index: number): FitnessDeviceFaceRecord => {
  return {
    faceId: `${deviceId}_face_${String(index + 1).padStart(5, '0')}`,
    studentId: student.studentId,
    studentName: student.studentName,
    className: student.className,
    facePhotoUrl: student.facePhotoUrl,
    syncStatus: '已同步',
    updatedAt: '2026-03-08 15:20'
  }
}

export const createFitnessDevice = (device: Omit<FitnessDeviceRecord, 'deviceId' | 'actions'>) => {
  const nextId = `device_${String(FITNESS_DEVICE_RECORDS.length + 1).padStart(3, '0')}`

  FITNESS_DEVICE_RECORDS.unshift({
    ...device,
    deviceId: nextId,
    actions: '管理'
  })
}

export const updateFitnessDevice = (device: FitnessDeviceRecord) => {
  const target = FITNESS_DEVICE_RECORDS.find((item) => item.deviceId === device.deviceId)

  if (!target) {
    return false
  }

  target.deviceName = device.deviceName
  target.ip = device.ip
  target.type = device.type
  target.status = device.status
  target.storage = device.storage
  target.secretKey = device.secretKey
  target.location = device.location

  return true
}

export const authenticateFitnessDevice = (deviceId: string, accessKey: string) => {
  const target = FITNESS_DEVICE_RECORDS.find((item) => item.deviceId === deviceId)

  if (!target) {
    return { success: false, message: '设备不存在' }
  }

  if (target.status === '维护中') {
    return { success: false, message: '设备维护中，暂不支持鉴权通信' }
  }

  if (target.secretKey !== accessKey.trim()) {
    return { success: false, message: '访问密钥错误，无法建立通信' }
  }

  target.status = '在线'

  return { success: true, message: '鉴权成功，设备已可通信' }
}

export const syncFitnessStudentsToDevice = (deviceId: string) => {
  const target = FITNESS_DEVICE_RECORDS.find((item) => item.deviceId === deviceId)

  if (!target) {
    return { success: false, message: '设备不存在', syncedCount: 0 }
  }

  if (target.status !== '在线') {
    return { success: false, message: '请先完成鉴权并建立通信，再同步学生人脸信息', syncedCount: 0 }
  }

  const syncableStudents = FITNESS_STUDENT_RECORDS.filter((item) => {
    return item.faceStatus === '已入库' || item.faceStatus === '已同步设备'
  })

  DEVICE_FACE_RECORDS.set(
    deviceId,
    syncableStudents.map((student, index) => buildDeviceFaceRecord(deviceId, student, index))
  )

  return {
    success: true,
    message: `已将 ${syncableStudents.length} 名学生的人脸信息同步至 ${target.deviceName}`,
    syncedCount: syncableStudents.length
  }
}

export const queryFitnessDeviceFaces = (query: FitnessDeviceFaceQuery) => {
  const keyword = query.keyword?.trim().toLowerCase() ?? ''
  const rows = DEVICE_FACE_RECORDS.get(query.deviceId) ?? []

  const filtered = rows.filter((item) => {
    if (!keyword) {
      return true
    }

    return [item.studentId, item.studentName, item.className, item.syncStatus].some((value) => {
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

export const createFitnessDeviceFace = (deviceId: string, payload: Omit<FitnessDeviceFaceRecord, 'faceId' | 'updatedAt'>) => {
  const rows = DEVICE_FACE_RECORDS.get(deviceId) ?? []
  const nextIndex = rows.length + 1

  rows.unshift({
    ...payload,
    faceId: `${deviceId}_face_${String(nextIndex).padStart(5, '0')}`,
    updatedAt: '2026-03-08 15:30'
  })

  DEVICE_FACE_RECORDS.set(deviceId, rows)
}

export const updateFitnessDeviceFace = (deviceId: string, payload: FitnessDeviceFaceRecord) => {
  const rows = DEVICE_FACE_RECORDS.get(deviceId) ?? []
  const target = rows.find((item) => item.faceId === payload.faceId)

  if (!target) {
    return false
  }

  target.studentId = payload.studentId
  target.studentName = payload.studentName
  target.className = payload.className
  target.facePhotoUrl = payload.facePhotoUrl
  target.syncStatus = payload.syncStatus
  target.updatedAt = '2026-03-08 15:35'

  return true
}

export const deleteFitnessDeviceFace = (deviceId: string, faceId: string) => {
  const rows = DEVICE_FACE_RECORDS.get(deviceId) ?? []
  const index = rows.findIndex((item) => item.faceId === faceId)

  if (index === -1) {
    return false
  }

  rows.splice(index, 1)
  DEVICE_FACE_RECORDS.set(deviceId, rows)
  return true
}

export const getFitnessDeviceFaceTotal = (deviceId: string) => {
  return (DEVICE_FACE_RECORDS.get(deviceId) ?? []).length
}

export const deleteFitnessDevice = (deviceId: string) => {
  const index = FITNESS_DEVICE_RECORDS.findIndex((item) => item.deviceId === deviceId)

  if (index === -1) {
    return false
  }

  FITNESS_DEVICE_RECORDS.splice(index, 1)
  return true
}