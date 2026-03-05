<template>
  <section :class="['cp-page', { 'cp-page-logged': !!currentRole }]">
    <div class="cp-bg cp-bg-a"></div>
    <div class="cp-bg cp-bg-b"></div>

    <div v-if="!currentRole" class="cp-shell">
      <section class="cp-intro-panel">
        <div class="cp-intro-head">
          <p class="cp-kicker">Competition Activity Service</p>
          <h2>竞赛活动应用服务平台</h2>
          <p>支持线上作品评比竞赛与展示交流活动，覆盖“发起、上传、评审、导出”完整业务流程。</p>
        </div>

        <div class="cp-feature-grid">
          <article v-for="item in serviceFeatures" :key="item.no" class="cp-feature-card">
            <div class="cp-feature-no">{{ item.no }}</div>
            <p class="cp-feature-text">{{ item.text }}</p>
          </article>
        </div>
      </section>

      <el-card class="cp-login-card" shadow="never">
        <div class="cp-head">
          <h3>账号登录</h3>
          <p>请输入账号密码并选择身份后登录</p>
        </div>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          class="cp-form"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入" clearable />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="身份" prop="role">
            <el-radio-group v-model="loginForm.role" class="cp-role-group">
              <el-radio label="platformAdmin">平台管理员</el-radio>
              <el-radio label="schoolAdmin">学校管理员</el-radio>
              <el-radio label="judge">评委</el-radio>
              <el-radio label="teacher">教师</el-radio>
              <el-radio label="student">学生</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="cp-action-row">
            <el-button type="primary" class="cp-login-btn" @click="submitLogin">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>

        <el-popover placement="top-start" trigger="hover" :width="380" popper-class="cp-account-popper">
          <template #reference>
            <el-button text class="cp-account-trigger">测试账号（悬停查看）</el-button>
          </template>
          <div class="cp-account-box">
            <p class="cp-account-title">测试账号</p>
            <p v-for="item in testAccounts" :key="item">{{ item }}</p>
          </div>
        </el-popover>
      </el-card>
    </div>

    <el-card v-else class="cp-role-card" shadow="never">
      <div class="cp-role-head">
        <div>
          <p class="cp-kicker">已登录</p>
          <h3>{{ roleConfig[currentRole].title }}</h3>
          <p class="cp-role-desc">{{ roleConfig[currentRole].desc }}</p>
        </div>
        <el-button @click="logout">退出登录</el-button>
      </div>

      <template v-if="isPlatformAdmin">
        <section class="cp-admin-layout">
          <aside class="cp-admin-side">
            <div class="cp-admin-side-title">平台管理员菜单</div>
            <el-menu :default-active="adminActiveModule" class="cp-admin-menu" @select="handleAdminMenuSelect">
              <el-menu-item index="overview">活动总览</el-menu-item>
              <el-menu-item index="launch">赛事活动发起</el-menu-item>
              <el-menu-item index="group">分组管理</el-menu-item>
              <el-menu-item index="upload">材料上传设置</el-menu-item>
              <el-menu-item index="schoolScore">学校评分</el-menu-item>
              <el-menu-item index="export">打包导出</el-menu-item>
              <el-menu-item index="portfolio">作品集管理</el-menu-item>
              <el-menu-item index="scoreMode">打分模式</el-menu-item>
              <el-menu-item index="permission">浏览下载权限</el-menu-item>
            </el-menu>
          </aside>

          <div class="cp-admin-content">
            <section v-if="adminActiveModule === 'overview'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>活动总览</h4>
                <p>展示当前活动运行状态与最新活动信息。</p>
              </div>

              <el-row :gutter="12" class="cp-stat-grid">
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>活动总数</p>
                    <h4>{{ adminStats.total }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>待发布</p>
                    <h4>{{ adminStats.pending }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>进行中</p>
                    <h4>{{ adminStats.running }}</h4>
                  </div>
                </el-col>
                <el-col :xs="12" :md="6">
                  <div class="cp-stat-card">
                    <p>已结束</p>
                    <h4>{{ adminStats.finished }}</h4>
                  </div>
                </el-col>
              </el-row>

              <el-table :data="pagedEventList" border stripe class="cp-event-table">
                <el-table-column prop="title" label="活动名称" min-width="220" />
                <el-table-column prop="school" label="发起学校" min-width="160" />
                <el-table-column prop="group" label="活动分组" min-width="120" />
                <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
                <el-table-column prop="status" label="状态" min-width="100" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="publishEvent(scope.row.id)">发布</el-button>
                    <el-button link type="danger" @click="deleteEvent(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.eventPage"
                :page-size="pagination.pageSize"
                :total="eventList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'launch'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>赛事活动发起</h4>
                <p>平台管理员可统一发起赛事活动并指派学校参与。</p>
              </div>
              <el-form :model="eventForm" :rules="eventRules" ref="eventFormRef" label-position="top" class="cp-launch-form">
                <el-form-item label="活动名称" prop="title">
                  <el-input v-model="eventForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="发起学校" prop="school">
                  <el-input v-model="eventForm.school" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动分组" prop="group">
                  <el-input v-model="eventForm.group" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动周期" prop="dateRange">
                  <el-date-picker
                    v-model="eventForm.dateRange"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="cp-date-range"
                  />
                </el-form-item>
                <el-form-item label="活动说明" prop="description" class="cp-launch-full">
                  <el-input v-model="eventForm.description" type="textarea" :rows="3" placeholder="请输入" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="submitEvent">发起活动</el-button>
                  <el-button @click="resetEventForm">重置</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'group'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>分组管理</h4>
                <p>创建活动分组并维护分组说明。</p>
              </div>
              <div class="cp-inline-row">
                <el-input v-model="groupDraft.name" placeholder="分组名称" clearable />
                <el-input v-model="groupDraft.description" placeholder="分组说明" clearable />
                <el-button type="primary" @click="addGroup">新增分组</el-button>
              </div>
              <el-table :data="pagedGroupList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="分组名称" min-width="160" />
                <el-table-column prop="description" label="分组说明" min-width="240" />
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="danger" @click="removeGroup(scope.row.name)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.groupPage"
                :page-size="pagination.pageSize"
                :total="groupList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'upload'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>上传策略设置</h4>
                <p>配置支持类型、附件大小与在线预览能力。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="支持文件类型" class="cp-launch-full">
                  <el-select v-model="uploadPolicy.fileTypes" multiple placeholder="请选择" class="cp-date-range">
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Word" value="docx" />
                    <el-option label="PPT" value="pptx" />
                    <el-option label="图片" value="image" />
                    <el-option label="视频" value="video" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单文件大小限制(MB)">
                  <el-input-number v-model="uploadPolicy.maxSizeMb" :min="1" :max="2048" />
                </el-form-item>
                <el-form-item label="是否允许在线预览">
                  <el-switch v-model="uploadPolicy.previewEnabled" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveUploadPolicy">保存设置</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'schoolScore'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>学校主体评分</h4>
                <p>评委可按学校维度进行打分。</p>
              </div>
              <el-table :data="pagedSchoolScoreList" border stripe class="cp-event-table">
                <el-table-column prop="school" label="学校" min-width="180" />
                <el-table-column prop="activity" label="活动" min-width="180" />
                <el-table-column label="评分" min-width="180">
                  <template #default="scope">
                    <el-rate v-model="scope.row.score" allow-half />
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="primary" @click="saveSchoolScore(scope.row)">保存</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolScorePage"
                :page-size="pagination.pageSize"
                :total="schoolScoreList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'export'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>打包导出管理</h4>
                <p>创建导出任务并跟踪任务状态。</p>
              </div>
              <div class="cp-inline-row">
                <el-input v-model="exportDraft.activity" placeholder="导出活动名称" clearable />
                <el-select v-model="exportDraft.type" placeholder="导出范围" style="width: 180px">
                  <el-option label="单作品" value="single" />
                  <el-option label="作品集" value="portfolio" />
                  <el-option label="学校作品集" value="school" />
                </el-select>
                <el-button type="primary" @click="createExportTask">创建导出任务</el-button>
              </div>
              <el-table :data="pagedExportTaskList" border stripe class="cp-event-table">
                <el-table-column prop="activity" label="活动" min-width="180" />
                <el-table-column prop="typeLabel" label="导出范围" min-width="120" />
                <el-table-column prop="status" label="状态" min-width="120" />
              </el-table>
              <el-pagination
                v-model:current-page="pagination.exportTaskPage"
                :page-size="pagination.pageSize"
                :total="exportTaskList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'portfolio'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>作品集管理</h4>
                <p>浏览单文件、单作品集、学校作品集并进行点评。</p>
              </div>
              <el-table :data="pagedPortfolioList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="作品名称" min-width="180" />
                <el-table-column prop="category" label="类别" min-width="120" />
                <el-table-column prop="school" label="学校" min-width="140" />
                <el-table-column prop="review" label="点评" min-width="220" />
                <el-table-column label="操作" min-width="100">
                  <template #default="scope">
                    <el-button link type="primary" @click="openPortfolio(scope.row)">浏览</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.portfolioPage"
                :page-size="pagination.pageSize"
                :total="portfolioList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="adminActiveModule === 'scoreMode'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>打分模式与比例</h4>
                <p>配置评分模式、权重比例及是否展示得分。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="评分模式">
                  <el-select v-model="scoreMode.mode" placeholder="请选择" style="width: 220px">
                    <el-option label="百分制" value="percent" />
                    <el-option label="星级制" value="star" />
                    <el-option label="等级制" value="grade" />
                  </el-select>
                </el-form-item>
                <el-form-item label="创新性占比(%)">
                  <el-input-number v-model="scoreMode.innovationRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="完成度占比(%)">
                  <el-input-number v-model="scoreMode.completionRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="表现力占比(%)">
                  <el-input-number v-model="scoreMode.presentationRatio" :min="0" :max="100" />
                </el-form-item>
                <el-form-item label="是否显示得分">
                  <el-switch v-model="scoreMode.showScore" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveScoreMode">保存评分模式</el-button>
                </el-form-item>
              </el-form>
            </section>

            <section v-if="adminActiveModule === 'permission'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>浏览与下载权限</h4>
                <p>控制是否允许下载单个作品，或仅允许在线浏览。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="允许下载单个作品">
                  <el-switch v-model="accessPolicy.allowSingleDownload" />
                </el-form-item>
                <el-form-item label="允许在线浏览作品">
                  <el-switch v-model="accessPolicy.allowPreview" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveAccessPolicy">保存权限配置</el-button>
                </el-form-item>
              </el-form>
            </section>
          </div>
        </section>
      </template>

      <template v-else-if="isSchoolAdmin">
        <section class="cp-admin-layout">
          <aside class="cp-admin-side">
            <div class="cp-admin-side-title">学校管理员菜单</div>
            <el-menu :default-active="schoolActiveModule" class="cp-admin-menu" @select="handleSchoolMenuSelect">
              <el-menu-item index="schoolLaunch">赛事活动发起</el-menu-item>
              <el-menu-item index="schoolUpload">学校作品集上传</el-menu-item>
              <el-menu-item index="schoolMaterial">学校材料管理</el-menu-item>
              <el-menu-item index="schoolProgress">活动进度查看</el-menu-item>
              <el-menu-item index="schoolScore">评分结果查看</el-menu-item>
              <el-menu-item index="schoolPermission">作品浏览权限</el-menu-item>
            </el-menu>
          </aside>

          <div class="cp-admin-content">
            <section v-if="schoolActiveModule === 'schoolLaunch'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>赛事活动发起</h4>
                <p>学校管理员可发起本校赛事活动并提交平台审核。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="活动名称">
                  <el-input v-model="schoolLaunchForm.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动分组">
                  <el-input v-model="schoolLaunchForm.group" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="活动周期">
                  <el-date-picker
                    v-model="schoolLaunchForm.dateRange"
                    type="daterange"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="cp-date-range"
                  />
                </el-form-item>
                <el-form-item label="活动说明" class="cp-launch-full">
                  <el-input v-model="schoolLaunchForm.description" type="textarea" :rows="3" placeholder="请输入" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="submitSchoolLaunch">发起活动</el-button>
                  <el-button @click="resetSchoolLaunchForm">重置</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="pagedSchoolLaunchList" border stripe class="cp-event-table">
                <el-table-column prop="title" label="活动名称" min-width="220" />
                <el-table-column prop="group" label="活动分组" min-width="120" />
                <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
                <el-table-column prop="status" label="状态" min-width="100" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="publishSchoolLaunch(scope.row.id)">发布</el-button>
                    <el-button link type="danger" @click="deleteSchoolLaunch(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolLaunchPage"
                :page-size="pagination.pageSize"
                :total="schoolLaunchList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="schoolActiveModule === 'schoolUpload'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>学校作品集上传</h4>
                <p>上传学校作品集并设置可预览链接。</p>
              </div>
              <div class="cp-inline-row cp-inline-row-school">
                <el-input v-model="schoolUploadDraft.name" placeholder="作品名称" clearable />
                <el-input v-model="schoolUploadDraft.activity" placeholder="所属活动" clearable />
                <el-select v-model="schoolUploadDraft.previewType" placeholder="预览类型">
                  <el-option label="PDF" value="pdf" />
                  <el-option label="图片" value="image" />
                </el-select>
                <el-input v-model="schoolUploadDraft.previewUrl" placeholder="在线预览链接" clearable />
                <el-button type="primary" @click="submitSchoolUpload">上传作品</el-button>
              </div>

              <el-table :data="pagedSchoolPortfolioList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="作品名称" min-width="180" />
                <el-table-column prop="school" label="学校" min-width="120" />
                <el-table-column prop="review" label="说明" min-width="220" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="openPortfolio(scope.row)">浏览</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolPortfolioPage"
                :page-size="pagination.pageSize"
                :total="schoolPortfolioList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="schoolActiveModule === 'schoolMaterial'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>学校材料管理</h4>
                <p>管理本校上传材料，支持浏览和删除。</p>
              </div>
              <el-table :data="pagedSchoolMaterialList" border stripe class="cp-event-table">
                <el-table-column prop="name" label="材料名称" min-width="180" />
                <el-table-column prop="activity" label="所属活动" min-width="170" />
                <el-table-column prop="materialTypeLabel" label="类型" min-width="100" />
                <el-table-column prop="size" label="大小" min-width="100" />
                <el-table-column prop="uploadedAt" label="上传时间" min-width="160" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button link type="primary" @click="openSchoolMaterial(scope.row)">浏览</el-button>
                    <el-button link type="danger" @click="deleteSchoolMaterial(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolMaterialPage"
                :page-size="pagination.pageSize"
                :total="schoolMaterialList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="schoolActiveModule === 'schoolProgress'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>活动进度查看</h4>
                <p>查看本校参与活动在报名、评审、公示阶段的进展。</p>
              </div>
              <el-table :data="pagedSchoolProgressList" border stripe class="cp-event-table">
                <el-table-column prop="activity" label="活动名称" min-width="220" />
                <el-table-column prop="stage" label="当前阶段" min-width="120" />
                <el-table-column label="进度" min-width="220">
                  <template #default="scope">
                    <div class="cp-progress-cell">
                      <el-progress :percentage="scope.row.percentage" :stroke-width="12" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolProgressPage"
                :page-size="pagination.pageSize"
                :total="schoolProgressList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="schoolActiveModule === 'schoolScore'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>评分结果查看</h4>
                <p>查看本校活动得分、排名与评审意见。</p>
              </div>
              <el-table :data="pagedSchoolScoreResultList" border stripe class="cp-event-table">
                <el-table-column prop="activity" label="活动名称" min-width="220" />
                <el-table-column prop="score" label="得分" min-width="100" />
                <el-table-column prop="rank" label="排名" min-width="90" />
                <el-table-column prop="judgeCount" label="评委人数" min-width="100" />
                <el-table-column prop="comment" label="评审意见" min-width="240" />
              </el-table>
              <el-pagination
                v-model:current-page="pagination.schoolScoreResultPage"
                :page-size="pagination.pageSize"
                :total="schoolScoreResultList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="schoolActiveModule === 'schoolPermission'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>作品浏览权限</h4>
                <p>配置本校作品是否允许浏览、下载与外链分享。</p>
              </div>
              <el-form label-position="top" class="cp-launch-form">
                <el-form-item label="允许校外浏览">
                  <el-switch v-model="schoolPermission.allowPreview" />
                </el-form-item>
                <el-form-item label="允许下载作品">
                  <el-switch v-model="schoolPermission.allowDownload" />
                </el-form-item>
                <el-form-item label="允许外链分享">
                  <el-switch v-model="schoolPermission.allowExternalShare" />
                </el-form-item>
                <el-form-item class="cp-launch-full">
                  <el-button type="primary" @click="saveSchoolPermission">保存权限配置</el-button>
                </el-form-item>
              </el-form>
            </section>
          </div>
        </section>
      </template>

      <template v-else-if="isJudge">
        <section class="cp-admin-layout">
          <aside class="cp-admin-side">
            <div class="cp-admin-side-title">评委菜单</div>
            <el-menu :default-active="judgeActiveModule" class="cp-admin-menu" @select="handleJudgeMenuSelect">
              <el-menu-item index="judgeActivities">所有活动列表</el-menu-item>
              <el-menu-item index="judgeHistory">历史评审查询</el-menu-item>
            </el-menu>
          </aside>

          <div class="cp-admin-content">
            <section v-if="judgeActiveModule === 'judgeActivities'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>所有活动列表</h4>
                <p>支持按活动名称、状态、分组筛选，查看活动详情与提交作品。</p>
              </div>

              <div class="cp-inline-row cp-inline-row-judge">
                <el-input v-model="judgeFilter.keyword" placeholder="请输入活动名称或学校" clearable />
                <el-select v-model="judgeFilter.status" placeholder="活动状态" clearable>
                  <el-option label="待发布" value="待发布" />
                  <el-option label="进行中" value="进行中" />
                  <el-option label="已结束" value="已结束" />
                </el-select>
                <el-select v-model="judgeFilter.group" placeholder="活动分组" clearable>
                  <el-option label="小学组" value="小学组" />
                  <el-option label="初中组" value="初中组" />
                  <el-option label="高中组" value="高中组" />
                </el-select>
                <el-button type="primary" @click="searchJudgeActivities">查询</el-button>
                <el-button @click="resetJudgeActivities">重置</el-button>
              </div>

              <el-table :data="pagedJudgeActivityList" border stripe class="cp-event-table">
                <el-table-column prop="title" label="活动名称" min-width="220" />
                <el-table-column prop="school" label="发起学校" min-width="160" />
                <el-table-column prop="group" label="活动分组" min-width="120" />
                <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
                <el-table-column prop="status" label="状态" min-width="100" />
                <el-table-column prop="submissionCount" label="提交作品数" min-width="110" />
                <el-table-column label="操作" min-width="180">
                  <template #default="scope">
                    <el-button link type="primary" @click="previewJudgeActivity(scope.row)">预览活动</el-button>
                    <el-button link type="success" @click="viewJudgeWorks(scope.row)">查看作品</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-model:current-page="pagination.judgeActivityPage"
                :page-size="pagination.pageSize"
                :total="filteredJudgeActivityList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>

            <section v-if="judgeActiveModule === 'judgeHistory'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>历史评审查询</h4>
                <p>查看历史评审活动的评分统计、评审结论与最后评审时间。</p>
              </div>

              <el-table :data="pagedJudgeHistoryList" border stripe class="cp-event-table">
                <el-table-column prop="activity" label="活动名称" min-width="220" />
                <el-table-column prop="reviewedCount" label="已评作品" min-width="110" />
                <el-table-column prop="avgScore" label="平均分" min-width="100" />
                <el-table-column prop="lastReviewedAt" label="最后评审时间" min-width="160" />
                <el-table-column prop="conclusion" label="评审结论" min-width="260" />
              </el-table>

              <el-pagination
                v-model:current-page="pagination.judgeHistoryPage"
                :page-size="pagination.pageSize"
                :total="judgeHistoryList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>
          </div>
        </section>
      </template>

      <template v-else-if="isParticipantRole">
        <section class="cp-admin-layout">
          <aside class="cp-admin-side">
            <div class="cp-admin-side-title">参与菜单</div>
            <el-menu :default-active="participantActiveModule" class="cp-admin-menu" @select="handleParticipantMenuSelect">
              <el-menu-item index="participantActivities">活动列表</el-menu-item>
            </el-menu>
          </aside>

          <div class="cp-admin-content">
            <section v-if="participantActiveModule === 'participantActivities'" class="cp-launch-panel">
              <div class="cp-launch-head">
                <h4>活动列表</h4>
                <p>可查看全部活动，筛选后参与活动并上传作品。</p>
              </div>

              <div class="cp-inline-row cp-inline-row-participant">
                <el-input v-model="participantFilter.keyword" placeholder="请输入活动名称或学校" clearable />
                <el-select v-model="participantFilter.status" placeholder="活动状态" clearable>
                  <el-option label="待发布" value="待发布" />
                  <el-option label="进行中" value="进行中" />
                  <el-option label="已结束" value="已结束" />
                </el-select>
                <el-select v-model="participantFilter.group" placeholder="活动分组" clearable>
                  <el-option label="小学组" value="小学组" />
                  <el-option label="初中组" value="初中组" />
                  <el-option label="高中组" value="高中组" />
                </el-select>
                <el-button type="primary" @click="searchParticipantActivities">查询</el-button>
                <el-button @click="resetParticipantActivities">重置</el-button>
              </div>

              <el-table :data="pagedParticipantActivityList" border stripe class="cp-event-table">
                <el-table-column prop="title" label="活动名称" min-width="220" />
                <el-table-column prop="school" label="发起学校" min-width="160" />
                <el-table-column prop="group" label="活动分组" min-width="120" />
                <el-table-column prop="dateRangeText" label="活动周期" min-width="180" />
                <el-table-column prop="status" label="状态" min-width="100" />
                <el-table-column label="操作" min-width="140">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      link
                      :disabled="scope.row.status !== '进行中'"
                      @click="openParticipationDialog(scope.row)"
                    >
                      参与
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                v-model:current-page="pagination.participantActivityPage"
                :page-size="pagination.pageSize"
                :total="filteredParticipantActivityList.length"
                layout="total, prev, pager, next"
                class="cp-pagination"
              />
            </section>
          </div>
        </section>
      </template>

      <el-empty v-else description="当前身份功能后续开发。" />

      <el-dialog
        v-model="previewDialogVisible"
        title="作品预览"
        width="72%"
        destroy-on-close
      >
        <template v-if="previewingPortfolio">
          <p class="cp-preview-title">{{ previewingPortfolio.name }}</p>
          <iframe
            v-if="previewingPortfolio.previewType === 'pdf'"
            :src="previewingPortfolio.previewUrl"
            class="cp-preview-pdf"
            title="PDF预览"
          />
          <img
            v-else
            :src="previewingPortfolio.previewUrl"
            :alt="previewingPortfolio.name"
            class="cp-preview-image"
          />
        </template>
      </el-dialog>

      <el-dialog v-model="judgeActivityDialogVisible" title="活动详情" width="660px" destroy-on-close>
        <template v-if="previewingJudgeActivity">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="活动名称">{{ previewingJudgeActivity.title }}</el-descriptions-item>
            <el-descriptions-item label="发起学校">{{ previewingJudgeActivity.school }}</el-descriptions-item>
            <el-descriptions-item label="活动分组">{{ previewingJudgeActivity.group }}</el-descriptions-item>
            <el-descriptions-item label="活动周期">{{ previewingJudgeActivity.dateRangeText }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ previewingJudgeActivity.status }}</el-descriptions-item>
            <el-descriptions-item label="活动说明">{{ previewingJudgeActivity.description }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-dialog>

      <el-dialog v-model="judgeWorksDialogVisible" title="提交作品列表" width="80%" destroy-on-close>
        <template v-if="currentJudgeActivity">
          <p class="cp-preview-title">{{ currentJudgeActivity.title }} - 全部提交作品</p>
          <el-table :data="pagedJudgeWorkList" border stripe class="cp-event-table">
            <el-table-column prop="name" label="作品名称" min-width="180" />
            <el-table-column prop="student" label="提交人" min-width="120" />
            <el-table-column prop="school" label="学校" min-width="120" />
            <el-table-column prop="group" label="分组" min-width="100" />
            <el-table-column prop="submittedAt" label="提交时间" min-width="160" />
            <el-table-column prop="status" label="评审状态" min-width="100" />
            <el-table-column prop="score" label="当前分数" min-width="100" />
            <el-table-column label="操作" min-width="180">
              <template #default="scope">
                <el-button link type="primary" @click="previewJudgeWork(scope.row)">预览</el-button>
                <el-button
                  v-if="scope.row.status === '待评审'"
                  link
                  type="success"
                  @click="openJudgeScore(scope.row)"
                >
                  评分
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="pagination.judgeWorkPage"
            :page-size="pagination.pageSize"
            :total="currentJudgeWorks.length"
            layout="total, prev, pager, next"
            class="cp-pagination"
          />
        </template>
      </el-dialog>

      <el-dialog v-model="judgeScoreDialogVisible" title="作品评分" width="520px" destroy-on-close>
        <template v-if="scoringJudgeWork">
          <el-form label-position="top">
            <el-form-item label="作品名称">
              <el-input :model-value="scoringJudgeWork.name" disabled />
            </el-form-item>
            <el-form-item label="分数(0-100)">
              <el-input-number v-model="judgeScoreForm.score" :min="0" :max="100" :precision="1" />
            </el-form-item>
            <el-form-item label="评审意见">
              <el-input v-model="judgeScoreForm.comment" type="textarea" :rows="3" placeholder="请输入评审意见" />
            </el-form-item>
          </el-form>
          <div class="cp-dialog-actions">
            <el-button @click="judgeScoreDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitJudgeScore">提交评分</el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="participantUploadDialogVisible" title="参与活动并上传作品" width="560px" destroy-on-close>
        <template v-if="participatingActivity">
          <el-form label-position="top">
            <el-form-item label="活动名称">
              <el-input :model-value="participatingActivity.title" disabled />
            </el-form-item>
            <el-form-item label="作品名称">
              <el-input v-model="participantUploadForm.workName" placeholder="请输入作品名称" clearable />
            </el-form-item>
            <el-form-item label="作品类型">
              <el-select v-model="participantUploadForm.previewType" placeholder="请选择">
                <el-option label="PDF" value="pdf" />
                <el-option label="图片" value="image" />
              </el-select>
            </el-form-item>
            <el-form-item label="作品链接">
              <el-input v-model="participantUploadForm.previewUrl" placeholder="请输入在线作品链接" clearable />
            </el-form-item>
            <el-form-item label="上传文件">
              <el-upload
                v-model:file-list="participantUploadFiles"
                action="#"
                :auto-upload="false"
                :limit="1"
                accept=".pdf,.png,.jpg,.jpeg"
              >
                <el-button type="primary" plain>选择文件</el-button>
                <template #tip>
                  <div class="cp-upload-tip">支持 PDF/JPG/PNG，最多 1 个文件。</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="作品说明">
              <el-input v-model="participantUploadForm.description" type="textarea" :rows="3" placeholder="请输入作品说明" />
            </el-form-item>
          </el-form>
          <div class="cp-dialog-actions">
            <el-button @click="participantUploadDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitParticipantUpload">提交作品</el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadUserFile } from 'element-plus'
import {
  competitionMockEvents,
  competitionMockExportTasks,
  competitionMockGroups,
  competitionMockPortfolios,
  competitionMockSchoolScores,
  competitionServiceFeatures,
  competitionTestAccounts,
  type EventRecord,
  type PortfolioRecord
} from '@/mock/competitionPlatform'

type RoleKey = 'platformAdmin' | 'schoolAdmin' | 'judge' | 'teacher' | 'student'

interface LoginForm {
  username: string
  password: string
  role: RoleKey | ''
}

interface EventForm {
  title: string
  school: string
  group: string
  dateRange: string[]
  description: string
}

interface SchoolMaterialRecord {
  id: number
  name: string
  activity: string
  materialType: 'pdf' | 'image'
  materialTypeLabel: 'PDF' | '图片'
  size: string
  uploadedAt: string
  previewUrl: string
}

interface SchoolProgressRecord {
  activity: string
  stage: string
  percentage: number
  updatedAt: string
}

interface SchoolScoreResultRecord {
  activity: string
  score: number
  rank: string
  judgeCount: number
  comment: string
}

interface JudgeActivityRecord extends EventRecord {
  description: string
  submissionCount: number
}

interface JudgeHistoryRecord {
  activity: string
  reviewedCount: number
  avgScore: number
  lastReviewedAt: string
  conclusion: string
}

interface JudgeWorkRecord {
  id: number
  activityId: number
  name: string
  student: string
  school: string
  group: string
  submittedAt: string
  previewType: 'pdf' | 'image'
  previewUrl: string
  status: '待评审' | '已评审'
  score: string
}

interface ParticipantSubmissionRecord {
  id: number
  role: 'teacher' | 'student'
  activityId: number
  activityTitle: string
  workName: string
  previewType: 'pdf' | 'image'
  previewUrl: string
  attachmentName: string
  submittedAt: string
}

const formRef = ref()
const eventFormRef = ref()
const currentRole = ref<RoleKey | null>(null)

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  role: ''
})

const eventForm = reactive<EventForm>({
  title: '',
  school: '',
  group: '',
  dateRange: [],
  description: ''
})

const eventList = ref<EventRecord[]>([...competitionMockEvents])

const adminActiveModule = ref('overview')
const schoolActiveModule = ref('schoolLaunch')
const judgeActiveModule = ref('judgeActivities')
const participantActiveModule = ref('participantActivities')

const eventIdSeed = ref(Math.max(...competitionMockEvents.map((item) => item.id)) + 1)
const schoolLaunchSeed = ref(3001)
const schoolMaterialSeed = ref(6001)

const groupDraft = reactive({
  name: '',
  description: ''
})

const groupList = ref([...competitionMockGroups])

const uploadPolicy = reactive({
  fileTypes: ['pdf', 'docx', 'image'],
  maxSizeMb: 200,
  previewEnabled: true
})

const schoolScoreList = ref([...competitionMockSchoolScores])

const exportDraft = reactive<{ activity: string; type: 'single' | 'portfolio' | 'school' }>({
  activity: '',
  type: 'portfolio'
})

const exportTaskList = ref([...competitionMockExportTasks])

const portfolioList = ref([...competitionMockPortfolios])

const previewDialogVisible = ref(false)
const previewingPortfolio = ref<PortfolioRecord | null>(null)

const pagination = reactive({
  pageSize: 5,
  eventPage: 1,
  groupPage: 1,
  schoolScorePage: 1,
  exportTaskPage: 1,
  portfolioPage: 1,
  schoolLaunchPage: 1,
  schoolPortfolioPage: 1,
  schoolMaterialPage: 1,
  schoolProgressPage: 1,
  schoolScoreResultPage: 1,
  judgeActivityPage: 1,
  judgeHistoryPage: 1,
  judgeWorkPage: 1,
  participantActivityPage: 1
})

const judgeFilter = reactive({
  keyword: '',
  status: '',
  group: ''
})

const judgeActivityDialogVisible = ref(false)
const judgeWorksDialogVisible = ref(false)
const judgeScoreDialogVisible = ref(false)
const previewingJudgeActivity = ref<JudgeActivityRecord | null>(null)
const currentJudgeActivity = ref<JudgeActivityRecord | null>(null)
const scoringJudgeWork = ref<JudgeWorkRecord | null>(null)

const judgeScoreForm = reactive({
  score: 85,
  comment: ''
})

const participantUploadDialogVisible = ref(false)
const participatingActivity = ref<JudgeActivityRecord | null>(null)

const participantFilter = reactive({
  keyword: '',
  status: '',
  group: ''
})

const participantUploadForm = reactive({
  workName: '',
  previewType: 'pdf' as 'pdf' | 'image',
  previewUrl: '',
  description: ''
})
const participantUploadFiles = ref<UploadUserFile[]>([])

const participantSubmissionList = ref<ParticipantSubmissionRecord[]>([
  {
    id: 1,
    role: 'teacher',
    activityId: 9001,
    activityTitle: '2026校园创新作品评比活动',
    workName: '课堂互动系统设计',
    previewType: 'pdf',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: '课堂互动系统设计.pdf',
    submittedAt: '2026-03-06 14:20'
  },
  {
    id: 2,
    role: 'student',
    activityId: 9005,
    activityTitle: '校园文化数字展演',
    workName: '校园文化导览图',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1600&q=80',
    attachmentName: '校园文化导览图.png',
    submittedAt: '2026-03-06 15:32'
  }
])

const judgeActivityList = ref<JudgeActivityRecord[]>([
  {
    id: 9001,
    title: '2026校园创新作品评比活动',
    school: '南城一中',
    group: '高中组',
    dateRangeText: '2026-03-01 至 2026-03-20',
    status: '进行中',
    description: '围绕智慧校园、低碳实践、AI教学辅助等方向开展项目评审。',
    submissionCount: 28
  },
  {
    id: 9002,
    title: '机器人编程校际联赛',
    school: '江南实验中学',
    group: '初中组',
    dateRangeText: '2026-03-12 至 2026-04-06',
    status: '进行中',
    description: '聚焦机器人编程、路径规划与实物调试的综合竞赛活动。',
    submissionCount: 34
  },
  {
    id: 9003,
    title: '数字媒体设计主题赛',
    school: '东城中学',
    group: '高中组',
    dateRangeText: '2026-02-10 至 2026-03-05',
    status: '已结束',
    description: '以数字媒体作品为核心，评估创意表达、叙事与技术实现。',
    submissionCount: 22
  },
  {
    id: 9004,
    title: '青少年信息素养实践赛',
    school: '临江实验学校',
    group: '初中组',
    dateRangeText: '2026-03-15 至 2026-04-09',
    status: '待发布',
    description: '通过信息检索、分析与呈现任务，检验学生信息素养能力。',
    submissionCount: 0
  },
  {
    id: 9005,
    title: '校园文化数字展演',
    school: '青云高级中学',
    group: '高中组',
    dateRangeText: '2026-03-05 至 2026-03-29',
    status: '进行中',
    description: '展示校园文化主题数字作品，注重创意传播和视觉表现。',
    submissionCount: 19
  },
  {
    id: 9006,
    title: '未来城市规划创想赛',
    school: '枫林学校',
    group: '小学组',
    dateRangeText: '2026-02-22 至 2026-03-18',
    status: '已结束',
    description: '以未来城市为主题提交设计方案，重点考察可行性和创新性。',
    submissionCount: 24
  }
])

const judgeWorkList = ref<JudgeWorkRecord[]>([
  { id: 1, activityId: 9001, name: '智慧校园低碳改造方案', student: '张晨', school: '南城一中', group: '高中组', submittedAt: '2026-03-06 09:12', previewType: 'pdf', previewUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', status: '已评审', score: '92' },
  { id: 2, activityId: 9001, name: 'AI课堂助手设计', student: '李欣', school: '北城实验学校', group: '高中组', submittedAt: '2026-03-06 10:41', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80', status: '待评审', score: '-' },
  { id: 3, activityId: 9002, name: '机器人路径优化挑战', student: '王旭', school: '江南实验中学', group: '初中组', submittedAt: '2026-03-06 11:18', previewType: 'pdf', previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: '已评审', score: '89' },
  { id: 4, activityId: 9002, name: '自动分拣机械臂方案', student: '赵萌', school: '西城二中', group: '初中组', submittedAt: '2026-03-06 12:06', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80', status: '待评审', score: '-' },
  { id: 5, activityId: 9003, name: '校园纪录片数字剪辑', student: '陈昊', school: '东城中学', group: '高中组', submittedAt: '2026-03-02 15:32', previewType: 'pdf', previewUrl: 'https://www.orimi.com/pdf-test.pdf', status: '已评审', score: '95' },
  { id: 6, activityId: 9005, name: '文化展演交互导览图', student: '孙雅', school: '青云高级中学', group: '高中组', submittedAt: '2026-03-06 16:01', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1600&q=80', status: '待评审', score: '-' },
  { id: 7, activityId: 9006, name: '未来城市交通系统设计', student: '周岚', school: '枫林学校', group: '小学组', submittedAt: '2026-03-01 13:56', previewType: 'pdf', previewUrl: 'https://www.africau.edu/images/default/sample.pdf', status: '已评审', score: '90' },
  { id: 8, activityId: 9001, name: '绿色能源智慧照明方案', student: '吴桐', school: '南城一中', group: '高中组', submittedAt: '2026-03-06 17:08', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80', status: '待评审', score: '-' },
  { id: 9, activityId: 9002, name: '校园巡检机器人系统', student: '何宁', school: '江南实验中学', group: '初中组', submittedAt: '2026-03-06 18:02', previewType: 'pdf', previewUrl: 'https://gahp.net/wp-content/uploads/2017/09/sample.pdf', status: '待评审', score: '-' },
  { id: 10, activityId: 9003, name: '数字海报叙事设计', student: '罗怡', school: '东城中学', group: '高中组', submittedAt: '2026-03-03 10:25', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80', status: '已评审', score: '91' },
  { id: 11, activityId: 9005, name: '校园文化数字导览', student: '邵涵', school: '青云高级中学', group: '高中组', submittedAt: '2026-03-06 15:22', previewType: 'pdf', previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', status: '待评审', score: '-' },
  { id: 12, activityId: 9006, name: '未来社区交通中枢方案', student: '任可', school: '枫林学校', group: '小学组', submittedAt: '2026-03-02 09:44', previewType: 'image', previewUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80', status: '已评审', score: '88' }
])

const judgeHistoryList = ref<JudgeHistoryRecord[]>([
  { activity: '数字媒体设计主题赛', reviewedCount: 22, avgScore: 90.4, lastReviewedAt: '2026-03-05 18:20', conclusion: '总体质量高，优秀作品集中在叙事与交互表达方向。' },
  { activity: '未来城市规划创想赛', reviewedCount: 24, avgScore: 88.7, lastReviewedAt: '2026-03-04 17:45', conclusion: '方案完整度较好，建议加强预算与实施路径可行性。' },
  { activity: '校园文化数字展演(上届)', reviewedCount: 19, avgScore: 91.1, lastReviewedAt: '2025-12-16 16:05', conclusion: '视觉表现突出，建议进一步规范素材版权标注。' },
  { activity: '青少年信息素养实践赛(上届)', reviewedCount: 31, avgScore: 86.9, lastReviewedAt: '2025-11-28 19:02', conclusion: '数据分析与论证能力提升明显，需强化表达规范。' }
])

const schoolLaunchForm = reactive({
  title: '',
  group: '',
  dateRange: [] as string[],
  description: ''
})

const schoolLaunchList = ref<EventRecord[]>([
  { id: 2001, title: '本校智慧校园实践挑战赛', school: '北城实验学校', group: '高中组', dateRangeText: '2026-03-10 至 2026-03-28', status: '进行中' },
  { id: 2002, title: '本校信息素养综合展示赛', school: '北城实验学校', group: '初中组', dateRangeText: '2026-03-16 至 2026-04-02', status: '待发布' },
  { id: 2003, title: '本校创客课堂成果评选', school: '北城实验学校', group: '小学组', dateRangeText: '2026-02-20 至 2026-03-08', status: '已结束' }
])

const schoolUploadDraft = reactive({
  name: '',
  activity: '',
  previewType: 'pdf' as 'pdf' | 'image',
  previewUrl: ''
})

const schoolPortfolioList = ref<PortfolioRecord[]>([
  ...competitionMockPortfolios.filter((item) => item.school === '北城实验学校' || item.school === '南城一中')
])

const schoolMaterialList = ref<SchoolMaterialRecord[]>([
  {
    id: 5001,
    name: 'AI课堂助手设计-汇报材料',
    activity: '本校智慧校园实践挑战赛',
    materialType: 'pdf',
    materialTypeLabel: 'PDF',
    size: '8.4MB',
    uploadedAt: '2026-03-06 10:18',
    previewUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    id: 5002,
    name: '校级展示海报',
    activity: '本校信息素养综合展示赛',
    materialType: 'image',
    materialTypeLabel: '图片',
    size: '3.1MB',
    uploadedAt: '2026-03-06 14:25',
    previewUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 5003,
    name: '机器人分组方案',
    activity: '本校创客课堂成果评选',
    materialType: 'pdf',
    materialTypeLabel: 'PDF',
    size: '5.6MB',
    uploadedAt: '2026-03-05 09:40',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
])

const schoolProgressList = ref<SchoolProgressRecord[]>([
  { activity: '本校智慧校园实践挑战赛', stage: '评审中', percentage: 72, updatedAt: '2026-03-06 15:10' },
  { activity: '本校信息素养综合展示赛', stage: '报名中', percentage: 41, updatedAt: '2026-03-06 11:45' },
  { activity: '本校创客课堂成果评选', stage: '已公示', percentage: 100, updatedAt: '2026-03-05 17:30' },
  { activity: '机器人编程校际联赛', stage: '材料复核', percentage: 85, updatedAt: '2026-03-06 09:20' },
  { activity: '数字媒体设计主题赛', stage: '已结束', percentage: 100, updatedAt: '2026-03-04 18:05' },
  { activity: '校园文化数字展演', stage: '评审中', percentage: 67, updatedAt: '2026-03-06 16:02' }
])

const schoolScoreResultList = ref<SchoolScoreResultRecord[]>([
  { activity: '数字媒体设计主题赛', score: 92.5, rank: '2/18', judgeCount: 5, comment: '创意表达突出，建议完善验证流程。' },
  { activity: '机器人编程校际联赛', score: 89.0, rank: '4/20', judgeCount: 6, comment: '系统稳定，建议补充安全策略。' },
  { activity: '校园文化数字展演', score: 94.0, rank: '1/15', judgeCount: 5, comment: '整体完成度高，演示效果优秀。' },
  { activity: '青少年信息素养实践赛', score: 87.5, rank: '5/19', judgeCount: 4, comment: '结构完整，建议加强数据分析深度。' },
  { activity: '未来城市规划创想赛', score: 90.5, rank: '3/16', judgeCount: 5, comment: '问题导向明确，建议补充落地预算。' }
])

const schoolPermission = reactive({
  allowPreview: true,
  allowDownload: false,
  allowExternalShare: false
})

const scoreMode = reactive({
  mode: 'percent',
  innovationRatio: 40,
  completionRatio: 35,
  presentationRatio: 25,
  showScore: true
})

const accessPolicy = reactive({
  allowSingleDownload: true,
  allowPreview: true
})

const serviceFeatures = competitionServiceFeatures

const testAccounts = competitionTestAccounts

const roleConfig: Record<RoleKey, { title: string; desc: string; features: string[] }> = {
  platformAdmin: {
    title: '平台管理员工作台',
    desc: '你可以发起赛事活动、配置分组与评分规则、导出作品。',
    features: ['赛事活动发起', '分组管理', '评分规则配置', '作品批量导出', '下载权限控制', '结果发布']
  },
  schoolAdmin: {
    title: '学校管理员工作台',
    desc: '你可以代表学校上传作品集并管理本校参赛数据。',
    features: ['学校作品集上传', '学校材料管理', '活动进度查看', '评分结果查看', '作品浏览权限', '下载控制']
  },
  judge: {
    title: '评委工作台',
    desc: '你可以在线浏览作品、点评并按规则评分。',
    features: ['所有活动列表', '历史评审查询']
  },
  teacher: {
    title: '教师工作台',
    desc: '你可以查看活动并参与上传作品。',
    features: ['活动列表', '参与活动上传作品']
  },
  student: {
    title: '学生工作台',
    desc: '你可以查看活动并参与上传作品。',
    features: ['活动列表', '参与活动上传作品']
  }
}

const accountMap: Record<RoleKey, { username: string; password: string }> = {
  platformAdmin: { username: 'platformAdmin', password: 'platformAdmin' },
  schoolAdmin: { username: 'schoolAdmin', password: 'schoolAdmin' },
  judge: { username: 'pingwei', password: 'pingwei' },
  teacher: { username: 'teacher001', password: 'teacher001' },
  student: { username: 'student001', password: 'student001' }
}

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择身份', trigger: 'change' }]
}

const eventRules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  school: [{ required: true, message: '请输入发起学校', trigger: 'blur' }],
  group: [{ required: true, message: '请输入活动分组', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择活动周期', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动说明', trigger: 'blur' }]
}

const isPlatformAdmin = computed(() => currentRole.value === 'platformAdmin')
const isSchoolAdmin = computed(() => currentRole.value === 'schoolAdmin')
const isJudge = computed(() => currentRole.value === 'judge')
const isParticipantRole = computed(() => currentRole.value === 'teacher' || currentRole.value === 'student')

const adminStats = computed(() => {
  const total = eventList.value.length
  const pending = eventList.value.filter((item) => item.status === '待发布').length
  const running = eventList.value.filter((item) => item.status === '进行中').length
  const finished = eventList.value.filter((item) => item.status === '已结束').length
  return { total, pending, running, finished }
})

function paginateList<T>(list: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}

function normalizePage(total: number, currentPage: number): number {
  const maxPage = Math.max(1, Math.ceil(total / pagination.pageSize))
  return Math.min(currentPage, maxPage)
}

const pagedEventList = computed(() => paginateList(eventList.value, pagination.eventPage, pagination.pageSize))
const pagedGroupList = computed(() => paginateList(groupList.value, pagination.groupPage, pagination.pageSize))
const pagedSchoolScoreList = computed(() => paginateList(schoolScoreList.value, pagination.schoolScorePage, pagination.pageSize))
const pagedExportTaskList = computed(() => paginateList(exportTaskList.value, pagination.exportTaskPage, pagination.pageSize))
const pagedPortfolioList = computed(() => paginateList(portfolioList.value, pagination.portfolioPage, pagination.pageSize))
const pagedSchoolLaunchList = computed(() => paginateList(schoolLaunchList.value, pagination.schoolLaunchPage, pagination.pageSize))
const pagedSchoolPortfolioList = computed(() => paginateList(schoolPortfolioList.value, pagination.schoolPortfolioPage, pagination.pageSize))
const pagedSchoolMaterialList = computed(() => paginateList(schoolMaterialList.value, pagination.schoolMaterialPage, pagination.pageSize))
const pagedSchoolProgressList = computed(() => paginateList(schoolProgressList.value, pagination.schoolProgressPage, pagination.pageSize))
const pagedSchoolScoreResultList = computed(() => paginateList(schoolScoreResultList.value, pagination.schoolScoreResultPage, pagination.pageSize))

const filteredJudgeActivityList = computed(() => {
  const keyword = judgeFilter.keyword.trim().toLowerCase()
  return judgeActivityList.value.filter((item) => {
    const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword) || item.school.toLowerCase().includes(keyword)
    const matchStatus = !judgeFilter.status || item.status === judgeFilter.status
    const matchGroup = !judgeFilter.group || item.group === judgeFilter.group
    return matchKeyword && matchStatus && matchGroup
  })
})

const currentJudgeWorks = computed(() => {
  if (!currentJudgeActivity.value) return []
  return judgeWorkList.value.filter((item) => item.activityId === currentJudgeActivity.value?.id)
})

const pagedJudgeActivityList = computed(() => paginateList(filteredJudgeActivityList.value, pagination.judgeActivityPage, pagination.pageSize))
const pagedJudgeHistoryList = computed(() => paginateList(judgeHistoryList.value, pagination.judgeHistoryPage, pagination.pageSize))
const pagedJudgeWorkList = computed(() => paginateList(currentJudgeWorks.value, pagination.judgeWorkPage, pagination.pageSize))

const filteredParticipantActivityList = computed(() => {
  const keyword = participantFilter.keyword.trim().toLowerCase()
  return judgeActivityList.value.filter((item) => {
    const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword) || item.school.toLowerCase().includes(keyword)
    const matchStatus = !participantFilter.status || item.status === participantFilter.status
    const matchGroup = !participantFilter.group || item.group === participantFilter.group
    return matchKeyword && matchStatus && matchGroup
  })
})

const pagedParticipantActivityList = computed(() =>
  paginateList(filteredParticipantActivityList.value, pagination.participantActivityPage, pagination.pageSize)
)

function submitLogin(): void {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return

    const role = loginForm.role as RoleKey
    const target = accountMap[role]

    if (loginForm.username === target.username && loginForm.password === target.password) {
      currentRole.value = role
      ElMessage.success(`${roleConfig[role].title} 登录成功`)
      return
    }

    ElMessage.error('账号、密码或身份不匹配，请检查后重试')
  })
}

function resetForm(): void {
  formRef.value.resetFields()
}

function logout(): void {
  currentRole.value = null
  resetForm()
  resetEventForm()
  ElMessage.success('已退出登录')
}

function submitEvent(): void {
  eventFormRef.value.validate((valid: boolean) => {
    if (!valid) return

    const [startDate, endDate] = eventForm.dateRange
    eventList.value.unshift({
      id: eventIdSeed.value++,
      title: eventForm.title,
      school: eventForm.school,
      group: eventForm.group,
      dateRangeText: `${startDate} 至 ${endDate}`,
      status: '待发布'
    })

    ElMessage.success('赛事活动发起成功')
    resetEventForm()
  })
}

function resetEventForm(): void {
  eventFormRef.value?.resetFields()
}

function publishEvent(id: number): void {
  const hit = eventList.value.find((item) => item.id === id)
  if (!hit) return
  hit.status = '进行中'
  ElMessage.success('活动已发布')
}

async function deleteEvent(id: number): Promise<void> {
  try {
    await ElMessageBox.confirm('确认删除该活动吗？删除后不可恢复。', '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    eventList.value = eventList.value.filter((item) => item.id !== id)
    pagination.eventPage = normalizePage(eventList.value.length, pagination.eventPage)
    ElMessage.success('活动已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function addGroup(): void {
  if (!groupDraft.name.trim()) {
    ElMessage.warning('请输入分组名称')
    return
  }

  groupList.value.unshift({
    name: groupDraft.name.trim(),
    description: groupDraft.description.trim() || '暂无说明'
  })
  groupDraft.name = ''
  groupDraft.description = ''
  ElMessage.success('分组新增成功')
}

async function removeGroup(name: string): Promise<void> {
  try {
    await ElMessageBox.confirm(`确认删除分组「${name}」吗？`, '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    groupList.value = groupList.value.filter((item) => item.name !== name)
    pagination.groupPage = normalizePage(groupList.value.length, pagination.groupPage)
    ElMessage.success('分组已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function saveUploadPolicy(): void {
  ElMessage.success('上传策略已保存')
}

function submitSchoolLaunch(): void {
  if (!schoolLaunchForm.title.trim() || !schoolLaunchForm.group.trim() || schoolLaunchForm.dateRange.length !== 2) {
    ElMessage.warning('请完整填写活动名称、分组和周期')
    return
  }

  const [startDate, endDate] = schoolLaunchForm.dateRange
  const newEvent: EventRecord = {
    id: schoolLaunchSeed.value++,
    title: schoolLaunchForm.title.trim(),
    school: '北城实验学校',
    group: schoolLaunchForm.group.trim(),
    dateRangeText: `${startDate} 至 ${endDate}`,
    status: '待发布'
  }

  schoolLaunchList.value.unshift(newEvent)
  eventList.value.unshift(newEvent)
  ElMessage.success('学校赛事活动已发起')
  resetSchoolLaunchForm()
}

function resetSchoolLaunchForm(): void {
  schoolLaunchForm.title = ''
  schoolLaunchForm.group = ''
  schoolLaunchForm.dateRange = []
  schoolLaunchForm.description = ''
}

function publishSchoolLaunch(id: number): void {
  const hit = schoolLaunchList.value.find((item) => item.id === id)
  if (!hit) return
  hit.status = '进行中'
  ElMessage.success('学校活动已发布')
}

async function deleteSchoolLaunch(id: number): Promise<void> {
  try {
    await ElMessageBox.confirm('确认删除该学校活动吗？删除后不可恢复。', '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    schoolLaunchList.value = schoolLaunchList.value.filter((item) => item.id !== id)
    eventList.value = eventList.value.filter((item) => item.id !== id)
    pagination.schoolLaunchPage = normalizePage(schoolLaunchList.value.length, pagination.schoolLaunchPage)
    ElMessage.success('学校活动已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function submitSchoolUpload(): void {
  if (!schoolUploadDraft.name.trim() || !schoolUploadDraft.activity.trim() || !schoolUploadDraft.previewUrl.trim()) {
    ElMessage.warning('请完整填写作品名称、活动和预览链接')
    return
  }

  const portfolio: PortfolioRecord = {
    name: schoolUploadDraft.name.trim(),
    category: '学校作品集',
    school: '北城实验学校',
    review: `活动：${schoolUploadDraft.activity.trim()}`,
    previewType: schoolUploadDraft.previewType,
    previewUrl: schoolUploadDraft.previewUrl.trim()
  }

  schoolPortfolioList.value.unshift(portfolio)
  schoolMaterialList.value.unshift({
    id: schoolMaterialSeed.value++,
    name: schoolUploadDraft.name.trim(),
    activity: schoolUploadDraft.activity.trim(),
    materialType: schoolUploadDraft.previewType,
    materialTypeLabel: schoolUploadDraft.previewType === 'pdf' ? 'PDF' : '图片',
    size: schoolUploadDraft.previewType === 'pdf' ? '6.2MB' : '2.8MB',
    uploadedAt: '2026-03-06 18:30',
    previewUrl: schoolUploadDraft.previewUrl.trim()
  })

  schoolUploadDraft.name = ''
  schoolUploadDraft.activity = ''
  schoolUploadDraft.previewUrl = ''
  schoolUploadDraft.previewType = 'pdf'
  ElMessage.success('学校作品上传成功')
}

function openSchoolMaterial(row: SchoolMaterialRecord): void {
  previewingPortfolio.value = {
    name: row.name,
    category: '单文件',
    school: '北城实验学校',
    review: row.activity,
    previewType: row.materialType,
    previewUrl: row.previewUrl
  }
  previewDialogVisible.value = true
}

async function deleteSchoolMaterial(id: number): Promise<void> {
  try {
    await ElMessageBox.confirm('确认删除该材料吗？删除后不可恢复。', '删除提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消'
    })
    schoolMaterialList.value = schoolMaterialList.value.filter((item) => item.id !== id)
    pagination.schoolMaterialPage = normalizePage(schoolMaterialList.value.length, pagination.schoolMaterialPage)
    ElMessage.success('材料已删除')
  } catch {
    ElMessage.info('已取消删除')
  }
}

function saveSchoolPermission(): void {
  ElMessage.success('学校浏览权限配置已保存')
}

function searchJudgeActivities(): void {
  pagination.judgeActivityPage = 1
}

function resetJudgeActivities(): void {
  judgeFilter.keyword = ''
  judgeFilter.status = ''
  judgeFilter.group = ''
  pagination.judgeActivityPage = 1
}

function previewJudgeActivity(row: JudgeActivityRecord): void {
  previewingJudgeActivity.value = row
  judgeActivityDialogVisible.value = true
}

function viewJudgeWorks(row: JudgeActivityRecord): void {
  currentJudgeActivity.value = row
  pagination.judgeWorkPage = 1
  judgeWorksDialogVisible.value = true
}

function openJudgeScore(row: JudgeWorkRecord): void {
  scoringJudgeWork.value = row
  judgeScoreForm.score = 85
  judgeScoreForm.comment = ''
  judgeScoreDialogVisible.value = true
}

function submitJudgeScore(): void {
  if (!scoringJudgeWork.value) return
  scoringJudgeWork.value.status = '已评审'
  scoringJudgeWork.value.score = String(judgeScoreForm.score)
  judgeScoreDialogVisible.value = false
  ElMessage.success('评分提交成功')
}

function searchParticipantActivities(): void {
  pagination.participantActivityPage = 1
}

function resetParticipantActivities(): void {
  participantFilter.keyword = ''
  participantFilter.status = ''
  participantFilter.group = ''
  pagination.participantActivityPage = 1
}

function openParticipationDialog(row: JudgeActivityRecord): void {
  participatingActivity.value = row
  participantUploadForm.workName = ''
  participantUploadForm.previewType = 'pdf'
  participantUploadForm.previewUrl = ''
  participantUploadForm.description = ''
  participantUploadFiles.value = []
  participantUploadDialogVisible.value = true
}

function submitParticipantUpload(): void {
  if (!participatingActivity.value) return
  if (!participantUploadForm.workName.trim()) {
    ElMessage.warning('请填写作品名称')
    return
  }
  if (!participantUploadFiles.value.length) {
    ElMessage.warning('请上传作品文件')
    return
  }

  const firstFile = participantUploadFiles.value[0]
  const filePreviewUrl = firstFile.raw ? URL.createObjectURL(firstFile.raw) : ''
  const finalPreviewUrl = participantUploadForm.previewUrl.trim() || filePreviewUrl
  if (!finalPreviewUrl) {
    ElMessage.warning('请补充作品链接或重新选择文件')
    return
  }

  const role = currentRole.value === 'student' ? 'student' : 'teacher'
  participantSubmissionList.value.unshift({
    id: participantSubmissionList.value.length + 1,
    role,
    activityId: participatingActivity.value.id,
    activityTitle: participatingActivity.value.title,
    workName: participantUploadForm.workName.trim(),
    previewType: participantUploadForm.previewType,
    previewUrl: finalPreviewUrl,
    attachmentName: firstFile.name,
    submittedAt: '2026-03-06 19:00'
  })

  judgeWorkList.value.unshift({
    id: Math.max(...judgeWorkList.value.map((item) => item.id)) + 1,
    activityId: participatingActivity.value.id,
    name: participantUploadForm.workName.trim(),
    student: role === 'student' ? '当前学生账号' : '当前教师账号',
    school: '当前所属学校',
    group: participatingActivity.value.group,
    submittedAt: '2026-03-06 19:00',
    previewType: participantUploadForm.previewType,
    previewUrl: finalPreviewUrl,
    status: '待评审',
    score: '-'
  })

  const activity = judgeActivityList.value.find((item) => item.id === participatingActivity.value?.id)
  if (activity) activity.submissionCount += 1

  participantUploadDialogVisible.value = false
  participantUploadFiles.value = []
  ElMessage.success('参与成功，作品已提交')
}

function previewJudgeWork(row: JudgeWorkRecord): void {
  previewingPortfolio.value = {
    name: row.name,
    category: '单文件',
    school: row.school,
    review: `提交人：${row.student}`,
    previewType: row.previewType,
    previewUrl: row.previewUrl
  }
  previewDialogVisible.value = true
}

function saveSchoolScore(_row: { school: string }): void {
  ElMessage.success('评分已保存')
}

function createExportTask(): void {
  if (!exportDraft.activity.trim()) {
    ElMessage.warning('请输入导出活动名称')
    return
  }

  const typeLabelMap = {
    single: '单作品',
    portfolio: '作品集',
    school: '学校作品集'
  } as const

  exportTaskList.value.unshift({
    activity: exportDraft.activity.trim(),
    typeLabel: typeLabelMap[exportDraft.type],
    status: '处理中'
  })
  exportDraft.activity = ''
  ElMessage.success('导出任务已创建')
}

function openPortfolio(row: PortfolioRecord): void {
  previewingPortfolio.value = row
  previewDialogVisible.value = true
}

function saveScoreMode(): void {
  const total = scoreMode.innovationRatio + scoreMode.completionRatio + scoreMode.presentationRatio
  if (total !== 100) {
    ElMessage.warning('评分比例总和需等于100%')
    return
  }
  ElMessage.success('评分模式已保存')
}

function saveAccessPolicy(): void {
  ElMessage.success('浏览下载权限已保存')
}

function handleAdminMenuSelect(key: string): void {
  adminActiveModule.value = key
}

function handleSchoolMenuSelect(key: string): void {
  schoolActiveModule.value = key
}

function handleJudgeMenuSelect(key: string): void {
  judgeActiveModule.value = key
}

function handleParticipantMenuSelect(key: string): void {
  participantActiveModule.value = key
}
</script>

<style scoped>
.cp-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 36px;
  overflow: hidden;
}

.cp-page-logged {
  align-items: flex-start;
}

.cp-bg {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
}

.cp-bg-a {
  width: 320px;
  height: 320px;
  left: -120px;
  top: -90px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.26) 0%, rgba(56, 189, 248, 0) 70%);
  animation: cpFloatA 9s ease-in-out infinite;
}

.cp-bg-b {
  width: 360px;
  height: 360px;
  right: -130px;
  bottom: -120px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.26) 0%, rgba(52, 211, 153, 0) 70%);
  animation: cpFloatB 10s ease-in-out infinite;
}

.cp-shell {
  position: relative;
  z-index: 2;
  width: min(1200px, 98%);
  display: grid;
  grid-template-columns: 1.25fr 0.9fr;
  gap: 18px;
  animation: cpRiseIn 0.58s ease-out both;
}

.cp-intro-panel {
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.92), rgba(240, 253, 250, 0.88));
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.1);
  padding: 20px;
  animation: cpSlideLeft 0.52s ease-out both;
}

.cp-intro-head h2 {
  margin: 8px 0 6px;
  font-size: clamp(28px, 2.7vw, 36px);
  color: #0f172a;
}

.cp-intro-head p {
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.cp-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0e7490;
}

.cp-feature-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cp-feature-card {
  border-radius: 14px;
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #d9e8f7;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: cpCardIn 0.55s ease both;
}

.cp-feature-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.cp-feature-card:nth-child(1) { animation-delay: 0.06s; }
.cp-feature-card:nth-child(2) { animation-delay: 0.1s; }
.cp-feature-card:nth-child(3) { animation-delay: 0.14s; }
.cp-feature-card:nth-child(4) { animation-delay: 0.18s; }
.cp-feature-card:nth-child(5) { animation-delay: 0.22s; }
.cp-feature-card:nth-child(6) { animation-delay: 0.26s; }
.cp-feature-card:nth-child(7) { animation-delay: 0.3s; }
.cp-feature-card:nth-child(8) { animation-delay: 0.34s; }

.cp-feature-no {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: #0e7490;
  font-size: 12px;
  font-weight: 700;
  background: rgba(14, 165, 233, 0.15);
}

.cp-feature-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #1e293b;
}

.cp-login-card,
.cp-role-card {
  position: relative;
  z-index: 2;
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.1);
}

.cp-login-card {
  animation: cpSlideRight 0.56s ease-out both;
}

.cp-role-card {
  animation: cpRiseIn 0.45s ease-out both;
  min-height: calc(100vh - 96px);
}

.cp-head h3 {
  margin: 2px 0 6px;
  font-size: 30px;
  color: #0f172a;
}

.cp-head p {
  margin: 0;
  color: #475569;
}

.cp-form {
  margin-top: 16px;
}

.cp-role-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 4px;
}

.cp-action-row {
  margin-top: 10px;
}

.cp-login-btn {
  min-width: 150px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cp-login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(14, 116, 144, 0.22);
}

.cp-account-box {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(241, 245, 249, 0.86);
  color: #334155;
  font-size: 13px;
  line-height: 1.7;
}

.cp-account-trigger {
  margin-top: 8px;
  padding-left: 2px;
  color: #0e7490;
  transition: color 0.2s ease, transform 0.2s ease;
}

.cp-account-trigger:hover {
  color: #0369a1;
  transform: translateX(2px);
}

.cp-account-title {
  font-weight: 700;
  color: #0f172a;
}

.cp-account-box p {
  margin: 0;
}

.cp-role-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.cp-role-head h3 {
  margin: 8px 0 6px;
  font-size: 28px;
  color: #0f172a;
}

.cp-role-desc {
  margin: 0;
  color: #475569;
}

.cp-role-grid {
  margin-top: 18px;
}

.cp-stat-grid {
  margin-top: 14px;
}

.cp-stat-card {
  border-radius: 12px;
  border: 1px solid #dbe6f2;
  background: #f8fbff;
  padding: 12px;
}

.cp-stat-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.cp-stat-card h4 {
  margin: 8px 0 0;
  color: #0f172a;
  font-size: 26px;
}

.cp-launch-panel {
  border: 1px solid #dbe8f4;
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(150deg, rgba(248, 252, 255, 0.95), rgba(241, 250, 245, 0.94));
}

.cp-admin-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
}

.cp-admin-side {
  border: 1px solid #dbe8f4;
  border-radius: 14px;
  background: linear-gradient(180deg, #0f2f49 0%, #123a59 100%);
  padding: 10px;
}

.cp-admin-side-title {
  color: #d9ebfd;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 4px 6px 10px;
}

.cp-admin-menu {
  border-right: none;
  background: transparent;
}

.cp-admin-menu :deep(.el-menu-item) {
  color: #d2e6fb;
  border-radius: 8px;
  margin-bottom: 4px;
}

.cp-admin-menu :deep(.el-menu-item:hover) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}

.cp-admin-menu :deep(.el-menu-item.is-active) {
  color: #ffffff;
  background: linear-gradient(90deg, rgba(30, 136, 229, 0.78), rgba(13, 148, 136, 0.72));
}

.cp-admin-content {
  min-width: 0;
}

.cp-launch-head h4 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.cp-launch-head p {
  margin: 6px 0 0;
  color: #475569;
}

.cp-launch-form {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 12px;
}

.cp-launch-full {
  grid-column: 1 / -1;
}

.cp-date-range {
  width: 100%;
}

.cp-inline-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin: 10px 0 12px;
}

.cp-inline-row-school {
  grid-template-columns: 1fr 1fr 140px 1.4fr auto;
}

.cp-inline-row-judge {
  grid-template-columns: 1.2fr 180px 180px auto auto;
}

.cp-inline-row-participant {
  grid-template-columns: 1.2fr 180px 180px auto auto;
}

.cp-event-table {
  margin-top: 8px;
}

.cp-progress-cell {
  min-width: 180px;
}

.cp-pagination {
  margin-top: 12px;
  justify-content: flex-end;
}

.cp-preview-title {
  margin: 0 0 12px;
  color: #0f172a;
  font-weight: 600;
}

.cp-preview-pdf {
  width: 100%;
  height: min(72vh, 760px);
  border: 1px solid #dbe5f0;
  border-radius: 10px;
}

.cp-preview-image {
  display: block;
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border: 1px solid #dbe5f0;
  border-radius: 10px;
  background: #f8fafc;
}

.cp-upload-tip {
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
}

.cp-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}

.cp-role-feature-item {
  height: 100%;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid #dbe5f0;
  background: linear-gradient(140deg, #f8fbff 0%, #f8fffb 100%);
  color: #0f172a;
  font-size: 14px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.cp-role-feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 18px rgba(15, 23, 42, 0.08);
}

@keyframes cpRiseIn {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes cpSlideLeft {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes cpSlideRight {
  from {
    transform: translateX(10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes cpCardIn {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes cpFloatA {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes cpFloatB {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cp-bg-a,
  .cp-bg-b,
  .cp-shell,
  .cp-intro-panel,
  .cp-login-card,
  .cp-role-card,
  .cp-feature-card {
    animation: none !important;
  }
}

@media (max-width: 900px) {
  .cp-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .cp-feature-grid {
    grid-template-columns: 1fr;
  }

  .cp-role-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cp-role-head {
    flex-direction: column;
  }

  .cp-launch-form {
    grid-template-columns: 1fr;
  }

  .cp-admin-layout {
    grid-template-columns: 1fr;
  }

  .cp-inline-row {
    grid-template-columns: 1fr;
  }

  .cp-inline-row-school {
    grid-template-columns: 1fr;
  }

  .cp-inline-row-judge {
    grid-template-columns: 1fr;
  }

  .cp-inline-row-participant {
    grid-template-columns: 1fr;
  }
}
</style>
