<template>
  <div class="why-choose-us">
    <h1>Why Choose Our Interview Prep Platform?</h1>
    <p>
      Join thousands of job seekers who land their dream roles 40% faster with
      our proven system. Our AI-powered platform combines cutting-edge
      technology with recruiter-approved strategies to give you an unbeatable
      edge. Users report 3x more confidence after just 5 mock sessions.
    </p>
    <transition-group name="fade" tag="div" class="feature-list">
      <div class="feature-item" v-for="item in features" :key="item.title">
        <div class="icon-box">
          <img :src="item.icon" alt="icon" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          title: "Data-Backed Results",
          desc: "Verified metrics like '75% of users receive callbacks within 2 weeks' build trust and credibility.",
          icon: require("@/assets/img/whyUs1.jpg"), // Suggested icon: bar chart/graph
        },
        {
          title: "AI-Powered Coaching",
          desc: "Our DeepSeek-powered AI analyzes your responses like a hiring manager, providing real-time improvements.",
          icon: require("@/assets/img/whyUs2.jpg"), // Suggested icon: neural network/robot
        },
        {
          title: "Cost-Effective Prep",
          desc: "Get premium-quality interview training at 1/3 the cost of human career coaches.",
          icon: require("@/assets/img/whyUs3.jpg"), // Suggested icon: coin/dollar sign
        },
        {
          title: "24/7 Expert Support",
          desc: "Access to interview strategists for personalized feedback on demand.",
          icon: require("@/assets/img/whyUs4.jpg"), // Suggested icon: headset/lifebuoy
        },
        {
          title: "Cutting-Edge Simulations",
          desc: "Practice with the latest interview formats including Metaverse and VR environments.",
          icon: require("@/assets/img/whyUs5.jpg"), // Suggested icon: virtual reality goggles
        },
        {
          title: "Intuitive Interface",
          desc: "User-friendly dashboard with progress tracking and one-click practice sessions.",
          icon: require("@/assets/img/whyUs6.jpg"), // Suggested icon: smartphone with checkmark
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
$text-color: #333;
$desc-color: #999;
$icon-size: 60px;
$gap-size: 40px;

.why-choose-us {
  text-align: center;
  padding: 40px;
  position: relative;
  background: url("../../assets/img/bg-whyUs.jpg") center/cover no-repeat; // 背景图

  // 添加半透明遮罩层
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8); // 白色半透明，降低背景图透明度
  }

  h1 {
    font-size: 28px;
    color: $text-color;
    margin-bottom: 20px;
    position: relative; // 确保文字在遮罩层之上
    z-index: 1;
    animation: fadeInDown 1s ease-out;
  }

  p {
    font-size: 14px;
    color: #777;
    max-width: 1000px;
    margin: 0 auto 40px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 1s ease-out;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-size;

    .feature-item {
      text-align: center;
      position: relative;
      z-index: 1;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.5s ease-out forwards;
      animation-delay: calc(var(--index) * 0.1s);

      .icon-box {
        width: $icon-size;
        height: $icon-size;
        margin: 0 auto 20px;
        background-color: #f5f5f5;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      h3 {
        font-size: 16px;
        color: $text-color;
        margin-bottom: 10px;
      }

      p {
        font-size: 12px;
        color: $desc-color;
      }
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .feature-list {
      grid-template-columns: 1fr;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
