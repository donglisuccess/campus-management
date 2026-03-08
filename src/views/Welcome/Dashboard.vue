<template>
  <section class="welcome-cockpit-page">
    <div class="welcome-cockpit-grid">
      <header class="hero-card panel-card">
        <div>
          <p class="hero-kicker">Freshman Command Deck</p>
          <h1 class="hero-title">智慧迎新大屏领导驾驶舱</h1>
          <p class="hero-desc">实时查看新生报到进度、校园导览、人流分布和重点服务节点，支撑迎新现场统筹调度。</p>

          <div class="hero-alert-board">
            <div class="hero-alert-head">
              <span class="hero-alert-dot"></span>
              <strong>实时告警</strong>
            </div>
            <div class="hero-alert-list">
              <article v-for="alert in liveAlerts" :key="alert.title" class="hero-alert-item">
                <span :class="['hero-alert-level', `hero-alert-level--${alert.level}`]">{{ alert.level }}</span>
                <div>
                  <strong>{{ alert.title }}</strong>
                  <p>{{ alert.detail }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div class="hero-side">
          <div v-for="item in summaryStats" :key="item.label" class="hero-metric">
            <span>{{ item.label }}</span>
            <strong :style="{ color: item.accent }">{{ formatMetric(item.value, item.unit) }}</strong>
          </div>
          <div class="hero-actions">
            <el-button type="primary" round @click="goWelcomeManage">进入后台</el-button>
            <el-button round @click="goHome">返回首页</el-button>
          </div>
        </div>
      </header>

      <section class="panel-card heat-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Origin Heat</p>
            <h2>生源热力图</h2>
          </div>
          <span class="panel-tag">{{ provinceRegions.length }} 个省级地区</span>
        </div>

        <div class="china-board">
          <svg viewBox="0 0 800 520" class="china-svg" aria-hidden="true">
            <defs>
              <linearGradient id="chinaStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#67e8f9" />
                <stop offset="100%" stop-color="#f472b6" />
              </linearGradient>
            </defs>
            <path
              class="china-land"
              d="M95 164L132 125L177 111L229 92L283 104L319 79L386 84L441 111L509 128L547 162L606 176L657 222L680 269L665 314L696 352L642 390L596 393L555 435L505 417L448 430L392 402L349 416L293 392L230 381L184 349L144 309L121 259L87 220Z"
            />
            <g class="china-region-layer">
              <path
                v-for="region in provinceRegions"
                :key="region.name"
                class="china-region"
                :d="region.path"
                :fill="region.fill"
              />
            </g>
            <path class="china-border" d="M95 164L132 125L177 111L229 92L283 104L319 79L386 84L441 111L509 128L547 162L606 176L657 222L680 269L665 314L696 352L642 390L596 393L555 435L505 417L448 430L392 402L349 416L293 392L230 381L184 349L144 309L121 259L87 220Z" />
          </svg>
          <div class="china-scan"></div>
          <div
            v-for="point in topHeatPoints"
            :key="point.name"
            class="heat-point"
            :style="{ left: `${point.x}%`, top: `${point.y}%`, '--heat-color': point.color, '--heat-size': `${20 + point.value / 22}px`, '--heat-delay': `${point.value / 90}s` }"
          >
            <span class="heat-dot"></span>
            <div class="heat-label">
              <strong>{{ point.name }}</strong>
              <span>{{ point.value }} 人</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card map-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Campus Guide</p>
            <h2>校园地图导览</h2>
          </div>
          <span class="panel-tag">7 个重点点位</span>
        </div>

        <div class="campus-board">
          <svg viewBox="0 0 800 520" class="campus-svg" aria-hidden="true">
            <path class="campus-road" d="M54 355L228 355L334 286L452 286L555 212L733 212" />
            <path class="campus-road campus-road--minor" d="M360 62L360 459" />
            <path class="campus-road campus-road--minor" d="M566 124L566 458" />
            <path class="campus-road campus-road--minor" d="M170 110L170 430" />
            <path class="campus-lake" d="M603 344C640 329 679 333 705 357C697 391 653 410 609 396C592 380 590 358 603 344Z" />
            <rect class="campus-building campus-building--main" x="120" y="262" width="110" height="76" rx="12" />
            <rect class="campus-building" x="279" y="92" width="126" height="92" rx="12" />
            <rect class="campus-building" x="455" y="160" width="126" height="78" rx="12" />
            <rect class="campus-building" x="622" y="122" width="94" height="64" rx="12" />
            <rect class="campus-building" x="624" y="252" width="90" height="122" rx="12" />
            <rect class="campus-building" x="482" y="66" width="84" height="58" rx="12" />
            <rect class="campus-building" x="112" y="92" width="88" height="76" rx="12" />
          </svg>
          <div class="campus-scan"></div>
          <div
            v-for="spot in campusSpots"
            :key="spot.name"
            :class="['campus-spot', `campus-spot--${spotSeverity(spot.status)}`]"
            :style="{ left: `${spot.x}%`, top: `${spot.y}%` }"
          >
            <span class="campus-pin"></span>
            <div class="campus-card">
              <div class="campus-card-head">
                <strong>{{ spot.name }}</strong>
                <span :class="['campus-status', `campus-status--${spotSeverity(spot.status)}`]">{{ spot.status }}</span>
              </div>
              <em>{{ spot.category }}</em>
              <span>{{ spot.description }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card latest-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Live Feed</p>
            <h2>最新报到学生</h2>
          </div>
          <span class="panel-tag">伪实时刷新</span>
        </div>

        <div class="latest-toolbar">
          <div class="latest-mode-switch">
            <button
              v-for="mode in latestViewModes"
              :key="mode.value"
              type="button"
              :class="['latest-mode-button', { 'latest-mode-button--active': latestViewMode === mode.value }]"
              @click="setLatestViewMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
          <div class="latest-filter-row">
            <button
              v-for="option in latestQueueOptions"
              :key="option.value"
              type="button"
              :class="['latest-filter-chip', { 'latest-filter-chip--active': latestFilter === option.value }]"
              @click="latestFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
          <div class="latest-live-meta">
            <span class="latest-live-dot"></span>
            <strong>持续入队</strong>
            <em>最近刷新 {{ latestRefreshTime }}</em>
          </div>
        </div>

        <div class="latest-marquee">
          <div
            class="latest-track"
            :class="{ 'latest-track--static': filteredLatestStudents.length <= latestVisibleCount }"
            :style="{ '--latest-steps': latestAnimationSteps.toString() }"
          >
            <div class="latest-list">
              <article
                v-for="(student, index) in latestCarouselStudents"
                :key="student.id"
                :class="['latest-item', { 'latest-item--fresh': index < latestFreshCount }]"
              >
                <div
                  class="latest-avatar"
                  :style="{
                    '--avatar-start': getCollegeTheme(student.college).start,
                    '--avatar-end': getCollegeTheme(student.college).end
                  }"
                >
                  <span>{{ student.name.slice(0, 1) }}</span>
                  <em>{{ getCollegeTheme(student.college).code }}</em>
                </div>
                <div class="latest-main">
                  <div class="latest-headline">
                    <div class="latest-name-block">
                      <strong>{{ student.name }}</strong>
                      <span class="latest-college-badge">{{ getCollegeTheme(student.college).label }}</span>
                    </div>
                    <div class="latest-time-block">
                      <span v-if="index < latestFreshCount" class="latest-fresh-badge">新报到</span>
                      <span class="latest-time">{{ student.checkInTime }}</span>
                    </div>
                  </div>
                  <p>{{ student.college }} · {{ student.major }}</p>
                  <div class="latest-foot">
                    <small>{{ student.origin }} · {{ student.gender }}</small>
                    <span :class="['latest-status', `latest-status--${getLatestStatusTone(student.status)}`]">{{ student.status }}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card progress-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Check-in Overview</p>
            <h2>报到情况统计图</h2>
          </div>
        </div>

        <div class="stack-bars">
          <div v-for="item in checkinProgress" :key="item.name" class="stack-bar-item">
            <div class="stack-bar-meta">
              <span>{{ item.name }}</span>
              <strong>{{ item.value }}</strong>
            </div>
            <div class="stack-bar-track">
              <div class="stack-bar-fill" :style="{ width: `${(item.value / progressMax) * 100}%`, background: item.accent }"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card college-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">College Ranking</p>
            <h2>各学院报到人员统计图</h2>
          </div>
        </div>

        <div class="column-chart">
          <div v-for="item in collegeStats" :key="item.name" class="column-item">
            <div class="column-track">
              <div class="column-bar" :style="{ height: `${(item.value / collegeMax) * 100}%`, background: item.accent }"></div>
            </div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </section>

      <section class="panel-card origin-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Origin Distribution</p>
            <h2>报到人生源地统计图</h2>
          </div>
        </div>

        <div class="rank-list">
          <div v-for="item in originStats" :key="item.name" class="rank-item">
            <div class="rank-main">
              <span class="rank-dot" :style="{ background: item.accent }"></span>
              <strong>{{ item.name }}</strong>
            </div>
            <div class="rank-progress">
              <div class="rank-fill" :style="{ width: `${(item.value / originMax) * 100}%`, background: item.accent }"></div>
            </div>
            <span class="rank-value">{{ item.value }}</span>
          </div>
        </div>
      </section>

      <section class="panel-card gender-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Gender Ratio</p>
            <h2>新生男女比例图表</h2>
          </div>
        </div>

        <div class="gender-layout">
          <div class="gender-donut" :style="{ background: genderChartBackground }">
            <div class="gender-donut-core">
              <strong>{{ totalGender }}</strong>
              <span>总人数</span>
            </div>
          </div>
          <div class="gender-meta">
            <div class="gender-item gender-item--male">
              <span>男生</span>
              <strong>{{ genderRatio.male }}</strong>
              <em>{{ malePercent }}%</em>
            </div>
            <div class="gender-item gender-item--female">
              <span>女生</span>
              <strong>{{ genderRatio.female }}</strong>
              <em>{{ femalePercent }}%</em>
            </div>
          </div>
        </div>
      </section>

      <section class="panel-card hour-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Hourly Trend</p>
            <h2>当天报到人数按时间统计图</h2>
          </div>
        </div>

        <div class="hour-chart">
          <div v-for="item in hourStats" :key="item.hour" class="hour-item">
            <strong>{{ item.value }}</strong>
            <div class="hour-track">
              <div class="hour-bar" :style="{ height: `${(item.value / hourMax) * 100}%` }"></div>
            </div>
            <span>{{ item.hour }}</span>
          </div>
        </div>
      </section>

      <section class="panel-card guide-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Process Guide</p>
            <h2>报到流程指引</h2>
          </div>
        </div>

        <div class="guide-list">
          <article v-for="item in guideSteps" :key="item.step" class="guide-item">
            <div class="guide-step">{{ item.step }}</div>
            <div class="guide-main">
              <div class="guide-headline">
                <strong>{{ item.title }}</strong>
                <span>{{ item.location }}</span>
              </div>
              <p>{{ item.detail }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="panel-card notice-card">
        <div class="panel-head">
          <div>
            <p class="panel-kicker">Bulletin</p>
            <h2>校园公告</h2>
          </div>
        </div>

        <div class="notice-list">
          <article v-for="notice in notices" :key="`${notice.title}-${notice.time}`" class="notice-item">
            <div class="notice-headline">
              <span :class="['notice-level', `notice-level--${notice.level}`]">{{ notice.level }}</span>
              <strong>{{ notice.title }}</strong>
              <em>{{ notice.time }}</em>
            </div>
            <p>{{ notice.content }}</p>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  WELCOME_CAMPUS_SPOTS,
  WELCOME_CHECKIN_PROGRESS,
  WELCOME_COLLEGE_STATS,
  WELCOME_GENDER_RATIO,
  WELCOME_GUIDE_STEPS,
  WELCOME_HEAT_POINTS,
  WELCOME_HOUR_STATS,
  WELCOME_LATEST_STUDENTS,
  WELCOME_NOTICES,
  WELCOME_ORIGIN_STATS,
  WELCOME_SUMMARY_STATS
} from '@/mock/welcomeDashboard'
import type { WelcomeArrivalStudent } from '@/mock/welcomeDashboard'

const router = useRouter()

const summaryStats = WELCOME_SUMMARY_STATS
const heatPoints = WELCOME_HEAT_POINTS
const campusSpots = WELCOME_CAMPUS_SPOTS
const checkinProgress = WELCOME_CHECKIN_PROGRESS
const collegeStats = WELCOME_COLLEGE_STATS
const originStats = WELCOME_ORIGIN_STATS
const genderRatio = WELCOME_GENDER_RATIO
const hourStats = WELCOME_HOUR_STATS
const guideSteps = WELCOME_GUIDE_STEPS
const notices = WELCOME_NOTICES

const provinceShapeMap: Record<string, string> = {
  新疆: 'M100 144L160 126L228 136L248 176L232 224L166 244L108 220L92 180Z',
  西藏: 'M106 272L182 266L240 286L232 338L162 362L108 332L96 292Z',
  青海: 'M226 206L282 202L308 236L294 286L244 294L212 256Z',
  甘肃: 'M274 150L326 144L356 178L344 222L302 228L268 200Z',
  宁夏: 'M336 190L360 190L370 214L352 232L334 220Z',
  内蒙古: 'M246 100L314 84L396 88L470 102L544 112L612 146L594 184L520 176L442 170L346 158L278 150Z',
  黑龙江: 'M606 118L662 128L704 160L692 214L650 228L608 198L594 154Z',
  吉林: 'M580 192L628 196L648 234L624 266L584 252L570 220Z',
  辽宁: 'M550 214L584 214L600 242L582 268L548 258L538 232Z',
  北京: 'M500 190L514 190L520 202L508 212L496 204Z',
  天津: 'M516 202L530 202L534 214L520 222L512 212Z',
  河北: 'M452 164L518 164L548 204L536 252L484 266L442 234L438 194Z',
  山西: 'M404 164L450 164L460 204L446 246L410 240L394 198Z',
  陕西: 'M348 184L398 180L418 216L404 258L364 258L340 222Z',
  山东: 'M544 166L602 176L634 204L620 238L572 240L546 216Z',
  河南: 'M350 182L430 176L456 214L434 248L378 242L344 214Z',
  江苏: 'M518 188L568 196L592 228L564 252L518 240L502 208Z',
  上海: 'M590 252L600 252L604 266L592 272L586 262Z',
  安徽: 'M462 194L518 194L544 232L520 274L474 266L450 228Z',
  湖北: 'M346 228L412 224L446 246L432 286L384 294L342 272Z',
  浙江: 'M558 236L604 244L620 284L590 312L548 296L540 262Z',
  江西: 'M448 274L498 278L520 316L496 356L454 348L438 310Z',
  福建: 'M578 320L622 332L638 378L606 404L568 388L558 344Z',
  湖南: 'M356 278L410 278L432 318L404 354L358 346L344 308Z',
  广东: 'M496 352L568 358L590 400L544 428L488 408L476 370Z',
  广西: 'M426 352L486 356L500 406L458 430L406 410L392 374Z',
  海南: 'M500 450L548 454L560 480L532 492L502 482L494 462Z',
  四川: 'M206 238L268 230L308 254L298 304L256 332L212 316L192 276Z',
  重庆: 'M300 262L326 264L336 286L318 304L298 294Z',
  贵州: 'M276 334L326 332L352 352L332 380L290 380L266 356Z',
  云南: 'M172 344L230 334L250 374L214 408L158 392L148 356Z',
  台湾: 'M654 340L678 352L686 392L666 430L646 412L640 370Z',
  香港: 'M574 414L584 414L588 422L578 428L570 422Z',
  澳门: 'M562 420L570 420L572 428L566 432L558 426Z'
}

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3 ? normalized.split('').map((item) => `${item}${item}`).join('') : normalized
  const red = Number.parseInt(full.slice(0, 2), 16)
  const green = Number.parseInt(full.slice(2, 4), 16)
  const blue = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const provinceRegions = computed(() => {
  const values = heatPoints.map((item) => item.value)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  return heatPoints
    .filter((item) => provinceShapeMap[item.name])
    .map((item) => ({
      ...item,
      path: provinceShapeMap[item.name],
      fill: hexToRgba(item.color, 0.14 + ((item.value - minValue) / (maxValue - minValue || 1)) * 0.62)
    }))
})

const topHeatPoints = computed(() => [...heatPoints].sort((left, right) => right.value - left.value).slice(0, 12))
const latestVisibleCount = 4
const latestFreshCount = 3

type LiveArrivalStudent = WelcomeArrivalStudent & { id: number }

const latestViewModes = [
  { label: '全部队列', value: 'all' },
  { label: '按学院', value: 'college' },
  { label: '按状态', value: 'status' }
] as const

const latestStatusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已报到', value: 'done' },
  { label: '宿舍队列', value: 'dorm' },
  { label: '校园卡办理', value: 'card' },
  { label: '物资领取', value: 'supply' },
  { label: '待核验', value: 'pending' }
] as const

const latestViewMode = ref<(typeof latestViewModes)[number]['value']>('all')
const latestFilter = ref('all')
const latestRefreshTime = ref('15:26:00')
const latestStudentsFeed = ref<LiveArrivalStudent[]>(
  WELCOME_LATEST_STUDENTS.map((item, index) => ({
    ...item,
    id: index + 1
  }))
)

let latestFeedTimer: ReturnType<typeof setInterval> | undefined
let latestFeedCursor = latestStudentsFeed.value.length

const latestQueueOptions = computed(() => {
  if (latestViewMode.value === 'college') {
    return [
      { label: '全部学院', value: 'all' },
      ...Array.from(new Set(latestStudentsFeed.value.map((item) => item.college))).map((college) => ({
        label: getCollegeTheme(college).label,
        value: college
      }))
    ]
  }

  if (latestViewMode.value === 'status') {
    return [...latestStatusOptions]
  }

  return [{ label: '全部学生', value: 'all' }]
})

const filteredLatestStudents = computed(() => {
  if (latestViewMode.value === 'college' && latestFilter.value !== 'all') {
    return latestStudentsFeed.value.filter((item) => item.college === latestFilter.value)
  }

  if (latestViewMode.value === 'status' && latestFilter.value !== 'all') {
    return latestStudentsFeed.value.filter((item) => getLatestStatusTone(item.status) === latestFilter.value)
  }

  return latestStudentsFeed.value
})

const latestCarouselStudents = computed(() => {
  if (filteredLatestStudents.value.length <= latestVisibleCount) {
    return filteredLatestStudents.value
  }

  return [...filteredLatestStudents.value, ...filteredLatestStudents.value.slice(0, latestVisibleCount)]
})

const latestAnimationSteps = computed(() => Math.max(filteredLatestStudents.value.length, 1))

const collegeThemeMap: Record<string, { code: string; label: string; start: string; end: string }> = {
  智能制造学院: { code: '智', label: '智造', start: '#38bdf8', end: '#2563eb' },
  医护学院: { code: '医', label: '医护', start: '#fb7185', end: '#ec4899' },
  电子工程学院: { code: '电', label: '电子', start: '#2dd4bf', end: '#0f766e' },
  经济管理学院: { code: '经', label: '经管', start: '#f59e0b', end: '#ea580c' },
  汽车工程学院: { code: '汽', label: '汽车', start: '#a78bfa', end: '#7c3aed' },
  信息工程学院: { code: '信', label: '信息', start: '#60a5fa', end: '#4338ca' },
  建筑工程学院: { code: '建', label: '建筑', start: '#34d399', end: '#15803d' }
}

const getCollegeTheme = (college: string) => {
  return collegeThemeMap[college] ?? { code: college.slice(0, 1), label: '学院', start: '#38bdf8', end: '#1d4ed8' }
}

const getLatestStatusTone = (status: string) => {
  if (status.includes('已完成报到') || status.includes('已完成寝室入住')) {
    return 'done'
  }
  if (status.includes('宿舍分配')) {
    return 'dorm'
  }
  if (status.includes('校园卡')) {
    return 'card'
  }
  if (status.includes('军训物资')) {
    return 'supply'
  }
  return 'pending'
}

const setLatestViewMode = (mode: (typeof latestViewModes)[number]['value']) => {
  latestViewMode.value = mode
}

const formatRealtimeClock = (index: number) => {
  const baseHour = 15
  const baseMinute = 26
  const baseSecond = 18
  const totalSeconds = baseHour * 3600 + baseMinute * 60 + baseSecond + index * 13
  const hour = Math.floor(totalSeconds / 3600)
  const minute = Math.floor((totalSeconds % 3600) / 60)
  const second = totalSeconds % 60
  return [hour, minute, second].map((item) => item.toString().padStart(2, '0')).join(':')
}

const formatRealtimeMinute = (clock: string) => clock.slice(0, 5)

const statusCycle = ['已完成报到', '已完成寝室入住', '正在办理校园卡', '宿舍分配中', '等待学院核验', '已领取军训物资']

const pushRealtimeStudent = () => {
  const seed = WELCOME_LATEST_STUDENTS[latestFeedCursor % WELCOME_LATEST_STUDENTS.length]
  const timeClock = formatRealtimeClock(latestFeedCursor)
  const nextStudent: LiveArrivalStudent = {
    ...seed,
    id: latestFeedCursor + 1,
    checkInTime: formatRealtimeMinute(timeClock),
    status: statusCycle[latestFeedCursor % statusCycle.length]
  }

  latestStudentsFeed.value = [nextStudent, ...latestStudentsFeed.value].slice(0, 24)
  latestRefreshTime.value = timeClock
  latestFeedCursor += 1
}

watch(latestQueueOptions, (options) => {
  if (!options.some((option) => option.value === latestFilter.value)) {
    latestFilter.value = options[0]?.value ?? 'all'
  }
}, { immediate: true })

onMounted(() => {
  latestFeedTimer = setInterval(() => {
    pushRealtimeStudent()
  }, 4800)
})

onBeforeUnmount(() => {
  if (latestFeedTimer) {
    clearInterval(latestFeedTimer)
  }
})

const liveAlerts = computed(() => [
  {
    level: '高',
    title: '南门迎新主入口人流预警',
    detail: '15 分钟内累计入校 412 人，建议增派志愿者引导。'
  },
  {
    level: '中',
    title: '兰苑 1-4 栋入住接近满载',
    detail: '剩余可分配床位 53 个，建议同步启用梅苑预备宿舍。'
  },
  {
    level: '中',
    title: '体育馆综合服务区办理排队上升',
    detail: '绿色通道与军训物资窗口平均等待时间已超过 9 分钟。'
  }
])

const progressMax = Math.max(...checkinProgress.map((item) => item.value))
const collegeMax = Math.max(...collegeStats.map((item) => item.value))
const originMax = Math.max(...originStats.map((item) => item.value))
const hourMax = Math.max(...hourStats.map((item) => item.value))

const totalGender = computed(() => genderRatio.male + genderRatio.female)
const malePercent = computed(() => ((genderRatio.male / totalGender.value) * 100).toFixed(1))
const femalePercent = computed(() => ((genderRatio.female / totalGender.value) * 100).toFixed(1))
const genderChartBackground = computed(
  () => `conic-gradient(#38bdf8 0 ${malePercent.value}%, #fb7185 ${malePercent.value}% 100%)`
)

const formatMetric = (value: number, unit = '') => `${value}${unit}`

const spotSeverity = (status: string) => {
  if (status.includes('高峰') || status.includes('满载') || status.includes('繁忙')) {
    return 'high'
  }
  if (status.includes('接近')) {
    return 'medium'
  }
  return 'normal'
}

const goHome = () => {
  void router.push('/')
}

const goWelcomeManage = () => {
  void router.push('/welcome')
}
</script>

<style scoped>
.welcome-cockpit-page {
  width: calc(100% + 40px);
  margin: -40px -20px -56px;
  min-height: 100vh;
  padding: 30px 24px 40px;
  color: #e2e8f0;
  background:
    radial-gradient(circle at 8% 12%, rgba(56, 189, 248, 0.18), transparent 24%),
    radial-gradient(circle at 92% 12%, rgba(251, 113, 133, 0.14), transparent 24%),
    linear-gradient(180deg, #05111f 0%, #071726 48%, #0a1622 100%);
}

.welcome-cockpit-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
}

.panel-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(9, 24, 38, 0.92), rgba(5, 17, 31, 0.92));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 18px 40px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(10px);
}

.hero-card {
  grid-column: span 12;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 18px;
  padding: 26px;
}

.hero-card::after,
.panel-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), transparent 36%, rgba(251, 113, 133, 0.06));
  pointer-events: none;
}

.hero-kicker,
.panel-kicker {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7dd3fc;
  background: rgba(56, 189, 248, 0.12);
}

.hero-title {
  margin-top: 14px;
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.08;
  color: #f8fafc;
}

.hero-desc {
  max-width: 720px;
  margin-top: 12px;
  line-height: 1.85;
  color: rgba(226, 232, 240, 0.78);
}

.hero-alert-board {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid rgba(125, 211, 252, 0.14);
  background: linear-gradient(180deg, rgba(8, 18, 28, 0.86), rgba(8, 18, 28, 0.62));
}

.hero-alert-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-alert-head strong {
  color: #f8fafc;
}

.hero-alert-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #fb7185;
  box-shadow: 0 0 0 6px rgba(251, 113, 133, 0.16);
  animation: alertPulse 1.8s infinite;
}

.hero-alert-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.hero-alert-item {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.48);
}

.hero-alert-level {
  display: grid;
  place-items: center;
  height: 28px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.hero-alert-level--高 {
  color: #ffe4e6;
  background: rgba(244, 63, 94, 0.18);
}

.hero-alert-level--中 {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.18);
}

.hero-alert-item strong {
  color: #f8fafc;
}

.hero-alert-item p {
  margin-top: 4px;
  color: #94a3b8;
  line-height: 1.6;
}

.hero-side {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-content: start;
}

.hero-metric {
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.56);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.hero-metric span {
  font-size: 13px;
  color: rgba(226, 232, 240, 0.72);
}

.hero-metric strong {
  display: block;
  margin-top: 10px;
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: 34px;
}

.hero-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
  padding: 18px 18px 0;
}

.panel-head h2 {
  margin-top: 8px;
  font-size: 24px;
  color: #f8fafc;
}

.panel-tag {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #f8fafc;
  background: rgba(244, 114, 182, 0.16);
}

.heat-card,
.map-card,
.latest-card,
.progress-card,
.college-card,
.origin-card,
.gender-card,
.hour-card,
.guide-card,
.notice-card {
  min-height: 320px;
}

.heat-card,
.map-card,
.latest-card,
.progress-card,
.college-card,
.origin-card,
.gender-card,
.hour-card,
.guide-card,
.notice-card {
  grid-column: span 4;
}

.china-board {
  position: relative;
  height: 320px;
  margin: 12px 18px 18px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.34), rgba(15, 23, 42, 0.66)),
    radial-gradient(circle at center, rgba(56, 189, 248, 0.12), transparent 66%);
}

.china-svg {
  position: absolute;
  inset: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}

.china-land {
  fill: rgba(33, 69, 108, 0.28);
}

.china-region-layer {
  mix-blend-mode: screen;
}

.china-region {
  stroke: rgba(186, 230, 253, 0.7);
  stroke-width: 2.4;
  stroke-linejoin: round;
  stroke-linecap: round;
  filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.12));
  transition: fill 0.3s ease;
}

.china-border {
  fill: none;
  stroke: url(#chinaStroke);
  stroke-width: 4;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.16));
}

.china-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.18) 48%, transparent 100%);
  mix-blend-mode: screen;
  animation: scanSweep 5.6s linear infinite;
}

.heat-point {
  position: absolute;
  transform: translate(-50%, -50%);
}

.heat-dot {
  display: block;
  width: var(--heat-size);
  height: var(--heat-size);
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--heat-color) 88%, white 12%), transparent 70%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 30px var(--heat-color);
  animation: heatBreath 2.4s ease-in-out infinite;
  animation-delay: var(--heat-delay);
}

.heat-label {
  position: absolute;
  left: 12px;
  top: -6px;
  display: grid;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(3, 10, 18, 0.84);
  white-space: nowrap;
}

.heat-label strong {
  font-size: 12px;
  color: #f8fafc;
}

.heat-label span {
  font-size: 11px;
  color: #94a3b8;
}

.campus-board {
  position: relative;
  height: 320px;
  margin: 12px 18px 18px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(13, 27, 42, 0.38), rgba(4, 16, 28, 0.86)),
    linear-gradient(90deg, rgba(34, 197, 94, 0.05), transparent 40%),
    linear-gradient(0deg, rgba(56, 189, 248, 0.05), transparent 30%);
}

.campus-board::before {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.08);
}

.campus-svg {
  position: absolute;
  inset: 12px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
}

.campus-road {
  fill: none;
  stroke: rgba(250, 204, 21, 0.5);
  stroke-width: 20;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.campus-road--minor {
  stroke: rgba(148, 163, 184, 0.28);
  stroke-width: 12;
}

.campus-lake {
  fill: rgba(56, 189, 248, 0.16);
  stroke: rgba(125, 211, 252, 0.24);
  stroke-width: 2;
}

.campus-building {
  fill: rgba(15, 23, 42, 0.7);
  stroke: rgba(125, 211, 252, 0.32);
  stroke-width: 3;
}

.campus-building--main {
  fill: rgba(30, 64, 175, 0.28);
}

.campus-scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.12) 48%, transparent 100%);
  mix-blend-mode: screen;
  animation: scanSweepX 4.8s linear infinite;
}

.campus-spot {
  position: absolute;
  transform: translate(-50%, -50%);
}

.campus-spot--high .campus-pin {
  background: #fb7185;
  box-shadow: 0 0 0 4px rgba(251, 113, 133, 0.16), 0 0 22px rgba(251, 113, 133, 0.48);
}

.campus-spot--medium .campus-pin {
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16), 0 0 22px rgba(245, 158, 11, 0.42);
}

.campus-pin {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #38bdf8;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.16), 0 0 18px rgba(56, 189, 248, 0.4);
  animation: spotPulse 2s ease-in-out infinite;
}

.campus-card {
  width: 170px;
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(4, 10, 18, 0.9);
}

.campus-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.campus-status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.campus-status--high {
  color: #ffe4e6;
  background: rgba(244, 63, 94, 0.18);
}

.campus-status--medium {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.18);
}

.campus-status--normal {
  color: #dcfce7;
  background: rgba(34, 197, 94, 0.16);
}

.campus-card strong,
.latest-headline strong,
.guide-headline strong,
.notice-headline strong {
  color: #f8fafc;
}

.campus-card em,
.campus-card span,
.latest-main p,
.latest-main small,
.guide-headline span,
.guide-main p,
.notice-item p {
  color: #94a3b8;
}

.campus-card em,
.campus-card span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-style: normal;
  line-height: 1.6;
}

.guide-list,
.notice-list {
  display: grid;
  gap: 12px;
  padding: 12px 18px 18px;
}

.latest-marquee {
  position: relative;
  height: 444px;
  margin: 12px 18px 18px;
  overflow: hidden;
  mask-image: linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
}

.latest-marquee::before,
.latest-marquee::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 42px;
  z-index: 1;
  pointer-events: none;
}

.latest-marquee::before {
  top: 0;
  background: linear-gradient(180deg, rgba(5, 17, 31, 0.95), transparent);
}

.latest-marquee::after {
  bottom: 0;
  background: linear-gradient(0deg, rgba(5, 17, 31, 0.95), transparent);
}

.latest-toolbar {
  display: grid;
  gap: 10px;
  padding: 12px 18px 0;
}

.latest-mode-switch,
.latest-filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.latest-mode-button,
.latest-filter-chip {
  border: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.latest-mode-button {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.latest-mode-button--active {
  color: #e0f2fe;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.16));
  border-color: rgba(56, 189, 248, 0.34);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.1);
}

.latest-filter-chip {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  color: #94a3b8;
  background: rgba(5, 17, 31, 0.7);
  border: 1px solid rgba(71, 85, 105, 0.32);
}

.latest-filter-chip--active {
  color: #f8fafc;
  background: rgba(244, 114, 182, 0.14);
  border-color: rgba(244, 114, 182, 0.36);
}

.latest-live-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  font-size: 12px;
}

.latest-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
  animation: latestLivePulse 1.8s infinite;
}

.latest-live-meta strong {
  color: #dcfce7;
}

.latest-live-meta em {
  font-style: normal;
  color: #7dd3fc;
}

.latest-track {
  animation: latestFlip calc(var(--latest-steps) * 2.8s) steps(var(--latest-steps)) infinite;
}

.latest-track--static {
  animation: none;
}

.latest-card:hover .latest-track {
  animation-play-state: paused;
}

.latest-list {
  display: grid;
  gap: 12px;
}

.latest-item,
.guide-item,
.notice-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.latest-item {
  min-height: 102px;
  align-items: center;
}

.latest-item--fresh {
  border-color: rgba(56, 189, 248, 0.28);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(12, 32, 52, 0.56));
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.08), 0 0 22px rgba(56, 189, 248, 0.08);
  animation: latestFreshGlow 1.8s ease-in-out infinite;
}

.latest-avatar,
.guide-step {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-weight: 700;
  color: #f8fafc;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
}

.latest-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--avatar-start), var(--avatar-end));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 10px 24px rgba(15, 23, 42, 0.28);
}

.latest-avatar span {
  font-size: 22px;
  line-height: 1;
}

.latest-avatar em {
  position: absolute;
  right: -4px;
  bottom: -4px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid rgba(5, 17, 31, 0.92);
  font-size: 11px;
  font-style: normal;
  color: #e0f2fe;
  background: rgba(15, 23, 42, 0.94);
}

.latest-main,
.guide-main {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.latest-name-block {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.latest-college-badge {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  color: #bae6fd;
  background: rgba(14, 165, 233, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.16);
}

.latest-time {
  flex: 0 0 auto;
  font-size: 12px;
  color: #7dd3fc;
}

.latest-time-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.latest-fresh-badge {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #082f49;
  background: linear-gradient(135deg, #67e8f9, #22c55e);
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.24);
}

.latest-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.latest-status {
  flex: 0 0 auto;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
}

.latest-status--done {
  color: #dcfce7;
  background: rgba(34, 197, 94, 0.16);
  border-color: rgba(34, 197, 94, 0.2);
}

.latest-status--dorm {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.16);
  border-color: rgba(245, 158, 11, 0.22);
}

.latest-status--card {
  color: #dbeafe;
  background: rgba(59, 130, 246, 0.16);
  border-color: rgba(59, 130, 246, 0.22);
}

.latest-status--supply {
  color: #fae8ff;
  background: rgba(168, 85, 247, 0.16);
  border-color: rgba(168, 85, 247, 0.24);
}

.latest-status--pending {
  color: #fde68a;
  background: rgba(234, 179, 8, 0.16);
  border-color: rgba(234, 179, 8, 0.22);
}

.latest-headline,
.guide-headline,
.notice-headline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.stack-bars,
.rank-list {
  display: grid;
  gap: 12px;
  padding: 14px 18px 18px;
}

.stack-bar-item,
.rank-item {
  display: grid;
  gap: 8px;
}

.stack-bar-meta {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.stack-bar-meta span,
.rank-main strong,
.hour-item span,
.column-item span {
  color: #cbd5e1;
}

.stack-bar-meta strong,
.rank-value,
.column-item strong,
.hour-item strong {
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  color: #f8fafc;
}

.stack-bar-track,
.rank-progress {
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  overflow: hidden;
}

.stack-bar-fill,
.rank-fill {
  height: 100%;
  border-radius: inherit;
}

.column-chart,
.hour-chart {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  align-items: end;
  height: 276px;
  padding: 14px 18px 18px;
}

.hour-chart {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.column-item,
.hour-item {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.column-track,
.hour-track {
  width: 100%;
  height: 190px;
  display: flex;
  align-items: end;
  justify-content: center;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(148, 163, 184, 0.08), rgba(15, 23, 42, 0.12));
}

.column-bar,
.hour-bar {
  width: 68%;
  min-height: 18px;
  border-radius: 18px 18px 8px 8px;
  background: linear-gradient(180deg, #7dd3fc, #2563eb);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}

.rank-item {
  grid-template-columns: 140px 1fr auto;
  align-items: center;
}

.rank-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.gender-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  align-items: center;
  padding: 20px 18px 18px;
}

.gender-donut {
  display: grid;
  place-items: center;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  margin: 0 auto;
}

.gender-donut-core {
  display: grid;
  place-items: center;
  width: 108px;
  height: 108px;
  border-radius: 999px;
  background: #071726;
}

.gender-donut-core strong {
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: 30px;
  color: #f8fafc;
}

.gender-donut-core span,
.gender-item span,
.gender-item em {
  color: #94a3b8;
}

.gender-meta {
  display: grid;
  gap: 14px;
}

.gender-item {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.5);
}

.gender-item strong {
  display: block;
  margin-top: 6px;
  font-family: 'Barlow', 'Noto Sans SC', sans-serif;
  font-size: 30px;
  color: #f8fafc;
}

.gender-item em {
  display: block;
  margin-top: 4px;
  font-style: normal;
}

.gender-item--male {
  border: 1px solid rgba(56, 189, 248, 0.18);
}

.gender-item--female {
  border: 1px solid rgba(251, 113, 133, 0.18);
}

.notice-item {
  display: grid;
}

.notice-level {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.notice-level--重要 {
  color: #ffe4e6;
  background: rgba(244, 63, 94, 0.18);
}

.notice-level--通知 {
  color: #e0f2fe;
  background: rgba(14, 165, 233, 0.18);
}

.notice-level--提醒 {
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.18);
}

.notice-headline em {
  color: #64748b;
  font-style: normal;
}

@keyframes heatBreath {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes latestFlip {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(calc(var(--latest-steps) * -114px));
  }
}

@keyframes latestFreshGlow {
  0%,
  100% {
    box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.08), 0 0 18px rgba(56, 189, 248, 0.06);
  }

  50% {
    box-shadow: inset 0 0 0 1px rgba(103, 232, 249, 0.16), 0 0 28px rgba(34, 197, 94, 0.14);
  }
}

@keyframes latestLivePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.2);
  }

  60% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
}

@keyframes spotPulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.18);
  }
}

@keyframes alertPulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

@keyframes scanSweep {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100%);
  }
}

@keyframes scanSweepX {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 1400px) {
  .heat-card,
  .map-card,
  .latest-card,
  .progress-card,
  .college-card,
  .origin-card,
  .gender-card,
  .hour-card,
  .guide-card,
  .notice-card {
    grid-column: span 6;
  }
}

@media (max-width: 1120px) {
  .welcome-cockpit-page {
    width: calc(100% + 24px);
    margin: -24px -12px -40px;
    padding: 22px 14px 26px;
  }

  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-side,
  .gender-layout {
    grid-template-columns: 1fr 1fr;
  }

  .heat-card,
  .map-card,
  .latest-card,
  .progress-card,
  .college-card,
  .origin-card,
  .gender-card,
  .hour-card,
  .guide-card,
  .notice-card {
    grid-column: span 12;
  }
}

@media (max-width: 720px) {
  .hero-side,
  .gender-layout,
  .rank-item,
  .notice-headline,
  .latest-headline,
  .guide-headline {
    grid-template-columns: 1fr;
    display: grid;
  }

  .hero-alert-item {
    grid-template-columns: 1fr;
  }

  .column-chart {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    height: auto;
  }

  .hour-chart {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    height: auto;
  }

  .column-track,
  .hour-track,
  .china-board,
  .campus-board {
    height: 240px;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>