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
        <el-collapse-transition>
          <div class="accordion-content" v-show="activeIndex === index">
            <div class="content-inner">
              <h3 class="content-title">{{ item.title }}</h3>
              <h5 class="content-subTitle">{{ item.subTitle }}</h5>
              <p class="content-text">{{ item.content }}</p>
            </div>
          </div>
        </el-collapse-transition>
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
          subTitle: "Practice with your voice, just like a real interview.",
          content:
            "Speak naturally and get voice responses from your AI coach to build fluency and confidence. This hands-on approach helps you develop quick thinking, improve verbal delivery, and get comfortable answering questions out loud—just like you would in an actual interview.",
        },
        {
          title: "Instant Evaluation",
          content:
            "Get instant AI-powered feedback on grammar, clarity, and example quality. See a sample answer after each response to help you improve right away.",
        },
        {
          title: "Assessment Report",
          content:
            "After each interview practice, receive a detailed report analyzing your performance, including STAR method usage and key improvement areas.",
        },
        {
          title: "Tracking Record",
          content:
            "All your sessions are saved. Review past practice, track your growth, and stay motivated with your personal progress history.",
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
  transform: rotate(180deg);
  padding: 20px 8px;
  background: linear-gradient(to top, #0295ff, #3cabff, #76c1ff, #b0d7ff);
  position: relative;
  overflow: hidden;
}

.accordion-header:hover {
  transform: rotate(180deg) scale(1.03);
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
  animation: fadeIn 0.5s ease forwards;
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
