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
          <i :class="item.icon"></i>
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
          title: "Affordable Coaching",
          desc: "Get interview training at a fraction of the cost of a real job coach.",
          icon: "fa-solid fa-dollar-sign",
        },
        {
          title: "Perfect Your English",
          desc: "AI helps you improve grammar and fluency—great for ESL speakers and newcomers.",
          icon: "fa-regular fa-comment-dots",
        },
        {
          title: "Your 24/7 AI Job Coach",
          desc: "Your AI coach is always on—practice whenever it fits your schedule.",
          icon: "fa-regular fa-calendar-check",
        },
        {
          title: "Track Your Growth",
          desc: "Save and review all your sessions to see how far you’ve come. Re-listen to your answers, compare sessions, and hear your improvement over time.",
          icon: "fa-solid fa-chart-column",
        },
        {
          title: "Know What You're Good At",
          desc: "Receive a structured assessment report highlighting your strengths and what to improve.",
          icon: "fa-regular fa-thumbs-up",
        },
        {
          title: "Practice That Feels Real",
          desc: "Simulate real interview pressure with voice-only mock interviews and no do-overs.",
          icon: "fa-solid fa-microphone",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
$text-color: #333;
$desc-color: #464545;
$icon-size: 60px;
$gap-size: 40px;

.why-choose-us {
  text-align: center;
  padding: 40px;
  position: relative;
  background-color: #ebefff;

  h1 {
    font-size: 32px;
    color: $text-color;
    margin-bottom: 20px;
    position: relative; // 确保文字在遮罩层之上
    z-index: 1;
    animation: fadeInDown 1s ease-out;
  }

  p {
    font-size: 16px;
    color: $desc-color;
    max-width: 1200px;
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
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        font-size: 48px;
        color: #0295ff;

        &:hover {
          transform: scale(1.1);
        }
      }

      h3 {
        font-size: 20px;
        color: $text-color;
        margin-bottom: 10px;
      }

      p {
        width: 80%;
        margin: 0 auto;
        font-size: 16px;
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
