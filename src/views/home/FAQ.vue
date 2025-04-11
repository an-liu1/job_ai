<template>
  <div class="maincontainer">
    <div class="container py-5">
      <!-- 标题部分 -->
      <div class="text-center mb-5">
        <h1 class="display-5 mb-3">Got questions?</h1>
        <p class="fs-6 opacity-75 mb-4">
          Our team and fellow users are here to help you succeed in every
          interview. Your feedback helps us make the AI even smarter!
        </p>
      </div>

      <el-collapse v-for="(i, index) of faqList" :key="index" class="mt-3">
        <el-collapse-item :title="i.question" :name="index">
          <div class="text-left">{{ i.answer }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faqList: [
        {
          question: "How do I start practicing interviews?",
          answer:
            "Simply create a free account, choose a practice module, allow microphone access, and click the 'Start' button to begin speaking your answers.",
        },
        {
          question: "What equipment do I need to use this platform?",
          answer:
            "You’ll need a device with a working microphone and speakers. A quiet environment also helps for better voice recognition and focus.",
        },
        {
          question: "Can I practice unlimited questions?",
          answer:
            "Yes, unlimited access is available on Pro and Premium plans. Free users have limited daily practice sessions.",
        },
        {
          question: "How does the AI evaluate my answers?",
          answer:
            "Our AI listens to your spoken responses and gives you feedback on clarity, structure, and delivery based on industry best practices.",
        },
        {
          question: "What’s the difference between Pro and Premium plans?",
          answer:
            "Pro includes advanced modules and AI feedback. Premium adds personalized coaching tips, industry-specific questions, and access to exclusive events.",
        },
        {
          question: "Is there a trial period?",
          answer:
            "Yes! Pro includes a 3-day trial and Premium includes a 6-day trial so you can try full features risk-free.",
        },
        {
          question: "Where can I get help or share feedback?",
          answer:
            "Join our community via Discord or contact our support team. We’re always open to suggestions to improve your experience.",
        },
        {
          question: "Are the interview questions updated regularly?",
          answer:
            "Yes, we continuously update question banks based on real recruiter feedback and current industry trends.",
        },
        {
          question: "Can I download or save my audio responses?",
          answer:
            "Yes, on Pro and Premium plans, you can download or revisit your past responses and track progress over time.",
        },
        {
          question: "Is this suitable for non-native English speakers?",
          answer:
            "Absolutely. Our AI is trained to recognize various accents and can help non-native speakers improve fluency and pronunciation.",
        },
        {
          question: "Does the mock interview simulate a real recruiter?",
          answer:
            "Yes, the mock interview module mimics a real interview environment, including follow-up questions and time limits.",
        },
        {
          question: "Can I get feedback from real coaches?",
          answer:
            "Premium users may get access to live events and coach-guided sessions. We're also planning to integrate more human-in-the-loop feedback soon.",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.maincontainer {
  text-align: center;
  color: #ffffff;
  background-color: #ebefff;

  h1 {
    color: #000;
    font-size: 56px;
  }

  .el-collapse {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-bottom: 1rem;
    overflow: hidden;
  }

  ::v-deep .el-collapse-item__header {
    background-color: #f9fafb;
    padding: 1rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
  }

  ::v-deep .el-collapse-item__header:hover {
    background-color: #cbd5e0;
  }

  ::v-deep .el-collapse-item__content {
    text-align: left;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e2e8f0;
    background-color: #fff;
    font-size: 14px;
  }

  /* 动画效果 */
  ::v-deep .el-collapse-item__wrap {
    transition: max-height 0.3s ease-in-out;
    overflow: hidden;
  }
}
</style>
