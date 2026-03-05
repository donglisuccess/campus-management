import { reactive } from 'vue'

export type PlatformRole = 'teacher' | 'admin'

export interface TeacherPlatformMenu {
  id: number
  title: string
  group: string
  fields: string[]
  multiple: boolean
}

export interface TeacherFormEntry {
  values: Record<string, string>
  locked: boolean
}

export interface TeacherProfile {
  id: string
  name: string
  forms: Record<number, TeacherFormEntry[]>
}

interface TeacherSeed {
  id: string
  name: string
  gender: '男' | '女'
  ethnicity: string
  hometown: string
  birthplace: string
  idCard: string
  school: string
  subject: string
}

export const teacherPlatformMenus: TeacherPlatformMenu[] = [
  { id: 1, title: '个人基本信息', group: '基础信息', multiple: false, fields: ['姓名', '曾用名', '性别', '民族', '籍贯', '出生地', '身份证'] },
  { id: 2, title: '家庭成员', group: '基础信息', multiple: true, fields: ['称谓', '姓名', '工作单位', '职务/岗位', '政治面貌'] },
  { id: 3, title: '政治面貌', group: '基础信息', multiple: true, fields: ['政治面貌', '加入时间', '转正时间', '加入组织名称', '现组织关系名称', '介绍人', '其他党派及职务'] },
  { id: 4, title: '学习经历', group: '履历发展', multiple: true, fields: ['起始时间', '终止时间', '学校名称', '院系名称', '所学专业', '是否师范类', '学习方式', '是否毕业', '毕业学历', '是否最高毕业学历', '学位名称', '是否获得学位', '是否最高学位', '是否参加工作学历'] },
  { id: 5, title: '工作单位经历', group: '履历发展', multiple: true, fields: ['单位规范全称', '工作状态', '进入单位时间', '进入单位方式', '人事劳动关系种类', '起始时间', '终止时间', '是否基层学校'] },
  { id: 6, title: '工作岗位经历', group: '履历发展', multiple: true, fields: ['起始时间', '终止时间', '主要工作岗位', '主要工作专业', '同时期是否兼任其他工作', '兼任工作岗位', '兼任工作专业'] },
  { id: 7, title: '党政职务', group: '履历发展', multiple: true, fields: ['任职起始时间', '任职终止时间', '任职单位规范全称', '党政职务名称', '职务行政级别', '是否兼任其他党政职务', '兼任党政职务名称', '兼任职务行政级别'] },
  { id: 8, title: '专业技术职务', group: '履历发展', multiple: true, fields: ['拟聘专业技术岗位级别', '专业技术职务名称', '职称所属系列', '拟聘所属系列', '拟聘任起始时间', '拟聘任终止时间', '取得资格时间', '当前专技岗位等级聘任起始时间'] },
  { id: 9, title: '工勤职务', group: '履历发展', multiple: true, fields: ['取得时间', '资格等级', '资格种类', '资格名称', '是否聘任', '首次聘任起始时间', '首次聘任单位', '最后聘期起始时间', '最后聘期终止时间', '最后聘期聘任单位', '累计聘任年限', '是否当前聘任职务资格'] },
  { id: 10, title: '教育教学工作', group: '教育教学', multiple: true, fields: ['学年', '学期', '任教学段', '任教学科', '任教班级', '任教班级数', '周课时数', '兼任任教学段', '兼任任教学科', '兼任任教班级', '兼任任教班级数', '兼任周课时数', '学生人数', '本学期周课时量'] },
  { id: 11, title: '备课工作', group: '教育教学', multiple: true, fields: ['学年', '学期', '学段及任教年级', '任课教程', '教材版本', '备课形式', '学校备课本检查结果'] },
  { id: 12, title: '班主任工作', group: '教育教学', multiple: true, fields: ['学年', '学期', '班级', '班级学段', '备注'] },
  { id: 13, title: '辅导员工作', group: '教育教学', multiple: true, fields: ['学年', '学期', '社团及第二课堂名称', '每周活动次数', '学生人数', '社团活动成果'] },
  { id: 14, title: '学年度考核', group: '考核奖惩', multiple: true, fields: ['年度信息', '考核单位', '考核结果', '原因'] },
  { id: 15, title: '师德考核', group: '考核奖惩', multiple: true, fields: ['年度信息', '考核单位', '考核结果', '原因'] },
  { id: 16, title: '处分', group: '考核奖惩', multiple: true, fields: ['处分类别', '处分原因', '时间', '是否撤销', '撤销日期', '做出处分单位'] },
  { id: 17, title: '国内培训', group: '培训交流', multiple: true, fields: ['培训开始时间', '培训结束时间', '培训项目名称', '培训机构名称', '培训方式', '培训学时', '获得学分'] },
  { id: 18, title: '海外研修', group: '培训交流', multiple: true, fields: ['开始时间', '结束时间', '国家', '研修机构名称', '项目名称', '组织单位名称', '研修学时', '获得学分'] },
  { id: 19, title: '公开课名师开放课城乡交流课', group: '培训交流', multiple: true, fields: ['开课类型', '开设时间', '结束时间', '开课地点', '开课年级', '开课课题', '发证部门'] },
  { id: 20, title: '教育教学经验交流', group: '培训交流', multiple: true, fields: ['交流日期', '会议名称', '交流发言题目', '举办部门'] },
  { id: 21, title: '教育教学获奖', group: '荣誉科研', multiple: true, fields: ['获奖时间', '奖项名称', '奖项级别', '评奖发证部门'] },
  { id: 22, title: '综合荣誉', group: '荣誉科研', multiple: true, fields: ['获奖时间', '奖项名称', '奖项级别', '评奖发证部门'] },
  { id: 23, title: '科研论文', group: '荣誉科研', multiple: true, fields: ['论文标题', '科学领域', '正式发表时间', '是否获奖', '颁奖单位', '获奖等级', '论文字数', '作者数量及位次', '影响因子', '刊物名称', '全国统一刊号CN', '关键词及描述'] },
  { id: 24, title: '著作教材', group: '荣誉科研', multiple: true, fields: ['正式出版时间', '著作名称', '本人位次', '本人参与部分字数', 'ISBN', 'CIP', '出版社名称', '著作描述'] },
  { id: 25, title: '专利或软件著作权', group: '荣誉科研', multiple: true, fields: ['类型', '名称', '学科领域', '批准日期', '本人角色及次位', '专利号'] },
  { id: 26, title: '教科研成果奖', group: '荣誉科研', multiple: true, fields: ['获奖时间', '奖项名称', '获奖项目名称', '获奖人数及位次', '奖项等级', '评奖部门', '成果描述'] },
  { id: 27, title: '科研课题', group: '荣誉科研', multiple: true, fields: ['立项时间', '是否结题', '结题时间', '课题名称', '课题级别', '是否子课题', '课题主管部门', '课题描述'] },
  { id: 28, title: '教育教学工作年限', group: '专项信息', multiple: true, fields: ['幼儿园', '小学', '初中', '高中', '职业学校', '高校', '合计'] },
  { id: 29, title: '企业实践经历', group: '专项信息', multiple: true, fields: ['企业名称', '实践岗位', '企业联系人', '联系人职务', '联系电话', '实践时间', '实践内容', '企业考核意见'] },
  { id: 30, title: '支教经历', group: '专项信息', multiple: true, fields: ['支教开始时间', '支教结束时间', '支教单位', '工作岗位', '工作内容', '单位评价', '证明人'] },
  { id: 31, title: '军转干部', group: '专项信息', multiple: true, fields: ['军转干部标识', '转业时间', '现单位待遇职级'] }
]

export const TEACHER_CREDENTIAL = { jobId: 'teacher001', password: 'teacher001' }
export const ADMIN_CREDENTIAL = { account: 'admin', password: 'admin' }

const teacherSeeds: TeacherSeed[] = [
  { id: 'teacher001', name: '陈晓东', gender: '男', ethnicity: '汉族', hometown: '江苏南京', birthplace: '江苏南京', idCard: '320102198703154217', school: '南京市第一中学', subject: '数学' },
  { id: 'teacher002', name: '刘雨欣', gender: '女', ethnicity: '汉族', hometown: '江苏苏州', birthplace: '江苏苏州', idCard: '320508199008114522', school: '苏州市实验中学', subject: '英语' },
  { id: 'teacher003', name: '周文博', gender: '男', ethnicity: '汉族', hometown: '浙江杭州', birthplace: '浙江杭州', idCard: '330106198912234036', school: '杭州市高级中学', subject: '物理' },
  { id: 'teacher004', name: '宋佳宁', gender: '女', ethnicity: '汉族', hometown: '安徽合肥', birthplace: '安徽合肥', idCard: '340103199306202146', school: '合肥市第六中学', subject: '化学' },
  { id: 'teacher005', name: '赵明哲', gender: '男', ethnicity: '回族', hometown: '山东济南', birthplace: '山东济南', idCard: '370102198510062919', school: '济南外国语学校', subject: '历史' },
  { id: 'teacher006', name: '吴思远', gender: '男', ethnicity: '汉族', hometown: '湖北武汉', birthplace: '湖北武汉', idCard: '420106198808273512', school: '武汉市第三中学', subject: '地理' },
  { id: 'teacher007', name: '郑雅琪', gender: '女', ethnicity: '汉族', hometown: '湖南长沙', birthplace: '湖南长沙', idCard: '430102199207195028', school: '长沙市明德中学', subject: '生物' },
  { id: 'teacher008', name: '孙浩然', gender: '男', ethnicity: '汉族', hometown: '广东广州', birthplace: '广东广州', idCard: '440106198611305810', school: '广州市执信中学', subject: '政治' },
  { id: 'teacher009', name: '马晨曦', gender: '女', ethnicity: '满族', hometown: '辽宁沈阳', birthplace: '辽宁沈阳', idCard: '210103199111133627', school: '沈阳市第二中学', subject: '语文' },
  { id: 'teacher010', name: '高一凡', gender: '男', ethnicity: '汉族', hometown: '四川成都', birthplace: '四川成都', idCard: '510105198901243033', school: '成都市石室中学', subject: '数学' },
  { id: 'teacher011', name: '梁若彤', gender: '女', ethnicity: '汉族', hometown: '福建厦门', birthplace: '福建厦门', idCard: '350203199402104825', school: '厦门双十中学', subject: '英语' },
  { id: 'teacher012', name: '冯宇航', gender: '男', ethnicity: '汉族', hometown: '重庆渝中', birthplace: '重庆渝中', idCard: '500103198704182116', school: '重庆南开中学', subject: '信息技术' },
  { id: 'teacher013', name: '彭思琪', gender: '女', ethnicity: '汉族', hometown: '江西南昌', birthplace: '江西南昌', idCard: '360102199109082447', school: '南昌市第二中学', subject: '音乐' },
  { id: 'teacher014', name: '谢凯文', gender: '男', ethnicity: '土家族', hometown: '贵州贵阳', birthplace: '贵州贵阳', idCard: '520102198602145738', school: '贵阳一中', subject: '体育' },
  { id: 'teacher015', name: '邓依婷', gender: '女', ethnicity: '汉族', hometown: '广西南宁', birthplace: '广西南宁', idCard: '450103199505252221', school: '南宁市第三中学', subject: '美术' },
  { id: 'teacher016', name: '卢志诚', gender: '男', ethnicity: '汉族', hometown: '河南郑州', birthplace: '河南郑州', idCard: '410105198312273419', school: '郑州外国语学校', subject: '语文' },
  { id: 'teacher017', name: '蒋欣怡', gender: '女', ethnicity: '汉族', hometown: '河北石家庄', birthplace: '河北石家庄', idCard: '130104199603215624', school: '石家庄第二中学', subject: '化学' },
  { id: 'teacher018', name: '郭天宇', gender: '男', ethnicity: '蒙古族', hometown: '内蒙古呼和浩特', birthplace: '内蒙古呼和浩特', idCard: '150102198911193013', school: '呼和浩特市第二中学', subject: '物理' },
  { id: 'teacher019', name: '韩雪晴', gender: '女', ethnicity: '汉族', hometown: '天津和平', birthplace: '天津和平', idCard: '120101199212044826', school: '天津市耀华中学', subject: '历史' },
  { id: 'teacher020', name: '许承泽', gender: '男', ethnicity: '汉族', hometown: '陕西西安', birthplace: '陕西西安', idCard: '610104198503176419', school: '西安市铁一中', subject: '地理' },
  { id: 'teacher021', name: '何诗妍', gender: '女', ethnicity: '汉族', hometown: '云南昆明', birthplace: '云南昆明', idCard: '530103199408304229', school: '云南师大附中', subject: '生物' },
  { id: 'teacher022', name: '罗泽楷', gender: '男', ethnicity: '汉族', hometown: '吉林长春', birthplace: '吉林长春', idCard: '220103198610146312', school: '长春市实验中学', subject: '政治' },
  { id: 'teacher023', name: '唐可欣', gender: '女', ethnicity: '汉族', hometown: '黑龙江哈尔滨', birthplace: '黑龙江哈尔滨', idCard: '230103199309055044', school: '哈尔滨市第三中学', subject: '英语' },
  { id: 'teacher024', name: '朱彦霖', gender: '男', ethnicity: '汉族', hometown: '山西太原', birthplace: '山西太原', idCard: '140105198407284015', school: '太原市第五中学', subject: '数学' }
]

const relatives = ['配偶', '父亲', '母亲', '兄长', '姐姐']
const politicalTypes = ['中共党员', '中共预备党员', '群众', '共青团员']
const workStatus = ['在岗', '借调', '挂职']
const joinWays = ['公开招聘', '人才引进', '调任']
const relationTypes = ['事业编制', '劳动合同', '劳务派遣']
const adminRanks = ['科员', '副科', '正科', '副处']
const techLevels = ['十级', '九级', '八级', '七级']
const techTitles = ['中学一级教师', '中学高级教师', '正高级教师']
const seriesList = ['中学教师系列', '教育管理系列']
const qualificationKinds = ['高级工', '技师', '高级技师']
const qualificationNames = ['电工证', '网络管理员证', '设备运维证']
const semesterList = ['第一学期', '第二学期']
const gradeBands = ['小学', '初中', '高中']
const classList = ['一班', '二班', '三班', '四班', '五班']
const trainingWays = ['集中面授', '线上研修', '校本培训']
const countries = ['新加坡', '英国', '日本', '澳大利亚']
const awardLevels = ['校级', '区级', '市级', '省级']
const patentTypes = ['发明专利', '实用新型', '软件著作权']
const projectLevels = ['校级课题', '区级课题', '市级课题', '省级课题']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function dateBy(seedIdx: number, offset: number): string {
  const year = 2004 + ((seedIdx + offset) % 19)
  const month = 1 + ((seedIdx * 3 + offset) % 12)
  const day = 5 + ((seedIdx * 5 + offset) % 22)
  return `${year}-${pad(month)}-${pad(day)}`
}

function academicYear(seedIdx: number): string {
  const start = 2018 + (seedIdx % 7)
  return `${start}-${start + 1}`
}

function safePick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]
}

function textByField(field: string, seed: TeacherSeed, seedIdx: number, menuId: number): string {
  if (field === '姓名') return menuId === 1 ? seed.name : `${safePick(['王', '李', '赵', '刘', '陈'], seedIdx)}${safePick(['明', '芳', '磊', '静', '博'], seedIdx + menuId)}`
  if (field === '曾用名') return `${seed.name.slice(0, 1)}${safePick(['文', '雨', '海', '宁'], seedIdx)}${seed.name.slice(-1)}`
  if (field === '性别') return seed.gender
  if (field === '民族') return seed.ethnicity
  if (field === '籍贯') return seed.hometown
  if (field === '出生地') return seed.birthplace
  if (field === '身份证') return seed.idCard
  if (field === '称谓') return safePick(relatives, seedIdx + menuId)
  if (field === '政治面貌') return safePick(politicalTypes, seedIdx + menuId)
  if (field.includes('加入时间')) return dateBy(seedIdx, 2)
  if (field.includes('转正时间')) return dateBy(seedIdx, 3)
  if (field.includes('加入组织名称')) return '中国共产党' + safePick(['南京市教育系统委员会', '苏州市教育局委员会', '杭州市教育局委员会'], seedIdx)
  if (field.includes('现组织关系名称')) return safePick(['市教育局直属党委', '区教育工委', '学校党总支'], seedIdx)
  if (field === '介绍人') return safePick(['周建华', '刘晨曦', '沈珂'], seedIdx)
  if (field === '其他党派及职务') return seedIdx % 4 === 0 ? '无' : '民进会员'
  if (field.includes('起始时间') || field.includes('开始时间') || field.includes('立项时间') || field.includes('取得时间')) return dateBy(seedIdx, menuId)
  if (field.includes('终止时间') || field.includes('结束时间') || field.includes('结题时间')) return dateBy(seedIdx, menuId + 6)
  if (field.includes('学校名称')) return seed.school
  if (field.includes('院系名称')) return safePick(['教育学院', '文学院', '理学院', '外国语学院'], seedIdx)
  if (field.includes('所学专业')) return safePick(['数学与应用数学', '汉语言文学', '英语', '物理学', '化学'], seedIdx + menuId)
  if (field.includes('学习方式')) return safePick(['全日制', '在职进修'], seedIdx)
  if (field.includes('毕业学历')) return safePick(['本科', '硕士研究生'], seedIdx)
  if (field.includes('学位名称')) return safePick(['教育学学士', '理学学士', '教育硕士'], seedIdx + 1)
  if (field.includes('是否')) return seedIdx % 3 === 0 ? '否' : '是'
  if (field.includes('单位规范全称') || field.includes('任职单位规范全称') || field.includes('做出处分单位')) return seed.school
  if (field.includes('工作状态')) return safePick(workStatus, seedIdx)
  if (field.includes('进入单位方式')) return safePick(joinWays, seedIdx)
  if (field.includes('人事劳动关系种类')) return safePick(relationTypes, seedIdx)
  if (field.includes('主要工作岗位') || field.includes('兼任工作岗位') || field.includes('实践岗位') || field.includes('工作岗位')) return safePick(['班主任', '教研组长', '年级主任', '学科教师'], seedIdx + menuId)
  if (field.includes('主要工作专业') || field.includes('兼任工作专业') || field.includes('任教学科') || field.includes('兼任任教学科')) return seed.subject
  if (field.includes('党政职务名称') || field.includes('兼任党政职务名称')) return safePick(['教务主任', '德育主任', '总务主任'], seedIdx)
  if (field.includes('行政级别')) return safePick(adminRanks, seedIdx)
  if (field.includes('岗位级别') || field.includes('岗位等级')) return safePick(techLevels, seedIdx)
  if (field.includes('专业技术职务名称')) return safePick(techTitles, seedIdx)
  if (field.includes('所属系列')) return safePick(seriesList, seedIdx)
  if (field.includes('资格等级')) return safePick(['一级', '二级', '三级'], seedIdx)
  if (field.includes('资格种类')) return safePick(qualificationKinds, seedIdx)
  if (field.includes('资格名称')) return safePick(qualificationNames, seedIdx)
  if (field.includes('首次聘任单位') || field.includes('最后聘期聘任单位') || field.includes('培训机构名称') || field.includes('研修机构名称') || field.includes('组织单位名称') || field.includes('举办部门') || field.includes('评奖发证部门') || field.includes('评奖部门') || field.includes('课题主管部门')) return safePick(['市教师发展中心', '区教育学院', '市教研院', '省教育厅'], seedIdx)
  if (field.includes('累计聘任年限')) return `${10 + (seedIdx % 14)}年`
  if (field === '学年' || field === '年度信息') return academicYear(seedIdx)
  if (field === '学期') return safePick(semesterList, seedIdx)
  if (field.includes('任教学段') || field.includes('班级学段') || field.includes('兼任任教学段')) return safePick(gradeBands, seedIdx)
  if (field.includes('任教班级') || field === '班级') return `${safePick(gradeBands, seedIdx)}${safePick(classList, seedIdx + menuId)}`
  if (field.includes('班级数')) return String(2 + (seedIdx % 3))
  if (field.includes('周课时')) return String(10 + (seedIdx % 10))
  if (field.includes('学生人数')) return String(35 + ((seedIdx + menuId) % 18))
  if (field === '本学期周课时量') return String(12 + (seedIdx % 8))
  if (field === '学段及任教年级') return `${safePick(gradeBands, seedIdx)}${(seedIdx % 3) + 1}年级`
  if (field === '任课教程') return `${seed.subject}教学设计与实践`
  if (field === '教材版本') return safePick(['人教版', '苏教版', '北师大版'], seedIdx)
  if (field === '备课形式') return safePick(['集体备课', '个人备课', '线上协同'], seedIdx)
  if (field === '学校备课本检查结果') return safePick(['优秀', '良好', '合格'], seedIdx)
  if (field === '备注') return safePick(['班风稳定，学业进步明显', '家校沟通积极，纪律良好', '心理辅导跟进及时'], seedIdx)
  if (field === '社团及第二课堂名称') return safePick(['机器人社团', '英语戏剧社', '科学探究营', '校园合唱团'], seedIdx)
  if (field === '每周活动次数') return String(1 + (seedIdx % 3))
  if (field === '社团活动成果') return safePick(['市级展示优秀', '区级评比二等奖', '校级品牌项目'], seedIdx)
  if (field === '考核单位') return safePick(['学校办公室', '区教育局', '市教育局'], seedIdx)
  if (field === '考核结果') return safePick(['优秀', '合格', '良好'], seedIdx)
  if (field === '原因') return safePick(['年度教学质量突出', '班级管理成效明显', '教研贡献突出'], seedIdx)
  if (field === '处分类别') return safePick(['通报批评', '警告'], seedIdx)
  if (field === '处分原因') return safePick(['教学资料上报不及时', '教研活动缺席'], seedIdx)
  if (field === '时间' || field === '交流日期' || field === '获奖时间' || field === '正式发表时间' || field === '正式出版时间' || field === '批准日期') return dateBy(seedIdx, menuId + 2)
  if (field === '是否撤销') return seedIdx % 2 === 0 ? '是' : '否'
  if (field === '撤销日期') return seedIdx % 2 === 0 ? dateBy(seedIdx, menuId + 7) : ''
  if (field === '培训项目名称') return safePick(['新课标深度解读', '学科核心素养提升', '课堂评价改革实践'], seedIdx)
  if (field === '培训方式') return safePick(trainingWays, seedIdx)
  if (field === '培训学时' || field === '研修学时') return String(24 + (seedIdx % 36))
  if (field === '获得学分') return String(2 + (seedIdx % 6))
  if (field === '国家') return safePick(countries, seedIdx)
  if (field === '项目名称') return safePick(['STEM课堂观察项目', '国际课程研修项目', '教育管理访学项目'], seedIdx)
  if (field === '开课类型') return safePick(['公开课', '名师开放课', '城乡交流课'], seedIdx)
  if (field === '开课地点') return safePick(['本校录播教室', '区教师发展中心', '合作学校'], seedIdx)
  if (field === '开课年级') return `${safePick(gradeBands, seedIdx)}${(seedIdx % 3) + 1}年级`
  if (field === '开课课题') return `${seed.subject}核心素养导向课堂`
  if (field === '发证部门') return safePick(['区教育局', '市教研院', '省教育厅'], seedIdx)
  if (field === '会议名称') return safePick(['区域教研年会', '课堂改革论坛', '学科教学研讨会'], seedIdx)
  if (field === '交流发言题目') return `${seed.subject}课堂中的任务驱动实践`
  if (field === '奖项名称') return safePick(['教学能手', '优质课一等奖', '课程创新奖', '班主任育人奖'], seedIdx + menuId)
  if (field === '奖项级别') return safePick(awardLevels, seedIdx)
  if (field === '论文标题') return `${seed.subject}学科教学评价改进研究`
  if (field === '科学领域' || field === '学科领域') return seed.subject
  if (field === '颁奖单位') return safePick(['中国教育学会', '省教育学会', '市教育局'], seedIdx)
  if (field === '获奖等级') return safePick(['一等奖', '二等奖', '三等奖'], seedIdx)
  if (field === '论文字数') return `${6500 + seedIdx * 120}`
  if (field === '作者数量及位次' || field === '获奖人数及位次' || field === '本人角色及次位') return `3人/第${(seedIdx % 3) + 1}作者`
  if (field === '影响因子') return (1.2 + (seedIdx % 9) * 0.2).toFixed(1)
  if (field === '刊物名称') return safePick(['基础教育研究', '中学教学参考', '课程与教学'], seedIdx)
  if (field === '全国统一刊号CN') return `CN11-${6000 + seedIdx}/G4`
  if (field === '关键词及描述') return `${seed.subject}, 课堂评价, 单元教学`
  if (field === '著作名称') return `${seed.subject}课堂教学案例集`
  if (field === '本人位次') return `第${(seedIdx % 3) + 1}作者`
  if (field === '本人参与部分字数') return `${35000 + seedIdx * 800}`
  if (field === 'ISBN') return `978-7-121-${80000 + seedIdx}-${(seedIdx % 9) + 1}`
  if (field === 'CIP') return `CIP${2023 + (seedIdx % 3)}-${3200 + seedIdx}`
  if (field === '出版社名称') return safePick(['教育科学出版社', '华东师大出版社', '人民教育出版社'], seedIdx)
  if (field === '著作描述') return '聚焦课堂改革案例，形成可复制教学路径。'
  if (field === '类型') return safePick(patentTypes, seedIdx)
  if (field === '名称') return `${seed.subject}教学资源管理系统`
  if (field === '专利号') return `ZL2023${pad(seedIdx + 1)}${100000 + seedIdx}`
  if (field === '获奖项目名称') return `${seed.subject}学科融合创新项目`
  if (field === '成果描述') return '形成校本课程成果并在区域推广。'
  if (field === '课题名称') return `${seed.subject}学科核心素养培育策略研究`
  if (field === '课题级别') return safePick(projectLevels, seedIdx)
  if (field === '幼儿园') return String(seedIdx % 2)
  if (field === '小学') return String(2 + (seedIdx % 6))
  if (field === '初中') return String(4 + (seedIdx % 8))
  if (field === '高中') return String(3 + (seedIdx % 9))
  if (field === '职业学校') return String(seedIdx % 3)
  if (field === '高校') return String(seedIdx % 2)
  if (field === '合计') return String(12 + (seedIdx % 14))
  if (field === '企业名称') return safePick(['华为技术有限公司', '科大讯飞股份有限公司', '中兴通讯股份有限公司'], seedIdx)
  if (field === '企业联系人') return safePick(['杨海涛', '宋明哲', '何嘉怡'], seedIdx)
  if (field === '联系人职务') return safePick(['培训经理', '项目主管', '人力资源经理'], seedIdx)
  if (field === '联系电话') return `1380000${String(1000 + seedIdx).slice(-4)}`
  if (field === '实践时间') return `${dateBy(seedIdx, 1)} 至 ${dateBy(seedIdx, 2)}`
  if (field === '实践内容') return '参与企业项目观摩、课程共建及技术培训。'
  if (field === '企业考核意见') return safePick(['表现优秀', '表现良好', '达到预期'], seedIdx)
  if (field === '支教单位') return safePick(['新疆喀什第二中学', '青海玉树州民族中学', '贵州毕节实验学校'], seedIdx)
  if (field === '工作内容') return '承担学科教学、青年教师指导及课程建设工作。'
  if (field === '单位评价') return safePick(['评价优秀', '评价良好', '评价合格'], seedIdx)
  if (field === '证明人') return safePick(['李建国', '王丽华', '陈晓宇'], seedIdx)
  if (field === '军转干部标识') return seedIdx % 8 === 0 ? '是' : '否'
  if (field === '转业时间') return seedIdx % 8 === 0 ? dateBy(seedIdx, 4) : ''
  if (field === '现单位待遇职级') return seedIdx % 8 === 0 ? safePick(['专技十级', '专技九级'], seedIdx) : '不适用'
  if (field === '工作单位') return seed.school
  if (field === '职务/岗位') return safePick(['教师', '教研组长', '年级组长'], seedIdx)
  return `${seed.subject}${field}${seedIdx + 1}`
}

function createEmptyRecord(menu: TeacherPlatformMenu): Record<string, string> {
  return menu.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field] = ''
    return acc
  }, {})
}

function createMockRecord(menu: TeacherPlatformMenu, seed: TeacherSeed, seedIdx: number): Record<string, string> {
  return menu.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field] = textByField(field, seed, seedIdx, menu.id)
    return acc
  }, {})
}

function createTeacherForms(seed: TeacherSeed, seedIdx: number): Record<number, TeacherFormEntry[]> {
  return teacherPlatformMenus.reduce<Record<number, TeacherFormEntry[]>>((acc, menu) => {
    acc[menu.id] = [{ values: createMockRecord(menu, seed, seedIdx), locked: true }]
    return acc
  }, {})
}

export const teacherPlatformState = reactive<{ teachers: TeacherProfile[] }>({
  teachers: teacherSeeds.map((seed, index) => ({
    id: seed.id,
    name: seed.name,
    forms: createTeacherForms(seed, index)
  }))
})

export function findTeacherById(teacherId: string): TeacherProfile | undefined {
  return teacherPlatformState.teachers.find((item) => item.id === teacherId)
}

export function ensureTeacherForms(teacher: TeacherProfile): void {
  for (const menu of teacherPlatformMenus) {
    if (!teacher.forms[menu.id] || teacher.forms[menu.id].length === 0) {
      teacher.forms[menu.id] = [{ values: createEmptyRecord(menu), locked: false }]
    }
  }
}

export function createNextEmptyEntry(menuId: number): TeacherFormEntry {
  const menu = teacherPlatformMenus.find((item) => item.id === menuId)
  if (!menu) return { values: {}, locked: false }
  return { values: createEmptyRecord(menu), locked: false }
}

export function getMenuById(menuId: number): TeacherPlatformMenu {
  return teacherPlatformMenus.find((item) => item.id === menuId) ?? teacherPlatformMenus[0]
}
