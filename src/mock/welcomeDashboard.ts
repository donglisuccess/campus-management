export interface WelcomeHeatPoint {
  name: string
  value: number
  x: number
  y: number
  color: string
}

export interface WelcomeCampusSpot {
  name: string
  category: string
  x: number
  y: number
  status: string
  description: string
}

export interface WelcomeArrivalStudent {
  name: string
  gender: '男' | '女'
  college: string
  major: string
  origin: string
  checkInTime: string
  status: string
}

export interface WelcomeStatItem {
  label: string
  value: number
  unit?: string
  accent: string
}

export interface WelcomeBarItem {
  name: string
  value: number
  accent: string
}

export interface WelcomeHourItem {
  hour: string
  value: number
}

export interface WelcomeGuideStep {
  step: string
  title: string
  location: string
  detail: string
}

export interface WelcomeNotice {
  title: string
  level: '重要' | '通知' | '提醒'
  time: string
  content: string
}

export const WELCOME_SUMMARY_STATS: WelcomeStatItem[] = [
  { label: '今日已报到', value: 3826, unit: '人', accent: '#38bdf8' },
  { label: '总体报到率', value: 91.4, unit: '%', accent: '#f59e0b' },
  { label: '待到寝入住', value: 486, unit: '人', accent: '#fb7185' },
  { label: '绿色通道办理', value: 138, unit: '人', accent: '#34d399' }
]

export const WELCOME_HEAT_POINTS: WelcomeHeatPoint[] = [
  { name: '新疆', value: 82, x: 18, y: 35, color: '#38bdf8' },
  { name: '西藏', value: 46, x: 18, y: 66, color: '#22c55e' },
  { name: '青海', value: 64, x: 28, y: 51, color: '#06b6d4' },
  { name: '甘肃', value: 91, x: 36, y: 38, color: '#14b8a6' },
  { name: '宁夏', value: 52, x: 42, y: 43, color: '#60a5fa' },
  { name: '内蒙古', value: 118, x: 47, y: 21, color: '#818cf8' },
  { name: '黑龙江', value: 78, x: 80, y: 20, color: '#a78bfa' },
  { name: '吉林', value: 83, x: 75, y: 30, color: '#c084fc' },
  { name: '辽宁', value: 106, x: 71, y: 36, color: '#f472b6' },
  { name: '北京', value: 66, x: 63, y: 34, color: '#f59e0b' },
  { name: '天津', value: 58, x: 65, y: 36, color: '#f97316' },
  { name: '河北', value: 134, x: 59, y: 38, color: '#22c55e' },
  { name: '山西', value: 117, x: 52, y: 40, color: '#84cc16' },
  { name: '陕西', value: 142, x: 44, y: 46, color: '#10b981' },
  { name: '山东', value: 301, x: 64, y: 32, color: '#14b8a6' },
  { name: '河南', value: 326, x: 54, y: 46, color: '#22c55e' },
  { name: '江苏', value: 265, x: 72, y: 42, color: '#60a5fa' },
  { name: '上海', value: 89, x: 74, y: 49, color: '#fb7185' },
  { name: '安徽', value: 226, x: 64, y: 48, color: '#ef4444' },
  { name: '湖北', value: 288, x: 57, y: 54, color: '#38bdf8' },
  { name: '浙江', value: 232, x: 76, y: 48, color: '#818cf8' },
  { name: '江西', value: 196, x: 66, y: 62, color: '#2dd4bf' },
  { name: '福建', value: 184, x: 74, y: 66, color: '#8b5cf6' },
  { name: '湖南', value: 245, x: 60, y: 62, color: '#f59e0b' },
  { name: '广东', value: 368, x: 72, y: 76, color: '#fb7185' },
  { name: '广西', value: 214, x: 63, y: 76, color: '#f97316' },
  { name: '海南', value: 74, x: 69, y: 90, color: '#f97316' },
  { name: '四川', value: 276, x: 34, y: 58, color: '#f43f5e' },
  { name: '重庆', value: 158, x: 42, y: 58, color: '#eab308' },
  { name: '贵州', value: 172, x: 44, y: 70, color: '#06b6d4' },
  { name: '云南', value: 148, x: 30, y: 78, color: '#10b981' },
  { name: '台湾', value: 96, x: 82, y: 73, color: '#a78bfa' },
  { name: '香港', value: 51, x: 73, y: 82, color: '#fb7185' },
  { name: '澳门', value: 38, x: 71, y: 83, color: '#f59e0b' }
]

export const WELCOME_CAMPUS_SPOTS: WelcomeCampusSpot[] = [
  { name: '南门迎新主入口', category: '校门', x: 14, y: 70, status: '高峰', description: '人流密集，已开启 6 条迎新通道。' },
  { name: '图文信息中心', category: '报到点', x: 32, y: 48, status: '正常', description: '集中办理身份核验、校园卡激活。' },
  { name: '体育馆综合服务区', category: '服务点', x: 48, y: 58, status: '繁忙', description: '军训服装发放、绿色通道与医保咨询。' },
  { name: '一食堂补给站', category: '生活区', x: 63, y: 46, status: '正常', description: '家长休息、矿泉水与志愿者引导。' },
  { name: '兰苑 1-4 栋', category: '宿舍区', x: 78, y: 28, status: '接近满载', description: '女生宿舍办理入住，建议错峰前往。' },
  { name: '竹苑 5-8 栋', category: '宿舍区', x: 76, y: 68, status: '正常', description: '男生宿舍入住办理点。' },
  { name: '学生活动中心', category: '报到点', x: 50, y: 28, status: '正常', description: '二级学院专业咨询和家长接待。' }
]

export const WELCOME_LATEST_STUDENTS: WelcomeArrivalStudent[] = [
  { name: '李俊豪', gender: '男', college: '智能制造学院', major: '机电一体化技术', origin: '河南郑州', checkInTime: '15:26', status: '已完成寝室入住' },
  { name: '周雨桐', gender: '女', college: '医护学院', major: '护理', origin: '湖南长沙', checkInTime: '15:24', status: '正在办理校园卡' },
  { name: '陈思远', gender: '男', college: '电子工程学院', major: '应用电子技术', origin: '广东佛山', checkInTime: '15:22', status: '已完成报到' },
  { name: '王可欣', gender: '女', college: '经济管理学院', major: '大数据与会计', origin: '江西南昌', checkInTime: '15:21', status: '已领取军训物资' },
  { name: '黄子辰', gender: '男', college: '汽车工程学院', major: '新能源汽车技术', origin: '广西南宁', checkInTime: '15:18', status: '宿舍分配中' },
  { name: '林嘉怡', gender: '女', college: '信息工程学院', major: '软件技术', origin: '福建泉州', checkInTime: '15:16', status: '已完成报到' },
  { name: '赵文博', gender: '男', college: '建筑工程学院', major: '工程造价', origin: '湖北武汉', checkInTime: '15:14', status: '正在办理宿舍入住' },
  { name: '许诺然', gender: '女', college: '医护学院', major: '助产', origin: '四川绵阳', checkInTime: '15:12', status: '已完成报到' },
  { name: '郭嘉铭', gender: '男', college: '信息工程学院', major: '大数据技术', origin: '山东济南', checkInTime: '15:10', status: '等待学院核验' },
  { name: '彭思琪', gender: '女', college: '经济管理学院', major: '电子商务', origin: '广东东莞', checkInTime: '15:09', status: '已完成寝室入住' },
  { name: '唐宇航', gender: '男', college: '电子工程学院', major: '物联网应用技术', origin: '安徽合肥', checkInTime: '15:07', status: '正在办理校园卡' },
  { name: '曹佳宁', gender: '女', college: '汽车工程学院', major: '智能网联汽车技术', origin: '江苏盐城', checkInTime: '15:05', status: '已领取军训物资' },
  { name: '邓启明', gender: '男', college: '智能制造学院', major: '工业机器人技术', origin: '重庆', checkInTime: '15:03', status: '已完成报到' },
  { name: '宋婉清', gender: '女', college: '建筑工程学院', major: '建筑室内设计', origin: '浙江温州', checkInTime: '15:01', status: '宿舍分配中' },
  { name: '冯泽楷', gender: '男', college: '信息工程学院', major: '云计算技术应用', origin: '河北石家庄', checkInTime: '14:58', status: '已完成寝室入住' },
  { name: '梁舒雅', gender: '女', college: '医护学院', major: '康复治疗技术', origin: '广西桂林', checkInTime: '14:56', status: '正在办理校园卡' },
  { name: '韩睿哲', gender: '男', college: '电子工程学院', major: '现代通信技术', origin: '陕西西安', checkInTime: '14:54', status: '已完成报到' },
  { name: '莫欣妍', gender: '女', college: '经济管理学院', major: '市场营销', origin: '云南昆明', checkInTime: '14:52', status: '等待学院核验' },
  { name: '吕承泽', gender: '男', college: '汽车工程学院', major: '汽车检测与维修技术', origin: '河南洛阳', checkInTime: '14:50', status: '已领取军训物资' },
  { name: '沈若溪', gender: '女', college: '智能制造学院', major: '数控技术', origin: '江西九江', checkInTime: '14:48', status: '已完成报到' }
]

export const WELCOME_CHECKIN_PROGRESS: WelcomeBarItem[] = [
  { name: '应到新生', value: 4186, accent: '#38bdf8' },
  { name: '已报到', value: 3826, accent: '#22c55e' },
  { name: '在途未到', value: 248, accent: '#f59e0b' },
  { name: '请假缓到', value: 112, accent: '#fb7185' }
]

export const WELCOME_COLLEGE_STATS: WelcomeBarItem[] = [
  { name: '智能制造学院', value: 768, accent: '#38bdf8' },
  { name: '电子工程学院', value: 624, accent: '#2dd4bf' },
  { name: '汽车工程学院', value: 538, accent: '#f59e0b' },
  { name: '医护学院', value: 812, accent: '#fb7185' },
  { name: '信息工程学院', value: 582, accent: '#818cf8' },
  { name: '经济管理学院', value: 502, accent: '#34d399' }
]

export const WELCOME_ORIGIN_STATS: WelcomeBarItem[] = [
  { name: '广东', value: 368, accent: '#fb7185' },
  { name: '河南', value: 326, accent: '#22c55e' },
  { name: '山东', value: 301, accent: '#14b8a6' },
  { name: '湖北', value: 288, accent: '#38bdf8' },
  { name: '四川', value: 276, accent: '#f43f5e' },
  { name: '江苏', value: 265, accent: '#60a5fa' }
]

export const WELCOME_GENDER_RATIO = {
  male: 2218,
  female: 1968
}

export const WELCOME_HOUR_STATS: WelcomeHourItem[] = [
  { hour: '08:00', value: 166 },
  { hour: '09:00', value: 284 },
  { hour: '10:00', value: 412 },
  { hour: '11:00', value: 508 },
  { hour: '12:00', value: 332 },
  { hour: '13:00', value: 418 },
  { hour: '14:00', value: 546 },
  { hour: '15:00', value: 618 }
]

export const WELCOME_GUIDE_STEPS: WelcomeGuideStep[] = [
  { step: '01', title: '校门核验', location: '南门迎新主入口', detail: '出示录取通知书与身份证，完成入校核验与分流。' },
  { step: '02', title: '学院报到', location: '图文信息中心 / 学生活动中心', detail: '确认专业班级、辅导员信息，领取新生资料袋。' },
  { step: '03', title: '缴费注册', location: '体育馆综合服务区', detail: '办理学费确认、绿色通道、校园卡激活与医保登记。' },
  { step: '04', title: '宿舍入住', location: '兰苑 / 竹苑宿舍区', detail: '领取钥匙和入住单，完成寝室登记与物资领取。' },
  { step: '05', title: '入学准备', location: '操场集合区', detail: '查看军训编排、班级群二维码与校园生活服务指南。' }
]

export const WELCOME_NOTICES: WelcomeNotice[] = [
  {
    title: '15:30 后南门车辆分流调整',
    level: '重要',
    time: '15:08',
    content: '家长车辆请由东侧临时停车区离场，校内摆渡车持续运行。'
  },
  {
    title: '医护学院报到点转移至学生活动中心 A 区',
    level: '通知',
    time: '14:46',
    content: '原体育馆 2 号通道改为绿色通道专用窗口。'
  },
  {
    title: '兰苑 3 栋宿舍入住接近饱和',
    level: '提醒',
    time: '14:20',
    content: '后续女生宿舍入住将优先引导至兰苑 4 栋与梅苑临时宿舍。'
  }
]