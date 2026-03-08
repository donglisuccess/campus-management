export interface LabAccountRoleOption {
  label: string
  value:
    | 'system-admin'
    | 'lab-admin'
    | 'device-admin'
    | 'consumable-admin'
    | 'teacher'
    | 'student'
}

export interface LabAccountItem {
  role: LabAccountRoleOption['value']
  roleLabel: string
  account: string
  password: string
  name: string
}

export const LAB_ROLE_OPTIONS: LabAccountRoleOption[] = [
  { label: '系统管理员', value: 'system-admin' },
  { label: '实验室管理员', value: 'lab-admin' },
  { label: '设备管理员', value: 'device-admin' },
  { label: '易耗品管理员', value: 'consumable-admin' },
  { label: '教师', value: 'teacher' },
  { label: '学生', value: 'student' }
]

export const LAB_ACCOUNT_LIST: LabAccountItem[] = [
  {
    role: 'system-admin',
    roleLabel: '系统管理员',
    account: 'sysadmin',
    password: 'sysadmin123',
    name: '平台超级管理员'
  },
  {
    role: 'lab-admin',
    roleLabel: '实验室管理员',
    account: 'labadmin01',
    password: 'labadmin123',
    name: '实验室值班管理员'
  },
  {
    role: 'device-admin',
    roleLabel: '设备管理员',
    account: 'device01',
    password: 'device123',
    name: '设备资产管理员'
  },
  {
    role: 'consumable-admin',
    roleLabel: '易耗品管理员',
    account: 'supply01',
    password: 'supply123',
    name: '易耗品库房管理员'
  },
  {
    role: 'teacher',
    roleLabel: '教师',
    account: 'teacher01',
    password: 'teacher123',
    name: '张老师'
  },
  {
    role: 'student',
    roleLabel: '学生',
    account: 'student01',
    password: 'student123',
    name: '李同学'
  }
]

export const findLabAccount = (role: LabAccountRoleOption['value'], account: string, password: string) => {
  return LAB_ACCOUNT_LIST.find(
    (item) => item.role === role && item.account === account.trim() && item.password === password
  )
}