export type LabMenuId =
  | 'user-permission'
  | 'lab-archive'
  | 'device-assets'
  | 'consumable-stock'
  | 'approval-center'
  | 'report-center'
  | 'operation-logs'

export type LabManagerMenuId =
  | 'reservation-manage'
  | 'schedule-query'
  | 'access-records'
  | 'inspection-tasks'
  | 'usage-analysis'

export type LabDeviceManagerMenuId =
  | 'device-ledger'
  | 'maintenance-orders'
  | 'borrow-audit'
  | 'inventory-check'
  | 'scrap-donation'

export interface LabSelectOption {
  label: string
  value: string
}

export interface LabFilterField {
  key: string
  label: string
  type: 'input' | 'select' | 'date'
  placeholder?: string
  options?: LabSelectOption[]
}

export interface LabTableColumn {
  prop: string
  label: string
  minWidth?: number
}

export interface LabMenuConfig {
  id: LabMenuId
  group: string
  title: string
  description: string
  filters: LabFilterField[]
  columns: LabTableColumn[]
}

export interface LabStatCard {
  label: string
  value: string
}

export const LAB_SYSTEM_ADMIN_MENUS: LabMenuConfig[] = [
  {
    id: 'user-permission',
    group: '平台治理',
    title: '用户与权限管理',
    description: '维护平台账号、角色、归属部门与数据权限范围。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索账号、姓名、手机号' },
      {
        key: 'role',
        label: '角色',
        type: 'select',
        options: [
          { label: '系统管理员', value: '系统管理员' },
          { label: '实验室管理员', value: '实验室管理员' },
          { label: '设备管理员', value: '设备管理员' },
          { label: '易耗品管理员', value: '易耗品管理员' },
          { label: '审核负责人', value: '审核负责人' },
          { label: '教师', value: '教师' },
          { label: '学生', value: '学生' }
        ]
      },
      {
        key: 'department',
        label: '所属部门',
        type: 'select',
        options: [
          { label: '信息中心', value: '信息中心' },
          { label: '智能制造学院', value: '智能制造学院' },
          { label: '电子工程学院', value: '电子工程学院' },
          { label: '汽车工程学院', value: '汽车工程学院' },
          { label: '医护学院', value: '医护学院' },
          { label: '教务处', value: '教务处' }
        ]
      },
      {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
          { label: '启用', value: '启用' },
          { label: '停用', value: '停用' },
          { label: '锁定', value: '锁定' }
        ]
      }
    ],
    columns: [
      { prop: 'account', label: '账号', minWidth: 130 },
      { prop: 'name', label: '姓名', minWidth: 120 },
      { prop: 'role', label: '角色', minWidth: 120 },
      { prop: 'department', label: '所属部门', minWidth: 140 },
      { prop: 'phone', label: '手机号', minWidth: 140 },
      { prop: 'scope', label: '数据权限', minWidth: 180 },
      { prop: 'status', label: '账号状态', minWidth: 110 },
      { prop: 'lastLogin', label: '最近登录时间', minWidth: 180 }
    ]
  },
  {
    id: 'lab-archive',
    group: '资源中心',
    title: '实验室基础档案',
    description: '统一查看教学楼、实训室、门禁与责任人基础信息。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索实训室名称、编号、负责人' },
      {
        key: 'campus',
        label: '校区',
        type: 'select',
        options: [
          { label: '主校区', value: '主校区' },
          { label: '产教融合园', value: '产教融合园' },
          { label: '医护实训中心', value: '医护实训中心' }
        ]
      },
      {
        key: 'labType',
        label: '实验室类型',
        type: 'select',
        options: [
          { label: '电子实训室', value: '电子实训室' },
          { label: '智能制造实训室', value: '智能制造实训室' },
          { label: '护理技能实训室', value: '护理技能实训室' },
          { label: '汽车检修实训室', value: '汽车检修实训室' }
        ]
      },
      {
        key: 'status',
        label: '使用状态',
        type: 'select',
        options: [
          { label: '开放中', value: '开放中' },
          { label: '维护中', value: '维护中' },
          { label: '停用', value: '停用' }
        ]
      }
    ],
    columns: [
      { prop: 'labCode', label: '实训室编号', minWidth: 130 },
      { prop: 'labName', label: '实训室名称', minWidth: 180 },
      { prop: 'campus', label: '校区', minWidth: 120 },
      { prop: 'building', label: '教学楼', minWidth: 120 },
      { prop: 'roomNo', label: '房间号', minWidth: 100 },
      { prop: 'labType', label: '类型', minWidth: 150 },
      { prop: 'manager', label: '负责人', minWidth: 120 },
      { prop: 'capacity', label: '工位数', minWidth: 100 },
      { prop: 'doorAccess', label: '门禁编号', minWidth: 120 },
      { prop: 'status', label: '状态', minWidth: 100 },
      { prop: 'updatedAt', label: '更新时间', minWidth: 170 }
    ]
  },
  {
    id: 'device-assets',
    group: '资源中心',
    title: '设备资产台账',
    description: '展示设备采购、归属实训室、状态与责任人等资产信息。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索设备名称、资产编号、品牌型号' },
      {
        key: 'category',
        label: '设备类别',
        type: 'select',
        options: [
          { label: '数控设备', value: '数控设备' },
          { label: '电子测试设备', value: '电子测试设备' },
          { label: '护理实训设备', value: '护理实训设备' },
          { label: '汽车诊断设备', value: '汽车诊断设备' }
        ]
      },
      {
        key: 'status',
        label: '资产状态',
        type: 'select',
        options: [
          { label: '在用', value: '在用' },
          { label: '待维修', value: '待维修' },
          { label: '封存', value: '封存' },
          { label: '报废审批中', value: '报废审批中' }
        ]
      },
      {
        key: 'labName',
        label: '所属实训室',
        type: 'select',
        options: [
          { label: '智能制造产线实训室', value: '智能制造产线实训室' },
          { label: '电子焊接实训室', value: '电子焊接实训室' },
          { label: '护理综合实训室', value: '护理综合实训室' },
          { label: '新能源汽车检修中心', value: '新能源汽车检修中心' }
        ]
      }
    ],
    columns: [
      { prop: 'assetCode', label: '资产编号', minWidth: 140 },
      { prop: 'deviceName', label: '设备名称', minWidth: 180 },
      { prop: 'category', label: '设备类别', minWidth: 140 },
      { prop: 'brand', label: '品牌', minWidth: 120 },
      { prop: 'model', label: '型号', minWidth: 150 },
      { prop: 'labName', label: '所属实训室', minWidth: 180 },
      { prop: 'purchaseDate', label: '采购日期', minWidth: 120 },
      { prop: 'originalValue', label: '原值(元)', minWidth: 120 },
      { prop: 'keeper', label: '保管人', minWidth: 110 },
      { prop: 'status', label: '资产状态', minWidth: 110 }
    ]
  },
  {
    id: 'consumable-stock',
    group: '资源中心',
    title: '易耗品库存台账',
    description: '查看易耗品库存、预警阈值、危险属性与库位分布。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索耗材编码、名称、规格' },
      {
        key: 'category',
        label: '耗材分类',
        type: 'select',
        options: [
          { label: '电子元件', value: '电子元件' },
          { label: '焊接辅料', value: '焊接辅料' },
          { label: '护理耗材', value: '护理耗材' },
          { label: '汽车保养耗材', value: '汽车保养耗材' }
        ]
      },
      {
        key: 'hazardLevel',
        label: '危险属性',
        type: 'select',
        options: [
          { label: '普通', value: '普通' },
          { label: '低风险', value: '低风险' },
          { label: '危险品', value: '危险品' }
        ]
      },
      {
        key: 'stockStatus',
        label: '库存状态',
        type: 'select',
        options: [
          { label: '充足', value: '充足' },
          { label: '预警', value: '预警' },
          { label: '紧缺', value: '紧缺' }
        ]
      }
    ],
    columns: [
      { prop: 'sku', label: '耗材编码', minWidth: 140 },
      { prop: 'name', label: '耗材名称', minWidth: 180 },
      { prop: 'category', label: '分类', minWidth: 140 },
      { prop: 'spec', label: '规格型号', minWidth: 160 },
      { prop: 'warehouse', label: '库房', minWidth: 140 },
      { prop: 'hazardLevel', label: '危险属性', minWidth: 110 },
      { prop: 'stock', label: '当前库存', minWidth: 100 },
      { prop: 'safeStock', label: '安全库存', minWidth: 100 },
      { prop: 'stockStatus', label: '库存状态', minWidth: 110 },
      { prop: 'manager', label: '库管员', minWidth: 110 },
      { prop: 'lastInbound', label: '最近入库时间', minWidth: 150 }
    ]
  },
  {
    id: 'approval-center',
    group: '流程监管',
    title: '审批流程监控',
    description: '统一跟踪设备借用、易耗品领用、危险品审核与预约审批。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索单号、申请人、资源名称' },
      {
        key: 'bizType',
        label: '流程类型',
        type: 'select',
        options: [
          { label: '实验室预约', value: '实验室预约' },
          { label: '设备借用', value: '设备借用' },
          { label: '易耗品申领', value: '易耗品申领' },
          { label: '危险品领用', value: '危险品领用' }
        ]
      },
      {
        key: 'status',
        label: '审批状态',
        type: 'select',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '审批中', value: '审批中' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' }
        ]
      },
      { key: 'applyDate', label: '申请日期', type: 'date' }
    ],
    columns: [
      { prop: 'orderNo', label: '流程单号', minWidth: 150 },
      { prop: 'bizType', label: '流程类型', minWidth: 130 },
      { prop: 'applicant', label: '申请人', minWidth: 110 },
      { prop: 'applicantRole', label: '申请角色', minWidth: 120 },
      { prop: 'targetResource', label: '申请资源', minWidth: 190 },
      { prop: 'applyTime', label: '申请时间', minWidth: 170 },
      { prop: 'status', label: '审批状态', minWidth: 110 },
      { prop: 'currentNode', label: '当前节点', minWidth: 130 },
      { prop: 'approver', label: '当前审批人', minWidth: 120 }
    ]
  },
  {
    id: 'report-center',
    group: '统计上报',
    title: '数据上报中心',
    description: '展示智慧校园建设相关统计报表生成、审核与上报状态。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索报表编号、名称、部门' },
      {
        key: 'reportType',
        label: '报表类型',
        type: 'select',
        options: [
          { label: '实训基地建设统计', value: '实训基地建设统计' },
          { label: '设备资产月报', value: '设备资产月报' },
          { label: '易耗品使用月报', value: '易耗品使用月报' },
          { label: '实验室使用率分析', value: '实验室使用率分析' }
        ]
      },
      {
        key: 'status',
        label: '上报状态',
        type: 'select',
        options: [
          { label: '待提交', value: '待提交' },
          { label: '审核中', value: '审核中' },
          { label: '已上报', value: '已上报' },
          { label: '退回修改', value: '退回修改' }
        ]
      },
      {
        key: 'term',
        label: '统计周期',
        type: 'select',
        options: [
          { label: '2025-2026学年上学期', value: '2025-2026学年上学期' },
          { label: '2025-2026学年下学期', value: '2025-2026学年下学期' },
          { label: '2026年2月', value: '2026年2月' },
          { label: '2026年3月', value: '2026年3月' }
        ]
      }
    ],
    columns: [
      { prop: 'reportNo', label: '报表编号', minWidth: 140 },
      { prop: 'reportName', label: '报表名称', minWidth: 220 },
      { prop: 'reportType', label: '报表类型', minWidth: 170 },
      { prop: 'term', label: '统计周期', minWidth: 150 },
      { prop: 'submitDept', label: '填报部门', minWidth: 140 },
      { prop: 'recordCount', label: '数据量', minWidth: 100 },
      { prop: 'status', label: '上报状态', minWidth: 110 },
      { prop: 'submittedAt', label: '提交时间', minWidth: 170 },
      { prop: 'reviewer', label: '审核人', minWidth: 120 }
    ]
  },
  {
    id: 'operation-logs',
    group: '平台治理',
    title: '操作日志审计',
    description: '记录各角色在系统中的关键操作、结果与来源终端信息。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索操作人、对象、IP地址' },
      {
        key: 'module',
        label: '业务模块',
        type: 'select',
        options: [
          { label: '用户权限', value: '用户权限' },
          { label: '实验室档案', value: '实验室档案' },
          { label: '设备资产', value: '设备资产' },
          { label: '易耗品库存', value: '易耗品库存' },
          { label: '审批中心', value: '审批中心' },
          { label: '数据上报', value: '数据上报' }
        ]
      },
      {
        key: 'result',
        label: '执行结果',
        type: 'select',
        options: [
          { label: '成功', value: '成功' },
          { label: '失败', value: '失败' },
          { label: '预警', value: '预警' }
        ]
      },
      { key: 'operateDate', label: '操作日期', type: 'date' }
    ],
    columns: [
      { prop: 'logId', label: '日志编号', minWidth: 140 },
      { prop: 'operatorName', label: '操作人', minWidth: 120 },
      { prop: 'role', label: '角色', minWidth: 120 },
      { prop: 'module', label: '业务模块', minWidth: 120 },
      { prop: 'operationType', label: '操作类型', minWidth: 130 },
      { prop: 'target', label: '操作对象', minWidth: 180 },
      { prop: 'result', label: '执行结果', minWidth: 100 },
      { prop: 'ip', label: '来源IP', minWidth: 130 },
      { prop: 'operateTime', label: '操作时间', minWidth: 180 }
    ]
  }
]

const pick = <T>(list: T[], index: number) => list[index % list.length]

const pad = (value: number, size = 2) => String(value).padStart(size, '0')

const makeDate = (month: number, day: number, hour: number, minute: number) => {
  return `2026-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}`
}

const buildings = [
  { campus: '主校区', building: '实训楼A', rooms: ['A201', 'A203', 'A305', 'A402'] },
  { campus: '主校区', building: '实训楼B', rooms: ['B101', 'B205', 'B306', 'B408'] },
  { campus: '产教融合园', building: '产教楼1', rooms: ['101', '203', '305', '402'] },
  { campus: '医护实训中心', building: '护理楼', rooms: ['N201', 'N302', 'N405', 'N501'] }
]

const labTemplates = [
  { type: '智能制造实训室', prefix: '智能制造产线', managers: ['赵工', '顾工', '蒋老师'] },
  { type: '电子实训室', prefix: '电子焊接', managers: ['陈老师', '叶老师', '袁老师'] },
  { type: '护理技能实训室', prefix: '护理综合', managers: ['李老师', '宋老师', '冯老师'] },
  { type: '汽车检修实训室', prefix: '新能源汽车检修', managers: ['周老师', '杨老师', '吴老师'] }
]

const userRoles = ['系统管理员', '实验室管理员', '设备管理员', '易耗品管理员', '审核负责人', '教师', '学生']
const departments = ['信息中心', '智能制造学院', '电子工程学院', '汽车工程学院', '医护学院', '教务处']
const accountStatus = ['启用', '启用', '启用', '停用', '锁定']
const scopeOptions = ['全校数据', '本学院数据', '本实验室数据', '本部门审批数据']
const personNames = ['张敏', '李晨', '王琪', '陈涛', '刘颖', '周洁', '吴俊', '黄璐', '徐航', '赵琳', '冯超', '蒋雪']

export const LAB_USER_PERMISSION_ROWS = Array.from({ length: 56 }, (_, index) => {
  const role = pick(userRoles, index)
  const department = role === '系统管理员' ? '信息中心' : pick(departments, index + 1)
  return {
    account: `lab${pad(index + 1, 4)}`,
    name: pick(personNames, index),
    role,
    department,
    phone: `1380000${pad(120 + index, 4)}`,
    scope: role === '系统管理员' ? '全校数据' : pick(scopeOptions, index + 2),
    status: pick(accountStatus, index),
    lastLogin: makeDate((index % 3) + 1, (index % 27) + 1, 8 + (index % 10), (index * 7) % 60)
  }
})

const generatedLabs = Array.from({ length: 40 }, (_, index) => {
  const building = pick(buildings, index)
  const template = pick(labTemplates, index)
  return {
    labCode: `LAB-${2026}${pad(index + 1, 3)}`,
    labName: `${template.prefix}${(index % 4) + 1}室`,
    campus: building.campus,
    building: building.building,
    roomNo: pick(building.rooms, index),
    labType: template.type,
    manager: pick(template.managers, index),
    capacity: 24 + (index % 5) * 8,
    doorAccess: `ACS${pad(300 + index, 4)}`,
    status: pick(['开放中', '开放中', '开放中', '维护中', '停用'], index),
    updatedAt: makeDate((index % 3) + 1, (index % 26) + 2, 9 + (index % 8), (index * 9) % 60)
  }
})

export const LAB_ARCHIVE_ROWS = generatedLabs

const deviceCategories = ['数控设备', '电子测试设备', '护理实训设备', '汽车诊断设备']
const deviceBrands = ['西门子', '华中数控', '安捷伦', '迈瑞', '博世', '元征']
const deviceStatus = ['在用', '在用', '在用', '待维修', '封存', '报废审批中']

export const LAB_DEVICE_ASSET_ROWS = Array.from({ length: 72 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  const category = pick(deviceCategories, index)
  return {
    assetCode: `ZC-${2025}${pad(index + 101, 4)}`,
    deviceName: `${category}${(index % 9) + 1}号机`,
    category,
    brand: pick(deviceBrands, index),
    model: `${pick(['X', 'M', 'Q', 'T'], index)}-${120 + index}`,
    labName: lab.labName,
    purchaseDate: `202${index % 3 + 3}-${pad((index % 12) + 1)}-${pad((index % 26) + 1)}`,
    originalValue: 8000 + index * 1350,
    keeper: lab.manager,
    status: pick(deviceStatus, index)
  }
})

const consumableCategories = ['电子元件', '焊接辅料', '护理耗材', '汽车保养耗材']
const warehouses = ['中心库房A', '中心库房B', '电子耗材库', '医护耗材库']
const hazardLevels = ['普通', '普通', '低风险', '危险品']
const stockStatusList = ['充足', '充足', '预警', '紧缺']

export const LAB_CONSUMABLE_ROWS = Array.from({ length: 64 }, (_, index) => {
  const stock = 20 + ((index * 13) % 180)
  const safeStock = 30 + ((index * 7) % 60)
  return {
    sku: `XM-${pad(800 + index, 5)}`,
    name: `${pick(consumableCategories, index)}-${(index % 16) + 1}`,
    category: pick(consumableCategories, index),
    spec: `${pick(['盒', '包', '瓶', '套'], index)}装 ${(index % 8) + 1}`,
    warehouse: pick(warehouses, index),
    hazardLevel: pick(hazardLevels, index),
    stock,
    safeStock,
    stockStatus: stock <= safeStock * 0.5 ? '紧缺' : stock <= safeStock ? '预警' : pick(stockStatusList, index),
    manager: pick(['沈老师', '丁老师', '贺老师', '彭老师'], index),
    lastInbound: `2026-${pad((index % 3) + 1)}-${pad((index % 25) + 3)}`
  }
})

const applicantRoles = ['教师', '学生', '实验室管理员']
const bizTypes = ['实验室预约', '设备借用', '易耗品申领', '危险品领用']
const approvalStatus = ['待审核', '审批中', '已通过', '已驳回']
const approvalNodes = ['部门初审', '资源核验', '负责人审批', '归档完成']

export const LAB_APPROVAL_ROWS = Array.from({ length: 88 }, (_, index) => {
  const bizType = pick(bizTypes, index)
  const lab = pick(generatedLabs, index)
  const applicant = pick(personNames, index + 2)
  const status = pick(approvalStatus, index)
  return {
    orderNo: `SP${202603}${pad(index + 1, 4)}`,
    bizType,
    applicant,
    applicantRole: pick(applicantRoles, index),
    targetResource:
      bizType === '实验室预约'
        ? `${lab.labName} ${lab.roomNo}`
        : bizType === '设备借用'
          ? `${pick(LAB_DEVICE_ASSET_ROWS, index).deviceName}`
          : `${pick(LAB_CONSUMABLE_ROWS, index).name}`,
    applyTime: makeDate((index % 3) + 1, (index % 28) + 1, 8 + (index % 9), (index * 5) % 60),
    applyDate: `2026-${pad((index % 3) + 1)}-${pad((index % 28) + 1)}`,
    status,
    currentNode: status === '已通过' || status === '已驳回' ? '流程结束' : pick(approvalNodes, index),
    approver: status === '待审核' ? '待分配' : pick(['刘主任', '王主任', '周主管', '审核专员'], index)
  }
})

const reportTypes = ['实训基地建设统计', '设备资产月报', '易耗品使用月报', '实验室使用率分析']
const terms = ['2025-2026学年上学期', '2025-2026学年下学期', '2026年2月', '2026年3月']
const reportStatus = ['待提交', '审核中', '已上报', '退回修改']

export const LAB_REPORT_ROWS = Array.from({ length: 36 }, (_, index) => ({
  reportNo: `RP-${2026}${pad(index + 1, 4)}`,
  reportName: `${pick(reportTypes, index)}第${(index % 4) + 1}批`,
  reportType: pick(reportTypes, index),
  term: pick(terms, index),
  submitDept: pick(departments, index + 2),
  recordCount: 120 + index * 17,
  status: pick(reportStatus, index),
  submittedAt: makeDate((index % 3) + 1, (index % 27) + 1, 10 + (index % 6), (index * 11) % 60),
  reviewer: pick(['刘主任', '林老师', '杨处长', '赵主管'], index)
}))

const modules = ['用户权限', '实验室档案', '设备资产', '易耗品库存', '审批中心', '数据上报']
const operationTypes = ['新增', '编辑', '删除', '导出', '审批', '登录']
const logResults = ['成功', '成功', '成功', '预警', '失败']

export const LAB_OPERATION_LOG_ROWS = Array.from({ length: 120 }, (_, index) => ({
  logId: `LOG${202603}${pad(index + 1, 5)}`,
  operatorName: pick(personNames, index),
  role: pick(userRoles, index + 3),
  module: pick(modules, index),
  operationType: pick(operationTypes, index),
  target: `${pick(modules, index)}对象${pad((index % 36) + 1, 3)}`,
  result: pick(logResults, index),
  ip: `10.18.${index % 12}.${20 + (index % 180)}`,
  operateTime: makeDate((index % 3) + 1, (index % 28) + 1, 7 + (index % 12), (index * 13) % 60),
  operateDate: `2026-${pad((index % 3) + 1)}-${pad((index % 28) + 1)}`
}))

export const LAB_MENU_ROWS: Record<LabMenuId, Record<string, string | number>[]> = {
  'user-permission': LAB_USER_PERMISSION_ROWS,
  'lab-archive': LAB_ARCHIVE_ROWS,
  'device-assets': LAB_DEVICE_ASSET_ROWS,
  'consumable-stock': LAB_CONSUMABLE_ROWS,
  'approval-center': LAB_APPROVAL_ROWS,
  'report-center': LAB_REPORT_ROWS,
  'operation-logs': LAB_OPERATION_LOG_ROWS
}

export const LAB_SYSTEM_STATS: LabStatCard[] = [
  { label: '平台账号数', value: `${LAB_USER_PERMISSION_ROWS.length}` },
  { label: '实训室总数', value: `${LAB_ARCHIVE_ROWS.length}` },
  { label: '设备资产数', value: `${LAB_DEVICE_ASSET_ROWS.length}` },
  { label: '易耗品条目', value: `${LAB_CONSUMABLE_ROWS.length}` },
  { label: '待办审批', value: `${LAB_APPROVAL_ROWS.filter((item) => item.status === '待审核' || item.status === '审批中').length}` },
  { label: '本期报表', value: `${LAB_REPORT_ROWS.length}` }
]

export const getLabMenuById = (menuId: LabMenuId) => {
  return LAB_SYSTEM_ADMIN_MENUS.find((item) => item.id === menuId) ?? LAB_SYSTEM_ADMIN_MENUS[0]
}

export const LAB_MANAGER_MENUS: Array<LabMenuConfig & { id: LabManagerMenuId }> = [
  {
    id: 'reservation-manage',
    group: '预约管理',
    title: '实验室预约审核',
    description: '集中处理教师和学生提交的实验室预约申请，跟踪预约时段与审核结果。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索预约单号、申请人、实验室名称' },
      {
        key: 'applicantRole',
        label: '申请角色',
        type: 'select',
        options: [
          { label: '教师', value: '教师' },
          { label: '学生', value: '学生' }
        ]
      },
      {
        key: 'status',
        label: '预约状态',
        type: 'select',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
          { label: '已取消', value: '已取消' }
        ]
      },
      { key: 'reservationDate', label: '预约日期', type: 'date' }
    ],
    columns: [
      { prop: 'reservationNo', label: '预约单号', minWidth: 150 },
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'applicant', label: '申请人', minWidth: 110 },
      { prop: 'applicantRole', label: '角色', minWidth: 100 },
      { prop: 'courseName', label: '课程/用途', minWidth: 180 },
      { prop: 'reservationDate', label: '预约日期', minWidth: 120 },
      { prop: 'timeSlot', label: '预约时段', minWidth: 180 },
      { prop: 'status', label: '预约状态', minWidth: 110 },
      { prop: 'reviewer', label: '审核人', minWidth: 110 }
    ]
  },
  {
    id: 'schedule-query',
    group: '预约管理',
    title: '实验室课表与占用',
    description: '查看实验室排课、预约占用与空闲时段，为开放安排提供依据。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索实验室、课程、教师' },
      {
        key: 'weekDay',
        label: '星期',
        type: 'select',
        options: [
          { label: '星期一', value: '星期一' },
          { label: '星期二', value: '星期二' },
          { label: '星期三', value: '星期三' },
          { label: '星期四', value: '星期四' },
          { label: '星期五', value: '星期五' }
        ]
      },
      {
        key: 'occupancyStatus',
        label: '占用状态',
        type: 'select',
        options: [
          { label: '已排课', value: '已排课' },
          { label: '预约占用', value: '预约占用' },
          { label: '空闲', value: '空闲' }
        ]
      },
      {
        key: 'labType',
        label: '实验室类型',
        type: 'select',
        options: [
          { label: '电子实训室', value: '电子实训室' },
          { label: '智能制造实训室', value: '智能制造实训室' },
          { label: '护理技能实训室', value: '护理技能实训室' },
          { label: '汽车检修实训室', value: '汽车检修实训室' }
        ]
      }
    ],
    columns: [
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'labType', label: '类型', minWidth: 150 },
      { prop: 'weekDay', label: '星期', minWidth: 100 },
      { prop: 'section', label: '节次', minWidth: 120 },
      { prop: 'courseName', label: '课程名称', minWidth: 180 },
      { prop: 'teacherName', label: '任课教师', minWidth: 110 },
      { prop: 'className', label: '班级', minWidth: 140 },
      { prop: 'occupancyStatus', label: '占用状态', minWidth: 110 }
    ]
  },
  {
    id: 'access-records',
    group: '运行管理',
    title: '门禁通行记录',
    description: '查看实验室门禁进出记录、刷卡结果与异常时段，支撑安全追溯。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索姓名、工号/学号、门禁编号' },
      {
        key: 'identityType',
        label: '身份类型',
        type: 'select',
        options: [
          { label: '教师', value: '教师' },
          { label: '学生', value: '学生' },
          { label: '管理员', value: '管理员' }
        ]
      },
      {
        key: 'result',
        label: '通行结果',
        type: 'select',
        options: [
          { label: '通过', value: '通过' },
          { label: '拒绝', value: '拒绝' },
          { label: '预警', value: '预警' }
        ]
      },
      { key: 'recordDate', label: '通行日期', type: 'date' }
    ],
    columns: [
      { prop: 'recordNo', label: '记录编号', minWidth: 150 },
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'doorAccess', label: '门禁编号', minWidth: 120 },
      { prop: 'personName', label: '姓名', minWidth: 110 },
      { prop: 'identityType', label: '身份类型', minWidth: 100 },
      { prop: 'personCode', label: '工号/学号', minWidth: 140 },
      { prop: 'recordTime', label: '通行时间', minWidth: 180 },
      { prop: 'result', label: '通行结果', minWidth: 100 }
    ]
  },
  {
    id: 'inspection-tasks',
    group: '运行管理',
    title: '值班巡检任务',
    description: '管理实验室日常巡检、卫生检查、设备点检与隐患整改任务。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索任务编号、实验室、责任人' },
      {
        key: 'taskType',
        label: '任务类型',
        type: 'select',
        options: [
          { label: '开课前巡检', value: '开课前巡检' },
          { label: '设备点检', value: '设备点检' },
          { label: '安全检查', value: '安全检查' },
          { label: '卫生检查', value: '卫生检查' }
        ]
      },
      {
        key: 'taskStatus',
        label: '任务状态',
        type: 'select',
        options: [
          { label: '待执行', value: '待执行' },
          { label: '处理中', value: '处理中' },
          { label: '已完成', value: '已完成' },
          { label: '逾期', value: '逾期' }
        ]
      },
      { key: 'planDate', label: '计划日期', type: 'date' }
    ],
    columns: [
      { prop: 'taskNo', label: '任务编号', minWidth: 150 },
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'taskType', label: '任务类型', minWidth: 130 },
      { prop: 'manager', label: '责任人', minWidth: 110 },
      { prop: 'planDate', label: '计划日期', minWidth: 120 },
      { prop: 'completionRate', label: '完成度', minWidth: 100 },
      { prop: 'issueCount', label: '发现问题', minWidth: 100 },
      { prop: 'taskStatus', label: '任务状态', minWidth: 110 }
    ]
  },
  {
    id: 'usage-analysis',
    group: '统计分析',
    title: '实验室使用分析',
    description: '按实验室维度统计课表占用、预约次数、利用率与异常关闭情况。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索实验室名称、负责人' },
      {
        key: 'campus',
        label: '校区',
        type: 'select',
        options: [
          { label: '主校区', value: '主校区' },
          { label: '产教融合园', value: '产教融合园' },
          { label: '医护实训中心', value: '医护实训中心' }
        ]
      },
      {
        key: 'status',
        label: '运行状态',
        type: 'select',
        options: [
          { label: '开放中', value: '开放中' },
          { label: '维护中', value: '维护中' },
          { label: '停用', value: '停用' }
        ]
      },
      {
        key: 'term',
        label: '统计周期',
        type: 'select',
        options: [
          { label: '2025-2026学年上学期', value: '2025-2026学年上学期' },
          { label: '2025-2026学年下学期', value: '2025-2026学年下学期' }
        ]
      }
    ],
    columns: [
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'campus', label: '校区', minWidth: 110 },
      { prop: 'manager', label: '负责人', minWidth: 110 },
      { prop: 'term', label: '统计周期', minWidth: 160 },
      { prop: 'classHours', label: '排课课时', minWidth: 100 },
      { prop: 'reservationCount', label: '预约次数', minWidth: 100 },
      { prop: 'usageRate', label: '使用率', minWidth: 110 },
      { prop: 'abnormalCloseCount', label: '异常闭馆', minWidth: 100 },
      { prop: 'status', label: '运行状态', minWidth: 100 }
    ]
  }
]

export const LAB_MANAGER_RESERVATION_ROWS = Array.from({ length: 54 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  const role = pick(['教师', '学生'], index)
  return {
    reservationNo: `YY${202603}${pad(index + 1, 4)}`,
    labName: lab.labName,
    applicant: pick(personNames, index + 1),
    applicantRole: role,
    courseName: role === '教师' ? pick(['PLC编程实训', '电子焊接训练', '护理操作演练', '新能源汽车检修'], index) : pick(['社团训练', '课后开放实训', '技能竞赛备赛', '创新项目调试'], index),
    reservationDate: `2026-${pad((index % 3) + 1)}-${pad((index % 27) + 1)}`,
    timeSlot: pick(['08:00-10:00', '10:20-12:00', '14:00-16:00', '18:30-20:30'], index),
    status: pick(['待审核', '已通过', '已通过', '已驳回', '已取消'], index),
    reviewer: pick(['赵工', '顾工', '值班管理员', '蒋老师'], index)
  }
})

export const LAB_MANAGER_SCHEDULE_ROWS = Array.from({ length: 60 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  return {
    labName: lab.labName,
    labType: lab.labType,
    weekDay: pick(['星期一', '星期二', '星期三', '星期四', '星期五'], index),
    section: pick(['1-2节', '3-4节', '5-6节', '7-8节'], index),
    courseName: pick(['PLC编程实训', '电子焊接工艺', '护理基础操作', '汽车电控检测', '开放预约'], index),
    teacherName: pick(['陈老师', '刘老师', '何老师', '汪老师', '值班管理员'], index),
    className: pick(['23机电1班', '23电子2班', '24护理3班', '23汽修2班', '开放预约'], index),
    occupancyStatus: pick(['已排课', '已排课', '预约占用', '空闲'], index)
  }
})

export const LAB_MANAGER_ACCESS_ROWS = Array.from({ length: 80 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  const identityType = pick(['教师', '学生', '管理员'], index)
  return {
    recordNo: `MJ${202603}${pad(index + 1, 5)}`,
    labName: lab.labName,
    doorAccess: lab.doorAccess,
    personName: pick(personNames, index),
    identityType,
    personCode: identityType === '学生' ? `2024${pad(1000 + index, 4)}` : `T${pad(200 + index, 4)}`,
    recordTime: makeDate((index % 3) + 1, (index % 28) + 1, 7 + (index % 13), (index * 9) % 60),
    recordDate: `2026-${pad((index % 3) + 1)}-${pad((index % 28) + 1)}`,
    result: pick(['通过', '通过', '通过', '拒绝', '预警'], index)
  }
})

export const LAB_MANAGER_INSPECTION_ROWS = Array.from({ length: 42 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  const issueCount = index % 4
  return {
    taskNo: `XJ${202603}${pad(index + 1, 4)}`,
    labName: lab.labName,
    taskType: pick(['开课前巡检', '设备点检', '安全检查', '卫生检查'], index),
    manager: lab.manager,
    planDate: `2026-${pad((index % 3) + 1)}-${pad((index % 26) + 2)}`,
    completionRate: pick(['0%', '35%', '75%', '100%'], index),
    issueCount,
    taskStatus: issueCount > 0 ? pick(['处理中', '逾期', '已完成'], index) : pick(['待执行', '已完成'], index)
  }
})

export const LAB_MANAGER_USAGE_ROWS = generatedLabs.map((lab, index) => ({
  labName: lab.labName,
  campus: lab.campus,
  manager: lab.manager,
  term: pick(['2025-2026学年上学期', '2025-2026学年下学期'], index),
  classHours: 180 + (index % 9) * 16,
  reservationCount: 24 + (index % 12) * 3,
  usageRate: `${68 + (index % 18)}%`,
  abnormalCloseCount: index % 5,
  status: lab.status
}))

export const LAB_MANAGER_MENU_ROWS: Record<LabManagerMenuId, Record<string, string | number>[]> = {
  'reservation-manage': LAB_MANAGER_RESERVATION_ROWS,
  'schedule-query': LAB_MANAGER_SCHEDULE_ROWS,
  'access-records': LAB_MANAGER_ACCESS_ROWS,
  'inspection-tasks': LAB_MANAGER_INSPECTION_ROWS,
  'usage-analysis': LAB_MANAGER_USAGE_ROWS
}

export const LAB_MANAGER_STATS: LabStatCard[] = [
  { label: '负责实验室', value: `${generatedLabs.length}` },
  { label: '待审预约', value: `${LAB_MANAGER_RESERVATION_ROWS.filter((item) => item.status === '待审核').length}` },
  { label: '今日通行', value: `${LAB_MANAGER_ACCESS_ROWS.slice(0, 24).length}` },
  { label: '待巡检任务', value: `${LAB_MANAGER_INSPECTION_ROWS.filter((item) => item.taskStatus === '待执行' || item.taskStatus === '处理中').length}` }
]

export const getLabManagerMenuById = (menuId: LabManagerMenuId) => {
  return LAB_MANAGER_MENUS.find((item) => item.id === menuId) ?? LAB_MANAGER_MENUS[0]
}

export const LAB_DEVICE_MANAGER_MENUS: Array<LabMenuConfig & { id: LabDeviceManagerMenuId }> = [
  {
    id: 'device-ledger',
    group: '设备台账',
    title: '设备总台账',
    description: '统一查看设备资产编号、存放位置、保管人和在线状态等信息。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索资产编号、设备名称、品牌型号' },
      {
        key: 'category',
        label: '设备类别',
        type: 'select',
        options: [
          { label: '数控设备', value: '数控设备' },
          { label: '电子测试设备', value: '电子测试设备' },
          { label: '护理实训设备', value: '护理实训设备' },
          { label: '汽车诊断设备', value: '汽车诊断设备' }
        ]
      },
      {
        key: 'status',
        label: '设备状态',
        type: 'select',
        options: [
          { label: '在用', value: '在用' },
          { label: '待维修', value: '待维修' },
          { label: '封存', value: '封存' },
          { label: '报废审批中', value: '报废审批中' }
        ]
      },
      {
        key: 'labName',
        label: '所属实验室',
        type: 'select',
        options: [
          { label: '智能制造产线1室', value: '智能制造产线1室' },
          { label: '电子焊接2室', value: '电子焊接2室' },
          { label: '护理综合3室', value: '护理综合3室' },
          { label: '新能源汽车检修4室', value: '新能源汽车检修4室' }
        ]
      }
    ],
    columns: [
      { prop: 'assetCode', label: '资产编号', minWidth: 140 },
      { prop: 'deviceName', label: '设备名称', minWidth: 180 },
      { prop: 'category', label: '类别', minWidth: 130 },
      { prop: 'brand', label: '品牌', minWidth: 110 },
      { prop: 'model', label: '型号', minWidth: 140 },
      { prop: 'labName', label: '所属实验室', minWidth: 180 },
      { prop: 'keeper', label: '保管人', minWidth: 110 },
      { prop: 'networkStatus', label: '联网状态', minWidth: 110 },
      { prop: 'status', label: '设备状态', minWidth: 110 }
    ]
  },
  {
    id: 'maintenance-orders',
    group: '运维管理',
    title: '设备维修工单',
    description: '跟踪设备报修、维修进度、服务厂商与验收结果。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索工单号、设备名称、报修人' },
      {
        key: 'priority',
        label: '优先级',
        type: 'select',
        options: [
          { label: '高', value: '高' },
          { label: '中', value: '中' },
          { label: '低', value: '低' }
        ]
      },
      {
        key: 'status',
        label: '工单状态',
        type: 'select',
        options: [
          { label: '待派单', value: '待派单' },
          { label: '维修中', value: '维修中' },
          { label: '待验收', value: '待验收' },
          { label: '已完成', value: '已完成' }
        ]
      },
      { key: 'reportDate', label: '报修日期', type: 'date' }
    ],
    columns: [
      { prop: 'orderNo', label: '工单号', minWidth: 150 },
      { prop: 'deviceName', label: '设备名称', minWidth: 180 },
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'reporter', label: '报修人', minWidth: 110 },
      { prop: 'faultType', label: '故障类型', minWidth: 140 },
      { prop: 'priority', label: '优先级', minWidth: 90 },
      { prop: 'vendor', label: '服务厂商', minWidth: 150 },
      { prop: 'status', label: '工单状态', minWidth: 110 },
      { prop: 'reportTime', label: '报修时间', minWidth: 170 }
    ]
  },
  {
    id: 'borrow-audit',
    group: '运维管理',
    title: '设备借还审核',
    description: '处理设备借用、归还、逾期和损坏确认等审核业务。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索单号、申请人、设备名称' },
      {
        key: 'bizType',
        label: '业务类型',
        type: 'select',
        options: [
          { label: '借用申请', value: '借用申请' },
          { label: '归还确认', value: '归还确认' },
          { label: '损坏认定', value: '损坏认定' }
        ]
      },
      {
        key: 'status',
        label: '审核状态',
        type: 'select',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
          { label: '已归档', value: '已归档' }
        ]
      },
      { key: 'applyDate', label: '申请日期', type: 'date' }
    ],
    columns: [
      { prop: 'borrowNo', label: '单号', minWidth: 150 },
      { prop: 'bizType', label: '业务类型', minWidth: 120 },
      { prop: 'deviceName', label: '设备名称', minWidth: 180 },
      { prop: 'applicant', label: '申请人', minWidth: 110 },
      { prop: 'department', label: '所属部门', minWidth: 140 },
      { prop: 'applyDate', label: '申请日期', minWidth: 120 },
      { prop: 'expectedReturnDate', label: '应归还日期', minWidth: 120 },
      { prop: 'status', label: '审核状态', minWidth: 110 },
      { prop: 'reviewer', label: '审核人', minWidth: 110 }
    ]
  },
  {
    id: 'inventory-check',
    group: '盘点管理',
    title: '设备盘点任务',
    description: '查看盘点批次、盘亏盘盈结果与差异处理进度。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索盘点批次、实验室、责任人' },
      {
        key: 'inventoryScope',
        label: '盘点范围',
        type: 'select',
        options: [
          { label: '全量盘点', value: '全量盘点' },
          { label: '专项盘点', value: '专项盘点' },
          { label: '抽样盘点', value: '抽样盘点' }
        ]
      },
      {
        key: 'status',
        label: '盘点状态',
        type: 'select',
        options: [
          { label: '未开始', value: '未开始' },
          { label: '进行中', value: '进行中' },
          { label: '待处理', value: '待处理' },
          { label: '已完成', value: '已完成' }
        ]
      },
      { key: 'planDate', label: '盘点日期', type: 'date' }
    ],
    columns: [
      { prop: 'inventoryNo', label: '盘点批次', minWidth: 150 },
      { prop: 'inventoryScope', label: '盘点范围', minWidth: 120 },
      { prop: 'labName', label: '实验室', minWidth: 180 },
      { prop: 'manager', label: '责任人', minWidth: 110 },
      { prop: 'planDate', label: '计划日期', minWidth: 120 },
      { prop: 'deviceCount', label: '设备数', minWidth: 90 },
      { prop: 'diffCount', label: '差异数', minWidth: 90 },
      { prop: 'status', label: '盘点状态', minWidth: 110 },
      { prop: 'reportTime', label: '提交时间', minWidth: 170 }
    ]
  },
  {
    id: 'scrap-donation',
    group: '资产处置',
    title: '报废与捐赠管理',
    description: '跟踪设备报废申请、捐赠流转和处置结果。',
    filters: [
      { key: 'keyword', label: '关键字', type: 'input', placeholder: '搜索处置单号、设备名称、申请人' },
      {
        key: 'disposeType',
        label: '处置类型',
        type: 'select',
        options: [
          { label: '报废申请', value: '报废申请' },
          { label: '捐赠申请', value: '捐赠申请' },
          { label: '调拨处置', value: '调拨处置' }
        ]
      },
      {
        key: 'status',
        label: '处置状态',
        type: 'select',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '审批中', value: '审批中' },
          { label: '已完成', value: '已完成' },
          { label: '已驳回', value: '已驳回' }
        ]
      },
      { key: 'applyDate', label: '申请日期', type: 'date' }
    ],
    columns: [
      { prop: 'disposeNo', label: '处置单号', minWidth: 150 },
      { prop: 'disposeType', label: '处置类型', minWidth: 120 },
      { prop: 'deviceName', label: '设备名称', minWidth: 180 },
      { prop: 'assetCode', label: '资产编号', minWidth: 140 },
      { prop: 'reason', label: '处置原因', minWidth: 180 },
      { prop: 'applicant', label: '申请人', minWidth: 110 },
      { prop: 'applyDate', label: '申请日期', minWidth: 120 },
      { prop: 'status', label: '处置状态', minWidth: 110 },
      { prop: 'reviewer', label: '审批人', minWidth: 110 }
    ]
  }
]

export const LAB_DEVICE_LEDGER_ROWS = LAB_DEVICE_ASSET_ROWS.map((item, index) => ({
  ...item,
  networkStatus: pick(['在线', '在线', '离线', '维护模式'], index)
}))

export const LAB_DEVICE_MAINTENANCE_ROWS = Array.from({ length: 48 }, (_, index) => {
  const device = pick(LAB_DEVICE_ASSET_ROWS, index)
  return {
    orderNo: `WX${202603}${pad(index + 1, 4)}`,
    deviceName: device.deviceName,
    labName: device.labName,
    reporter: pick(personNames, index + 1),
    faultType: pick(['无法开机', '通讯异常', '传感器故障', '耗材卡滞'], index),
    priority: pick(['高', '中', '低'], index),
    vendor: pick(['西门子华东服务中心', '安捷伦授权商', '迈瑞售后团队', '校内运维组'], index),
    status: pick(['待派单', '维修中', '待验收', '已完成'], index),
    reportDate: `2026-${pad((index % 3) + 1)}-${pad((index % 28) + 1)}`,
    reportTime: makeDate((index % 3) + 1, (index % 28) + 1, 8 + (index % 10), (index * 7) % 60)
  }
})

export const LAB_DEVICE_BORROW_ROWS = Array.from({ length: 52 }, (_, index) => {
  const device = pick(LAB_DEVICE_ASSET_ROWS, index)
  const bizType = pick(['借用申请', '归还确认', '损坏认定'], index)
  return {
    borrowNo: `JY${202603}${pad(index + 1, 4)}`,
    bizType,
    deviceName: device.deviceName,
    applicant: pick(personNames, index + 2),
    department: pick(departments, index + 3),
    applyDate: `2026-${pad((index % 3) + 1)}-${pad((index % 27) + 1)}`,
    expectedReturnDate: bizType === '借用申请' ? `2026-${pad((index % 3) + 1)}-${pad((index % 27) + 3)}` : '-',
    status: pick(['待审核', '已通过', '已驳回', '已归档'], index),
    reviewer: pick(['设备管理员', '周主管', '赵工', '杨老师'], index)
  }
})

export const LAB_DEVICE_INVENTORY_ROWS = Array.from({ length: 32 }, (_, index) => {
  const lab = pick(generatedLabs, index)
  return {
    inventoryNo: `PD${202603}${pad(index + 1, 4)}`,
    inventoryScope: pick(['全量盘点', '专项盘点', '抽样盘点'], index),
    labName: lab.labName,
    manager: lab.manager,
    planDate: `2026-${pad((index % 3) + 1)}-${pad((index % 26) + 2)}`,
    deviceCount: 12 + (index % 18),
    diffCount: index % 5,
    status: pick(['未开始', '进行中', '待处理', '已完成'], index),
    reportTime: makeDate((index % 3) + 1, (index % 27) + 1, 9 + (index % 8), (index * 5) % 60)
  }
})

export const LAB_DEVICE_DISPOSE_ROWS = Array.from({ length: 30 }, (_, index) => {
  const device = pick(LAB_DEVICE_ASSET_ROWS, index)
  return {
    disposeNo: `CZ${202603}${pad(index + 1, 4)}`,
    disposeType: pick(['报废申请', '捐赠申请', '调拨处置'], index),
    deviceName: device.deviceName,
    assetCode: device.assetCode,
    reason: pick(['主板损坏无法修复', '设备老化超年限', '专业共建捐赠', '校区间资源调拨'], index),
    applicant: pick(personNames, index + 4),
    applyDate: `2026-${pad((index % 3) + 1)}-${pad((index % 25) + 2)}`,
    status: pick(['待审核', '审批中', '已完成', '已驳回'], index),
    reviewer: pick(['刘主任', '王主任', '资产管理员', '赵主管'], index)
  }
})

export const LAB_DEVICE_MANAGER_MENU_ROWS: Record<LabDeviceManagerMenuId, Record<string, string | number>[]> = {
  'device-ledger': LAB_DEVICE_LEDGER_ROWS,
  'maintenance-orders': LAB_DEVICE_MAINTENANCE_ROWS,
  'borrow-audit': LAB_DEVICE_BORROW_ROWS,
  'inventory-check': LAB_DEVICE_INVENTORY_ROWS,
  'scrap-donation': LAB_DEVICE_DISPOSE_ROWS
}

export const LAB_DEVICE_MANAGER_STATS: LabStatCard[] = [
  { label: '设备总数', value: `${LAB_DEVICE_LEDGER_ROWS.length}` },
  { label: '待维修', value: `${LAB_DEVICE_LEDGER_ROWS.filter((item) => item.status === '待维修').length}` },
  { label: '待审借还', value: `${LAB_DEVICE_BORROW_ROWS.filter((item) => item.status === '待审核').length}` },
  { label: '待处置', value: `${LAB_DEVICE_DISPOSE_ROWS.filter((item) => item.status === '待审核' || item.status === '审批中').length}` }
]

export const getLabDeviceManagerMenuById = (menuId: LabDeviceManagerMenuId) => {
  return LAB_DEVICE_MANAGER_MENUS.find((item) => item.id === menuId) ?? LAB_DEVICE_MANAGER_MENUS[0]
}