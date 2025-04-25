<template>
  <div class="main-container">
    <transition name="content-fade">
      <div class="content-container container py-4" v-show="showContent">
        <div class="row g-4">
          <div class="col-12 col-lg-4">
            <div class="image-section">
              <img
                :src="featureInfo[0].imgUrl"
                alt="Team Image"
                class="img-fluid animated fadeIn"
              />
            </div>
          </div>
          <div class="col-12 col-lg-8">
            <div class="info-section">
              <h1 class="main-title">
                {{ featureInfo[0].title }}
              </h1>
              <h5>{{ featureInfo[0].subTitle }}</h5>
              <p
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[0].des"
                :key="index"
              >
                <b>{{ i.title + " " }}</b> {{ i.des }}
              </p>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <button
                  class="nav-btn btn active"
                  @click="redirectTo(featureInfo[0].redirectURL)"
                >
                  {{ featureInfo[0].btnText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="content-fade">
      <div class="content-container container py-4 mt-3" v-show="showContent">
        <div class="row g-4">
          <div class="col-12 col-lg-8">
            <div class="info-section">
              <h1 class="main-title">
                {{ featureInfo[1].title }}
              </h1>
              <h5>{{ featureInfo[1].subTitle }}</h5>
              <p
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[1].des"
                :key="index"
              >
                <b>{{ i.title + " " }}</b> {{ i.des }}
              </p>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <button
                  class="nav-btn btn active"
                  @click="redirectTo(featureInfo[1].redirectURL)"
                >
                  {{ featureInfo[1].btnText }}
                </button>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="image-section">
              <img
                :src="featureInfo[1].imgUrl"
                alt="Team Image"
                class="img-fluid animated fadeIn"
              />
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
          title: "The Complete Interview Preparation System",
          subTitle:
            "From common questions to curveball challenges - master every interview scenario with our battle-tested framework",
          des: [
            {
              title: "Practice Common Questions",
              des: "While you can’t predict every interview question, mastering frequently asked ones (like ‘Tell me about yourself’ or ‘Why this role?’) builds a strong foundation. Our curated list ensures you’re ready for the basics—so you can focus on standing out.",
            },
            {
              title: "Master Behavioral Questions",
              des: "Behavioral questions (‘Describe a challenge you faced…’) require structured answers. The STAR method (Situation, Task, Action, Result) helps you turn past experiences into compelling stories that impress recruiters.",
            },
            {
              title: "Tackle Tough Questions",
              des: "Employers ask tough questions (e.g., ‘How would you handle a failed project?’) to test your critical thinking. Practice these to demonstrate resilience, adaptability, and technical expertise under pressure.",
            },
          ],
          btnText: "Start practicing now",
          redirectURL: "exercise/feature",
        },
        {
          imgUrl: require("@/assets/guide3.png"),
          title: "AI-Powered Interview Rehearsal Studio",
          subTitle:
            "Experience the closest thing to real interviews with our adaptive simulation technology",
          des: [
            {
              title: "Dynamic Question Flow:",
              des: "Our AI adapts in real-time to your responses, creating uniquely challenging interview paths that test your thinking depth",
            },
            {
              title: "360° Performance Analysis:",
              des: "Get detailed feedback on verbal delivery (pace, clarity), nonverbal cues (eye contact, posture), and content quality",
            },
            {
              title: "Confidence Builder:",
              des: "Repeat until perfect - reduce anxiety by experiencing the full interview cycle in a risk-free environment",
            },
          ],
          btnText: "Start your mock interview",
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
