<template>
  <section v-if="isSystemAdmin" class="lab-manage-page">
    <aside class="lab-manage-side">
      <div class="lab-manage-brand">
        <p class="lab-manage-kicker">Lab Cloud Admin</p>
        <h1>系统管理员后台</h1>
        <p>统一管理实验室平台用户权限、资源档案、流程监控与数据上报。</p>
      </div>

      <div class="lab-manage-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="activeMenuId" class="lab-manage-menu" @select="handleSelectMenu">
        <el-sub-menu v-for="group in menuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-manage-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-manage-main">
      <header class="lab-manage-header">
        <div>
          <p class="lab-manage-header-kicker">{{ activeMenu.group }}</p>
          <h2>{{ activeMenu.title }}</h2>
          <p class="lab-manage-header-desc">{{ activeMenu.description }}</p>
        </div>
      </header>

      <section class="lab-stat-grid">
        <article v-for="item in topStats" :key="item.label" class="lab-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-manage-panel" shadow="never">
        <template #header>
          <div class="lab-panel-head lab-panel-head--toolbar">
            <div>
              <h3>{{ activeMenu.title }}</h3>
              <p>当前菜单共 {{ activeRows.length }} 条 mock 数据，筛选后 {{ filteredRows.length }} 条。</p>
            </div>

            <div class="lab-toolbar-actions">
              <el-button @click="resetFilters">重置</el-button>
              <el-button type="primary" @click="applyFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-filter-grid">
          <el-form-item v-for="filter in activeMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="draftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="draftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="draftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="pagedRows" border stripe class="lab-data-table">
          <el-table-column
            v-for="column in activeMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="activeMenuId === 'user-permission'" label="操作" fixed="right" min-width="160">
            <template #default="scope">
              <div class="lab-row-actions">
                <el-button
                  link
                  :type="scope.row.status === '启用' ? 'success' : 'primary'"
                  :disabled="scope.row.status === '启用'"
                  @click="updateUserStatus(scope.row, '启用')"
                >
                  启用
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status === '停用'"
                  @click="updateUserStatus(scope.row, '停用')"
                >
                  禁用
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="activeMenuId === 'approval-center'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-row-actions">
                <el-button
                  link
                  type="success"
                  :disabled="!['待审核', '审批中'].includes(String(scope.row.status))"
                  @click="approveReviewFlow(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="!['待审核', '审批中'].includes(String(scope.row.status))"
                  @click="openReviewRejectDialog(scope.row, 'flow')"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="activeMenuId === 'report-center'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-row-actions">
                <el-button
                  link
                  type="success"
                  :disabled="!['待提交', '审核中'].includes(String(scope.row.status))"
                  @click="approveReviewReport(scope.row)"
                >
                  上报通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="!['待提交', '审核中'].includes(String(scope.row.status))"
                  @click="openReviewRejectDialog(scope.row, 'report')"
                >
                  退回修改
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="filteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else-if="isLabAdmin" class="lab-role-page">
    <aside class="lab-role-side">
      <div class="lab-role-brand">
        <p class="lab-role-kicker">Lab Operations</p>
        <h1>实验室管理员工作台</h1>
        <p>聚焦实验室预约、课表占用、门禁记录、巡检任务与使用率分析。</p>
      </div>

      <div class="lab-role-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="labAdminMenuId" class="lab-role-menu" @select="handleSelectLabAdminMenu">
        <el-sub-menu v-for="group in labAdminMenuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-role-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-role-main">
      <header class="lab-role-header">
        <div>
          <p class="lab-role-header-kicker">{{ activeLabAdminMenu.group }}</p>
          <h2>{{ activeLabAdminMenu.title }}</h2>
          <p class="lab-role-header-desc">{{ activeLabAdminMenu.description }}</p>
        </div>
      </header>

      <section class="lab-role-stat-grid">
        <article v-for="item in labAdminTopStats" :key="item.label" class="lab-role-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-role-panel" shadow="never">
        <template #header>
          <div class="lab-role-panel-head">
            <div>
              <h3>{{ activeLabAdminMenu.title }}</h3>
              <p>当前菜单共 {{ labAdminActiveRows.length }} 条 mock 数据，筛选后 {{ labAdminFilteredRows.length }} 条。</p>
            </div>
            <div class="lab-role-toolbar-actions">
              <el-button @click="resetLabAdminFilters">重置</el-button>
              <el-button type="primary" @click="applyLabAdminFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-role-filter-grid">
          <el-form-item v-for="filter in activeLabAdminMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="labAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyLabAdminFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="labAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="labAdminDraftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="labAdminPagedRows" border stripe class="lab-role-table">
          <el-table-column
            v-for="column in activeLabAdminMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="labAdminMenuId === 'reservation-manage'"
            label="操作"
            fixed="right"
            min-width="220"
          >
            <template #default="scope">
              <div class="lab-role-row-actions">
                <el-button link type="primary" @click="openReservationDetail(scope.row)">查看详情</el-button>
                <el-button
                  link
                  type="success"
                  :disabled="scope.row.status !== '待审核'"
                  @click="approveReservation(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status !== '待审核'"
                  @click="openRejectDialog(scope.row)"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-role-pagination">
          <el-pagination
            v-model:current-page="labAdminCurrentPage"
            v-model:page-size="labAdminPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="labAdminFilteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else-if="isDeviceAdmin" class="lab-device-page">
    <aside class="lab-device-side">
      <div class="lab-device-brand">
        <p class="lab-device-kicker">Device Operations</p>
        <h1>设备管理员工作台</h1>
        <p>覆盖设备台账、维修工单、借还审核、盘点任务和报废捐赠等设备全生命周期管理。</p>
      </div>

      <div class="lab-device-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="deviceAdminMenuId" class="lab-device-menu" @select="handleSelectDeviceAdminMenu">
        <el-sub-menu v-for="group in deviceAdminMenuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-device-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-device-main">
      <header class="lab-device-header">
        <div>
          <p class="lab-device-header-kicker">{{ activeDeviceAdminMenu.group }}</p>
          <h2>{{ activeDeviceAdminMenu.title }}</h2>
          <p class="lab-device-header-desc">{{ activeDeviceAdminMenu.description }}</p>
        </div>
      </header>

      <section class="lab-device-stat-grid">
        <article v-for="item in deviceAdminTopStats" :key="item.label" class="lab-device-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-device-panel" shadow="never">
        <template #header>
          <div class="lab-device-panel-head">
            <div>
              <h3>{{ activeDeviceAdminMenu.title }}</h3>
              <p>当前菜单共 {{ deviceAdminActiveRows.length }} 条 mock 数据，筛选后 {{ deviceAdminFilteredRows.length }} 条。</p>
            </div>
            <div class="lab-device-toolbar-actions">
              <el-button v-if="deviceAdminMenuId === 'device-ledger'" type="primary" @click="openCreateDevice">
                新增设备
              </el-button>
              <el-button @click="resetDeviceAdminFilters">重置</el-button>
              <el-button type="primary" @click="applyDeviceAdminFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-device-filter-grid">
          <el-form-item v-for="filter in activeDeviceAdminMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="deviceAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyDeviceAdminFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="deviceAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="deviceAdminDraftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="deviceAdminPagedRows" border stripe class="lab-device-table">
          <el-table-column
            v-for="column in activeDeviceAdminMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="deviceAdminMenuId === 'device-ledger'" label="操作" fixed="right" min-width="240">
            <template #default="scope">
              <div class="lab-device-row-actions">
                <el-button link type="primary" @click="openDeviceDetail(scope.row)">查看详情</el-button>
                <el-button link @click="openEditDevice(scope.row)">编辑</el-button>
                <el-button link type="danger" @click="deleteDeviceRow(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="deviceAdminMenuId === 'borrow-audit'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-device-row-actions">
                <el-button
                  link
                  type="success"
                  :disabled="scope.row.status !== '待审核'"
                  @click="approveDeviceBorrow(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status !== '待审核'"
                  @click="openDeviceBorrowReject(scope.row)"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="deviceAdminMenuId === 'maintenance-orders'" label="操作" fixed="right" min-width="260">
            <template #default="scope">
              <div class="lab-device-row-actions">
                <el-button
                  link
                  type="primary"
                  :disabled="scope.row.status !== '待派单'"
                  @click="openAssignMaintenance(scope.row)"
                >
                  派单
                </el-button>
                <el-button
                  link
                  type="warning"
                  :disabled="scope.row.status !== '维修中'"
                  @click="completeMaintenance(scope.row)"
                >
                  完成维修
                </el-button>
                <el-button
                  link
                  type="success"
                  :disabled="scope.row.status !== '待验收'"
                  @click="acceptMaintenance(scope.row)"
                >
                  验收
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-device-pagination">
          <el-pagination
            v-model:current-page="deviceAdminCurrentPage"
            v-model:page-size="deviceAdminPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="deviceAdminFilteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else-if="isConsumableAdmin" class="lab-supply-page">
    <aside class="lab-supply-side">
      <div class="lab-supply-brand">
        <p class="lab-supply-kicker">Consumable Operations</p>
        <h1>易耗品管理员工作台</h1>
        <p>围绕耗材台账、出入库、领用归还、危险品审核与库存预警开展日常管理。</p>
      </div>

      <div class="lab-supply-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="consumableAdminMenuId" class="lab-supply-menu" @select="handleSelectConsumableAdminMenu">
        <el-sub-menu v-for="group in consumableAdminMenuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-supply-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-supply-main">
      <header class="lab-supply-header">
        <div>
          <p class="lab-supply-header-kicker">{{ activeConsumableAdminMenu.group }}</p>
          <h2>{{ activeConsumableAdminMenu.title }}</h2>
          <p class="lab-supply-header-desc">{{ activeConsumableAdminMenu.description }}</p>
        </div>
      </header>

      <section class="lab-supply-stat-grid">
        <article v-for="item in consumableAdminTopStats" :key="item.label" class="lab-supply-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-supply-panel" shadow="never">
        <template #header>
          <div class="lab-supply-panel-head">
            <div>
              <h3>{{ activeConsumableAdminMenu.title }}</h3>
              <p>当前菜单共 {{ consumableAdminActiveRows.length }} 条 mock 数据，筛选后 {{ consumableAdminFilteredRows.length }} 条。</p>
            </div>
            <div class="lab-supply-toolbar-actions">
              <el-button
                v-if="consumableAdminMenuId === 'inbound-outbound'"
                type="primary"
                plain
                @click="openStandaloneConsumableIo('入库')"
              >
                入库登记
              </el-button>
              <el-button
                v-if="consumableAdminMenuId === 'inbound-outbound'"
                type="warning"
                plain
                @click="openStandaloneConsumableIo('出库')"
              >
                出库登记
              </el-button>
              <el-button @click="resetConsumableAdminFilters">重置</el-button>
              <el-button type="primary" @click="applyConsumableAdminFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-supply-filter-grid">
          <el-form-item v-for="filter in activeConsumableAdminMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="consumableAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyConsumableAdminFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="consumableAdminDraftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="consumableAdminDraftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="consumableAdminPagedRows" border stripe class="lab-supply-table">
          <el-table-column
            v-for="column in activeConsumableAdminMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="consumableAdminMenuId === 'consumable-ledger'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-supply-row-actions">
                <el-button link type="primary" @click="openConsumableIoDialog(scope.row, '入库')">入库登记</el-button>
                <el-button link type="warning" @click="openConsumableIoDialog(scope.row, '出库')">出库登记</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="consumableAdminMenuId === 'borrow-review'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-supply-row-actions">
                <el-button
                  link
                  type="success"
                  :disabled="scope.row.status !== '待审核'"
                  @click="approveConsumableReview(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status !== '待审核'"
                  @click="openConsumableRejectDialog(scope.row, 'review')"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="consumableAdminMenuId === 'hazardous-audit'" label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <div class="lab-supply-row-actions">
                <el-button
                  link
                  type="success"
                  :disabled="!['待初审', '待复审'].includes(String(scope.row.status))"
                  @click="approveHazardousAudit(scope.row)"
                >
                  通过
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="!['待初审', '待复审'].includes(String(scope.row.status))"
                  @click="openConsumableRejectDialog(scope.row, 'hazard')"
                >
                  驳回
                </el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="consumableAdminMenuId === 'stock-warning'" label="操作" fixed="right" min-width="160">
            <template #default="scope">
              <div class="lab-supply-row-actions">
                <el-button
                  link
                  type="primary"
                  :disabled="scope.row.handleStatus === '已完成'"
                  @click="handleConsumableWarning(scope.row)"
                >
                  预警处理
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-supply-pagination">
          <el-pagination
            v-model:current-page="consumableAdminCurrentPage"
            v-model:page-size="consumableAdminPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="consumableAdminFilteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else-if="isUserPortal" :class="['lab-user-page', isTeacher ? 'lab-user-page--teacher' : 'lab-user-page--student']">
    <aside class="lab-user-side">
      <div class="lab-user-brand">
        <p class="lab-user-kicker">{{ isTeacher ? 'Teacher Portal' : 'Student Portal' }}</p>
        <h1>{{ isTeacher ? '教师服务门户' : '学生服务门户' }}</h1>
        <p>{{ isTeacher ? '发起实验室预约、设备借用和耗材申领，统一查看个人教学服务记录。' : '发起开放实验预约、设备借用和耗材申领，统一查看个人实训服务记录。' }}</p>
      </div>

      <div class="lab-user-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="userPortalMenuId" class="lab-user-menu" @select="handleSelectUserPortalMenu">
        <el-sub-menu v-for="group in userPortalMenuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.id" :index="item.id">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="lab-user-side-actions">
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="lab-user-main">
      <header class="lab-user-header">
        <div>
          <p class="lab-user-header-kicker">{{ activeUserPortalMenu.group }}</p>
          <h2>{{ activeUserPortalMenu.title }}</h2>
          <p class="lab-user-header-desc">{{ activeUserPortalMenu.description }}</p>
        </div>
      </header>

      <section class="lab-user-stat-grid">
        <article v-for="item in userPortalTopStats" :key="item.label" class="lab-user-stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <el-card class="lab-user-panel" shadow="never">
        <template #header>
          <div class="lab-user-panel-head">
            <div>
              <h3>{{ activeUserPortalMenu.title }}</h3>
              <p>当前菜单共 {{ userPortalActiveRows.length }} 条 mock 数据，筛选后 {{ userPortalFilteredRows.length }} 条。</p>
            </div>
            <div class="lab-user-toolbar-actions">
              <el-button v-if="userPortalMenuId === 'reservation-center'" type="primary" @click="openUserReservationDialog">
                新增预约
              </el-button>
              <el-button v-if="userPortalMenuId === 'device-service'" type="primary" @click="openUserDeviceDialog">
                发起借用
              </el-button>
              <el-button v-if="userPortalMenuId === 'consumable-service'" type="primary" @click="openUserConsumableDialog">
                提交申领
              </el-button>
              <el-button @click="resetUserPortalFilters">重置</el-button>
              <el-button type="primary" @click="applyUserPortalFilters">查询</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="lab-user-filter-grid">
          <el-form-item v-for="filter in activeUserPortalMenu.filters" :key="filter.key" :label="filter.label">
            <el-input
              v-if="filter.type === 'input'"
              v-model="userPortalDraftFilters[filter.key]"
              :placeholder="filter.placeholder || '请输入查询条件'"
              clearable
              @keyup.enter="applyUserPortalFilters"
            />
            <el-select
              v-else-if="filter.type === 'select'"
              v-model="userPortalDraftFilters[filter.key]"
              :placeholder="filter.placeholder || `请选择${filter.label}`"
              clearable
            >
              <el-option
                v-for="option in filter.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-date-picker
              v-else
              v-model="userPortalDraftFilters[filter.key]"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-table :data="userPortalPagedRows" border stripe class="lab-user-table">
          <el-table-column
            v-for="column in activeUserPortalMenu.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth ?? 120"
          >
            <template #default="scope">
              <span>{{ scope.row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="userPortalMenuId !== 'my-applications'" label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <div class="lab-user-row-actions">
                <el-button link type="primary" @click="openUserDetail(scope.row)">查看详情</el-button>
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="userPortalMenuId === 'my-applications'" label="操作" fixed="right" min-width="180">
            <template #default="scope">
              <div class="lab-user-row-actions">
                <el-button link type="primary" @click="openUserDetail(scope.row)">查看详情</el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="scope.row.status !== '待审核'"
                  @click="cancelUserApplication(scope.row)"
                >
                  撤回申请
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="lab-user-pagination">
          <el-pagination
            v-model:current-page="userPortalCurrentPage"
            v-model:page-size="userPortalPageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="userPortalFilteredRows.length"
          />
        </div>
      </el-card>
    </main>
  </section>

  <section v-else class="placeholder-page">
    <el-card class="placeholder-card">
      <div class="placeholder-badge-row">
        <span class="placeholder-badge">{{ currentRoleLabel }}</span>
        <span class="placeholder-user">{{ currentUserName }}</span>
      </div>
      <h2 class="placeholder-title">实验室综合管理云平台</h2>
      <p class="placeholder-desc">
        当前已进入平台。系统管理员后台已搭建完成，其他角色页面可在此基础上继续扩展对应业务菜单与工作台。
      </p>
      <div class="placeholder-action-row">
        <el-button type="primary" round @click="goHome">返回首页</el-button>
        <el-button round @click="logout">退出登录</el-button>
      </div>
    </el-card>
  </section>

  <el-dialog v-model="reservationDetailVisible" title="预约详情" width="760px">
    <el-descriptions v-if="reservationDetailRow" :column="2" border>
      <el-descriptions-item label="预约单号">{{ reservationDetailRow.reservationNo }}</el-descriptions-item>
      <el-descriptions-item label="实验室">{{ reservationDetailRow.labName }}</el-descriptions-item>
      <el-descriptions-item label="申请人">{{ reservationDetailRow.applicant }}</el-descriptions-item>
      <el-descriptions-item label="申请角色">{{ reservationDetailRow.applicantRole }}</el-descriptions-item>
      <el-descriptions-item label="课程/用途">{{ reservationDetailRow.courseName }}</el-descriptions-item>
      <el-descriptions-item label="预约日期">{{ reservationDetailRow.reservationDate }}</el-descriptions-item>
      <el-descriptions-item label="预约时段">{{ reservationDetailRow.timeSlot }}</el-descriptions-item>
      <el-descriptions-item label="审核状态">{{ reservationDetailRow.status }}</el-descriptions-item>
      <el-descriptions-item label="审核人">{{ reservationDetailRow.reviewer }}</el-descriptions-item>
      <el-descriptions-item label="驳回原因">
        {{ reservationDetailRow.rejectReason || '无' }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="reservationRejectVisible" title="驳回预约" width="520px">
    <el-form label-position="top">
      <el-form-item label="驳回原因" required>
        <el-input
          v-model="reservationRejectReason"
          type="textarea"
          :rows="4"
          maxlength="120"
          show-word-limit
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="reservationRejectVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReservationReject">确认驳回</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="deviceDetailVisible" title="设备详情" width="760px">
    <el-descriptions v-if="deviceDetailRow" :column="2" border>
      <el-descriptions-item label="资产编号">{{ deviceDetailRow.assetCode }}</el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ deviceDetailRow.deviceName }}</el-descriptions-item>
      <el-descriptions-item label="设备类别">{{ deviceDetailRow.category }}</el-descriptions-item>
      <el-descriptions-item label="品牌">{{ deviceDetailRow.brand }}</el-descriptions-item>
      <el-descriptions-item label="型号">{{ deviceDetailRow.model }}</el-descriptions-item>
      <el-descriptions-item label="所属实验室">{{ deviceDetailRow.labName }}</el-descriptions-item>
      <el-descriptions-item label="保管人">{{ deviceDetailRow.keeper }}</el-descriptions-item>
      <el-descriptions-item label="联网状态">{{ deviceDetailRow.networkStatus }}</el-descriptions-item>
      <el-descriptions-item label="设备状态">{{ deviceDetailRow.status }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="deviceEditorVisible" :title="deviceDialogTitle" width="760px">
    <el-form label-position="top" class="lab-device-edit-grid">
      <el-form-item label="资产编号" required>
        <el-input v-model="deviceForm.assetCode" placeholder="请输入资产编号" />
      </el-form-item>
      <el-form-item label="设备名称" required>
        <el-input v-model="deviceForm.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备类别">
        <el-select v-model="deviceForm.category" placeholder="请选择设备类别">
          <el-option label="数控设备" value="数控设备" />
          <el-option label="电子测试设备" value="电子测试设备" />
          <el-option label="护理实训设备" value="护理实训设备" />
          <el-option label="汽车诊断设备" value="汽车诊断设备" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="deviceForm.brand" placeholder="请输入品牌" />
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="deviceForm.model" placeholder="请输入型号" />
      </el-form-item>
      <el-form-item label="所属实验室">
        <el-input v-model="deviceForm.labName" placeholder="请输入所属实验室" />
      </el-form-item>
      <el-form-item label="保管人">
        <el-input v-model="deviceForm.keeper" placeholder="请输入保管人" />
      </el-form-item>
      <el-form-item label="联网状态">
        <el-select v-model="deviceForm.networkStatus" placeholder="请选择联网状态">
          <el-option label="在线" value="在线" />
          <el-option label="离线" value="离线" />
          <el-option label="维护模式" value="维护模式" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select v-model="deviceForm.status" placeholder="请选择设备状态">
          <el-option label="在用" value="在用" />
          <el-option label="待维修" value="待维修" />
          <el-option label="封存" value="封存" />
          <el-option label="报废审批中" value="报废审批中" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="deviceEditorVisible = false">取消</el-button>
      <el-button type="primary" @click="submitDeviceForm">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="deviceBorrowRejectVisible" title="驳回设备借还申请" width="520px">
    <el-form label-position="top">
      <el-form-item label="驳回原因" required>
        <el-input
          v-model="deviceBorrowRejectReason"
          type="textarea"
          :rows="4"
          maxlength="120"
          show-word-limit
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="deviceBorrowRejectVisible = false">取消</el-button>
      <el-button type="primary" @click="submitDeviceBorrowReject">确认驳回</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="deviceMaintenanceAssignVisible" title="维修工单派单" width="580px">
    <el-form label-position="top">
      <el-form-item label="服务厂商" required>
        <el-select v-model="deviceMaintenanceAssignForm.vendor" placeholder="请选择服务厂商">
          <el-option label="西门子华东服务中心" value="西门子华东服务中心" />
          <el-option label="安捷伦授权商" value="安捷伦授权商" />
          <el-option label="迈瑞售后团队" value="迈瑞售后团队" />
          <el-option label="校内运维组" value="校内运维组" />
        </el-select>
      </el-form-item>
      <el-form-item label="维修工程师" required>
        <el-input v-model="deviceMaintenanceAssignForm.engineer" placeholder="请输入维修工程师姓名" />
      </el-form-item>
      <el-form-item label="计划到场时间">
        <el-input v-model="deviceMaintenanceAssignForm.planTime" placeholder="例如 2026-03-09 09:00" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="deviceMaintenanceAssignVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAssignMaintenance">确认派单</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="consumableIoVisible" :title="consumableIoDialogTitle" width="620px">
    <el-form label-position="top" class="lab-consumable-edit-grid">
      <el-form-item label="业务类型" required>
        <el-select v-model="consumableIoForm.bizType" placeholder="请选择业务类型">
          <el-option label="入库" value="入库" />
          <el-option label="出库" value="出库" />
        </el-select>
      </el-form-item>
      <el-form-item label="耗材名称" required>
        <el-input v-model="consumableIoForm.name" placeholder="请输入耗材名称" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="consumableIoForm.spec" placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item label="库房">
        <el-input v-model="consumableIoForm.warehouse" placeholder="请输入库房名称" />
      </el-form-item>
      <el-form-item label="数量" required>
        <el-input v-model="consumableIoForm.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="consumableIoForm.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="consumableIoVisible = false">取消</el-button>
      <el-button type="primary" @click="submitConsumableIo">确认保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="consumableRejectVisible" :title="consumableRejectDialogTitle" width="520px">
    <el-form label-position="top">
      <el-form-item label="驳回原因" required>
        <el-input
          v-model="consumableRejectReason"
          type="textarea"
          :rows="4"
          maxlength="120"
          show-word-limit
          placeholder="请输入驳回原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="consumableRejectVisible = false">取消</el-button>
      <el-button type="primary" @click="submitConsumableReject">确认驳回</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="reviewRejectVisible" :title="reviewRejectDialogTitle" width="520px">
    <el-form label-position="top">
      <el-form-item :label="reviewRejectMode === 'report' ? '退回说明' : '驳回原因'" required>
        <el-input
          v-model="reviewRejectReason"
          type="textarea"
          :rows="4"
          maxlength="120"
          show-word-limit
          placeholder="请输入处理说明"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="reviewRejectVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReviewReject">确认提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="userDetailVisible" :title="userDetailTitle" width="760px">
    <el-descriptions v-if="userDetailRow" :column="2" border>
      <template v-if="userDetailMode === 'reservation'">
        <el-descriptions-item label="预约单号">{{ userDetailRow.reservationNo || userDetailRow.applicationNo }}</el-descriptions-item>
        <el-descriptions-item label="实验室">{{ userDetailRow.labName || userDetailRow.targetName }}</el-descriptions-item>
        <el-descriptions-item label="实验室类型">{{ userDetailRow.labType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="课程/用途">{{ userDetailRow.courseName || userDetailRow.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ userDetailRow.reservationDate || userDetailRow.submitDate }}</el-descriptions-item>
        <el-descriptions-item label="预约时段">{{ userDetailRow.timeSlot || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{ userDetailRow.status }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ userDetailRow.reviewer || '待分配' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因">{{ userDetailRow.rejectReason || '无' }}</el-descriptions-item>
      </template>
      <template v-else-if="userDetailMode === 'device'">
        <el-descriptions-item label="借用单号">{{ userDetailRow.borrowNo || userDetailRow.applicationNo }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ userDetailRow.deviceName || userDetailRow.targetName }}</el-descriptions-item>
        <el-descriptions-item label="设备类别">{{ userDetailRow.category || '-' }}</el-descriptions-item>
        <el-descriptions-item label="借用用途">{{ userDetailRow.purpose || userDetailRow.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ userDetailRow.applyDate || userDetailRow.submitDate }}</el-descriptions-item>
        <el-descriptions-item label="应归还日期">{{ userDetailRow.expectedReturnDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{ userDetailRow.status }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ userDetailRow.reviewer || '待分配' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因">{{ userDetailRow.rejectReason || '无' }}</el-descriptions-item>
      </template>
      <template v-else-if="userDetailMode === 'consumable'">
        <el-descriptions-item label="申请单号">{{ userDetailRow.reviewNo || userDetailRow.applicationNo }}</el-descriptions-item>
        <el-descriptions-item label="耗材名称">{{ userDetailRow.name || userDetailRow.targetName }}</el-descriptions-item>
        <el-descriptions-item label="耗材分类">{{ userDetailRow.category || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请数量">{{ userDetailRow.quantity || '-' }}</el-descriptions-item>
        <el-descriptions-item label="使用用途">{{ userDetailRow.usagePurpose || userDetailRow.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ userDetailRow.applyDate || userDetailRow.submitDate }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{ userDetailRow.status }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ userDetailRow.reviewer || '待分配' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因">{{ userDetailRow.rejectReason || '无' }}</el-descriptions-item>
      </template>
      <template v-else>
        <el-descriptions-item label="申请单号">{{ userDetailRow.applicationNo }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">{{ userDetailRow.bizType }}</el-descriptions-item>
        <el-descriptions-item label="目标资源">{{ userDetailRow.targetName }}</el-descriptions-item>
        <el-descriptions-item label="提交日期">{{ userDetailRow.submitDate }}</el-descriptions-item>
        <el-descriptions-item label="当前节点">{{ userDetailRow.currentNode }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ userDetailRow.reviewer || '待分配' }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">{{ userDetailRow.status }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ userDetailRow.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因">{{ userDetailRow.rejectReason || '无' }}</el-descriptions-item>
      </template>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="userReservationVisible" title="新增实验室预约" width="680px">
    <el-form label-position="top" class="lab-user-edit-grid">
      <el-form-item label="实验室名称" required>
        <el-input v-model="userReservationForm.labName" placeholder="请输入实验室名称" />
      </el-form-item>
      <el-form-item label="实验室类型">
        <el-select v-model="userReservationForm.labType" placeholder="请选择实验室类型">
          <el-option label="电子实训室" value="电子实训室" />
          <el-option label="智能制造实训室" value="智能制造实训室" />
          <el-option label="护理技能实训室" value="护理技能实训室" />
          <el-option label="汽车检修实训室" value="汽车检修实训室" />
        </el-select>
      </el-form-item>
      <el-form-item :label="isTeacher ? '课程名称' : '预约用途'" required>
        <el-input v-model="userReservationForm.courseName" :placeholder="isTeacher ? '请输入课程名称' : '请输入预约用途'" />
      </el-form-item>
      <el-form-item label="预约日期" required>
        <el-input v-model="userReservationForm.reservationDate" placeholder="例如 2026-03-10" />
      </el-form-item>
      <el-form-item label="预约时段" required>
        <el-select v-model="userReservationForm.timeSlot" placeholder="请选择预约时段">
          <el-option label="08:00-10:00" value="08:00-10:00" />
          <el-option label="10:20-12:00" value="10:20-12:00" />
          <el-option label="14:00-16:00" value="14:00-16:00" />
          <el-option label="18:30-20:30" value="18:30-20:30" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="userReservationVisible = false">取消</el-button>
      <el-button type="primary" @click="submitUserReservation">提交预约</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="userDeviceVisible" title="发起设备借用" width="680px">
    <el-form label-position="top" class="lab-user-edit-grid">
      <el-form-item label="设备名称" required>
        <el-input v-model="userDeviceForm.deviceName" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备类别">
        <el-select v-model="userDeviceForm.category" placeholder="请选择设备类别">
          <el-option label="数控设备" value="数控设备" />
          <el-option label="电子测试设备" value="电子测试设备" />
          <el-option label="护理实训设备" value="护理实训设备" />
          <el-option label="汽车诊断设备" value="汽车诊断设备" />
        </el-select>
      </el-form-item>
      <el-form-item label="借用用途" required>
        <el-input v-model="userDeviceForm.purpose" placeholder="请输入借用用途" />
      </el-form-item>
      <el-form-item label="应归还日期" required>
        <el-input v-model="userDeviceForm.expectedReturnDate" placeholder="例如 2026-03-15" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="userDeviceVisible = false">取消</el-button>
      <el-button type="primary" @click="submitUserDeviceBorrow">提交借用</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="userConsumableVisible" title="提交耗材申领" width="680px">
    <el-form label-position="top" class="lab-user-edit-grid">
      <el-form-item label="耗材名称" required>
        <el-input v-model="userConsumableForm.name" placeholder="请输入耗材名称" />
      </el-form-item>
      <el-form-item label="耗材分类">
        <el-select v-model="userConsumableForm.category" placeholder="请选择耗材分类">
          <el-option label="电子元件" value="电子元件" />
          <el-option label="焊接辅料" value="焊接辅料" />
          <el-option label="护理耗材" value="护理耗材" />
          <el-option label="汽车保养耗材" value="汽车保养耗材" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请数量" required>
        <el-input v-model="userConsumableForm.quantity" placeholder="请输入申请数量" />
      </el-form-item>
      <el-form-item label="使用用途" required>
        <el-input v-model="userConsumableForm.usagePurpose" placeholder="请输入使用用途" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="userConsumableVisible = false">取消</el-button>
      <el-button type="primary" @click="submitUserConsumable">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  LAB_CONSUMABLE_MANAGER_MENU_ROWS,
  LAB_CONSUMABLE_MANAGER_MENUS,
  LAB_CONSUMABLE_MANAGER_STATS,
  LAB_DEVICE_MANAGER_MENU_ROWS,
  LAB_DEVICE_MANAGER_MENUS,
  LAB_DEVICE_MANAGER_STATS,
  LAB_MENU_ROWS,
  LAB_MANAGER_MENU_ROWS,
  LAB_MANAGER_MENUS,
  LAB_MANAGER_STATS,
  LAB_STUDENT_PORTAL_MENU_ROWS,
  LAB_STUDENT_PORTAL_STATS,
  LAB_SYSTEM_ADMIN_MENUS,
  LAB_SYSTEM_STATS,
  LAB_TEACHER_PORTAL_MENU_ROWS,
  LAB_TEACHER_PORTAL_STATS,
  LAB_USER_PORTAL_MENUS,
  getLabConsumableManagerMenuById,
  getLabDeviceManagerMenuById,
  getLabManagerMenuById,
  getLabMenuById,
  getLabUserPortalMenuById,
  type LabConsumableManagerMenuId,
  type LabDeviceManagerMenuId,
  type LabManagerMenuId,
  type LabMenuId,
  type LabUserPortalMenuId
} from '@/mock/labPlatform'

const router = useRouter()
const nowDate = '2026-03-08'
type LabBizType = '实验室预约' | '设备借用' | '耗材申领' | '易耗品申领'

const currentRole = computed(() => sessionStorage.getItem('lab_role') || '')
const currentRoleLabel = computed(() => sessionStorage.getItem('lab_role_label') || '访客')
const currentUserName = computed(() => sessionStorage.getItem('lab_name') || '未登录用户')
const isSystemAdmin = computed(() => currentRole.value === 'system-admin')
const isLabAdmin = computed(() => currentRole.value === 'lab-admin')
const isDeviceAdmin = computed(() => currentRole.value === 'device-admin')
const isConsumableAdmin = computed(() => currentRole.value === 'consumable-admin')
const isTeacher = computed(() => currentRole.value === 'teacher')
const isStudent = computed(() => currentRole.value === 'student')
const isUserPortal = computed(() => isTeacher.value || isStudent.value)

const activeMenuId = ref<LabMenuId>('user-permission')
const draftFilters = reactive<Record<string, string>>({})
const appliedFilters = reactive<Record<string, string>>({})
const currentPage = ref(1)
const pageSize = ref(10)
const menuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabMenuId, Record<string, string | number>[]>
)
const labAdminMenuId = ref<LabManagerMenuId>('reservation-manage')
const labAdminDraftFilters = reactive<Record<string, string>>({})
const labAdminAppliedFilters = reactive<Record<string, string>>({})
const labAdminCurrentPage = ref(1)
const labAdminPageSize = ref(10)
const reservationDetailVisible = ref(false)
const reservationRejectVisible = ref(false)
const reservationDetailRow = ref<Record<string, string | number> | null>(null)
const reservationPendingRow = ref<Record<string, string | number> | null>(null)
const reservationRejectReason = ref('')
const labAdminMenuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_MANAGER_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabManagerMenuId, Record<string, string | number>[]>
)
const deviceAdminMenuId = ref<LabDeviceManagerMenuId>('device-ledger')
const deviceAdminDraftFilters = reactive<Record<string, string>>({})
const deviceAdminAppliedFilters = reactive<Record<string, string>>({})
const deviceAdminCurrentPage = ref(1)
const deviceAdminPageSize = ref(10)
const deviceDetailVisible = ref(false)
const deviceEditorVisible = ref(false)
const deviceEditorMode = ref<'create' | 'edit'>('create')
const deviceBorrowRejectVisible = ref(false)
const deviceMaintenanceAssignVisible = ref(false)
const deviceDetailRow = ref<Record<string, string | number> | null>(null)
const deviceBorrowPendingRow = ref<Record<string, string | number> | null>(null)
const deviceMaintenancePendingRow = ref<Record<string, string | number> | null>(null)
const deviceBorrowRejectReason = ref('')
const deviceForm = reactive({
  assetCode: '',
  deviceName: '',
  category: '',
  brand: '',
  model: '',
  labName: '',
  keeper: '',
  networkStatus: '',
  status: ''
})
const deviceMaintenanceAssignForm = reactive({
  vendor: '',
  engineer: '',
  planTime: ''
})
const deviceAdminMenuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_DEVICE_MANAGER_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabDeviceManagerMenuId, Record<string, string | number>[]>
)
const consumableAdminMenuId = ref<LabConsumableManagerMenuId>('consumable-ledger')
const consumableAdminDraftFilters = reactive<Record<string, string>>({})
const consumableAdminAppliedFilters = reactive<Record<string, string>>({})
const consumableAdminCurrentPage = ref(1)
const consumableAdminPageSize = ref(10)
const consumableIoVisible = ref(false)
const consumableRejectVisible = ref(false)
const consumableRejectMode = ref<'review' | 'hazard'>('review')
const consumablePendingRow = ref<Record<string, string | number> | null>(null)
const consumableRejectReason = ref('')
const consumableIoTargetRow = ref<Record<string, string | number> | null>(null)
const consumableIoForm = reactive({
  bizType: '入库',
  name: '',
  spec: '',
  warehouse: '',
  quantity: '',
  remark: ''
})
const consumableAdminMenuRowsState = reactive(
  Object.fromEntries(
    Object.entries(LAB_CONSUMABLE_MANAGER_MENU_ROWS).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabConsumableManagerMenuId, Record<string, string | number>[]>
)
const reviewRejectVisible = ref(false)
const reviewRejectMode = ref<'flow' | 'hazard' | 'report'>('flow')
const reviewPendingRow = ref<Record<string, string | number> | null>(null)
const reviewRejectReason = ref('')
const userPortalMenuId = ref<LabUserPortalMenuId>('reservation-center')
const userPortalDraftFilters = reactive<Record<string, string>>({})
const userPortalAppliedFilters = reactive<Record<string, string>>({})
const userPortalCurrentPage = ref(1)
const userPortalPageSize = ref(10)
const userReservationVisible = ref(false)
const userDeviceVisible = ref(false)
const userConsumableVisible = ref(false)
const userDetailVisible = ref(false)
const userDetailMode = ref<'reservation' | 'device' | 'consumable' | 'application'>('application')
const userDetailRow = ref<Record<string, string | number> | null>(null)
const userReservationForm = reactive({
  labName: '',
  labType: '',
  courseName: '',
  reservationDate: '',
  timeSlot: ''
})
const userDeviceForm = reactive({
  deviceName: '',
  category: '',
  purpose: '',
  expectedReturnDate: ''
})
const userConsumableForm = reactive({
  name: '',
  category: '',
  quantity: '',
  usagePurpose: ''
})
const userPortalSeedRows = currentRole.value === 'student' ? LAB_STUDENT_PORTAL_MENU_ROWS : LAB_TEACHER_PORTAL_MENU_ROWS
const userPortalMenuRowsState = reactive(
  Object.fromEntries(
    Object.entries(userPortalSeedRows).map(([key, rows]) => [
      key,
      rows.map((row) => ({ ...row }))
    ])
  ) as Record<LabUserPortalMenuId, Record<string, string | number>[]>
)

const activeMenu = computed(() => getLabMenuById(activeMenuId.value))
const activeLabAdminMenu = computed(() => getLabManagerMenuById(labAdminMenuId.value))
const activeDeviceAdminMenu = computed(() => getLabDeviceManagerMenuById(deviceAdminMenuId.value))
const activeConsumableAdminMenu = computed(() => getLabConsumableManagerMenuById(consumableAdminMenuId.value))
const activeUserPortalMenu = computed(() => getLabUserPortalMenuById(userPortalMenuId.value))

const menuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_SYSTEM_ADMIN_MENUS>()

  for (const item of LAB_SYSTEM_ADMIN_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const activeRows = computed(() => menuRowsState[activeMenuId.value] ?? [])
const labAdminActiveRows = computed(() => labAdminMenuRowsState[labAdminMenuId.value] ?? [])
const deviceAdminActiveRows = computed(() => deviceAdminMenuRowsState[deviceAdminMenuId.value] ?? [])
const consumableAdminActiveRows = computed(() => consumableAdminMenuRowsState[consumableAdminMenuId.value] ?? [])
const userPortalActiveRows = computed(() => userPortalMenuRowsState[userPortalMenuId.value] ?? [])

const filteredRows = computed(() => {
  return activeRows.value.filter((row) => {
    return activeMenu.value.filters.every((filter) => {
      const keyword = (appliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const labAdminFilteredRows = computed(() => {
  return labAdminActiveRows.value.filter((row) => {
    return activeLabAdminMenu.value.filters.every((filter) => {
      const keyword = (labAdminAppliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const deviceAdminFilteredRows = computed(() => {
  return deviceAdminActiveRows.value.filter((row) => {
    return activeDeviceAdminMenu.value.filters.every((filter) => {
      const keyword = (deviceAdminAppliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const consumableAdminFilteredRows = computed(() => {
  return consumableAdminActiveRows.value.filter((row) => {
    return activeConsumableAdminMenu.value.filters.every((filter) => {
      const keyword = (consumableAdminAppliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const userPortalFilteredRows = computed(() => {
  return userPortalActiveRows.value.filter((row) => {
    return activeUserPortalMenu.value.filters.every((filter) => {
      const keyword = (userPortalAppliedFilters[filter.key] ?? '').trim()
      if (!keyword) {
        return true
      }

      if (filter.key === 'keyword') {
        return Object.values(row).some((value) => String(value).includes(keyword))
      }

      const targetValue = String(row[filter.key] ?? '')
      if (filter.type === 'date') {
        return targetValue.startsWith(keyword)
      }

      return targetValue.includes(keyword)
    })
  })
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRows.value.slice(start, end)
})

const labAdminPagedRows = computed(() => {
  const start = (labAdminCurrentPage.value - 1) * labAdminPageSize.value
  const end = start + labAdminPageSize.value
  return labAdminFilteredRows.value.slice(start, end)
})

const deviceAdminPagedRows = computed(() => {
  const start = (deviceAdminCurrentPage.value - 1) * deviceAdminPageSize.value
  const end = start + deviceAdminPageSize.value
  return deviceAdminFilteredRows.value.slice(start, end)
})

const consumableAdminPagedRows = computed(() => {
  const start = (consumableAdminCurrentPage.value - 1) * consumableAdminPageSize.value
  const end = start + consumableAdminPageSize.value
  return consumableAdminFilteredRows.value.slice(start, end)
})

const userPortalPagedRows = computed(() => {
  const start = (userPortalCurrentPage.value - 1) * userPortalPageSize.value
  const end = start + userPortalPageSize.value
  return userPortalFilteredRows.value.slice(start, end)
})

const topStats = computed(() => {
  if (activeMenuId.value === 'approval-center') {
    const waiting = filteredRows.value.filter((item) => item.status === '待审核').length
    const processing = filteredRows.value.filter((item) => item.status === '审批中').length
    const passed = filteredRows.value.filter((item) => item.status === '已通过').length
    const rejected = filteredRows.value.filter((item) => item.status === '已驳回').length
    return [
      { label: '待审核', value: `${waiting}` },
      { label: '审批中', value: `${processing}` },
      { label: '已通过', value: `${passed}` },
      { label: '已驳回', value: `${rejected}` }
    ]
  }

  if (activeMenuId.value === 'operation-logs') {
    const success = filteredRows.value.filter((item) => item.result === '成功').length
    const warning = filteredRows.value.filter((item) => item.result === '预警').length
    const failed = filteredRows.value.filter((item) => item.result === '失败').length
    return [
      { label: '日志总数', value: `${filteredRows.value.length}` },
      { label: '执行成功', value: `${success}` },
      { label: '执行预警', value: `${warning}` },
      { label: '执行失败', value: `${failed}` }
    ]
  }

  return LAB_SYSTEM_STATS.slice(0, 4)
})

const labAdminTopStats = computed(() => {
  if (labAdminMenuId.value === 'reservation-manage') {
    return [
      { label: '待审核', value: `${labAdminFilteredRows.value.filter((item) => item.status === '待审核').length}` },
      { label: '已通过', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已驳回').length}` },
      { label: '已取消', value: `${labAdminFilteredRows.value.filter((item) => item.status === '已取消').length}` }
    ]
  }

  if (labAdminMenuId.value === 'inspection-tasks') {
    return [
      { label: '待执行', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '待执行').length}` },
      { label: '处理中', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '处理中').length}` },
      { label: '已完成', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '已完成').length}` },
      { label: '逾期', value: `${labAdminFilteredRows.value.filter((item) => item.taskStatus === '逾期').length}` }
    ]
  }

  return LAB_MANAGER_STATS
})

const deviceAdminTopStats = computed(() => {
  if (deviceAdminMenuId.value === 'maintenance-orders') {
    return [
      { label: '待派单', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '待派单').length}` },
      { label: '维修中', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '维修中').length}` },
      { label: '待验收', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '待验收').length}` },
      { label: '已完成', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '已完成').length}` }
    ]
  }

  if (deviceAdminMenuId.value === 'borrow-audit') {
    return [
      { label: '待审核', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '待审核').length}` },
      { label: '已通过', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '已驳回').length}` },
      { label: '已归档', value: `${deviceAdminFilteredRows.value.filter((item) => item.status === '已归档').length}` }
    ]
  }

  return LAB_DEVICE_MANAGER_STATS
})

const consumableAdminTopStats = computed(() => {
  if (consumableAdminMenuId.value === 'borrow-review') {
    return [
      { label: '待审核', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '待审核').length}` },
      { label: '已通过', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '已驳回').length}` },
      { label: '已归档', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '已归档').length}` }
    ]
  }

  if (consumableAdminMenuId.value === 'hazardous-audit') {
    return [
      { label: '待初审', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '待初审').length}` },
      { label: '待复审', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '待复审').length}` },
      { label: '已通过', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回', value: `${consumableAdminFilteredRows.value.filter((item) => item.status === '已驳回').length}` }
    ]
  }

  return LAB_CONSUMABLE_MANAGER_STATS
})

const userPortalTopStats = computed(() => {
  if (userPortalMenuId.value === 'my-applications') {
    return [
      { label: '申请总数', value: `${userPortalFilteredRows.value.length}` },
      { label: '待审核', value: `${userPortalFilteredRows.value.filter((item) => item.status === '待审核').length}` },
      { label: '已通过', value: `${userPortalFilteredRows.value.filter((item) => item.status === '已通过').length}` },
      { label: '已驳回/取消', value: `${userPortalFilteredRows.value.filter((item) => item.status === '已驳回' || item.status === '已取消').length}` }
    ]
  }

  return isStudent.value ? LAB_STUDENT_PORTAL_STATS : LAB_TEACHER_PORTAL_STATS
})

const deviceDialogTitle = computed(() => {
  return deviceEditorMode.value === 'create' ? '新增设备' : '编辑设备'
})

const consumableIoDialogTitle = computed(() => `${consumableIoForm.bizType}登记`)
const consumableRejectDialogTitle = computed(() => (consumableRejectMode.value === 'hazard' ? '驳回危险品申请' : '驳回领用申请'))
const reviewRejectDialogTitle = computed(() => {
  if (reviewRejectMode.value === 'report') {
    return '退回报表'
  }
  return reviewRejectMode.value === 'hazard' ? '驳回危险品复审' : '驳回流程申请'
})
const userDetailTitle = computed(() => {
  if (userDetailMode.value === 'reservation') {
    return '预约详情'
  }
  if (userDetailMode.value === 'device') {
    return '设备借用详情'
  }
  if (userDetailMode.value === 'consumable') {
    return '耗材申领详情'
  }
  return '申请详情'
})

const resetFilterState = () => {
  for (const key of Object.keys(draftFilters)) {
    delete draftFilters[key]
  }

  for (const key of Object.keys(appliedFilters)) {
    delete appliedFilters[key]
  }

  for (const filter of activeMenu.value.filters) {
    draftFilters[filter.key] = ''
    appliedFilters[filter.key] = ''
  }

  currentPage.value = 1
}

const resetLabAdminFilterState = () => {
  for (const key of Object.keys(labAdminDraftFilters)) {
    delete labAdminDraftFilters[key]
  }

  for (const key of Object.keys(labAdminAppliedFilters)) {
    delete labAdminAppliedFilters[key]
  }

  for (const filter of activeLabAdminMenu.value.filters) {
    labAdminDraftFilters[filter.key] = ''
    labAdminAppliedFilters[filter.key] = ''
  }

  labAdminCurrentPage.value = 1
}

const resetDeviceAdminFilterState = () => {
  for (const key of Object.keys(deviceAdminDraftFilters)) {
    delete deviceAdminDraftFilters[key]
  }

  for (const key of Object.keys(deviceAdminAppliedFilters)) {
    delete deviceAdminAppliedFilters[key]
  }

  for (const filter of activeDeviceAdminMenu.value.filters) {
    deviceAdminDraftFilters[filter.key] = ''
    deviceAdminAppliedFilters[filter.key] = ''
  }

  deviceAdminCurrentPage.value = 1
}

const resetConsumableAdminFilterState = () => {
  for (const key of Object.keys(consumableAdminDraftFilters)) {
    delete consumableAdminDraftFilters[key]
  }

  for (const key of Object.keys(consumableAdminAppliedFilters)) {
    delete consumableAdminAppliedFilters[key]
  }

  for (const filter of activeConsumableAdminMenu.value.filters) {
    consumableAdminDraftFilters[filter.key] = ''
    consumableAdminAppliedFilters[filter.key] = ''
  }

  consumableAdminCurrentPage.value = 1
}

const resetUserPortalFilterState = () => {
  for (const key of Object.keys(userPortalDraftFilters)) {
    delete userPortalDraftFilters[key]
  }

  for (const key of Object.keys(userPortalAppliedFilters)) {
    delete userPortalAppliedFilters[key]
  }

  for (const filter of activeUserPortalMenu.value.filters) {
    userPortalDraftFilters[filter.key] = ''
    userPortalAppliedFilters[filter.key] = ''
  }

  userPortalCurrentPage.value = 1
}

const applyFilters = () => {
  for (const filter of activeMenu.value.filters) {
    appliedFilters[filter.key] = draftFilters[filter.key] ?? ''
  }
  currentPage.value = 1
}

const applyLabAdminFilters = () => {
  for (const filter of activeLabAdminMenu.value.filters) {
    labAdminAppliedFilters[filter.key] = labAdminDraftFilters[filter.key] ?? ''
  }
  labAdminCurrentPage.value = 1
}

const applyDeviceAdminFilters = () => {
  for (const filter of activeDeviceAdminMenu.value.filters) {
    deviceAdminAppliedFilters[filter.key] = deviceAdminDraftFilters[filter.key] ?? ''
  }
  deviceAdminCurrentPage.value = 1
}

const applyConsumableAdminFilters = () => {
  for (const filter of activeConsumableAdminMenu.value.filters) {
    consumableAdminAppliedFilters[filter.key] = consumableAdminDraftFilters[filter.key] ?? ''
  }
  consumableAdminCurrentPage.value = 1
}

const applyUserPortalFilters = () => {
  for (const filter of activeUserPortalMenu.value.filters) {
    userPortalAppliedFilters[filter.key] = userPortalDraftFilters[filter.key] ?? ''
  }
  userPortalCurrentPage.value = 1
}

const resetFilters = () => {
  resetFilterState()
}

const resetLabAdminFilters = () => {
  resetLabAdminFilterState()
}

const resetDeviceAdminFilters = () => {
  resetDeviceAdminFilterState()
}

const resetConsumableAdminFilters = () => {
  resetConsumableAdminFilterState()
}

const resetUserPortalFilters = () => {
  resetUserPortalFilterState()
}

const handleSelectMenu = (index: string) => {
  activeMenuId.value = index as LabMenuId
}

const labAdminMenuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_MANAGER_MENUS>()

  for (const item of LAB_MANAGER_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const deviceAdminMenuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_DEVICE_MANAGER_MENUS>()

  for (const item of LAB_DEVICE_MANAGER_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const consumableAdminMenuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_CONSUMABLE_MANAGER_MENUS>()

  for (const item of LAB_CONSUMABLE_MANAGER_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const userPortalMenuGroups = computed(() => {
  const groupMap = new Map<string, typeof LAB_USER_PORTAL_MENUS>()

  for (const item of LAB_USER_PORTAL_MENUS) {
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
    }
    groupMap.get(item.group)?.push(item)
  }

  return Array.from(groupMap.entries()).map(([name, items]) => ({ name, items }))
})

const handleSelectLabAdminMenu = (index: string) => {
  labAdminMenuId.value = index as LabManagerMenuId
}

const handleSelectDeviceAdminMenu = (index: string) => {
  deviceAdminMenuId.value = index as LabDeviceManagerMenuId
}

const handleSelectConsumableAdminMenu = (index: string) => {
  consumableAdminMenuId.value = index as LabConsumableManagerMenuId
}

const handleSelectUserPortalMenu = (index: string) => {
  userPortalMenuId.value = index as LabUserPortalMenuId
}

const makeDateCode = (prefix: string, length: number) => `${prefix}${nowDate.replace(/-/g, '')}${String(length + 1).padStart(4, '0')}`

const isConsumableBizType = (bizType: string) => bizType === '耗材申领' || bizType === '易耗品申领'

const normalizeBizType = (bizType: string): LabBizType => {
  if (bizType === '实验室预约' || bizType === '设备借用' || bizType === '易耗品申领') {
    return bizType
  }
  return '耗材申领'
}

const updateRowByKey = (
  rows: Record<string, string | number>[],
  key: string,
  id: string,
  patch: Record<string, string | number>
) => {
  const target = rows.find((item) => String(item[key] ?? '') === id)
  if (target) {
    Object.assign(target, patch)
  }
  return target
}

const removeRowByKey = (rows: Record<string, string | number>[], key: string, id: string) => {
  const index = rows.findIndex((item) => String(item[key] ?? '') === id)
  if (index >= 0) {
    rows.splice(index, 1)
  }
}

const syncApprovalQueues = (
  applicationNo: string,
  bizType: string,
  patch: Record<string, string | number>
) => {
  updateRowByKey(menuRowsState['approval-center'], 'orderNo', applicationNo, patch)

  if (bizType === '实验室预约') {
    updateRowByKey(labAdminMenuRowsState['reservation-manage'], 'reservationNo', applicationNo, patch)
  }
  if (bizType === '设备借用') {
    updateRowByKey(deviceAdminMenuRowsState['borrow-audit'], 'borrowNo', applicationNo, patch)
  }
  if (isConsumableBizType(bizType)) {
    updateRowByKey(consumableAdminMenuRowsState['borrow-review'], 'reviewNo', applicationNo, patch)
  }
}

const syncUserPortalQueues = (
  applicationNo: string,
  bizType: string,
  patch: Record<string, string | number>
) => {
  updateRowByKey(userPortalMenuRowsState['my-applications'], 'applicationNo', applicationNo, patch)

  if (bizType === '实验室预约') {
    updateRowByKey(userPortalMenuRowsState['reservation-center'], 'reservationNo', applicationNo, patch)
  }
  if (bizType === '设备借用') {
    updateRowByKey(userPortalMenuRowsState['device-service'], 'borrowNo', applicationNo, patch)
  }
  if (isConsumableBizType(bizType)) {
    updateRowByKey(userPortalMenuRowsState['consumable-service'], 'reviewNo', applicationNo, patch)
  }
}

const pushSharedApprovalRows = (payload: {
  applicationNo: string
  bizType: LabBizType
  targetResource: string
  applicant: string
  applicantRole: string
  applyDate: string
  currentNode: string
  roleRow: Record<string, string | number>
}) => {
  menuRowsState['approval-center'].unshift({
    orderNo: payload.applicationNo,
    bizType: payload.bizType,
    applicant: payload.applicant,
    applicantRole: payload.applicantRole,
    targetResource: payload.targetResource,
    applyTime: `${payload.applyDate} 09:00`,
    applyDate: payload.applyDate,
    status: '待审核',
    currentNode: payload.currentNode,
    approver: '待分配'
  })

  if (payload.bizType === '实验室预约') {
    labAdminMenuRowsState['reservation-manage'].unshift(payload.roleRow)
  }
  if (payload.bizType === '设备借用') {
    deviceAdminMenuRowsState['borrow-audit'].unshift(payload.roleRow)
  }
  if (isConsumableBizType(payload.bizType)) {
    consumableAdminMenuRowsState['borrow-review'].unshift(payload.roleRow)
  }
}

const finalizeApplicationStatus = (
  applicationNo: string,
  bizType: LabBizType,
  status: '已通过' | '已驳回' | '已取消',
  reviewer: string,
  rejectReason = ''
) => {
  const currentNode = '流程结束'
  const patch = {
    status,
    reviewer,
    approver: reviewer,
    currentNode,
    rejectReason
  }
  syncUserPortalQueues(applicationNo, bizType, patch)
  syncApprovalQueues(applicationNo, bizType, patch)
}

const removePendingQueuesForCancel = (applicationNo: string, bizType: LabBizType) => {
  removeRowByKey(menuRowsState['approval-center'], 'orderNo', applicationNo)

  if (bizType === '实验室预约') {
    removeRowByKey(labAdminMenuRowsState['reservation-manage'], 'reservationNo', applicationNo)
  }
  if (bizType === '设备借用') {
    removeRowByKey(deviceAdminMenuRowsState['borrow-audit'], 'borrowNo', applicationNo)
  }
  if (isConsumableBizType(bizType)) {
    removeRowByKey(consumableAdminMenuRowsState['borrow-review'], 'reviewNo', applicationNo)
  }
}

const openUserDetail = (row: Record<string, string | number>) => {
  userDetailRow.value = row
  if (userPortalMenuId.value === 'reservation-center' || String(row.bizType ?? '') === '实验室预约') {
    userDetailMode.value = 'reservation'
  } else if (userPortalMenuId.value === 'device-service' || String(row.bizType ?? '') === '设备借用') {
    userDetailMode.value = 'device'
  } else if (userPortalMenuId.value === 'consumable-service' || isConsumableBizType(String(row.bizType ?? ''))) {
    userDetailMode.value = 'consumable'
  } else {
    userDetailMode.value = 'application'
  }
  userDetailVisible.value = true
}

const parsePositiveNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

const calcStockStatus = (stock: number, safeStock: number) => {
  if (stock <= safeStock * 0.5) {
    return '紧缺'
  }
  if (stock <= safeStock) {
    return '预警'
  }
  return '充足'
}

const syncConsumableWarningRow = (ledgerRow: Record<string, string | number>) => {
  const warningRows = consumableAdminMenuRowsState['stock-warning']
  const warningIndex = warningRows.findIndex((item) => item.sku === ledgerRow.sku)
  const stock = Number(ledgerRow.stock ?? 0)
  const safeStock = Number(ledgerRow.safeStock ?? 0)
  const warningType = stock <= safeStock * 0.5 ? '紧缺预警' : stock <= safeStock ? '库存预警' : '效期预警'

  if (warningIndex >= 0) {
    Object.assign(warningRows[warningIndex], {
      sku: ledgerRow.sku,
      name: ledgerRow.name,
      warehouse: ledgerRow.warehouse,
      stock,
      safeStock,
      warningType,
      hazardLevel: ledgerRow.hazardLevel,
      expiryDate: warningRows[warningIndex].expiryDate || '2026-12-31'
    })
  } else {
    warningRows.unshift({
      sku: ledgerRow.sku,
      name: ledgerRow.name,
      warehouse: ledgerRow.warehouse,
      stock,
      safeStock,
      warningType,
      hazardLevel: ledgerRow.hazardLevel,
      expiryDate: '2026-12-31',
      handleStatus: '待处理',
      handler: '待分配',
      manager: ledgerRow.manager
    })
  }
}

const fillConsumableIoForm = (row?: Record<string, string | number>, bizType = '入库') => {
  consumableIoForm.bizType = bizType
  consumableIoForm.name = String(row?.name ?? '')
  consumableIoForm.spec = String(row?.spec ?? '')
  consumableIoForm.warehouse = String(row?.warehouse ?? '')
  consumableIoForm.quantity = ''
  consumableIoForm.remark = ''
}

const openConsumableIoDialog = (row: Record<string, string | number>, bizType: '入库' | '出库') => {
  consumableIoTargetRow.value = row
  fillConsumableIoForm(row, bizType)
  consumableIoVisible.value = true
}

const openStandaloneConsumableIo = (bizType: '入库' | '出库') => {
  consumableIoTargetRow.value = null
  fillConsumableIoForm(undefined, bizType)
  consumableIoVisible.value = true
}

const submitConsumableIo = () => {
  const quantity = parsePositiveNumber(consumableIoForm.quantity)
  if (!consumableIoForm.name.trim() || quantity <= 0) {
    ElMessage.warning('请填写耗材名称和有效数量')
    return
  }

  const ledgerRows = consumableAdminMenuRowsState['consumable-ledger']
  const ioRows = consumableAdminMenuRowsState['inbound-outbound']
  const targetRow =
    consumableIoTargetRow.value ||
    ledgerRows.find((item) => String(item.name) === consumableIoForm.name.trim() && String(item.warehouse) === consumableIoForm.warehouse.trim()) ||
    null

  let ledgerRow = targetRow

  if (!ledgerRow && consumableIoForm.bizType === '出库') {
    ElMessage.warning('未找到对应台账，请先确认耗材信息')
    return
  }

  if (!ledgerRow) {
    ledgerRow = {
      sku: makeDateCode('XM', ledgerRows.length),
      name: consumableIoForm.name.trim(),
      category: '电子元件',
      spec: consumableIoForm.spec.trim() || '标准规格',
      warehouse: consumableIoForm.warehouse.trim() || '中心库房A',
      hazardLevel: '普通',
      stock: 0,
      safeStock: 30,
      stockStatus: '充足',
      manager: currentUserName.value,
      lastInbound: nowDate
    }
    ledgerRows.unshift(ledgerRow)
  }

  const currentStock = Number(ledgerRow.stock ?? 0)
  const nextStock = consumableIoForm.bizType === '入库' ? currentStock + quantity : Math.max(0, currentStock - quantity)
  ledgerRow.stock = nextStock
  ledgerRow.stockStatus = calcStockStatus(nextStock, Number(ledgerRow.safeStock ?? 30))
  if (consumableIoForm.bizType === '入库') {
    ledgerRow.lastInbound = nowDate
  }
  ledgerRow.spec = consumableIoForm.spec.trim() || String(ledgerRow.spec ?? '标准规格')
  ledgerRow.warehouse = consumableIoForm.warehouse.trim() || String(ledgerRow.warehouse ?? '中心库房A')

  ioRows.unshift({
    orderNo: makeDateCode('CK', ioRows.length),
    bizType: consumableIoForm.bizType,
    name: consumableIoForm.name.trim(),
    spec: consumableIoForm.spec.trim() || String(ledgerRow.spec ?? ''),
    warehouse: consumableIoForm.warehouse.trim() || String(ledgerRow.warehouse ?? ''),
    quantity,
    operator: currentUserName.value,
    operateDate: nowDate,
    operateTime: `${nowDate} 09:30`,
    remark: consumableIoForm.remark.trim() || `${consumableIoForm.bizType}登记`
  })

  syncConsumableWarningRow(ledgerRow)
  consumableIoVisible.value = false
  consumableAdminCurrentPage.value = 1
  ElMessage.success(`${consumableIoForm.bizType}登记已保存`)
}

const approveConsumableReview = (row: Record<string, string | number>) => {
  if (row.status !== '待审核') {
    return
  }

  row.status = '已通过'
  row.reviewer = currentUserName.value
  row.rejectReason = ''
  finalizeApplicationStatus(String(row.reviewNo), '耗材申领', '已通过', currentUserName.value)
  ElMessage.success('领用申请已通过')
}

const approveHazardousAudit = (row: Record<string, string | number>) => {
  if (row.status === '待初审') {
    row.status = '待复审'
    row.firstReviewer = currentUserName.value
    row.secondReviewer = '库房主管'
    ElMessage.success('危险品申请已转入复审')
    return
  }

  if (row.status === '待复审') {
    row.status = '已通过'
    row.secondReviewer = currentUserName.value
    ElMessage.success('危险品申请已审核通过')
  }
}

const openConsumableRejectDialog = (row: Record<string, string | number>, mode: 'review' | 'hazard') => {
  consumablePendingRow.value = row
  consumableRejectMode.value = mode
  consumableRejectReason.value = ''
  consumableRejectVisible.value = true
}

const submitConsumableReject = () => {
  if (!consumablePendingRow.value) {
    return
  }

  if (!consumableRejectReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  consumablePendingRow.value.status = '已驳回'
  consumablePendingRow.value.rejectReason = consumableRejectReason.value.trim()
  if (consumableRejectMode.value === 'hazard') {
    if (consumablePendingRow.value.firstReviewer === '待分配') {
      consumablePendingRow.value.firstReviewer = currentUserName.value
    } else {
      consumablePendingRow.value.secondReviewer = currentUserName.value
    }
  } else {
    consumablePendingRow.value.reviewer = currentUserName.value
    finalizeApplicationStatus(String(consumablePendingRow.value.reviewNo), '耗材申领', '已驳回', currentUserName.value, consumableRejectReason.value.trim())
  }
  consumableRejectVisible.value = false
  ElMessage.success('申请已驳回')
}

const handleConsumableWarning = (row: Record<string, string | number>) => {
  const currentStatus = String(row.handleStatus ?? '待处理')
  row.handleStatus = currentStatus === '待处理' ? '处理中' : '已完成'
  row.handler = currentUserName.value
  ElMessage.success(currentStatus === '待处理' ? '预警已转入处理中' : '预警已处理完成')
}

const openDeviceDetail = (row: Record<string, string | number>) => {
  deviceDetailRow.value = row
  deviceDetailVisible.value = true
}

const fillDeviceForm = (row?: Record<string, string | number>) => {
  deviceForm.assetCode = String(row?.assetCode ?? '')
  deviceForm.deviceName = String(row?.deviceName ?? '')
  deviceForm.category = String(row?.category ?? '')
  deviceForm.brand = String(row?.brand ?? '')
  deviceForm.model = String(row?.model ?? '')
  deviceForm.labName = String(row?.labName ?? '')
  deviceForm.keeper = String(row?.keeper ?? '')
  deviceForm.networkStatus = String(row?.networkStatus ?? '在线')
  deviceForm.status = String(row?.status ?? '在用')
}

const openCreateDevice = () => {
  deviceEditorMode.value = 'create'
  deviceDetailRow.value = null
  fillDeviceForm()
  deviceEditorVisible.value = true
}

const openEditDevice = (row: Record<string, string | number>) => {
  deviceEditorMode.value = 'edit'
  deviceDetailRow.value = row
  fillDeviceForm(row)
  deviceEditorVisible.value = true
}

const submitDeviceForm = () => {
  if (!deviceForm.assetCode.trim() || !deviceForm.deviceName.trim()) {
    ElMessage.warning('请填写设备编号和设备名称')
    return
  }

  const payload = {
    assetCode: deviceForm.assetCode.trim(),
    deviceName: deviceForm.deviceName.trim(),
    category: deviceForm.category.trim(),
    brand: deviceForm.brand.trim(),
    model: deviceForm.model.trim(),
    labName: deviceForm.labName.trim(),
    keeper: deviceForm.keeper.trim(),
    networkStatus: deviceForm.networkStatus.trim(),
    status: deviceForm.status.trim()
  }

  const rows = deviceAdminMenuRowsState['device-ledger']

  if (deviceEditorMode.value === 'create') {
    rows.unshift(payload)
    ElMessage.success('设备已新增')
  } else if (deviceDetailRow.value) {
    Object.assign(deviceDetailRow.value, payload)
    ElMessage.success('设备信息已更新')
  }

  deviceEditorVisible.value = false
}

const deleteDeviceRow = async (row: Record<string, string | number>) => {
  await ElMessageBox.confirm(`确认删除设备 ${row.deviceName} 吗？`, '删除确认', {
    type: 'warning'
  })

  const rows = deviceAdminMenuRowsState['device-ledger']
  const index = rows.indexOf(row)
  if (index >= 0) {
    rows.splice(index, 1)
    ElMessage.success('设备已删除')
  }
}

const approveDeviceBorrow = (row: Record<string, string | number>) => {
  if (deviceAdminMenuId.value !== 'borrow-audit' || row.status !== '待审核') {
    return
  }

  row.status = '已通过'
  row.reviewer = currentUserName.value
  row.rejectReason = ''
  finalizeApplicationStatus(String(row.borrowNo), '设备借用', '已通过', currentUserName.value)
  ElMessage.success('设备借还申请已通过')
}

const openDeviceBorrowReject = (row: Record<string, string | number>) => {
  if (deviceAdminMenuId.value !== 'borrow-audit' || row.status !== '待审核') {
    return
  }

  deviceBorrowPendingRow.value = row
  deviceBorrowRejectReason.value = ''
  deviceBorrowRejectVisible.value = true
}

const submitDeviceBorrowReject = () => {
  if (!deviceBorrowPendingRow.value) {
    return
  }

  if (!deviceBorrowRejectReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  deviceBorrowPendingRow.value.status = '已驳回'
  deviceBorrowPendingRow.value.reviewer = currentUserName.value
  deviceBorrowPendingRow.value.rejectReason = deviceBorrowRejectReason.value.trim()
  finalizeApplicationStatus(
    String(deviceBorrowPendingRow.value.borrowNo),
    '设备借用',
    '已驳回',
    currentUserName.value,
    deviceBorrowRejectReason.value.trim()
  )
  deviceBorrowRejectVisible.value = false
  ElMessage.success('设备借还申请已驳回')
}

const openAssignMaintenance = (row: Record<string, string | number>) => {
  if (deviceAdminMenuId.value !== 'maintenance-orders' || row.status !== '待派单') {
    return
  }

  deviceMaintenancePendingRow.value = row
  deviceMaintenanceAssignForm.vendor = String(row.vendor || '')
  deviceMaintenanceAssignForm.engineer = ''
  deviceMaintenanceAssignForm.planTime = ''
  deviceMaintenanceAssignVisible.value = true
}

const submitAssignMaintenance = () => {
  if (!deviceMaintenancePendingRow.value) {
    return
  }

  if (!deviceMaintenanceAssignForm.vendor.trim() || !deviceMaintenanceAssignForm.engineer.trim()) {
    ElMessage.warning('请选择服务厂商并填写维修工程师')
    return
  }

  deviceMaintenancePendingRow.value.vendor = deviceMaintenanceAssignForm.vendor.trim()
  deviceMaintenancePendingRow.value.engineer = deviceMaintenanceAssignForm.engineer.trim()
  deviceMaintenancePendingRow.value.planTime = deviceMaintenanceAssignForm.planTime.trim() || '-'
  deviceMaintenancePendingRow.value.status = '维修中'
  deviceMaintenanceAssignVisible.value = false
  ElMessage.success('维修工单已派单')
}

const completeMaintenance = (row: Record<string, string | number>) => {
  if (deviceAdminMenuId.value !== 'maintenance-orders' || row.status !== '维修中') {
    return
  }

  row.status = '待验收'
  ElMessage.success('维修工单已标记为待验收')
}

const acceptMaintenance = (row: Record<string, string | number>) => {
  if (deviceAdminMenuId.value !== 'maintenance-orders' || row.status !== '待验收') {
    return
  }

  row.status = '已完成'
  ElMessage.success('维修工单已验收完成')
}

const openReservationDetail = (row: Record<string, string | number>) => {
  reservationDetailRow.value = row
  reservationDetailVisible.value = true
}

const approveReservation = (row: Record<string, string | number>) => {
  if (labAdminMenuId.value !== 'reservation-manage' || row.status !== '待审核') {
    return
  }

  row.status = '已通过'
  row.reviewer = currentUserName.value
  row.rejectReason = ''
  finalizeApplicationStatus(String(row.reservationNo), '实验室预约', '已通过', currentUserName.value)
  ElMessage.success('预约审核已通过')
}

const openRejectDialog = (row: Record<string, string | number>) => {
  if (labAdminMenuId.value !== 'reservation-manage' || row.status !== '待审核') {
    return
  }

  reservationPendingRow.value = row
  reservationRejectReason.value = ''
  reservationRejectVisible.value = true
}

const submitReservationReject = () => {
  if (!reservationPendingRow.value) {
    return
  }

  if (!reservationRejectReason.value.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  reservationPendingRow.value.status = '已驳回'
  reservationPendingRow.value.reviewer = currentUserName.value
  reservationPendingRow.value.rejectReason = reservationRejectReason.value.trim()
  finalizeApplicationStatus(
    String(reservationPendingRow.value.reservationNo),
    '实验室预约',
    '已驳回',
    currentUserName.value,
    reservationRejectReason.value.trim()
  )
  reservationRejectVisible.value = false
  ElMessage.success('预约申请已驳回')
}

const approveReviewFlow = (row: Record<string, string | number>) => {
  if (!['待审核', '审批中'].includes(String(row.status))) {
    return
  }

  row.status = '已通过'
  row.currentNode = '流程结束'
  row.approver = currentUserName.value
  row.reviewAdvice = '审核通过'
  const bizType = normalizeBizType(String(row.bizType))
  if (['实验室预约', '设备借用', '耗材申领', '易耗品申领'].includes(bizType)) {
    finalizeApplicationStatus(String(row.orderNo), bizType, '已通过', currentUserName.value)
  }
  ElMessage.success('流程审批已通过')
}

const approveReviewReport = (row: Record<string, string | number>) => {
  if (!['待提交', '审核中'].includes(String(row.status))) {
    return
  }

  row.status = '已上报'
  row.reviewer = currentUserName.value
  ElMessage.success('报表已审核并上报')
}

const openReviewRejectDialog = (row: Record<string, string | number>, mode: 'flow' | 'hazard' | 'report') => {
  reviewPendingRow.value = row
  reviewRejectMode.value = mode
  reviewRejectReason.value = ''
  reviewRejectVisible.value = true
}

const submitReviewReject = () => {
  if (!reviewPendingRow.value) {
    return
  }

  if (!reviewRejectReason.value.trim()) {
    ElMessage.warning('请输入处理说明')
    return
  }

  if (reviewRejectMode.value === 'report') {
    reviewPendingRow.value.status = '退回修改'
    reviewPendingRow.value.reviewer = currentUserName.value
  } else if (reviewRejectMode.value === 'hazard') {
    reviewPendingRow.value.status = '已驳回'
    reviewPendingRow.value.secondReviewer = currentUserName.value
  } else {
    reviewPendingRow.value.status = '已驳回'
    reviewPendingRow.value.currentNode = '流程结束'
    reviewPendingRow.value.approver = currentUserName.value
    const bizType = normalizeBizType(String(reviewPendingRow.value.bizType))
    if (['实验室预约', '设备借用', '耗材申领', '易耗品申领'].includes(bizType)) {
      finalizeApplicationStatus(String(reviewPendingRow.value.orderNo), bizType, '已驳回', currentUserName.value, reviewRejectReason.value.trim())
    }
  }

  reviewPendingRow.value.rejectReason = reviewRejectReason.value.trim()
  reviewRejectVisible.value = false
  ElMessage.success(reviewRejectMode.value === 'report' ? '报表已退回修改' : '审批已驳回')
}

const resetUserReservationForm = () => {
  userReservationForm.labName = ''
  userReservationForm.labType = ''
  userReservationForm.courseName = ''
  userReservationForm.reservationDate = ''
  userReservationForm.timeSlot = ''
}

const resetUserDeviceForm = () => {
  userDeviceForm.deviceName = ''
  userDeviceForm.category = ''
  userDeviceForm.purpose = ''
  userDeviceForm.expectedReturnDate = ''
}

const resetUserConsumableForm = () => {
  userConsumableForm.name = ''
  userConsumableForm.category = ''
  userConsumableForm.quantity = ''
  userConsumableForm.usagePurpose = ''
}

const openUserReservationDialog = () => {
  resetUserReservationForm()
  userReservationVisible.value = true
}

const openUserDeviceDialog = () => {
  resetUserDeviceForm()
  userDeviceVisible.value = true
}

const openUserConsumableDialog = () => {
  resetUserConsumableForm()
  userConsumableVisible.value = true
}

const appendUserApplication = (payload: Record<string, string | number>) => {
  userPortalMenuRowsState['my-applications'].unshift(payload)
}

const submitUserReservation = () => {
  if (!userReservationForm.labName.trim() || !userReservationForm.courseName.trim() || !userReservationForm.reservationDate.trim()) {
    ElMessage.warning('请完整填写预约信息')
    return
  }

  const reservationNo = makeDateCode(isTeacher.value ? 'TYY' : 'SYY', userPortalMenuRowsState['reservation-center'].length)
  userPortalMenuRowsState['reservation-center'].unshift({
    reservationNo,
    labName: userReservationForm.labName.trim(),
    labType: userReservationForm.labType.trim() || '电子实训室',
    courseName: userReservationForm.courseName.trim(),
    reservationDate: userReservationForm.reservationDate.trim(),
    timeSlot: userReservationForm.timeSlot.trim() || '14:00-16:00',
    status: '待审核',
    reviewer: '待分配'
  })
  pushSharedApprovalRows({
    applicationNo: reservationNo,
    bizType: '实验室预约',
    targetResource: userReservationForm.labName.trim(),
    applicant: currentUserName.value,
    applicantRole: currentRoleLabel.value,
    applyDate: userReservationForm.reservationDate.trim(),
    currentNode: '实验室审核',
    roleRow: {
      reservationNo,
      labName: userReservationForm.labName.trim(),
      applicant: currentUserName.value,
      applicantRole: currentRoleLabel.value,
      courseName: userReservationForm.courseName.trim(),
      reservationDate: userReservationForm.reservationDate.trim(),
      timeSlot: userReservationForm.timeSlot.trim() || '14:00-16:00',
      status: '待审核',
      reviewer: '待分配',
      rejectReason: ''
    }
  })
  appendUserApplication({
    applicationNo: reservationNo,
    bizType: '实验室预约',
    targetName: userReservationForm.labName.trim(),
    submitDate: userReservationForm.reservationDate.trim(),
    status: '待审核',
    currentNode: '实验室审核',
    reviewer: '待分配',
    remark: userReservationForm.courseName.trim()
  })
  userReservationVisible.value = false
  userPortalCurrentPage.value = 1
  ElMessage.success('预约申请已提交')
}

const submitUserDeviceBorrow = () => {
  if (!userDeviceForm.deviceName.trim() || !userDeviceForm.purpose.trim() || !userDeviceForm.expectedReturnDate.trim()) {
    ElMessage.warning('请完整填写借用信息')
    return
  }

  const borrowNo = makeDateCode(isTeacher.value ? 'TSB' : 'SSB', userPortalMenuRowsState['device-service'].length)
  userPortalMenuRowsState['device-service'].unshift({
    borrowNo,
    deviceName: userDeviceForm.deviceName.trim(),
    category: userDeviceForm.category.trim() || '电子测试设备',
    purpose: userDeviceForm.purpose.trim(),
    applyDate: nowDate,
    expectedReturnDate: userDeviceForm.expectedReturnDate.trim(),
    status: '待审核',
    reviewer: '待分配'
  })
  pushSharedApprovalRows({
    applicationNo: borrowNo,
    bizType: '设备借用',
    targetResource: userDeviceForm.deviceName.trim(),
    applicant: currentUserName.value,
    applicantRole: currentRoleLabel.value,
    applyDate: nowDate,
    currentNode: '设备审核',
    roleRow: {
      borrowNo,
      bizType: '借用申请',
      deviceName: userDeviceForm.deviceName.trim(),
      applicant: currentUserName.value,
      department: currentRoleLabel.value,
      applyDate: nowDate,
      expectedReturnDate: userDeviceForm.expectedReturnDate.trim(),
      status: '待审核',
      reviewer: '待分配',
      rejectReason: ''
    }
  })
  appendUserApplication({
    applicationNo: borrowNo,
    bizType: '设备借用',
    targetName: userDeviceForm.deviceName.trim(),
    submitDate: nowDate,
    status: '待审核',
    currentNode: '设备审核',
    reviewer: '待分配',
    remark: userDeviceForm.purpose.trim()
  })
  userDeviceVisible.value = false
  userPortalCurrentPage.value = 1
  ElMessage.success('设备借用申请已提交')
}

const submitUserConsumable = () => {
  const quantity = parsePositiveNumber(userConsumableForm.quantity)
  if (!userConsumableForm.name.trim() || !userConsumableForm.usagePurpose.trim() || quantity <= 0) {
    ElMessage.warning('请完整填写耗材申请信息')
    return
  }

  const reviewNo = makeDateCode(isTeacher.value ? 'TSL' : 'SSL', userPortalMenuRowsState['consumable-service'].length)
  userPortalMenuRowsState['consumable-service'].unshift({
    reviewNo,
    name: userConsumableForm.name.trim(),
    category: userConsumableForm.category.trim() || '电子元件',
    quantity,
    usagePurpose: userConsumableForm.usagePurpose.trim(),
    applyDate: nowDate,
    status: '待审核',
    reviewer: '待分配'
  })
  pushSharedApprovalRows({
    applicationNo: reviewNo,
    bizType: '易耗品申领',
    targetResource: userConsumableForm.name.trim(),
    applicant: currentUserName.value,
    applicantRole: currentRoleLabel.value,
    applyDate: nowDate,
    currentNode: '耗材审核',
    roleRow: {
      reviewNo,
      bizType: '领用申请',
      applicant: currentUserName.value,
      department: currentRoleLabel.value,
      name: userConsumableForm.name.trim(),
      quantity,
      applyDate: nowDate,
      status: '待审核',
      reviewer: '待分配',
      usagePurpose: userConsumableForm.usagePurpose.trim(),
      rejectReason: ''
    }
  })
  appendUserApplication({
    applicationNo: reviewNo,
    bizType: '易耗品申领',
    targetName: userConsumableForm.name.trim(),
    submitDate: nowDate,
    status: '待审核',
    currentNode: '耗材审核',
    reviewer: '待分配',
    remark: userConsumableForm.usagePurpose.trim()
  })
  userConsumableVisible.value = false
  userPortalCurrentPage.value = 1
  ElMessage.success('耗材申领已提交')
}

const cancelUserApplication = async (row: Record<string, string | number>) => {
  if (row.status !== '待审核') {
    return
  }

  await ElMessageBox.confirm(`确认撤回申请 ${row.applicationNo} 吗？`, '撤回确认', {
    type: 'warning'
  })

  row.status = '已取消'
  row.currentNode = '流程结束'
  row.reviewer = currentUserName.value
  const bizType = normalizeBizType(String(row.bizType))
  if (['实验室预约', '设备借用', '耗材申领', '易耗品申领'].includes(bizType)) {
    removePendingQueuesForCancel(String(row.applicationNo), bizType)
    syncUserPortalQueues(String(row.applicationNo), bizType, {
      status: '已取消',
      currentNode: '流程结束',
      reviewer: currentUserName.value
    })
  }

  ElMessage.success('申请已撤回')
}

const updateUserStatus = (row: Record<string, string | number>, status: '启用' | '停用') => {
  if (activeMenuId.value !== 'user-permission') {
    return
  }

  row.status = status
  ElMessage.success(`账号已${status === '启用' ? '启用' : '禁用'}`)
}

const goHome = () => {
  void router.push('/')
}

const logout = () => {
  sessionStorage.removeItem('lab_auth')
  sessionStorage.removeItem('lab_role')
  sessionStorage.removeItem('lab_role_label')
  sessionStorage.removeItem('lab_account')
  sessionStorage.removeItem('lab_name')
  void router.push('/lab/login')
}

watch(
  () => activeMenuId.value,
  () => {
    resetFilterState()
  },
  { immediate: true }
)

watch(
  () => labAdminMenuId.value,
  () => {
    resetLabAdminFilterState()
  },
  { immediate: true }
)

watch(
  () => deviceAdminMenuId.value,
  () => {
    resetDeviceAdminFilterState()
  },
  { immediate: true }
)

watch(
  () => consumableAdminMenuId.value,
  () => {
    resetConsumableAdminFilterState()
  },
  { immediate: true }
)

watch(
  () => userPortalMenuId.value,
  () => {
    resetUserPortalFilterState()
  },
  { immediate: true }
)

watch(
  () => filteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }
)

watch(
  () => labAdminFilteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / labAdminPageSize.value))
    if (labAdminCurrentPage.value > maxPage) {
      labAdminCurrentPage.value = maxPage
    }
  }
)

watch(
  () => deviceAdminFilteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / deviceAdminPageSize.value))
    if (deviceAdminCurrentPage.value > maxPage) {
      deviceAdminCurrentPage.value = maxPage
    }
  }
)

watch(
  () => consumableAdminFilteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / consumableAdminPageSize.value))
    if (consumableAdminCurrentPage.value > maxPage) {
      consumableAdminCurrentPage.value = maxPage
    }
  }
)

watch(
  () => userPortalFilteredRows.value.length,
  (length) => {
    const maxPage = Math.max(1, Math.ceil(length / userPortalPageSize.value))
    if (userPortalCurrentPage.value > maxPage) {
      userPortalCurrentPage.value = maxPage
    }
  }
)

watch(
  () => pageSize.value,
  () => {
    currentPage.value = 1
  }
)

watch(
  () => labAdminPageSize.value,
  () => {
    labAdminCurrentPage.value = 1
  }
)

watch(
  () => deviceAdminPageSize.value,
  () => {
    deviceAdminCurrentPage.value = 1
  }
)

watch(
  () => consumableAdminPageSize.value,
  () => {
    consumableAdminCurrentPage.value = 1
  }
)

watch(
  () => userPortalPageSize.value,
  () => {
    userPortalCurrentPage.value = 1
  }
)
</script>

<style scoped>
.lab-manage-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-manage-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #ecfeff;
  background:
    radial-gradient(circle at top, rgba(45, 212, 191, 0.22), transparent 36%),
    linear-gradient(180deg, #115e59 0%, #155e75 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-manage-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-manage-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-manage-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(236, 254, 255, 0.88);
}

.lab-manage-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-manage-user-card span,
.lab-manage-user-card em {
  font-size: 13px;
  color: rgba(236, 254, 255, 0.84);
}

.lab-manage-user-card strong {
  font-size: 18px;
}

.lab-manage-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-manage-menu :deep(.el-menu) {
  background: transparent;
}

.lab-manage-menu :deep(.el-sub-menu__title),
.lab-manage-menu :deep(.el-menu-item) {
  color: rgba(240, 253, 250, 0.94);
}

.lab-manage-menu :deep(.el-sub-menu .el-menu-item),
.lab-manage-menu :deep(.el-sub-menu .el-menu) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-manage-menu :deep(.el-menu-item.is-active) {
  color: #052e2b;
  background: rgba(240, 253, 250, 0.92);
  border-radius: 12px;
}

.lab-manage-menu :deep(.el-sub-menu__title:hover),
.lab-manage-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-manage-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-manage-main {
  min-width: 0;
}

.lab-manage-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(240, 253, 250, 0.78));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-manage-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.lab-manage-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-manage-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-manage-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-panel-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.lab-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-data-table {
  width: 100%;
}

.lab-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lab-role-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-role-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #eff6ff;
  background:
    radial-gradient(circle at top, rgba(96, 165, 250, 0.22), transparent 36%),
    linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-role-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-role-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-role-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(219, 234, 254, 0.9);
}

.lab-role-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-role-user-card span,
.lab-role-user-card em {
  font-size: 13px;
  color: rgba(219, 234, 254, 0.88);
}

.lab-role-user-card strong {
  font-size: 18px;
}

.lab-role-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-role-menu :deep(.el-menu),
.lab-role-menu :deep(.el-sub-menu .el-menu) {
  background: transparent;
}

.lab-role-menu :deep(.el-sub-menu__title),
.lab-role-menu :deep(.el-menu-item) {
  color: rgba(239, 246, 255, 0.96);
}

.lab-role-menu :deep(.el-sub-menu .el-menu-item) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-role-menu :deep(.el-menu-item.is-active) {
  color: #172554;
  background: rgba(239, 246, 255, 0.94);
  border-radius: 12px;
}

.lab-role-menu :deep(.el-sub-menu__title:hover),
.lab-role-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-role-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-role-main {
  min-width: 0;
}

.lab-role-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(239, 246, 255, 0.82));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-role-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.lab-role-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-role-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-role-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-role-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-role-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-role-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-role-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-role-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.lab-role-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-role-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-role-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-role-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-role-table {
  width: 100%;
}

.lab-role-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-role-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lab-device-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-device-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #fefce8;
  background:
    radial-gradient(circle at top, rgba(251, 191, 36, 0.22), transparent 36%),
    linear-gradient(180deg, #92400e 0%, #78350f 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-device-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-device-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-device-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(254, 252, 232, 0.9);
}

.lab-device-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-device-user-card span,
.lab-device-user-card em {
  font-size: 13px;
  color: rgba(254, 252, 232, 0.88);
}

.lab-device-user-card strong {
  font-size: 18px;
}

.lab-device-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-device-menu :deep(.el-menu),
.lab-device-menu :deep(.el-sub-menu .el-menu) {
  background: transparent;
}

.lab-device-menu :deep(.el-sub-menu__title),
.lab-device-menu :deep(.el-menu-item) {
  color: rgba(255, 251, 235, 0.96);
}

.lab-device-menu :deep(.el-sub-menu .el-menu-item) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-device-menu :deep(.el-menu-item.is-active) {
  color: #451a03;
  background: rgba(255, 251, 235, 0.94);
  border-radius: 12px;
}

.lab-device-menu :deep(.el-sub-menu__title:hover),
.lab-device-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-device-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-device-main {
  min-width: 0;
}

.lab-device-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(255, 247, 237, 0.86));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-device-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b45309;
}

.lab-device-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-device-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-device-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-device-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-device-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-device-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-device-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-device-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.lab-device-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-device-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-device-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-device-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-device-table {
  width: 100%;
}

.lab-device-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-device-edit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.lab-device-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lab-supply-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-supply-side {
  padding: 24px 20px;
  border-radius: 24px;
  color: #ecfdf5;
  background:
    radial-gradient(circle at top, rgba(52, 211, 153, 0.2), transparent 36%),
    linear-gradient(180deg, #047857 0%, #065f46 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-supply-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-supply-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-supply-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
  color: rgba(236, 253, 245, 0.9);
}

.lab-supply-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-supply-user-card span,
.lab-supply-user-card em {
  font-size: 13px;
  color: rgba(209, 250, 229, 0.88);
}

.lab-supply-user-card strong {
  font-size: 18px;
}

.lab-supply-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-supply-menu :deep(.el-menu),
.lab-supply-menu :deep(.el-sub-menu .el-menu) {
  background: transparent;
}

.lab-supply-menu :deep(.el-sub-menu__title),
.lab-supply-menu :deep(.el-menu-item) {
  color: rgba(236, 253, 245, 0.96);
}

.lab-supply-menu :deep(.el-sub-menu .el-menu-item) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-supply-menu :deep(.el-menu-item.is-active) {
  color: #064e3b;
  background: rgba(236, 253, 245, 0.94);
  border-radius: 12px;
}

.lab-supply-menu :deep(.el-sub-menu__title:hover),
.lab-supply-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-supply-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-supply-main {
  min-width: 0;
}

.lab-supply-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(236, 253, 245, 0.86));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-supply-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #047857;
}

.lab-supply-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-supply-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-supply-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-supply-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-supply-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-supply-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-supply-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-supply-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.lab-supply-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-supply-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-supply-toolbar-actions {
  display: flex;
  gap: 10px;
}

.lab-supply-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-supply-table {
  width: 100%;
}

.lab-supply-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-consumable-edit-grid,
.lab-user-edit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.lab-supply-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.lab-user-page {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: calc(100vh - 96px);
  gap: 22px;
}

.lab-user-page--teacher .lab-user-side {
  color: #f0f9ff;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.22), transparent 36%),
    linear-gradient(180deg, #0369a1 0%, #075985 100%);
}

.lab-user-page--student .lab-user-side {
  color: #eff6ff;
  background:
    radial-gradient(circle at top, rgba(129, 140, 248, 0.22), transparent 36%),
    linear-gradient(180deg, #4338ca 0%, #3730a3 100%);
}

.lab-user-side {
  padding: 24px 20px;
  border-radius: 24px;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.lab-user-kicker {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.12);
}

.lab-user-brand h1 {
  margin-top: 18px;
  font-size: 28px;
  line-height: 1.25;
}

.lab-user-brand p:last-child {
  margin-top: 10px;
  line-height: 1.75;
}

.lab-user-user-card {
  display: grid;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
}

.lab-user-user-card span,
.lab-user-user-card em {
  font-size: 13px;
  opacity: 0.88;
}

.lab-user-user-card strong {
  font-size: 18px;
}

.lab-user-menu {
  margin-top: 20px;
  border: none;
  background: transparent;
}

.lab-user-menu :deep(.el-menu),
.lab-user-menu :deep(.el-sub-menu .el-menu) {
  background: transparent;
}

.lab-user-menu :deep(.el-sub-menu__title),
.lab-user-menu :deep(.el-menu-item) {
  color: rgba(239, 246, 255, 0.96);
}

.lab-user-menu :deep(.el-sub-menu .el-menu-item) {
  background: rgba(255, 255, 255, 0.04);
}

.lab-user-page--teacher .lab-user-menu :deep(.el-menu-item.is-active) {
  color: #0c4a6e;
  background: rgba(240, 249, 255, 0.94);
  border-radius: 12px;
}

.lab-user-page--student .lab-user-menu :deep(.el-menu-item.is-active) {
  color: #312e81;
  background: rgba(238, 242, 255, 0.94);
  border-radius: 12px;
}

.lab-user-menu :deep(.el-sub-menu__title:hover),
.lab-user-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

.lab-user-side-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.lab-user-main {
  min-width: 0;
}

.lab-user-header {
  padding: 26px 28px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(239, 246, 255, 0.86));
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.lab-user-header-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2563eb;
}

.lab-user-header h2 {
  margin-top: 8px;
  font-size: 30px;
  color: #0f172a;
}

.lab-user-header-desc {
  margin-top: 8px;
  color: #475569;
}

.lab-user-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.lab-user-stat-card {
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.lab-user-stat-card span {
  font-size: 13px;
  color: #64748b;
}

.lab-user-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  color: #0f172a;
}

.lab-user-panel {
  margin-top: 18px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.lab-user-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.lab-user-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.lab-user-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.lab-user-toolbar-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.lab-user-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 16px;
  margin-bottom: 14px;
}

.lab-user-table {
  width: 100%;
}

.lab-user-row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lab-user-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.placeholder-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 120px);
}

.placeholder-card {
  width: min(620px, 100%);
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
}

.placeholder-badge-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.placeholder-badge,
.placeholder-user {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
}

.placeholder-badge {
  color: #065f46;
  background: rgba(16, 185, 129, 0.14);
}

.placeholder-user {
  color: #0f172a;
  background: rgba(148, 163, 184, 0.16);
}

.placeholder-title {
  font-size: 28px;
  color: #0f172a;
  margin-bottom: 14px;
}

.placeholder-desc {
  font-size: 16px;
  color: #475569;
  margin-bottom: 22px;
  line-height: 1.75;
}

.placeholder-action-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 1100px) {
  .lab-manage-page {
    grid-template-columns: 1fr;
  }

  .lab-role-page {
    grid-template-columns: 1fr;
  }

  .lab-device-page {
    grid-template-columns: 1fr;
  }

  .lab-supply-page {
    grid-template-columns: 1fr;
  }

  .lab-user-page {
    grid-template-columns: 1fr;
  }

  .lab-stat-grid,
  .lab-filter-grid,
  .lab-role-stat-grid,
  .lab-role-filter-grid,
  .lab-device-stat-grid,
  .lab-device-filter-grid,
  .lab-supply-stat-grid,
  .lab-supply-filter-grid,
  .lab-user-stat-grid,
  .lab-user-filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .lab-stat-grid,
  .lab-filter-grid,
  .lab-role-stat-grid,
  .lab-role-filter-grid,
  .lab-device-stat-grid,
  .lab-device-filter-grid,
  .lab-supply-stat-grid,
  .lab-supply-filter-grid,
  .lab-user-stat-grid,
  .lab-user-filter-grid {
    grid-template-columns: 1fr;
  }

  .lab-device-edit-grid,
  .lab-consumable-edit-grid,
  .lab-user-edit-grid {
    grid-template-columns: 1fr;
  }

  .lab-panel-head,
  .lab-toolbar-actions,
  .lab-role-panel-head,
  .lab-role-toolbar-actions,
  .lab-device-panel-head,
  .lab-device-toolbar-actions,
  .lab-supply-panel-head,
  .lab-supply-toolbar-actions,
  .lab-user-panel-head,
  .lab-user-toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lab-pagination,
  .lab-role-pagination,
  .lab-device-pagination,
  .lab-supply-pagination,
  .lab-user-pagination {
    justify-content: center;
  }

  .lab-supply-side-actions,
  .lab-user-side-actions {
    flex-direction: column;
  }
}
</style>
