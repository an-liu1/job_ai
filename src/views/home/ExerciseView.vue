<template>
  <div class="main-container">
    <!-- 导航栏 -->
    <nav class="nav-bar container mx-auto px-4 py-2">
      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <button
          v-for="(item, index) in navItems"
          :key="index"
          class="nav-btn btn"
          @click="activeIndex = index"
          :class="{ active: activeIndex === index }"
        >
          <b>{{ item.label }}</b>
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
                :src="featureInfo[activeIndex].imgUrl"
                alt="Team Image"
                class="img-fluid animated fadeIn"
              />
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="info-section">
              <h1 class="main-title">
                <span class="number text-primary animated fadeInUp"
                  >{{ activeIndex + 1 }}.</span
                >
                {{ featureInfo[activeIndex].title }}
              </h1>
              <h5>{{ featureInfo[activeIndex].subTitle }}</h5>
              <p
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[activeIndex].des"
                :key="index"
              >
                <b>{{ i.title + " " }}</b> {{ i.des }}
              </p>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <button
                  class="nav-btn btn active"
                  @click="redirectTo(featureInfo[activeIndex].redirectURL)"
                >
                  {{ featureInfo[activeIndex].btnText }}
                </button>
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
        { label: "Mock Interview Simulation" },
      ],
      featureInfo: [
        {
          imgUrl: require("@/assets/guide1.png"),
          title: "Practice Common Questions",
          subTitle: "Nail the Basics with Industry-Tested Prompts",
          des: [
            {
              title: "Smart Question Bank:",
              des: "Access 200+ frequently asked questions across tech, finance, consulting, and more—curated from top companies like Google, McKinsey, and Amazon.",
            },
            {
              title: "Role-Specific Drills:",
              des: "Get tailored practice sessions based on your target job (e.g., 'Tell me about yourself' for sales vs. engineering roles).",
            },
            {
              title: "Sample Answers:",
              des: "Learn from high-scoring responses, with tips to avoid clichés and structure concise, compelling replies.",
            },
          ],
          btnText: "Start Practice",
          redirectURL: "exercise/common",
        },
        {
          imgUrl: require("@/assets/guide2.png"),
          title: "Master Behavioral Questions",
          subTitle: "STAR Method Made Simple—Turn Stories into Success",
          des: [
            {
              title: "Guided Frameworks:",
              des: "Break down answers into Situation, Task, Action, Result with interactive templates that adapt to your experience level.",
            },
            {
              title: "AI Story Builder:",
              des: "Transform raw experiences into compelling narratives with metrics (e.g., 'Increased team efficiency by 30%').",
            },
            {
              title: "Company-Specific Prep:",
              des: "Practice behavioral questions tailored to target employers' core values (e.g., Amazon's Leadership Principles).",
            },
          ],
          btnText: "Start Practice",
          redirectURL: "exercise/star",
        },
        {
          imgUrl: require("@/assets/guide3.png"),
          title: "Tackle Tough Questions",
          subTitle: "Handle Curveball Questions with Confidence",
          des: [
            {
              title: "Red Flag Response Library:",
              des: "Diplomatic answers for sensitive topics like employment gaps, job hopping, or salary expectations.",
            },
            {
              title: "Pressure Test Mode:",
              des: "Simulate stress interviews with rapid-fire questioning and interruptions.",
            },
            {
              title: "Damage Control Coach:",
              des: "Get real-time suggestions to recover from weak answers or mistakes during practice.",
            },
          ],
          btnText: "Start Challenge",
          redirectURL: "exercise/tough",
        },
        {
          imgUrl: require("@/assets/guide3.png"),
          title: "Mock Interview Simulation",
          subTitle:
            "Realistic Practice with AI That Thinks Like a Hiring Manager",
          des: [
            {
              title: "Adaptive Interviews:",
              des: "AI probes deeper based on your answers, just like human interviewers would.",
            },
            {
              title: "Multimodal Feedback:",
              des: "Analysis of speech patterns (filler words, clarity) and video cues (eye contact, posture) if enabled.",
            },
            {
              title: "Performance Benchmarking:",
              des: "Compare your scores with successful candidates in similar roles.",
            },
          ],
          btnText: "Start Mock Interview",
          redirectURL: "exercise/mock",
        },
      ],
    };
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
  },
  mounted() {
    // 初始化延迟显示（模拟动态加载）
    this.showContent = false;
    setTimeout(() => {
      this.showContent = true;
    }, 1000);
  },
  methods: {
    redirectTo: function (url) {
      if (this.loginStatus) {
        this.$router.push(url);
      } else {
        this.$router.push("/signinup");
      }
    },
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
