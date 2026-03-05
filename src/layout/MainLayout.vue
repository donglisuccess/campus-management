<template>
  <div class="layout-shell">
    <span class="bg-orb orb-left" />
    <span class="bg-orb orb-right" />
    <main class="layout-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  position: relative;
  min-height: 100vh;
  padding: 40px 20px 56px;
  overflow: hidden;
  background: linear-gradient(135deg, #eff5ff 0%, #eef8f2 48%, #fff8ec 100%);
}

.layout-main {
  position: relative;
  z-index: 2;
  max-width: 1220px;
  margin: 0 auto;
}

.bg-orb {
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(2px);
}

.orb-left {
  top: -100px;
  left: -120px;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.28) 0%, rgba(96, 165, 250, 0) 72%);
}

.orb-right {
  right: -140px;
  bottom: -110px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, rgba(16, 185, 129, 0) 72%);
}
</style>
