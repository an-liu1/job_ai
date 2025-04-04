<template>
  <div class="main-container">
    <!-- 导航栏 -->
    <nav class="nav-bar container">
      <div class="d-flex justify-content-center gap-3">
        <button
          v-for="(item, index) in navItems"
          :key="index"
          class="nav-btn btn"
          @click="activeIndex = index"
          :class="{ active: activeIndex === index }"
        >
          {{ item.label }}
        </button>
      </div>
    </nav>

    <!-- 内容区动画 -->
    <transition name="content-fade">
      <div class="content-container container py-4" v-show="showContent">
        <div class="row g-4">
          <div class="col-12 col-lg-6">
            <div class="image-section">
              <img
                src="https://example.com/team-image.jpg"
                alt="Team Image"
                class="img-fluid animated fadeIn"
              />
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="info-section">
              <h1 class="main-title">
                <span class="number text-primary animated fadeInUp">25</span>
                Years of experience in IT Solution & Business
              </h1>
              <p class="description text-secondary animated fadeIn">
                There are many variations of passages of Lorem Ipsum and
                available, project is but the majority have suffered alteration
                in some form, by injected humour, or randomised.
              </p>
              <div class="progress-list">
                <div
                  v-for="(progress, idx) in progressList"
                  :key="idx"
                  class="progress-item mb-3 animated fadeIn"
                  :style="{ animationDelay: `${idx * 100}ms` }"
                >
                  <span>{{ progress.title }}</span>
                  <div class="progress">
                    <div
                      class="progress-bar bg-primary"
                      role="progressbar"
                      :style="{ width: progress.percent }"
                      aria-valuenow="95"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      showContent: true,
      navItems: [
        { label: "Common Questions" },
        { label: "Behavioural Questions" },
        { label: "Tough Question" },
      ],
      progressList: [
        { title: "Web Development", percent: "95%" },
        { title: "Database Management", percent: "85%" },
        { title: "Digital Marketing", percent: "75%" },
      ],
    };
  },
  mounted() {
    // 初始化延迟显示（模拟动态加载）
    this.showContent = false;
    setTimeout(() => {
      this.showContent = true;
    }, 1000);
  },
};
</script>

<style lang="scss">
.main-container {
  margin: 50px 0;
}
/* 自定义动画 */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.5s ease;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.nav-btn {
  padding: 12px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: transform 0.2s ease;

  &.active {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
  }

  &:hover {
    transform: scale(1.02);
  }
}

// 复用Bootstrap动画
.animated {
  animation-fill-mode: both;
}
</style>
