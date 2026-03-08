export interface FitnessVideoSummaryRecord extends Record<string, string> {
  videoId: string
  zone: string
  deviceName: string
  duration: string
  storage: string
  status: string
  actions: string
}

export interface FitnessVideoDetailRecord {
  timeRange: string
  clipName: string
  studentName: string
  project: string
  duration: string
  storage: string
  status: string
  videoUrl: string
  actions: string
}

const playableVideoPool = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
]

const videoSummaryRecords: FitnessVideoSummaryRecord[] = [
  {
    videoId: 'video_001',
    zone: '东操场',
    deviceName: '50 米跑 A-01',
    duration: '3,428 min',
    storage: '312 GB',
    status: '正常',
    actions: '查看详情'
  },
  {
    videoId: 'video_002',
    zone: '南校区',
    deviceName: '立定跳远 C-02',
    duration: '2,612 min',
    storage: '286 GB',
    status: '空间预警',
    actions: '查看详情'
  },
  {
    videoId: 'video_003',
    zone: '体育馆',
    deviceName: '仰卧起坐 B-03',
    duration: '2,945 min',
    storage: '244 GB',
    status: '正常',
    actions: '查看详情'
  },
  {
    videoId: 'video_004',
    zone: '综合馆',
    deviceName: '肺活量 D-05',
    duration: '2,164 min',
    storage: '198 GB',
    status: '待归档',
    actions: '查看详情'
  }
]

const buildVideoDetail = (videoId: string, baseName: string, project: string, studentPrefix: string) => {
  return [
    {
      timeRange: '08:00 - 08:12',
      clipName: `${baseName}-morning-01.mp4`,
      studentName: `${studentPrefix}晨`,
      project,
      duration: '12 min',
      storage: '1.2 GB',
      status: '已锁定',
      videoUrl: playableVideoPool[0],
      actions: '播放'
    },
    {
      timeRange: '09:20 - 09:36',
      clipName: `${baseName}-class-02.mp4`,
      studentName: `${studentPrefix}航`,
      project,
      duration: '16 min',
      storage: '1.6 GB',
      status: '正常',
      videoUrl: playableVideoPool[1],
      actions: '播放'
    },
    {
      timeRange: '10:40 - 10:55',
      clipName: `${baseName}-group-03.mp4`,
      studentName: `${studentPrefix}妍`,
      project,
      duration: '15 min',
      storage: '1.4 GB',
      status: '待归档',
      videoUrl: playableVideoPool[2],
      actions: '播放'
    },
    {
      timeRange: '14:10 - 14:28',
      clipName: `${baseName}-review-04.mp4`,
      studentName: `${studentPrefix}泽`,
      project,
      duration: '18 min',
      storage: '1.8 GB',
      status: '正常',
      videoUrl: playableVideoPool[3],
      actions: '播放'
    },
    {
      timeRange: '16:00 - 16:11',
      clipName: `${baseName}-audit-05.mp4`,
      studentName: `${studentPrefix}琪`,
      project,
      duration: '11 min',
      storage: '1.1 GB',
      status: '抽检保留',
      videoUrl: playableVideoPool[4],
      actions: '播放'
    }
  ].map((item) => ({ ...item, videoId }))
}

const videoDetails = {
  video_001: buildVideoDetail('video_001', 'sprint-a01', '50 米跑', '周'),
  video_002: buildVideoDetail('video_002', 'jump-c02', '立定跳远', '陈'),
  video_003: buildVideoDetail('video_003', 'situp-b03', '仰卧起坐', '李'),
  video_004: buildVideoDetail('video_004', 'vital-d05', '肺活量', '王')
} as const

export const FITNESS_VIDEO_COLUMNS = [
  { prop: 'zone', label: '区域', minWidth: 140 },
  { prop: 'deviceName', label: '设备名称', minWidth: 150 },
  { prop: 'duration', label: '视频时长', minWidth: 120 },
  { prop: 'storage', label: '空间占用', minWidth: 120 },
  { prop: 'status', label: '留存状态', minWidth: 120 },
  { prop: 'actions', label: '操作', minWidth: 120 }
] as const

export const FITNESS_VIDEO_DETAIL_COLUMNS = [
  { prop: 'timeRange', label: '时间段', minWidth: 140 },
  { prop: 'clipName', label: '视频文件', minWidth: 220 },
  { prop: 'studentName', label: '学生', minWidth: 110 },
  { prop: 'project', label: '训练项目', minWidth: 120 },
  { prop: 'duration', label: '片段时长', minWidth: 100 },
  { prop: 'storage', label: '占用空间', minWidth: 100 },
  { prop: 'status', label: '留存状态', minWidth: 120 },
  { prop: 'actions', label: '操作', minWidth: 100 }
] as const

export const FITNESS_VIDEO_STATS = [
  { label: '已留存视频', value: '13,842 min' },
  { label: '剩余可用', value: '1,158 min' },
  { label: '待归档', value: '426 min' },
  { label: '抽检锁定', value: '92 min' }
]

export const FITNESS_VIDEO_HIGHLIGHTS = [
  '支持按学生、设备、项目定位训练视频。',
  '支持容量预警和归档清理。',
  '详情弹窗展示指定设备在多个时间段的视频片段列表。'
]

export const getFitnessVideoSummaryRecords = () => videoSummaryRecords

export const getFitnessVideoDetailRecords = (videoId: string) => {
  return videoDetails[videoId as keyof typeof videoDetails] ?? []
}