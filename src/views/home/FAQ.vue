<template>
  <div class="bg-dark text-white maincontainer">
    <div class="container py-5">
      <!-- 标题部分 -->
      <div class="text-center mb-5">
        <h1 class="display-5 mb-3">Got questions?</h1>
        <h2 class="display-5">Join the community.</h2>
        <p class="fs-6 opacity-75 mb-4">
          Our Discord community and staff are here to help<br />
          Your feedback will help Dora AI improve in future versions.
        </p>
        <a href="#" class="btn btn-dark border-white">Join Discord +</a>
      </div>

      <el-collapse v-for="(i, index) of faqList" :key="index" class="mt-3">
        <el-collapse-item :title="i.question" :name="index">
          <div>
            {{ i.answer }}
          </div>
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
          question: "How do I activate Dora AI?",
          answer:
            "Activate by following the official guide in our documentation center.",
        },
        {
          question: "How is Dora AI different from other AI tools?",
          answer:
            "Unique algorithms and user-centric design for better interaction.",
        },
        {
          question: "How much usage is included with my Dora AI plan?",
          answer:
            "Check your plan details in the user dashboard for usage limits.",
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
  background-color: #121212;
}
</style>
