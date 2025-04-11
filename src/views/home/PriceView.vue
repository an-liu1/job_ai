<template>
  <div class="pricing-plans">
    <div class="section-header">
      <!-- <span class="sub-title">CHOOSE A PLAN</span> -->
      <h2 class="main-title">CHOOSE A PLAN</h2>
    </div>
    <div class="plan-list">
      <div
        class="plan-card"
        v-for="(plan, index) in plans"
        :key="index"
        @mouseenter="handleHover(index)"
        @mouseleave="handleHover(index)"
      >
        <h3 class="plan-title">{{ plan.title }}</h3>
        <p class="plan-desc">{{ plan.desc }}</p>
        <div class="price-wrap">
          <span class="price-num">{{ plan.price }}</span>
          <small class="price-unit">{{ plan.unit }}</small>
        </div>
        <button
          class="cta-btn"
          :class="{ pulse: isHovering[index] }"
          @click="handleClick"
        >
          {{ plan.ctaText }}
        </button>
        <ul class="features-list" :class="{ visible: showFeatures }">
          <li v-for="(feature, idx) in plan.features" :key="idx">
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PricingComponent",
  data() {
    return {
      plans: [
        {
          title: "Free",
          desc: "Perfect for getting started",
          price: "$0",
          unit: "Per month",
          ctaText: "Get Started Free",
          features: [
            "Access to Common Interview Questions",
            "Voice-Based Practice (Microphone Required)",
            "Record, Retry & Submit Answers",
            "Basic Performance Feedback",
            "Limited Daily Practice Sessions",
            "Dashboard Access",
            "Community Support",
          ],
        },
        {
          title: "Pro",
          desc: "Sharpen your edge for real interviews",
          price: "$19",
          unit: "Per month",
          ctaText: "Start 3 Days Free Trial",
          features: [
            "All Free Plan Features",
            "Behavioral & Tough Question Modules",
            "AI-Powered Feedback & Suggestions",
            "Unlimited Daily Practice",
            "Access to Progress Reports",
            "Mock Interview Mode",
            "Priority Email Support",
          ],
        },
        {
          title: "Premium",
          desc: "Full access. Maximum preparation.",
          price: "$29",
          unit: "Per month",
          ctaText: "Start 6 Days Free Trial",
          features: [
            "All Pro Plan Features",
            "Personalized Coaching Suggestions",
            "Industry-Specific Question Sets",
            "Interview Analytics Dashboard",
            "Resume & Elevator Pitch Review Tools",
            "Invite-Only Live Mock Interview Events",
            "24/7 Premium Support",
          ],
        },
      ],
      isHovering: Array(3).fill(false),
      showFeatures: false, // 新增控制变量
    };
  },
  mounted() {
    this.showFeatures = true; // 组件加载后触发显示动画
  },
  methods: {
    handleHover(index) {
      this.isHovering[index] = !this.isHovering[index];
    },
    handleClick() {
      // 按钮点击逻辑
    },
  },
};
</script>

<style scoped lang="scss">
.pricing-plans {
  padding: 60px 20px;
  background: #fff;

  .section-header {
    text-align: center;
    margin-bottom: 50px;

    .sub-title {
      display: block;
      color: #ff4444;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }

    .main-title {
      font-size: 28px;
      color: #2c3e50;
    }
  }

  .plan-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;

    .plan-card {
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
      min-width: 360px;
      text-align: left;
      transform: translateY(0);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .plan-title {
        font-size: 20px;
        color: #2c3e50;
        margin-bottom: 15px;
      }

      .plan-desc {
        color: #7f8c8d;
        font-size: 14px;
        margin-bottom: 20px;
      }

      .price-wrap {
        margin-bottom: 25px;
        font-size: 28px;
        color: #2c3e50;

        .price-num {
          font-weight: bold;
          animation: bounce 2s infinite;
        }

        .price-unit {
          font-size: 14px;
          color: #7f8c8d;
          margin-left: 10px;
        }
      }

      .cta-btn {
        display: block;
        width: 100%;
        padding: 12px;
        background: #646cff;
        color: #fff;
        border: none;
        border-radius: 24px;
        cursor: pointer;
        margin-bottom: 20px;
        transition: transform 0.2s, box-shadow 0.3s;
        will-change: transform;

        &.pulse {
          animation: pulse 1.5s infinite;
        }

        &:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      }

      .features-list {
        list-style: none;
        padding: 0;

        li {
          margin: 10px 0;
          position: relative;
          padding-left: 25px;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.3s ease;

          &:nth-child(1) {
            transition-delay: 0.1s;
          }
          &:nth-child(2) {
            transition-delay: 0.2s;
          }
          &:nth-child(3) {
            transition-delay: 0.3s;
          }
          &:nth-child(4) {
            transition-delay: 0.4s;
          }
          &:nth-child(5) {
            transition-delay: 0.5s;
          }
          &:nth-child(6) {
            transition-delay: 0.6s;
          }
          &:nth-child(7) {
            transition-delay: 0.7s;
          }

          &::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #2ecc71;
          }
        }

        // 新增动画触发类
        &.visible li {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .plan-list {
      gap: 20px;
    }

    .plan-card {
      min-width: 100%;
    }

    .main-title {
      font-size: 24px;
    }
  }

  // 自定义动画
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
