<template>
  <div class="feature-view">
    <el-carousel :interval="2000" arrow="always">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <div class="slide-container">
          <div class="text-content">
            <div class="accordion-content">
              <div class="content-inner">
                <h3 class="content-title">{{ item.title }}</h3>
                <h5 class="content-subTitle">{{ item.subTitle }}</h5>
                <p class="content-text">{{ item.content }}</p>
              </div>
            </div>
          </div>
          <div class="image-content">
            <img :src="item.img" alt="img" class="slide-image" />
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          img: require("@/assets/Voice-Powered_Practice.png"),
          title: "Voice-Powered Practice",
          subTitle:
            "Speak your answers out loud — just like in a real interview.",
          content:
            "Improve the way you speak in interviews by focusing on key elements of effective communication: tone, pacing, and clarity. With natural, real-time speaking practice guided by your AI coach, you'll build fluency and confidence every step of the way. Studies show that verbal training can improve pronunciation by up to 82%, helping you sound clearer and more professional in every interview.",
        },
        {
          img: require("@/assets/Targeted_Questions.png"),
          title: "Targeted Questions",
          subTitle:
            "Get role-specific questions that match your goals and experience.",
          content:
            "The AI Coach generates interview questions tailored to the role you're preparing for. It includes follow-up questions based on your answers, challenging prompts to test your problem-solving skills, and even tricky questions to assess your critical thinking. This helps ensure you're ready for anything an interviewer might throw your way.",
        },
        {
          img: require("@/assets/Real-Time_Evaluation.png"),
          title: "Real-Time Evaluation",
          subTitle:
            "Get instant AI-powered feedback on grammar, clarity, and example quality.",
          content:
            "After each response, receive constructive suggestions to refine your language, clarify your structure, and strengthen your examples. A model answer is generated based on your reply, giving you clear, immediate direction for improvement and helping you perform better in future interviews.",
        },
        {
          img: require("@/assets/Assessment_Report.png"),
          title: "Assessment Report",
          subTitle: "Receive a detailed report after each practice session.",
          content:
            "Your report highlights key performance areas such as STAR method usage, communication effectiveness, and language accuracy—helping you identify strengths and track areas for improvement. The Assessment Report also provides a clear summary of your performance, including strengths, weaknesses, an improvement plan, and personalized career suggestions.",
        },
        {
          img: require("@/assets/Tracking_Record.png"),
          title: "Tracking Record",
          subTitle: "All your sessions are saved for easy access.",
          content:
            "All your practice sessions—including audio recordings and transcripts—are saved to your account for easy access. This allows you to review your performance, listen to your responses, and identify patterns in your strengths and weaknesses. This tracking feature helps guide you on areas you need to focus on. You can use the feature to compare your performance from past practices to see how much you've improved.",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-carousel {
  height: 350px !important;
  @media (max-width: 991px) {
    .image-content {
      display: none;
    }
  }
}

.slide-container {
  display: flex;
  padding: 0 100px;
  align-items: center;
}

.text-content {
  flex: 1;
  padding-right: 50px;
}

.slide-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
}

.accordion-content {
  background: var(--bg-white);
  border-radius: 15px;
  padding: 30px;
  z-index: 1;
  overflow: hidden;
}

.content-inner {
  width: 100%;
}

.content-title {
  font-size: 30px;
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
  margin-bottom: 15px;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 25px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slide-container {
    flex-direction: column;
    padding: 0 30px;
  }

  .text-content {
    padding-right: 0;
    margin-bottom: 30px;
  }

  .image-content {
    width: 100%;
  }
}
</style>
