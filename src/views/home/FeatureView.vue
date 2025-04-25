<template>
  <div class="horizontal-accordion-container">
    <div class="accordion-wrapper">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="accordion-item"
        :class="{ active: activeIndex === index }"
      >
        <div
          class="accordion-header"
          @click="togglePanel(index)"
          :style="{
            backgroundColor:
              activeIndex === index ? activeColor : inactiveColor,
          }"
        >
          <div class="header-content">
            <span class="accordion-title">{{ item.title }}</span>
          </div>
        </div>
        <div class="accordion-content" v-show="activeIndex === index">
          <div class="content-inner">
            <h3 class="content-title">{{ item.title }}</h3>
            <h5 class="content-subTitle">{{ item.subTitle }}</h5>
            <p class="content-text">{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      activeColor: "#4facfe",
      inactiveColor: "#3a7bd5",
      items: [
        {
          title: "Voice-Powered Practice",
          subTitle:
            "Speak your answers out loud — just like in a real interview.",
          content:
            "Improve the way you speak in interviews by focusing on key elements of effective communication: tone, pacing, and clarity. With natural, real-time speaking practice guided by your AI coach, you'll build fluency and confidence every step of the way. Studies show that verbal training can improve pronunciation by up to 82%, helping you sound clearer and more professional in every interview.",
        },
        {
          title: "Targeted Questions",
          subTitle:
            "Get role-specific questions that match your goals and experience.",
          content:
            "The AI Coach generates interview questions tailored to the role you're preparing for. It includes follow-up questions based on your answers, challenging prompts to test your problem-solving skills, and even tricky questions to assess your critical thinking. This helps ensure you're ready for anything an interviewer might throw your way.",
        },
        {
          title: "Real-Time Evaluation",
          subTitle:
            "Get instant AI-powered feedback on grammar, clarity, and example quality.",
          content:
            "After each response, receive constructive suggestions to refine your language, clarify your structure, and strengthen your examples. A model answer is generated based on your reply, giving you clear, immediate direction for improvement and helping you perform better in future interviews.",
        },
        {
          title: "Assessment Report",
          subTitle: "Receive a detailed report after each practice session.",
          content:
            "Your report highlights key performance areas such as STAR method usage, communication effectiveness, and language accuracy—helping you identify strengths and track areas for improvement. The Assessment Report also provides a clear summary of your performance, including strengths, weaknesses, an improvement plan, and personalized career suggestions.",
        },
        {
          title: "Tracking Record",
          subTitle: "All your sessions are saved for easy access.",
          content:
            "All your practice sessions—including audio recordings and transcripts—are saved to your account for easy access. This allows you to review your performance, listen to your responses, and identify patterns in your strengths and weaknesses. This tracking feature helps guide you on areas you need to focus on. You can use the feature to compare your performance from past practices to see how much you've improved.",
        },
      ],
    };
  },
  methods: {
    togglePanel(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.horizontal-accordion-container {
  width: 100%;
  margin: 40px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.accordion-wrapper {
  display: flex;
  height: 300px;
  padding: 0 100px;
}

.accordion-item {
  display: flex;
  position: relative;
  flex: 0 0 80px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 15px;
}

.accordion-item.active {
  flex: 1 1 400px;
}

.accordion-header {
  flex: 0 0 80px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  height: 300px;
  align-self: center;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  z-index: 2;
  color: white;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 20px 8px;
  background: linear-gradient(to top, #0295ff, #3cabff, #76c1ff, #b0d7ff);
  position: relative;
  overflow: hidden;
}

.accordion-header:hover {
  transform: scale(1.03);
}

.accordion-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.accordion-header:hover::before {
  opacity: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.accordion-title {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.accordion-content {
  position: absolute;
  left: 100px;
  right: 0;
  top: 0;
  bottom: 0;
  background: white;
  border-radius: 15px;
  padding: 0 30px;
  box-shadow: 5px 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.content-inner {
  width: 100%;
  opacity: 0;
  animation: fadeIn 1.5s ease forwards;
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px); /* 从左边20px开始 */
  }
  to {
    opacity: 1;
    transform: translateX(0); /* 移动到原始位置 */
  }
}

.content-title {
  color: #2c3e50;
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 700;
  position: relative;
  padding-bottom: 10px;
}

.content-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

.content-subTitle {
  color: #2c3e50;
}

.content-text {
  color: #4a5568;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 25px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .accordion-wrapper {
    flex-direction: column;
    min-height: auto;
    padding: 20px;
  }

  .accordion-item {
    flex: 0 0 60px;
    margin-right: 0;
    margin-bottom: 15px;
    width: 100%;
  }

  .accordion-item.active {
    flex: 0 0 auto;
    min-height: 200px;
  }

  .accordion-header {
    width: 100%;
    height: 60px;
    writing-mode: horizontal-tb;
    transform: none;
    padding: 0 25px;
    flex: 0 0 60px;
    justify-content: space-between;
  }

  .accordion-content {
    position: static;
    margin-top: 15px;
    left: 0;
    width: 100%;
  }
}

@media (max-width: 576px) {
  .content-title {
    font-size: 20px;
  }

  .content-text {
    font-size: 15px;
  }
}
</style>
