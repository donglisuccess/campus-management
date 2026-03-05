export interface EventRecord {
  id: number
  title: string
  school: string
  group: string
  dateRangeText: string
  status: '待发布' | '进行中' | '已结束'
}

export interface GroupRecord {
  name: string
  description: string
}

export interface SchoolScoreRecord {
  school: string
  activity: string
  score: number
}

export interface ExportTaskRecord {
  activity: string
  typeLabel: '单作品' | '作品集' | '学校作品集'
  status: '已完成' | '处理中' | '失败'
}

export interface PortfolioRecord {
  name: string
  category: '单文件' | '单作品集' | '学校作品集'
  school: string
  review: string
  previewType: 'pdf' | 'image'
  previewUrl: string
}

export interface ServiceFeature {
  no: string
  text: string
}

export const competitionMockEvents: EventRecord[] = [
  { id: 1, title: '2026校园创新作品评比活动', school: '南城一中', group: '高中组', dateRangeText: '2026-03-01 至 2026-03-20', status: '进行中' },
  { id: 2, title: '2026青少年科技创客挑战赛', school: '北城实验学校', group: '初中组', dateRangeText: '2026-03-08 至 2026-03-30', status: '待发布' },
  { id: 3, title: '数字媒体设计主题赛', school: '东城中学', group: '高中组', dateRangeText: '2026-02-10 至 2026-03-05', status: '已结束' },
  { id: 4, title: '机器人编程校际联赛', school: '江南实验中学', group: '初中组', dateRangeText: '2026-03-12 至 2026-04-06', status: '进行中' },
  { id: 5, title: '校园低碳实践方案征集', school: '新港学校', group: '小学组', dateRangeText: '2026-03-02 至 2026-03-25', status: '待发布' },
  { id: 6, title: '智慧校园应用设计赛', school: '海陵中学', group: '高中组', dateRangeText: '2026-02-18 至 2026-03-15', status: '已结束' },
  { id: 7, title: '人工智能课堂应用大赛', school: '西城二中', group: '高中组', dateRangeText: '2026-03-11 至 2026-04-08', status: '进行中' },
  { id: 8, title: '创意劳动课程成果赛', school: '春晖学校', group: '小学组', dateRangeText: '2026-03-09 至 2026-03-28', status: '待发布' },
  { id: 9, title: '无人机应用探索挑战赛', school: '育才中学', group: '初中组', dateRangeText: '2026-02-01 至 2026-02-24', status: '已结束' },
  { id: 10, title: '校园文化数字展演', school: '青云高级中学', group: '高中组', dateRangeText: '2026-03-05 至 2026-03-29', status: '进行中' },
  { id: 11, title: '青少年信息素养实践赛', school: '临江实验学校', group: '初中组', dateRangeText: '2026-03-15 至 2026-04-09', status: '待发布' },
  { id: 12, title: '未来城市规划创想赛', school: '枫林学校', group: '小学组', dateRangeText: '2026-02-22 至 2026-03-18', status: '进行中' }
]

export const competitionMockGroups: GroupRecord[] = [
  { name: '小学组', description: '面向小学学段，强调启蒙实践与创新表达。' },
  { name: '初中组', description: '面向初中学段，突出项目完整性与协作能力。' },
  { name: '高中组', description: '面向高中学段，关注方案深度与落地可行性。' },
  { name: '中高职组', description: '面向职业院校，强调专业技能与应用能力。' },
  { name: '教师指导组', description: '面向教师与教研团队，展示课程创新成果。' }
]

export const competitionMockSchoolScores: SchoolScoreRecord[] = [
  { school: '南城一中', activity: '2026校园创新作品评比活动', score: 4.8 },
  { school: '北城实验学校', activity: '2026校园创新作品评比活动', score: 4.4 },
  { school: '东城中学', activity: '数字媒体设计主题赛', score: 4.2 },
  { school: '江南实验中学', activity: '机器人编程校际联赛', score: 4.7 },
  { school: '新港学校', activity: '校园低碳实践方案征集', score: 4.1 },
  { school: '海陵中学', activity: '智慧校园应用设计赛', score: 4.5 },
  { school: '西城二中', activity: '人工智能课堂应用大赛', score: 4.6 },
  { school: '春晖学校', activity: '创意劳动课程成果赛', score: 4.0 },
  { school: '育才中学', activity: '无人机应用探索挑战赛', score: 3.9 },
  { school: '青云高级中学', activity: '校园文化数字展演', score: 4.3 },
  { school: '临江实验学校', activity: '青少年信息素养实践赛', score: 4.2 },
  { school: '枫林学校', activity: '未来城市规划创想赛', score: 4.4 }
]

export const competitionMockExportTasks: ExportTaskRecord[] = [
  { activity: '2026校园创新作品评比活动', typeLabel: '学校作品集', status: '已完成' },
  { activity: '机器人编程校际联赛', typeLabel: '作品集', status: '处理中' },
  { activity: '数字媒体设计主题赛', typeLabel: '单作品', status: '已完成' },
  { activity: '智慧校园应用设计赛', typeLabel: '作品集', status: '已完成' },
  { activity: '人工智能课堂应用大赛', typeLabel: '学校作品集', status: '处理中' },
  { activity: '创意劳动课程成果赛', typeLabel: '单作品', status: '失败' }
]

export const competitionMockPortfolios: PortfolioRecord[] = [
  {
    name: '智慧校园低碳改造方案',
    category: '学校作品集',
    school: '南城一中',
    review: '结构完整，建议补充年度运维成本测算。',
    previewType: 'pdf',
    previewUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    name: 'AI课堂助手设计',
    category: '单作品集',
    school: '北城实验学校',
    review: '创意突出，建议强化无障碍交互细节。',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: '机器人编程挑战赛记录',
    category: '单文件',
    school: '东城中学',
    review: '文档详实，建议增加实测视频链接。',
    previewType: 'pdf',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    name: '校园雨水回收智能监测',
    category: '单作品集',
    school: '江南实验中学',
    review: '选题契合实际，建议完善数据来源说明。',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: '历史文化XR导览方案',
    category: '学校作品集',
    school: '新港学校',
    review: '叙事完整，建议加强性能优化策略。',
    previewType: 'pdf',
    previewUrl: 'https://www.orimi.com/pdf-test.pdf'
  },
  {
    name: '青少年交通安全可视化项目',
    category: '单文件',
    school: '海陵中学',
    review: '可视化效果好，建议增加用户测试记录。',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: '校园垃圾分类智能识别',
    category: '单作品集',
    school: '西城二中',
    review: '模型思路清晰，建议补充误判场景分析。',
    previewType: 'pdf',
    previewUrl: 'https://gahp.net/wp-content/uploads/2017/09/sample.pdf'
  },
  {
    name: '未来教室声学优化设计',
    category: '单文件',
    school: '春晖学校',
    review: '表达完整，建议补充材料选型依据。',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: '无人机巡检实训案例集',
    category: '学校作品集',
    school: '育才中学',
    review: '实操价值高，建议增加风险控制章节。',
    previewType: 'pdf',
    previewUrl: 'https://www.africau.edu/images/default/sample.pdf'
  },
  {
    name: '校园艺术节数字传播计划',
    category: '单作品集',
    school: '青云高级中学',
    review: '执行路径明确，建议细化预算与排期。',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1600&q=80'
  }
]

export const competitionServiceFeatures: ServiceFeature[] = [
  { no: '01', text: '赛事活动发起，支持学校可发起赛事活动。' },
  { no: '02', text: '支持建立分组，可选择分组发起活动。' },
  { no: '03', text: '支持教师/学生在线上传竞赛材料，支持在线预览并限制附件大小。' },
  { no: '04', text: '支持以学校为主体发起赛事活动，每所学校上传材料，评委可对学校评分。' },
  { no: '05', text: '支持管理人员将作品打包导出或下载。' },
  { no: '06', text: '支持单个文件、单个作品集、学校作品集上传及浏览、点评、打分。' },
  { no: '07', text: '支持自定义打分模式与比例，并支持配置是否显示得分情况。' },
  { no: '08', text: '支持配置是否允许下载单个作品或仅浏览作品。' }
]

export const competitionTestAccounts = [
  '平台管理员：platformAdmin/platformAdmin',
  '学校管理员：schoolAdmin/schoolAdmin',
  '评委：pingwei/pingwei',
  '教师：teacher001/teacher001',
  '学生：student001/student001'
]
