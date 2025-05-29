<template>
  <div class="main-container">
    <transition name="content-fade">
      <div class="content-container container py-4 mt-3" v-show="showContent">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-lg-8 order-lg-1 order-2">
            <div class="info-section">
              <h1 class="main-title">
                {{ featureInfo[2].title }}
              </h1>
              <h5 class="sub-title">{{ featureInfo[2].subTitle }}</h5>
              <div
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[2].des"
                :key="index"
              >
                <h5>{{ i.title }}</h5>
                <p>{{ i.des }}</p>
              </div>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <el-button
                  class="default-btn"
                  type="primary"
                  @click="redirectTo(featureInfo[2].redirectURL)"
                >
                  {{ featureInfo[2].btnText }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 order-lg-2 order-1">
            <div class="image-section h-100">
              <img
                :src="featureInfo[2].imgUrl"
                alt="AI Interview Simulation"
                class="img-fluid w-100 h-100 object-fit-cover animated fadeIn"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="content-fade">
      <div class="content-container container py-4" v-show="showContent">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-lg-4">
            <div class="image-section h-100">
              <img
                :src="featureInfo[0].imgUrl"
                alt="Interview Preparation"
                class="img-fluid w-100 h-100 object-fit-cover animated fadeIn"
              />
            </div>
          </div>
          <div class="col-12 col-lg-8">
            <div class="info-section">
              <h1 class="main-title">
                {{ featureInfo[0].title }}
              </h1>
              <h5 class="sub-title">{{ featureInfo[0].subTitle }}</h5>
              <p
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[0].des"
                :key="index"
              >
                <b>{{ i.title + " " }}</b> {{ i.des }}
              </p>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <el-button
                  class="default-btn"
                  type="primary"
                  @click="redirectTo(featureInfo[0].redirectURL)"
                >
                  {{ featureInfo[0].btnText }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="content-fade">
      <div class="content-container container py-4 mt-3" v-show="showContent">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-lg-8 order-lg-1 order-2">
            <div class="info-section">
              <h1 class="main-title">
                {{ featureInfo[1].title }}
              </h1>
              <h5 class="sub-title">{{ featureInfo[1].subTitle }}</h5>
              <p
                class="description animated fadeIn mt-4"
                v-for="(i, index) in featureInfo[1].des"
                :key="index"
              >
                <b>{{ i.title + " " }}</b> {{ i.des }}
              </p>

              <div class="d-flex justify-content-center gap-3 mt-5">
                <el-button
                  class="default-btn"
                  type="primary"
                  @click="redirectTo(featureInfo[1].redirectURL)"
                >
                  {{ featureInfo[1].btnText }}
                </el-button>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 order-lg-2 order-1">
            <div class="image-section h-100">
              <img
                :src="featureInfo[1].imgUrl"
                alt="AI Interview Simulation"
                class="img-fluid w-100 h-100 object-fit-cover animated fadeIn"
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
      showContent: true,
      featureInfo: [
        {
          imgUrl: require("@/assets/interview1.png"),
          title: "The Complete Interview Preparation System",
          subTitle:
            "From common questions to curveball challenges - master every interview scenario with our battle-tested framework",
          des: [
            {
              title: "Practice Common Questions",
              des: "While you can't predict every interview question, mastering frequently asked ones (like 'Tell me about yourself' or 'Why this role?') builds a strong foundation. Our curated list ensures you're ready for the basics—so you can focus on standing out.",
            },
            {
              title: "Master Behavioral Questions",
              des: "Behavioral questions ('Describe a challenge you faced...') require structured answers. The STAR method (Situation, Task, Action, Result) helps you turn past experiences into compelling stories that impress recruiters.",
            },
            {
              title: "Tackle Tough Questions",
              des: "Employers ask tough questions (e.g., 'How would you handle a failed project?') to test your critical thinking. Practice these to demonstrate resilience, adaptability, and technical expertise under pressure.",
            },
          ],
          btnText: "Start practicing now",
          redirectURL: "exercise/feature",
        },
        {
          imgUrl: require("@/assets/interview2.png"),
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
        {
          imgUrl: require("@/assets/job.png"),
          title: "Job Portal for Interview Preparation",
          subTitle:
            "Our comprehensive job portal aggregates thousands of real job listings from across Canada, helping you find the perfect positions to practice for your next interview.",
          des: [
            {
              title: "Advanced Job Search & Details",
              des: "Find your ideal role with comprehensive search filters (title, location) and access complete job descriptions including responsibilities, requirements, and qualifications",
            },
            {
              title: "Mock Interview Practice",
              des: "Use real job descriptions to prepare for Mock interviews with your resume, simulating real interview conditions",
            },
            {
              title: "Direct Application Links",
              des: "One-click access to original job postings with verified application links, when you're ready",
            },
          ],
          btnText: "Explore Job Listings",
          redirectURL: "jobList",
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
        this.$store.commit("setLogininFrom", this.$route.fullPath);
        this.$router.push("/signinup");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  margin: 50px 0;
}

.content-container {
  .image-section {
    height: 350px; /* Fixed height for consistency */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.03);
      }
    }
  }

  .info-section {
    padding: 20px;

    .main-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .sub-title {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
    }

    .description {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  }
}

/* Animation and button styles */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.5s ease;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .content-container {
    .image-section {
      height: 300px;
      margin-bottom: 2rem;
    }

    .info-section {
      .main-title {
        font-size: 1.8rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .content-container {
    .image-section {
      height: 250px;
    }

    .info-section {
      .main-title {
        font-size: 1.6rem;
      }
      .sub-title {
        font-size: 1.1rem;
      }
    }
  }
}

.animated {
  animation-fill-mode: both;
}
</style>
