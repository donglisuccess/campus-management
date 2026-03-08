export type LabMenuId =
  | 'user-permission'
  | 'lab-archive'
  | 'device-assets'
  | 'consumable-stock'
  | 'approval-center'
  | 'report-center'
  | 'operation-logs'

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