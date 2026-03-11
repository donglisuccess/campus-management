<template>
  <section class="welcome-manage-page">
    <aside class="welcome-manage-side">
      <div class="welcome-manage-brand">
        <p class="welcome-manage-kicker">Freshman Operations</p>
        <h1>迎新 PC 管理端</h1>
        <p>一期模块覆盖首页总览、学生管理、预报到、防疫门禁、健康打卡、紧急调度和公告发布。</p>
      </div>

      <div class="welcome-user-card">
        <span>当前登录</span>
        <strong>{{ currentUserName }}</strong>
        <em>{{ currentRoleLabel }}</em>
      </div>

      <el-menu :default-active="activeMenuKey" class="welcome-side-menu" @select="handleSelectMenu">
        <el-sub-menu v-for="group in menuGroups" :key="group.name" :index="group.name">
          <template #title>{{ group.name }}</template>
          <el-menu-item v-for="item in group.items" :key="item.key" :index="item.key">
            {{ item.label }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="welcome-side-actions">
        <el-button @click="goDashboard">领导驾驶舱</el-button>
        <el-button @click="goHome">返回首页</el-button>
        <el-button type="danger" plain @click="logout">退出登录</el-button>
      </div>
    </aside>

    <main class="welcome-manage-main">
      <header class="welcome-main-header">
        <div>
          <p class="welcome-header-kicker">{{ activeMenu?.group }}</p>
          <h2>{{ activeMenu?.label }}</h2>
          <p>{{ activeDescription }}</p>
        </div>
        <div class="welcome-header-side">
          <div class="welcome-header-meta">
            <span>角色权限：{{ permissionSummary }}</span>
            <strong>{{ currentDateLabel }}</strong>
          </div>
          <div class="welcome-header-actions">
            <el-button @click="openLogDrawer">操作日志</el-button>
          </div>
        </div>
      </header>

      <template v-if="activeMenuKey === 'dashboard'">
        <section class="welcome-stat-grid">
          <article v-for="item in dashboardCards" :key="item.label" class="welcome-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <em>{{ item.note }}</em>
          </article>
        </section>

        <section class="welcome-dashboard-grid">
          <el-card class="welcome-panel" shadow="never">
            <template #header>
              <div class="welcome-panel-head">
                <div>
                  <h3>重点待办</h3>
                  <p>结合当前迎新现场的高优先事项，支持快速进入对应模块。</p>
                </div>
              </div>
            </template>

            <div class="welcome-todo-list">
              <article v-for="item in WELCOME_DASHBOARD_TODOS" :key="item.title" class="welcome-todo-item">
                <div>
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.owner }} · 截止 {{ item.deadline }}</span>
                </div>
                <el-tag :type="todoTagType[item.level]" effect="light">{{ item.level }}</el-tag>
              </article>
            </div>
          </el-card>

          <el-card class="welcome-panel" shadow="never">
            <template #header>
              <div class="welcome-panel-head">
                <div>
                  <h3>快捷操作</h3>
                  <p>按权限显示可直达模块。</p>
                </div>
              </div>
            </template>

            <div class="welcome-quick-grid">
              <button
                v-for="item in quickActions"
                :key="item.key"
                type="button"
                class="welcome-quick-card"
                @click="activeMenuKey = item.key"
              >
                <strong>{{ item.label }}</strong>
                <span>{{ item.note }}</span>
              </button>
            </div>
          </el-card>
        </section>
      </template>

      <el-card v-else-if="activeMenuKey === 'student'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>学生管理</h3>
              <p>统一维护新生档案、报到状态和宿舍信息。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button type="primary" @click="openStudentImportDialog">学生导入</el-button>
              <el-button @click="exportStudents">导出当前结果</el-button>
              <el-button @click="resetStudentFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--three">
          <el-form-item label="关键词">
            <el-input v-model="studentFilters.keyword" placeholder="姓名 / 学号 / 生源地" clearable />
          </el-form-item>
          <el-form-item label="报到状态">
            <el-select v-model="studentFilters.status" placeholder="请选择状态" clearable>
              <el-option label="已报到" value="已报到" />
              <el-option label="预报到" value="预报到" />
              <el-option label="未到校" value="未到校" />
            </el-select>
          </el-form-item>
          <el-form-item label="学院">
            <el-select v-model="studentFilters.college" placeholder="请选择学院" clearable>
              <el-option v-for="item in collegeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in studentFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedStudents" border stripe row-key="id">
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="id" label="学号" min-width="120" />
          <el-table-column prop="name" label="姓名" min-width="100" />
          <el-table-column prop="gender" label="性别" min-width="80" />
          <el-table-column prop="college" label="学院" min-width="150" />
          <el-table-column prop="major" label="专业" min-width="160" />
          <el-table-column prop="origin" label="生源地" min-width="120" />
          <el-table-column prop="status" label="报到状态" min-width="110" />
          <el-table-column prop="dormitory" label="宿舍" min-width="120" />
          <el-table-column label="操作" fixed="right" min-width="240">
            <template #default="scope">
              <el-button link @click="openDetailDrawer('学生详情', getStudentDetailFields(scope.row))">详情</el-button>
              <el-button link type="primary" @click="openStudentDialog(scope.row)">编辑</el-button>
              <el-button
                link
                type="success"
                :disabled="scope.row.status === '已报到'"
                @click="markStudentArrived(scope.row)"
              >
                补录报到
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.student.currentPage"
            v-model:page-size="paginationState.student.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredStudents.length"
            @size-change="handlePageSizeChange('student')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'precheckin'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>预报到</h3>
              <p>审核到校计划、交通方式和补充材料。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button type="success" :disabled="selectedPrecheckinIds.length === 0" @click="batchApprovePrecheckins">
                批量审核通过
              </el-button>
              <el-button type="warning" :disabled="selectedPrecheckinIds.length === 0" @click="batchReturnPrecheckins">
                批量退回补充
              </el-button>
              <el-button @click="exportPrecheckins">导出当前结果</el-button>
              <el-button @click="resetPrecheckinFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--three">
          <el-form-item label="学生姓名">
            <el-input v-model="precheckinFilters.keyword" placeholder="请输入学生姓名" clearable />
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="precheckinFilters.status" placeholder="请选择状态" clearable>
              <el-option label="已提交" value="已提交" />
              <el-option label="待补充" value="待补充" />
              <el-option label="已审核" value="已审核" />
            </el-select>
          </el-form-item>
          <el-form-item label="学院">
            <el-select v-model="precheckinFilters.college" placeholder="请选择学院" clearable>
              <el-option v-for="item in precheckinCollegeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in precheckinFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedPrecheckins" border stripe row-key="id" @selection-change="handlePrecheckinSelectionChange">
          <el-table-column type="selection" width="54" />
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="studentName" label="学生" min-width="120" />
          <el-table-column prop="college" label="学院" min-width="160" />
          <el-table-column prop="arrivalPlan" label="到校计划" min-width="160" />
          <el-table-column prop="travelMode" label="交通方式" min-width="110" />
          <el-table-column prop="baggage" label="行李" min-width="90" />
          <el-table-column prop="status" label="状态" min-width="110" />
          <el-table-column label="操作" fixed="right" min-width="230">
            <template #default="scope">
              <el-button link @click="openDetailDrawer('预报到详情', getPrecheckinDetailFields(scope.row))">详情</el-button>
              <el-button
                link
                type="success"
                :disabled="scope.row.status === '已审核'"
                @click="approvePrecheckin(scope.row)"
              >
                审核通过
              </el-button>
              <el-button link type="warning" @click="returnPrecheckin(scope.row)">退回补充</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.precheckin.currentPage"
            v-model:page-size="paginationState.precheckin.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredPrecheckins.length"
            @size-change="handlePageSizeChange('precheckin')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'access'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>防疫门禁</h3>
              <p>查看入校核验、体温和预警处理情况。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button @click="exportAccessRows">导出当前结果</el-button>
              <el-button @click="resetAccessFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--three">
          <el-form-item label="学生姓名">
            <el-input v-model="accessFilters.keyword" placeholder="请输入学生姓名" clearable />
          </el-form-item>
          <el-form-item label="校门">
            <el-select v-model="accessFilters.gate" placeholder="请选择校门" clearable>
              <el-option v-for="item in gateOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="结果">
            <el-select v-model="accessFilters.result" placeholder="请选择结果" clearable>
              <el-option label="通过" value="通过" />
              <el-option label="预警" value="预警" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in accessFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedAccessRows" border stripe row-key="id">
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="studentName" label="学生" min-width="110" />
          <el-table-column prop="gate" label="校门" min-width="90" />
          <el-table-column prop="direction" label="方向" min-width="80" />
          <el-table-column prop="temperature" label="体温" min-width="90" />
          <el-table-column prop="time" label="时间" min-width="110" />
          <el-table-column prop="result" label="结果" min-width="100" />
          <el-table-column label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <el-button link @click="openDetailDrawer('门禁详情', getAccessDetailFields(scope.row))">详情</el-button>
              <el-button
                link
                type="success"
                :disabled="scope.row.result === '通过'"
                @click="resolveAccessWarning(scope.row)"
              >
                完成复核
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.access.currentPage"
            v-model:page-size="paginationState.access.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredAccessRows.length"
            @size-change="handlePageSizeChange('access')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'health'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>健康打卡</h3>
              <p>跟踪健康申报异常和待关注名单。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button @click="exportHealthRows">导出当前结果</el-button>
              <el-button @click="resetHealthFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--three">
          <el-form-item label="学生姓名">
            <el-input v-model="healthFilters.keyword" placeholder="请输入学生姓名" clearable />
          </el-form-item>
          <el-form-item label="健康码">
            <el-select v-model="healthFilters.code" placeholder="请选择健康码" clearable>
              <el-option label="绿码" value="绿码" />
              <el-option label="黄码" value="黄码" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="healthFilters.status" placeholder="请选择状态" clearable>
              <el-option label="正常" value="正常" />
              <el-option label="待关注" value="待关注" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in healthFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedHealthRows" border stripe row-key="id">
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="studentName" label="学生" min-width="110" />
          <el-table-column prop="healthCode" label="健康码" min-width="100" />
          <el-table-column prop="symptom" label="症状" min-width="150" />
          <el-table-column prop="clockTime" label="打卡时间" min-width="160" />
          <el-table-column prop="status" label="状态" min-width="100" />
          <el-table-column label="操作" fixed="right" min-width="220">
            <template #default="scope">
              <el-button link @click="openDetailDrawer('健康打卡详情', getHealthDetailFields(scope.row))">详情</el-button>
              <el-button
                link
                type="success"
                :disabled="scope.row.status === '正常'"
                @click="followHealthIssue(scope.row)"
              >
                标记已跟进
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.health.currentPage"
            v-model:page-size="paginationState.health.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredHealthRows.length"
            @size-change="handlePageSizeChange('health')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'dispatch'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>紧急调度</h3>
              <p>对迎新现场突发事件进行派发、跟踪和闭环。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button @click="exportDispatchRows">导出当前结果</el-button>
              <el-button @click="resetDispatchFilters">重置</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--three">
          <el-form-item label="事件关键词">
            <el-input v-model="dispatchFilters.keyword" placeholder="请输入事件关键词" clearable />
          </el-form-item>
          <el-form-item label="等级">
            <el-select v-model="dispatchFilters.level" placeholder="请选择等级" clearable>
              <el-option label="一级" value="一级" />
              <el-option label="二级" value="二级" />
              <el-option label="三级" value="三级" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="dispatchFilters.status" placeholder="请选择状态" clearable>
              <el-option label="待派发" value="待派发" />
              <el-option label="处理中" value="处理中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in dispatchFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedDispatchRows" border stripe row-key="id">
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="event" label="事件" min-width="180" />
          <el-table-column prop="level" label="等级" min-width="90" />
          <el-table-column prop="location" label="位置" min-width="180" />
          <el-table-column prop="owner" label="责任部门" min-width="140" />
          <el-table-column prop="status" label="状态" min-width="100" />
          <el-table-column prop="updateTime" label="更新时间" min-width="100" />
          <el-table-column label="操作" fixed="right" min-width="250">
            <template #default="scope">
              <el-button link @click="openDetailDrawer('调度详情', getDispatchDetailFields(scope.row))">详情</el-button>
              <el-button
                link
                type="primary"
                :disabled="scope.row.status !== '待派发'"
                @click="assignDispatch(scope.row)"
              >
                派发处理
              </el-button>
              <el-button
                link
                type="success"
                :disabled="scope.row.status === '已完成'"
                @click="finishDispatch(scope.row)"
              >
                办结
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.dispatch.currentPage"
            v-model:page-size="paginationState.dispatch.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredDispatchRows.length"
            @size-change="handlePageSizeChange('dispatch')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'notice'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head welcome-panel-head--toolbar">
            <div>
              <h3>公告管理</h3>
              <p>维护学生端和现场大屏使用的迎新公告内容。</p>
            </div>
            <div class="welcome-toolbar-actions">
              <el-button type="success" :disabled="selectedNoticeIds.length === 0" @click="batchPublishNotices">
                批量发布
              </el-button>
              <el-button type="warning" :disabled="selectedNoticeIds.length === 0" @click="batchRevokeNotices">
                批量撤回
              </el-button>
              <el-button @click="exportNotices">导出当前结果</el-button>
              <el-button @click="resetNoticeFilters">重置</el-button>
              <el-button type="primary" @click="openNoticeDialog()">新增公告</el-button>
            </div>
          </div>
        </template>

        <el-form label-position="top" class="welcome-filter-grid welcome-filter-grid--two">
          <el-form-item label="公告标题">
            <el-input v-model="noticeFilters.keyword" placeholder="请输入公告标题" clearable />
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="noticeFilters.status" placeholder="请选择状态" clearable>
              <el-option label="已发布" value="已发布" />
              <el-option label="草稿" value="草稿" />
            </el-select>
          </el-form-item>
        </el-form>

        <div class="welcome-inline-stats">
          <article v-for="item in noticeFilterStats" :key="item.label" class="welcome-inline-stat-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <el-table :data="pagedNotices" border stripe row-key="id" @selection-change="handleNoticeSelectionChange">
          <el-table-column type="selection" width="54" />
          <el-table-column type="index" label="序号" width="72" />
          <el-table-column prop="title" label="标题" min-width="220" />
          <el-table-column prop="audience" label="发布范围" min-width="150" />
          <el-table-column prop="publisher" label="发布人" min-width="120" />
          <el-table-column label="正文摘要" min-width="220">
            <template #default="scope">
              <span>{{ getNoticeSummary(scope.row.content) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" min-width="160" />
          <el-table-column prop="status" label="状态" min-width="100" />
          <el-table-column label="操作" fixed="right" min-width="270">
            <template #default="scope">
              <el-button link @click="openNoticeDetail(scope.row)">详情</el-button>
              <el-button link type="primary" @click="openNoticeDialog(scope.row)">编辑</el-button>
              <el-button
                link
                :type="scope.row.status === '已发布' ? 'warning' : 'success'"
                @click="toggleNoticePublish(scope.row)"
              >
                {{ scope.row.status === '已发布' ? '撤回' : '发布' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="welcome-pagination">
          <el-pagination
            v-model:current-page="paginationState.notice.currentPage"
            v-model:page-size="paginationState.notice.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredNotices.length"
            @size-change="handlePageSizeChange('notice')"
          />
        </div>
      </el-card>

      <el-card v-else-if="activeMenuKey === 'profile'" class="welcome-panel" shadow="never">
        <template #header>
          <div class="welcome-panel-head">
            <div>
              <h3>我的信息</h3>
              <p>查看当前登录后台账号的基础资料。</p>
            </div>
          </div>
        </template>

        <div class="welcome-profile-grid">
          <article class="welcome-profile-card">
            <span>姓名</span>
            <strong>{{ profile.name }}</strong>
          </article>
          <article class="welcome-profile-card">
            <span>角色</span>
            <strong>{{ currentRoleLabel }}</strong>
          </article>
          <article class="welcome-profile-card">
            <span>部门</span>
            <strong>{{ profile.department }}</strong>
          </article>
          <article class="welcome-profile-card">
            <span>手机号</span>
            <strong>{{ profile.phone }}</strong>
          </article>
          <article class="welcome-profile-card">
            <span>邮箱</span>
            <strong>{{ profile.email }}</strong>
          </article>
          <article class="welcome-profile-card">
            <span>最后登录</span>
            <strong>{{ profile.lastLogin }}</strong>
          </article>
        </div>
      </el-card>
    </main>
  </section>

  <el-dialog v-model="studentDialogVisible" title="编辑学生信息" width="720px" destroy-on-close>
    <el-form label-position="top" class="welcome-dialog-grid">
      <el-form-item label="学号">
        <el-input v-model="studentForm.id" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="studentForm.name" disabled />
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="studentForm.college" disabled />
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="studentForm.major" disabled />
      </el-form-item>
      <el-form-item label="报到状态">
        <el-select v-model="studentForm.status">
          <el-option label="已报到" value="已报到" />
          <el-option label="预报到" value="预报到" />
          <el-option label="未到校" value="未到校" />
        </el-select>
      </el-form-item>
      <el-form-item label="宿舍">
        <el-input v-model="studentForm.dormitory" placeholder="请输入宿舍信息" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="studentDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveStudentDialog">保存</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="studentImportDialogVisible" title="导入学生数据" width="860px" destroy-on-close>
    <div class="welcome-import-guide">
      <p>支持上传 Excel 模板文件，系统会校验表头与必填字段，字段顺序为：学号、姓名、性别、学院、专业、班级、生源地、状态、宿舍。</p>
      <div class="welcome-toolbar-actions">
        <el-button @click="downloadStudentImportTemplate">下载模板</el-button>
        <el-button @click="resetStudentImportState">清空</el-button>
      </div>
    </div>

    <el-upload
      class="welcome-upload"
      drag
      :auto-upload="false"
      :limit="1"
      accept=".xlsx,.xls"
      :file-list="studentImportFileList"
      :on-change="handleStudentExcelChange"
      :on-remove="resetStudentImportState"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">将 Excel 文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">仅支持 .xlsx / .xls 文件，上传后会自动进行模板校验。</div>
      </template>
    </el-upload>

    <div v-if="studentImportValidation.fileName" class="welcome-import-result">
      <div class="welcome-inline-stats">
        <article class="welcome-inline-stat-card">
          <span>文件名</span>
          <strong>{{ studentImportValidation.fileName }}</strong>
        </article>
        <article class="welcome-inline-stat-card">
          <span>有效记录</span>
          <strong>{{ studentImportValidation.validRows }}</strong>
        </article>
        <article class="welcome-inline-stat-card">
          <span>异常记录</span>
          <strong>{{ studentImportValidation.invalidRows }}</strong>
        </article>
      </div>

      <el-alert
        :title="studentImportValidation.message"
        :type="studentImportValidation.valid ? 'success' : 'warning'"
        show-icon
        :closable="false"
      />

      <div v-if="studentImportValidation.errors.length" class="welcome-import-errors">
        <strong>校验提示</strong>
        <ul>
          <li v-for="item in studentImportValidation.errors" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <el-button @click="studentImportDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitStudentImport">开始导入</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="noticeDialogVisible" :title="editingNoticeId ? '编辑公告' : '新增公告'" width="760px" destroy-on-close>
    <el-form label-position="top" class="welcome-dialog-grid">
      <el-form-item label="标题">
        <el-input v-model="noticeForm.title" placeholder="请输入公告标题" />
      </el-form-item>
      <el-form-item label="发布范围">
        <el-input v-model="noticeForm.audience" placeholder="例如：全体新生 / 某学院新生" />
      </el-form-item>
      <el-form-item label="发布人">
        <el-input v-model="noticeForm.publisher" placeholder="请输入发布人" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="noticeForm.status">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item label="正文内容" class="welcome-dialog-span-two">
        <div class="welcome-editor-shell">
          <div class="welcome-editor-toolbar">
            <el-button size="small" @click="applyNoticeCommand('bold')">加粗</el-button>
            <el-button size="small" @click="applyNoticeCommand('italic')">斜体</el-button>
            <el-button size="small" @click="applyNoticeCommand('underline')">下划线</el-button>
            <el-button size="small" @click="applyNoticeCommand('insertUnorderedList')">项目符号</el-button>
            <el-button size="small" @click="applyNoticeCommand('formatBlock', 'h3')">标题</el-button>
            <el-button size="small" @click="applyNoticeCommand('formatBlock', 'p')">正文</el-button>
          </div>
          <div
            ref="noticeEditorRef"
            class="welcome-rich-editor"
            contenteditable="true"
            @input="handleNoticeEditorInput"
          ></div>
        </div>
      </el-form-item>
      <el-form-item label="预览" class="welcome-dialog-span-two">
        <div class="welcome-editor-preview" v-html="noticeForm.content"></div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="noticeDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveNoticeDialog">保存</el-button>
    </template>
  </el-dialog>

  <el-drawer v-model="logDrawerVisible" title="操作日志" size="720px">
    <div class="welcome-log-head">
      <div>
        <strong>共 {{ operationLogs.length }} 条日志</strong>
        <p>记录学生导入、审核、发布、调度等后台关键操作。</p>
      </div>
      <el-button @click="clearOperationLogs" :disabled="operationLogs.length === 0">清空日志</el-button>
    </div>

    <el-table :data="pagedOperationLogs" border stripe row-key="id">
      <el-table-column type="index" label="序号" width="72" />
      <el-table-column prop="module" label="模块" min-width="110" />
      <el-table-column prop="action" label="操作" min-width="140" />
      <el-table-column prop="detail" label="详情" min-width="240" />
      <el-table-column prop="operator" label="操作人" min-width="110" />
      <el-table-column prop="time" label="时间" min-width="160" />
      <el-table-column label="结果" min-width="90">
        <template #default="scope">
          <el-tag :type="scope.row.result === '成功' ? 'success' : 'warning'" effect="light">
            {{ scope.row.result }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="welcome-pagination">
      <el-pagination
        v-model:current-page="logPagination.currentPage"
        v-model:page-size="logPagination.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50]"
        :total="operationLogs.length"
        @size-change="handleLogPageSizeChange"
      />
    </div>
  </el-drawer>

  <el-drawer v-model="detailDrawerVisible" :title="detailDrawerTitle" size="640px">
    <div v-if="detailDrawerHtml" class="welcome-detail-html" v-html="detailDrawerHtml"></div>
    <div v-else class="welcome-detail-grid">
      <article v-for="item in detailDrawerFields" :key="item.label" class="welcome-detail-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
import {
  WELCOME_ACCESS_ROWS,
  WELCOME_DASHBOARD_STATS,
  WELCOME_DASHBOARD_TODOS,
  WELCOME_DISPATCH_ROWS,
  WELCOME_HEALTH_ROWS,
  WELCOME_LOGIN_ACCOUNTS,
  WELCOME_MANAGE_MENUS,
  WELCOME_NOTICE_ROWS,
  WELCOME_PHASE_ONE_MENU_KEYS,
  WELCOME_PRECHECKIN_ROWS,
  WELCOME_PROFILE,
  WELCOME_STUDENT_ROWS,
  type WelcomeAccessRow,
  type WelcomeDispatchRow,
  type WelcomeHealthRow,
  type WelcomeManageMenuItem,
  type WelcomeManageMenuKey,
  type WelcomeManageRole,
  type WelcomeNoticeRow,
  type WelcomePreCheckinRow,
  type WelcomeStudentRow
} from '@/mock/welcomeManage'

type PaginationModuleKey = 'student' | 'precheckin' | 'access' | 'health' | 'dispatch' | 'notice'

interface PaginationStateItem {
  currentPage: number
  pageSize: number
}

interface OperationLogItem {
  id: number
  module: string
  action: string
  detail: string
  operator: string
  time: string
  result: '成功' | '提示'
}

interface StudentImportValidationState {
  fileName: string
  valid: boolean
  message: string
  validRows: number
  invalidRows: number
  errors: string[]
}

interface DetailFieldItem {
  label: string
  value: string
}

const STUDENT_IMPORT_HEADERS = ['学号', '姓名', '性别', '学院', '专业', '班级', '生源地', '状态', '宿舍']

const router = useRouter()

const currentRole = ref((sessionStorage.getItem('welcome_role') ?? 'super-admin') as WelcomeManageRole)
const currentRoleLabel = ref(sessionStorage.getItem('welcome_role_label') ?? '超级管理员')
const currentUserName = ref(sessionStorage.getItem('welcome_name') ?? WELCOME_PROFILE.name)
const permissionKeys = ref(
  (sessionStorage.getItem('welcome_permissions') ?? '')
    .split(',')
    .filter(Boolean) as WelcomeManageMenuKey[]
)

if (permissionKeys.value.length === 0) {
  permissionKeys.value = WELCOME_LOGIN_ACCOUNTS[0].permissions
}

const students = ref(WELCOME_STUDENT_ROWS.map((item) => ({ ...item })))
const precheckins = ref(WELCOME_PRECHECKIN_ROWS.map((item) => ({ ...item })))
const accessRows = ref(WELCOME_ACCESS_ROWS.map((item) => ({ ...item })))
const healthRows = ref(WELCOME_HEALTH_ROWS.map((item) => ({ ...item })))
const dispatchRows = ref(WELCOME_DISPATCH_ROWS.map((item) => ({ ...item })))
const notices = ref(WELCOME_NOTICE_ROWS.map((item) => ({ ...item })))

const visibleMenus = computed(() => {
  return WELCOME_MANAGE_MENUS.filter((item) => {
    const isPhaseOne = WELCOME_PHASE_ONE_MENU_KEYS.includes(item.key)
    const isCommon = item.key === 'profile' || item.key === 'logout'
    return permissionKeys.value.includes(item.key) && (isPhaseOne || isCommon)
  })
})

const menuGroups = computed(() => {
  const groups = new Map<string, WelcomeManageMenuItem[]>()

  for (const item of visibleMenus.value) {
    if (!groups.has(item.group)) {
      groups.set(item.group, [])
    }

    groups.get(item.group)?.push(item)
  }

  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }))
})

const firstMenuKey = visibleMenus.value.find((item) => item.key !== 'logout')?.key ?? 'dashboard'
const activeMenuKey = ref<WelcomeManageMenuKey>(firstMenuKey)

const activeMenu = computed(() => visibleMenus.value.find((item) => item.key === activeMenuKey.value) ?? visibleMenus.value[0])

const currentDateLabel = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
})

const permissionSummary = computed(() => `${permissionKeys.value.length} 个菜单权限`)

const activeDescriptionMap: Record<WelcomeManageMenuKey, string> = {
  dashboard: '查看迎新总览、重点待办和模块快入口。',
  department: '部门管理未纳入一期范围。',
  user: '用户管理未纳入一期范围。',
  student: '查看和维护新生主档案、报到状态及宿舍信息。',
  access: '管理校门核验、入校方向、体温和门禁预警。',
  precheckin: '审核学生到校计划、交通方式和材料补充情况。',
  health: '跟踪健康打卡、异常体征和后续跟进记录。',
  dispatch: '统筹迎新突发事件的派发、办理和闭环。',
  notice: '维护迎新公告内容并控制发布状态。',
  guide: '报到指引未纳入一期范围。',
  map: '校园地图未纳入一期范围。',
  stats: '学生统计未纳入一期范围。',
  device: '设备管理未纳入一期范围。',
  system: '系统管理未纳入一期范围。',
  profile: '查看当前登录人的基础资料和登录信息。',
  logout: '退出当前后台登录状态。'
}

const activeDescription = computed(() => activeDescriptionMap[activeMenuKey.value])

const dashboardCards = computed(() => {
  const studentTotal = students.value.length
  const arrivedCount = students.value.filter((item) => item.status === '已报到').length
  const pendingPrecheckin = precheckins.value.filter((item) => item.status !== '已审核').length
  const accessWarning = accessRows.value.filter((item) => item.result === '预警').length
  const healthPending = healthRows.value.filter((item) => item.status === '待关注').length
  const dispatchPending = dispatchRows.value.filter((item) => item.status !== '已完成').length
  const draftNotice = notices.value.filter((item) => item.status === '草稿').length

  return [
    { label: '学生总数', value: `${studentTotal} 人`, note: '当前后台学生主档案' },
    { label: '已完成报到', value: `${arrivedCount} 人`, note: '含现场补录后的结果' },
    { label: '预报到待处理', value: `${pendingPrecheckin} 条`, note: '需审核或补充信息' },
    { label: '门禁 / 健康异常', value: `${accessWarning + healthPending} 条`, note: '待防疫组继续跟进' },
    { label: '紧急工单', value: `${dispatchPending} 单`, note: '未闭环事件持续跟踪' },
    { label: '公告草稿', value: `${draftNotice} 篇`, note: '待发布到学生端和大屏' }
  ]
})

const quickActionNotes: Partial<Record<WelcomeManageMenuKey, string>> = {
  student: '核验学生档案与宿舍',
  precheckin: '处理到校计划审核',
  access: '查看门禁异常预警',
  health: '复核健康打卡异常',
  dispatch: '跟进现场突发工单',
  notice: '发布迎新通知'
}

const quickActions = computed(() => {
  return visibleMenus.value
    .filter((item) => item.key !== 'dashboard' && item.key !== 'profile' && item.key !== 'logout')
    .map((item) => ({
      key: item.key,
      label: item.label,
      note: quickActionNotes[item.key] ?? '进入模块处理业务'
    }))
})

const todoTagType: Record<'高' | '中' | '低', 'danger' | 'warning' | 'success'> = {
  高: 'danger',
  中: 'warning',
  低: 'success'
}

const collegeOptions = [...new Set(students.value.map((item) => item.college))]
const precheckinCollegeOptions = [...new Set(precheckins.value.map((item) => item.college))]
const gateOptions = [...new Set(accessRows.value.map((item) => item.gate))]

const studentFilters = reactive({
  keyword: '',
  status: '',
  college: ''
})

const precheckinFilters = reactive({
  keyword: '',
  status: '',
  college: ''
})

const accessFilters = reactive({
  keyword: '',
  gate: '',
  result: ''
})

const healthFilters = reactive({
  keyword: '',
  code: '',
  status: ''
})

const dispatchFilters = reactive({
  keyword: '',
  level: '',
  status: ''
})

const noticeFilters = reactive({
  keyword: '',
  status: ''
})

const selectedPrecheckinIds = ref<number[]>([])
const selectedNoticeIds = ref<number[]>([])

const paginationState = reactive<Record<PaginationModuleKey, PaginationStateItem>>({
  student: { currentPage: 1, pageSize: 10 },
  precheckin: { currentPage: 1, pageSize: 10 },
  access: { currentPage: 1, pageSize: 10 },
  health: { currentPage: 1, pageSize: 10 },
  dispatch: { currentPage: 1, pageSize: 10 },
  notice: { currentPage: 1, pageSize: 10 }
})

function paginateRows<T>(rows: T[], key: PaginationModuleKey) {
  const { currentPage, pageSize } = paginationState[key]
  const start = (currentPage - 1) * pageSize
  return rows.slice(start, start + pageSize)
}

function resetPagination(key: PaginationModuleKey) {
  paginationState[key].currentPage = 1
}

function handlePageSizeChange(key: PaginationModuleKey) {
  paginationState[key].currentPage = 1
}

function syncPaginationBoundary(key: PaginationModuleKey, total: number) {
  const maxPage = Math.max(1, Math.ceil(total / paginationState[key].pageSize))
  if (paginationState[key].currentPage > maxPage) {
    paginationState[key].currentPage = maxPage
  }
}

const filteredStudents = computed(() => {
  return students.value.filter((item) => {
    const matchedKeyword =
      !studentFilters.keyword ||
      [item.id, item.name, item.origin].some((field) => field.includes(studentFilters.keyword))
    const matchedStatus = !studentFilters.status || item.status === studentFilters.status
    const matchedCollege = !studentFilters.college || item.college === studentFilters.college
    return matchedKeyword && matchedStatus && matchedCollege
  })
})

const pagedStudents = computed(() => paginateRows(filteredStudents.value, 'student'))

const filteredPrecheckins = computed(() => {
  return precheckins.value.filter((item) => {
    const matchedKeyword = !precheckinFilters.keyword || item.studentName.includes(precheckinFilters.keyword)
    const matchedStatus = !precheckinFilters.status || item.status === precheckinFilters.status
    const matchedCollege = !precheckinFilters.college || item.college === precheckinFilters.college
    return matchedKeyword && matchedStatus && matchedCollege
  })
})

const pagedPrecheckins = computed(() => paginateRows(filteredPrecheckins.value, 'precheckin'))

const filteredAccessRows = computed(() => {
  return accessRows.value.filter((item) => {
    const matchedKeyword = !accessFilters.keyword || item.studentName.includes(accessFilters.keyword)
    const matchedGate = !accessFilters.gate || item.gate === accessFilters.gate
    const matchedResult = !accessFilters.result || item.result === accessFilters.result
    return matchedKeyword && matchedGate && matchedResult
  })
})

const pagedAccessRows = computed(() => paginateRows(filteredAccessRows.value, 'access'))

const filteredHealthRows = computed(() => {
  return healthRows.value.filter((item) => {
    const matchedKeyword = !healthFilters.keyword || item.studentName.includes(healthFilters.keyword)
    const matchedCode = !healthFilters.code || item.healthCode === healthFilters.code
    const matchedStatus = !healthFilters.status || item.status === healthFilters.status
    return matchedKeyword && matchedCode && matchedStatus
  })
})

const pagedHealthRows = computed(() => paginateRows(filteredHealthRows.value, 'health'))

const filteredDispatchRows = computed(() => {
  return dispatchRows.value.filter((item) => {
    const matchedKeyword = !dispatchFilters.keyword || item.event.includes(dispatchFilters.keyword)
    const matchedLevel = !dispatchFilters.level || item.level === dispatchFilters.level
    const matchedStatus = !dispatchFilters.status || item.status === dispatchFilters.status
    return matchedKeyword && matchedLevel && matchedStatus
  })
})

const pagedDispatchRows = computed(() => paginateRows(filteredDispatchRows.value, 'dispatch'))

const filteredNotices = computed(() => {
  return notices.value.filter((item) => {
    const matchedKeyword = !noticeFilters.keyword || item.title.includes(noticeFilters.keyword)
    const matchedStatus = !noticeFilters.status || item.status === noticeFilters.status
    return matchedKeyword && matchedStatus
  })
})

const pagedNotices = computed(() => paginateRows(filteredNotices.value, 'notice'))

const studentFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredStudents.value.length} 条` },
  { label: '已报到', value: `${filteredStudents.value.filter((item) => item.status === '已报到').length} 人` },
  { label: '未到校', value: `${filteredStudents.value.filter((item) => item.status === '未到校').length} 人` }
])

const precheckinFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredPrecheckins.value.length} 条` },
  { label: '待补充', value: `${filteredPrecheckins.value.filter((item) => item.status === '待补充').length} 条` },
  { label: '已审核', value: `${filteredPrecheckins.value.filter((item) => item.status === '已审核').length} 条` }
])

const accessFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredAccessRows.value.length} 条` },
  { label: '预警记录', value: `${filteredAccessRows.value.filter((item) => item.result === '预警').length} 条` },
  { label: '入校记录', value: `${filteredAccessRows.value.filter((item) => item.direction === '入校').length} 条` }
])

const healthFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredHealthRows.value.length} 条` },
  { label: '待关注', value: `${filteredHealthRows.value.filter((item) => item.status === '待关注').length} 条` },
  { label: '黄码', value: `${filteredHealthRows.value.filter((item) => item.healthCode === '黄码').length} 人` }
])

const dispatchFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredDispatchRows.value.length} 条` },
  { label: '处理中', value: `${filteredDispatchRows.value.filter((item) => item.status === '处理中').length} 单` },
  { label: '一级事件', value: `${filteredDispatchRows.value.filter((item) => item.level === '一级').length} 单` }
])

const noticeFilterStats = computed(() => [
  { label: '筛选结果', value: `${filteredNotices.value.length} 条` },
  { label: '已发布', value: `${filteredNotices.value.filter((item) => item.status === '已发布').length} 篇` },
  { label: '草稿', value: `${filteredNotices.value.filter((item) => item.status === '草稿').length} 篇` }
])

const studentImportDialogVisible = ref(false)
const studentImportFileList = ref<any[]>([])
const studentImportParsedRows = ref<WelcomeStudentRow[]>([])
const studentImportValidation = reactive<StudentImportValidationState>({
  fileName: '',
  valid: false,
  message: '请上传符合模板的 Excel 文件。',
  validRows: 0,
  invalidRows: 0,
  errors: []
})

const logDrawerVisible = ref(false)
const logPagination = reactive<PaginationStateItem>({
  currentPage: 1,
  pageSize: 10
})

const operationLogs = ref<OperationLogItem[]>([
  {
    id: 1,
    module: '学生管理',
    action: '初始化数据',
    detail: '一期学生主档案已同步到管理后台。',
    operator: currentUserName.value,
    time: '2026/03/09 09:05',
    result: '成功'
  },
  {
    id: 2,
    module: '预报到',
    action: '待审核统计',
    detail: '系统已加载预报到待审核记录。',
    operator: currentUserName.value,
    time: '2026/03/09 09:06',
    result: '成功'
  }
])

const pagedOperationLogs = computed(() => {
  const start = (logPagination.currentPage - 1) * logPagination.pageSize
  return operationLogs.value.slice(start, start + logPagination.pageSize)
})

const noticeEditorRef = ref<HTMLDivElement>()
const detailDrawerVisible = ref(false)
const detailDrawerTitle = ref('')
const detailDrawerHtml = ref('')
const detailDrawerFields = ref<DetailFieldItem[]>([])

watch(() => [studentFilters.keyword, studentFilters.status, studentFilters.college], () => resetPagination('student'))
watch(() => [precheckinFilters.keyword, precheckinFilters.status, precheckinFilters.college], () => resetPagination('precheckin'))
watch(() => [accessFilters.keyword, accessFilters.gate, accessFilters.result], () => resetPagination('access'))
watch(() => [healthFilters.keyword, healthFilters.code, healthFilters.status], () => resetPagination('health'))
watch(() => [dispatchFilters.keyword, dispatchFilters.level, dispatchFilters.status], () => resetPagination('dispatch'))
watch(() => [noticeFilters.keyword, noticeFilters.status], () => resetPagination('notice'))

watch(() => filteredStudents.value.length, (total) => syncPaginationBoundary('student', total))
watch(() => filteredPrecheckins.value.length, (total) => syncPaginationBoundary('precheckin', total))
watch(() => filteredAccessRows.value.length, (total) => syncPaginationBoundary('access', total))
watch(() => filteredHealthRows.value.length, (total) => syncPaginationBoundary('health', total))
watch(() => filteredDispatchRows.value.length, (total) => syncPaginationBoundary('dispatch', total))
watch(() => filteredNotices.value.length, (total) => syncPaginationBoundary('notice', total))
watch(() => operationLogs.value.length, (total) => {
  const maxPage = Math.max(1, Math.ceil(total / logPagination.pageSize))
  if (logPagination.currentPage > maxPage) {
    logPagination.currentPage = maxPage
  }
})

const studentDialogVisible = ref(false)
const editingStudentId = ref('')
const studentForm = reactive<WelcomeStudentRow>({
  id: '',
  name: '',
  gender: '男',
  college: '',
  major: '',
  className: '',
  origin: '',
  status: '未到校',
  dormitory: ''
})

const noticeDialogVisible = ref(false)
const editingNoticeId = ref<number | null>(null)
const noticeForm = reactive<WelcomeNoticeRow>({
  id: 0,
  title: '',
  audience: '',
  publisher: '',
  publishTime: '',
  content: '',
  status: '草稿'
})

const profile = computed(() => ({
  ...WELCOME_PROFILE,
  name: currentUserName.value,
  role: currentRoleLabel.value
}))

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
}

function handleSelectMenu(key: string) {
  if (key === 'logout') {
    logout()
    return
  }

  activeMenuKey.value = key as WelcomeManageMenuKey
}

function openLogDrawer() {
  logDrawerVisible.value = true
}

function goHome() {
  void router.push('/')
}

function goDashboard() {
  void router.push('/welcome/dashboard')
}

function logout() {
  sessionStorage.removeItem('welcome_auth')
  sessionStorage.removeItem('welcome_role')
  sessionStorage.removeItem('welcome_role_label')
  sessionStorage.removeItem('welcome_name')
  sessionStorage.removeItem('welcome_account')
  sessionStorage.removeItem('welcome_permissions')
  ElMessage.success('已退出迎新后台')
  void router.push('/welcome/login')
}

function resetStudentFilters() {
  studentFilters.keyword = ''
  studentFilters.status = ''
  studentFilters.college = ''
}

function resetPrecheckinFilters() {
  precheckinFilters.keyword = ''
  precheckinFilters.status = ''
  precheckinFilters.college = ''
}

function resetAccessFilters() {
  accessFilters.keyword = ''
  accessFilters.gate = ''
  accessFilters.result = ''
}

function resetHealthFilters() {
  healthFilters.keyword = ''
  healthFilters.code = ''
  healthFilters.status = ''
}

function resetDispatchFilters() {
  dispatchFilters.keyword = ''
  dispatchFilters.level = ''
  dispatchFilters.status = ''
}

function resetNoticeFilters() {
  noticeFilters.keyword = ''
  noticeFilters.status = ''
}

function appendOperationLog(
  module: string,
  action: string,
  detail: string,
  result: OperationLogItem['result'] = '成功'
) {
  operationLogs.value.unshift({
    id: Date.now() + operationLogs.value.length,
    module,
    action,
    detail,
    operator: currentUserName.value,
    time: getCurrentTimeLabel(),
    result
  })
  logPagination.currentPage = 1
}

function handleLogPageSizeChange() {
  logPagination.currentPage = 1
}

function clearOperationLogs() {
  operationLogs.value = []
  ElMessage.success('操作日志已清空')
}

function openStudentImportDialog() {
  studentImportDialogVisible.value = true
}

function resetStudentImportState() {
  studentImportFileList.value = []
  studentImportParsedRows.value = []
  Object.assign(studentImportValidation, {
    fileName: '',
    valid: false,
    message: '请上传符合模板的 Excel 文件。',
    validRows: 0,
    invalidRows: 0,
    errors: []
  })
}

function downloadWorkbook(fileName: string, rows: unknown[][]) {
  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, fileName)
}

function downloadStudentImportTemplate() {
  downloadWorkbook('迎新学生导入模板.xlsx', [
    STUDENT_IMPORT_HEADERS,
    ['20269991', '测试新生甲', '男', '信息工程学院', '软件技术', '软件 2401', '湖北武汉', '预报到', '待分配'],
    ['20269992', '测试新生乙', '女', '医护学院', '护理', '护理 2405', '湖南衡阳', '未到校', '待分配']
  ])
  appendOperationLog('学生管理', '下载模板', '已下载学生 Excel 导入模板。')
}

function normalizeStudentStatus(value: string): WelcomeStudentRow['status'] {
  if (value === '已报到' || value === '预报到' || value === '未到校') {
    return value
  }

  return '未到校'
}

function normalizeStudentGender(value: string): WelcomeStudentRow['gender'] {
  return value === '女' ? '女' : '男'
}

function buildStudentRowFromColumns(columns: string[]) {
  const [id, name, gender, college, major, className, origin, status, dormitory] = columns
  if (!id || !name || !college || !major || !className || !origin) {
    return null
  }

  return {
    id,
    name,
    gender: normalizeStudentGender(gender),
    college,
    major,
    className,
    origin,
    status: normalizeStudentStatus(status),
    dormitory: dormitory || '待分配'
  } satisfies WelcomeStudentRow
}

async function handleStudentExcelChange(file: any) {
  const rawFile = file.raw as File | undefined
  if (!rawFile) {
    return false
  }

  resetStudentImportState()
  studentImportFileList.value = [file]
  studentImportValidation.fileName = rawFile.name

  try {
    const buffer = await rawFile.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, {
      header: 1,
      raw: false,
      defval: ''
    })

    const headerRow = (rows[0] ?? []).map((item) => String(item).trim())
    const headerValid = STUDENT_IMPORT_HEADERS.every((item, index) => headerRow[index] === item)

    if (!headerValid) {
      Object.assign(studentImportValidation, {
        valid: false,
        message: '表头校验失败，请使用系统模板。',
        validRows: 0,
        invalidRows: 0,
        errors: [`当前表头：${headerRow.join(' / ') || '空表头'}`]
      })
      return false
    }

    const parsedRows: WelcomeStudentRow[] = []
    const errors: string[] = []
    const bodyRows = rows.slice(1)

    bodyRows.forEach((row, rowIndex) => {
      const columns = row.map((item) => String(item).trim())
      if (!columns.some(Boolean)) {
        return
      }

      if (columns.length < STUDENT_IMPORT_HEADERS.length) {
        errors.push(`第 ${rowIndex + 2} 行字段数量不足。`)
        return
      }

      const parsed = buildStudentRowFromColumns(columns)
      if (!parsed) {
        errors.push(`第 ${rowIndex + 2} 行存在必填字段为空。`)
        return
      }

      parsedRows.push(parsed)
    })

    studentImportParsedRows.value = parsedRows
    Object.assign(studentImportValidation, {
      valid: parsedRows.length > 0,
      message: parsedRows.length > 0 ? '模板校验通过，可以开始导入。' : '未识别到有效学生数据。',
      validRows: parsedRows.length,
      invalidRows: errors.length,
      errors
    })
  } catch (error) {
    Object.assign(studentImportValidation, {
      valid: false,
      message: 'Excel 解析失败，请检查文件格式。',
      validRows: 0,
      invalidRows: 1,
      errors: [error instanceof Error ? error.message : '未知解析错误']
    })
  }

  return false
}

function submitStudentImport() {
  if (!studentImportParsedRows.value.length || !studentImportValidation.valid) {
    ElMessage.warning('请先上传并校验通过 Excel 文件')
    return
  }

  const parsedRows = studentImportParsedRows.value

  let createdCount = 0
  let updatedCount = 0

  for (const row of parsedRows) {
    const existingIndex = students.value.findIndex((item) => item.id === row.id)
    if (existingIndex >= 0) {
      students.value[existingIndex] = row
      updatedCount += 1
    } else {
      students.value.unshift(row)
      createdCount += 1
    }
  }

  studentImportDialogVisible.value = false
  resetStudentImportState()
  resetPagination('student')
  appendOperationLog('学生管理', '学生导入', `新增 ${createdCount} 条，更新 ${updatedCount} 条学生数据。`)
  ElMessage.success(`导入完成，新增 ${createdCount} 条，更新 ${updatedCount} 条`)
}

function downloadJsonRows(fileName: string, rows: Record<string, unknown>[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '导出结果')
  XLSX.writeFile(workbook, fileName)
}

function exportStudents() {
  downloadJsonRows('迎新学生管理导出.xlsx', filteredStudents.value)
  appendOperationLog('学生管理', '导出数据', `已导出 ${filteredStudents.value.length} 条学生记录。`)
}

function exportPrecheckins() {
  downloadJsonRows('迎新预报到导出.xlsx', filteredPrecheckins.value)
  appendOperationLog('预报到', '导出数据', `已导出 ${filteredPrecheckins.value.length} 条预报到记录。`)
}

function exportAccessRows() {
  downloadJsonRows('迎新门禁导出.xlsx', filteredAccessRows.value)
  appendOperationLog('防疫门禁', '导出数据', `已导出 ${filteredAccessRows.value.length} 条门禁记录。`)
}

function exportHealthRows() {
  downloadJsonRows('迎新健康打卡导出.xlsx', filteredHealthRows.value)
  appendOperationLog('健康打卡', '导出数据', `已导出 ${filteredHealthRows.value.length} 条健康打卡记录。`)
}

function exportDispatchRows() {
  downloadJsonRows('迎新紧急调度导出.xlsx', filteredDispatchRows.value)
  appendOperationLog('紧急调度', '导出数据', `已导出 ${filteredDispatchRows.value.length} 条调度记录。`)
}

function exportNotices() {
  downloadJsonRows(
    '迎新公告导出.xlsx',
    filteredNotices.value.map((item) => ({
      ...item,
      content: getNoticeSummary(item.content)
    }))
  )
  appendOperationLog('公告管理', '导出数据', `已导出 ${filteredNotices.value.length} 篇公告。`)
}

function handlePrecheckinSelectionChange(rows: WelcomePreCheckinRow[]) {
  selectedPrecheckinIds.value = rows.map((item) => item.id)
}

function openStudentDialog(row: WelcomeStudentRow) {
  editingStudentId.value = row.id
  Object.assign(studentForm, row)
  studentDialogVisible.value = true
}

function saveStudentDialog() {
  const index = students.value.findIndex((item) => item.id === editingStudentId.value)
  if (index === -1) return

  students.value[index] = { ...studentForm }
  studentDialogVisible.value = false
  appendOperationLog('学生管理', '编辑学生', `已更新 ${studentForm.name} 的报到状态和宿舍信息。`)
  ElMessage.success('学生信息已更新')
}

function markStudentArrived(row: WelcomeStudentRow) {
  row.status = '已报到'
  if (row.dormitory === '待分配') {
    row.dormitory = '待现场分配'
  }
  appendOperationLog('学生管理', '补录报到', `已补录 ${row.name} 的报到状态。`)
  ElMessage.success(`已补录 ${row.name} 的报到状态`)
}

function approvePrecheckin(row: WelcomePreCheckinRow) {
  row.status = '已审核'
  appendOperationLog('预报到', '单条审核通过', `已通过 ${row.studentName} 的预报到审核。`)
  ElMessage.success(`已通过 ${row.studentName} 的预报到审核`)
}

function returnPrecheckin(row: WelcomePreCheckinRow) {
  row.status = '待补充'
  appendOperationLog('预报到', '单条退回', `已退回 ${row.studentName} 的预报到信息。`, '提示')
  ElMessage.warning(`已退回 ${row.studentName} 的预报到信息`)
}

function batchApprovePrecheckins() {
  const targetRows = precheckins.value.filter((item) => selectedPrecheckinIds.value.includes(item.id))
  if (!targetRows.length) {
    ElMessage.warning('请先选择待审核记录')
    return
  }

  targetRows.forEach((item) => {
    item.status = '已审核'
  })
  appendOperationLog('预报到', '批量审核通过', `共处理 ${targetRows.length} 条预报到记录。`)
  selectedPrecheckinIds.value = []
  ElMessage.success(`已批量通过 ${targetRows.length} 条预报到记录`)
}

function batchReturnPrecheckins() {
  const targetRows = precheckins.value.filter((item) => selectedPrecheckinIds.value.includes(item.id))
  if (!targetRows.length) {
    ElMessage.warning('请先选择待处理记录')
    return
  }

  targetRows.forEach((item) => {
    item.status = '待补充'
  })
  appendOperationLog('预报到', '批量退回补充', `共退回 ${targetRows.length} 条预报到记录。`, '提示')
  selectedPrecheckinIds.value = []
  ElMessage.warning(`已批量退回 ${targetRows.length} 条预报到记录`)
}

function handleNoticeSelectionChange(rows: WelcomeNoticeRow[]) {
  selectedNoticeIds.value = rows.map((item) => item.id)
}

function batchPublishNotices() {
  const targetRows = notices.value.filter((item) => selectedNoticeIds.value.includes(item.id))
  if (!targetRows.length) {
    ElMessage.warning('请先选择公告记录')
    return
  }

  targetRows.forEach((item) => {
    item.status = '已发布'
    item.publishTime = getCurrentTimeLabel()
  })
  appendOperationLog('公告管理', '批量发布', `已批量发布 ${targetRows.length} 篇公告。`)
  selectedNoticeIds.value = []
  ElMessage.success(`已批量发布 ${targetRows.length} 篇公告`)
}

function batchRevokeNotices() {
  const targetRows = notices.value.filter((item) => selectedNoticeIds.value.includes(item.id))
  if (!targetRows.length) {
    ElMessage.warning('请先选择公告记录')
    return
  }

  targetRows.forEach((item) => {
    item.status = '草稿'
    item.publishTime = '待发布'
  })
  appendOperationLog('公告管理', '批量撤回', `已批量撤回 ${targetRows.length} 篇公告。`, '提示')
  selectedNoticeIds.value = []
  ElMessage.warning(`已批量撤回 ${targetRows.length} 篇公告`)
}

function resolveAccessWarning(row: WelcomeAccessRow) {
  row.result = '通过'
  appendOperationLog('防疫门禁', '异常复核', `已完成 ${row.studentName} 的门禁异常复核。`)
  ElMessage.success(`已完成 ${row.studentName} 的门禁异常复核`)
}

function followHealthIssue(row: WelcomeHealthRow) {
  row.status = '正常'
  row.symptom = '已完成复核'
  appendOperationLog('健康打卡', '异常跟进', `已完成 ${row.studentName} 的健康异常跟进。`)
  ElMessage.success(`已完成 ${row.studentName} 的健康异常跟进`)
}

function assignDispatch(row: WelcomeDispatchRow) {
  row.status = '处理中'
  row.updateTime = getCurrentTimeLabel().slice(-5)
  appendOperationLog('紧急调度', '派发处理', `事件“${row.event}”已派发至 ${row.owner}。`)
  ElMessage.success(`事件“${row.event}”已进入处理中状态`)
}

function finishDispatch(row: WelcomeDispatchRow) {
  row.status = '已完成'
  row.updateTime = getCurrentTimeLabel().slice(-5)
  appendOperationLog('紧急调度', '办结事件', `事件“${row.event}”已办结。`)
  ElMessage.success(`事件“${row.event}”已办结`)
}

function syncNoticeEditor() {
  if (noticeEditorRef.value) {
    noticeEditorRef.value.innerHTML = noticeForm.content || '<p></p>'
  }
}

function handleNoticeEditorInput() {
  noticeForm.content = noticeEditorRef.value?.innerHTML ?? ''
}

function applyNoticeCommand(command: string, value?: string) {
  noticeEditorRef.value?.focus()
  document.execCommand(command, false, value)
  handleNoticeEditorInput()
}

function getNoticeSummary(content: string) {
  const plainText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return plainText || '暂无正文'
}

function openDetailDrawer(title: string, fields: DetailFieldItem[], html = '') {
  detailDrawerTitle.value = title
  detailDrawerFields.value = fields
  detailDrawerHtml.value = html
  detailDrawerVisible.value = true
}

function getStudentDetailFields(row: WelcomeStudentRow): DetailFieldItem[] {
  return [
    { label: '学号', value: row.id },
    { label: '姓名', value: row.name },
    { label: '性别', value: row.gender },
    { label: '学院', value: row.college },
    { label: '专业', value: row.major },
    { label: '班级', value: row.className },
    { label: '生源地', value: row.origin },
    { label: '报到状态', value: row.status },
    { label: '宿舍', value: row.dormitory }
  ]
}

function getPrecheckinDetailFields(row: WelcomePreCheckinRow): DetailFieldItem[] {
  return [
    { label: '学生', value: row.studentName },
    { label: '学院', value: row.college },
    { label: '到校计划', value: row.arrivalPlan },
    { label: '交通方式', value: row.travelMode },
    { label: '行李数量', value: row.baggage },
    { label: '审核状态', value: row.status }
  ]
}

function getAccessDetailFields(row: WelcomeAccessRow): DetailFieldItem[] {
  return [
    { label: '学生', value: row.studentName },
    { label: '校门', value: row.gate },
    { label: '方向', value: row.direction },
    { label: '体温', value: row.temperature },
    { label: '核验时间', value: row.time },
    { label: '结果', value: row.result }
  ]
}

function getHealthDetailFields(row: WelcomeHealthRow): DetailFieldItem[] {
  return [
    { label: '学生', value: row.studentName },
    { label: '健康码', value: row.healthCode },
    { label: '症状', value: row.symptom },
    { label: '打卡时间', value: row.clockTime },
    { label: '状态', value: row.status }
  ]
}

function getDispatchDetailFields(row: WelcomeDispatchRow): DetailFieldItem[] {
  return [
    { label: '事件', value: row.event },
    { label: '等级', value: row.level },
    { label: '位置', value: row.location },
    { label: '责任部门', value: row.owner },
    { label: '状态', value: row.status },
    { label: '更新时间', value: row.updateTime }
  ]
}

function openNoticeDetail(row: WelcomeNoticeRow) {
  openDetailDrawer(
    '公告详情',
    [
      { label: '标题', value: row.title },
      { label: '发布范围', value: row.audience },
      { label: '发布人', value: row.publisher },
      { label: '发布时间', value: row.publishTime },
      { label: '状态', value: row.status }
    ],
    row.content
  )
}

function openNoticeDialog(row?: WelcomeNoticeRow) {
  if (row) {
    editingNoticeId.value = row.id
    Object.assign(noticeForm, row)
  } else {
    editingNoticeId.value = null
    Object.assign(noticeForm, {
      id: 0,
      title: '',
      audience: '',
      publisher: currentUserName.value,
      publishTime: '',
      content: '<p>请输入公告正文内容。</p>',
      status: '草稿'
    })
  }

  noticeDialogVisible.value = true
  void nextTick(() => {
    syncNoticeEditor()
  })
}

function saveNoticeDialog() {
  const noticePlainText = getNoticeSummary(noticeForm.content)

  if (!noticeForm.title.trim() || !noticeForm.audience.trim() || !noticeForm.publisher.trim() || noticePlainText === '暂无正文') {
    ElMessage.warning('请补全公告标题、发布范围、发布人和正文内容')
    return
  }

  const publishTime = noticeForm.status === '已发布' ? getCurrentTimeLabel() : noticeForm.publishTime || '待发布'

  if (editingNoticeId.value) {
    const index = notices.value.findIndex((item) => item.id === editingNoticeId.value)
    if (index !== -1) {
      notices.value[index] = { ...noticeForm, publishTime }
    }
    appendOperationLog('公告管理', '编辑公告', `已更新公告“${noticeForm.title}”。`)
    ElMessage.success('公告已更新')
  } else {
    notices.value.unshift({
      ...noticeForm,
      id: Date.now(),
      publishTime
    })
    appendOperationLog('公告管理', '新增公告', `已新增公告“${noticeForm.title}”。`)
    ElMessage.success('公告已新增')
  }

  noticeDialogVisible.value = false
  resetPagination('notice')
}

function toggleNoticePublish(row: WelcomeNoticeRow) {
  if (row.status === '已发布') {
    row.status = '草稿'
    row.publishTime = '待发布'
    appendOperationLog('公告管理', '撤回公告', `已撤回公告“${row.title}”。`, '提示')
    ElMessage.warning(`已撤回公告“${row.title}”`)
    return
  }

  row.status = '已发布'
  row.publishTime = getCurrentTimeLabel()
  appendOperationLog('公告管理', '发布公告', `已发布公告“${row.title}”。`)
  ElMessage.success(`已发布公告“${row.title}”`)
}

const currentAccount = computed(() => WELCOME_LOGIN_ACCOUNTS.find((item) => item.role === currentRole.value) ?? null)

if (currentAccount.value && !permissionKeys.value.length) {
  permissionKeys.value = currentAccount.value.permissions
}
</script>

<style scoped>
.welcome-manage-page {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
  min-height: calc(100vh - 80px);
}

.welcome-manage-side {
  position: sticky;
  top: 24px;
  align-self: start;
  display: grid;
  gap: 18px;
  padding: 22px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 20% 18%, rgba(251, 146, 60, 0.18), rgba(251, 146, 60, 0)),
    linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
  border: 1px solid rgba(251, 146, 60, 0.18);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.08);
}

.welcome-manage-brand {
  display: grid;
  gap: 10px;
}

.welcome-manage-kicker {
  display: inline-flex;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c2410c;
  background: rgba(249, 115, 22, 0.12);
}

.welcome-manage-brand h1 {
  font-family: 'Barlow', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  font-size: 30px;
  line-height: 1.2;
  color: #0f172a;
}

.welcome-manage-brand p:last-child {
  color: #64748b;
  line-height: 1.75;
}

.welcome-user-card {
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 20px;
  background: linear-gradient(150deg, #9a3412 0%, #ea580c 55%, #0f766e 100%);
  color: #fff7ed;
}

.welcome-user-card span {
  font-size: 12px;
  opacity: 0.88;
}

.welcome-user-card strong {
  font-size: 20px;
}

.welcome-user-card em {
  font-style: normal;
  color: rgba(255, 247, 237, 0.88);
}

.welcome-side-menu {
  border: none;
  background: transparent;
}

.welcome-side-menu :deep(.el-sub-menu__title),
.welcome-side-menu :deep(.el-menu-item) {
  border-radius: 14px;
}

.welcome-side-menu :deep(.el-menu-item.is-active) {
  color: #c2410c;
  background: rgba(249, 115, 22, 0.12);
}

.welcome-side-actions {
  display: grid;
  gap: 10px;
}

.welcome-manage-main {
  display: grid;
  gap: 18px;
}

.welcome-main-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 26px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 82% 16%, rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0)),
    linear-gradient(150deg, rgba(255, 255, 255, 0.96), rgba(255, 247, 237, 0.92));
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.06);
}

.welcome-header-side {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.welcome-header-kicker {
  color: #c2410c;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.welcome-main-header h2 {
  margin-top: 10px;
  font-size: 32px;
  color: #0f172a;
}

.welcome-main-header p:last-child {
  margin-top: 10px;
  color: #64748b;
  line-height: 1.75;
}

.welcome-header-meta {
  display: grid;
  gap: 8px;
  justify-items: end;
  color: #64748b;
}

.welcome-header-actions {
  display: flex;
  align-items: center;
}

.welcome-header-meta strong {
  font-size: 24px;
  color: #0f172a;
}

.welcome-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.welcome-stat-card {
  display: grid;
  gap: 10px;
  padding: 20px 22px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.05);
}

.welcome-stat-card span {
  color: #64748b;
}

.welcome-stat-card strong {
  font-size: 28px;
  color: #0f172a;
}

.welcome-stat-card em {
  font-style: normal;
  color: #c2410c;
}

.welcome-dashboard-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
}

.welcome-panel {
  border: none;
  border-radius: 28px;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.06);
}

.welcome-panel :deep(.el-card__header) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.88);
}

.welcome-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.welcome-panel-head h3 {
  font-size: 20px;
  color: #0f172a;
}

.welcome-panel-head p {
  margin-top: 6px;
  color: #64748b;
}

.welcome-panel-head--toolbar {
  align-items: flex-start;
}

.welcome-toolbar-actions {
  display: flex;
  gap: 10px;
}

.welcome-todo-list {
  display: grid;
  gap: 14px;
}

.welcome-todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 247, 237, 0.8), rgba(255, 255, 255, 0.95));
  border: 1px solid rgba(251, 146, 60, 0.12);
}

.welcome-todo-item div {
  display: grid;
  gap: 6px;
}

.welcome-todo-item span {
  color: #64748b;
}

.welcome-quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.welcome-quick-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  text-align: left;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 20px;
  background: linear-gradient(150deg, #ffffff, #eff6ff);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.welcome-quick-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(14, 165, 233, 0.12);
}

.welcome-quick-card strong {
  color: #0f172a;
}

.welcome-quick-card span {
  color: #64748b;
  line-height: 1.7;
}

.welcome-filter-grid {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}

.welcome-filter-grid--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.welcome-filter-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.welcome-profile-grid,
.welcome-dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.welcome-dialog-span-two {
  grid-column: 1 / -1;
}

.welcome-import-guide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.welcome-import-guide p {
  color: #64748b;
  line-height: 1.75;
}

.welcome-editor-shell {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.welcome-editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background: #fffaf5;
}

.welcome-rich-editor {
  min-height: 220px;
  padding: 16px;
  line-height: 1.8;
  outline: none;
}

.welcome-editor-preview {
  min-height: 160px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(145deg, #fffaf5, #ffffff);
  border: 1px solid rgba(251, 146, 60, 0.14);
  line-height: 1.85;
}

.welcome-log-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.welcome-log-head p {
  margin-top: 6px;
  color: #64748b;
}

.welcome-pagination {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

.welcome-profile-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(145deg, #fffaf5, #ffffff);
  border: 1px solid rgba(251, 146, 60, 0.14);
}

.welcome-profile-card span {
  color: #64748b;
}

.welcome-profile-card strong {
  font-size: 18px;
  color: #0f172a;
}

@media (max-width: 1180px) {
  .welcome-manage-page {
    grid-template-columns: 1fr;
  }

  .welcome-manage-side {
    position: static;
  }

  .welcome-stat-grid,
  .welcome-dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .welcome-filter-grid--three,
  .welcome-filter-grid--two,
  .welcome-profile-grid,
  .welcome-dialog-grid,
  .welcome-quick-grid {
    grid-template-columns: 1fr;
  }

  .welcome-main-header {
    flex-direction: column;
  }

  .welcome-header-side,
  .welcome-import-guide,
  .welcome-log-head {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .welcome-header-meta {
    justify-items: start;
  }
}
</style>