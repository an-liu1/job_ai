<template>
  <div class="guide">
    <div class="row g-4 align-items-center">
      <!-- 左侧内容区 -->
      <div class="col-lg-8">
        <div class="header-group">
          <span class="tag">Hello</span>
          <h1 class="display-4">Step-by-Step Guidance</h1>
          <p class="text-muted">
            Each module is designed to simulate real-life interview scenarios
            and help you improve through practice. The more you speak, the more
            confident and polished you become!.
          </p>
        </div>

        <div class="row g-4 mt-3">
          <div
            class="col-md-6"
            v-for="(item, index) in featureList"
            :key="index"
          >
            <div class="feature-card p-4">
              <i :class="item.icon" class="feature-icon mb-2"></i>
              <h3>{{ item.title }}</h3>
              <p class="text-secondary small" v-html="item.desc"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧图片区 -->
      <div class="col-lg-4">
        <img :src="img" alt="Sitemap Preview" class="img-fluid" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      featureList: [
        {
          icon: "el-icon-right",
          title: "Choose a Practice Module",
          desc: "Pick from one of the modules: <br />· Common Questions <br />· Behavioral Questions <br />· Tough Questions <br />· Mock Interview",
        },
        {
          icon: "el-icon-right",
          title: "Get Ready to Speak",
          desc: "Each question will appear on screen. When you're ready to answer:<br />· Click 'Start' to begin recording your voice.<br />· Speak your answer clearly into microphone.<br />· Click 'Stop' when you've finished speaking.",
        },
        {
          icon: "el-icon-right",
          title: "Review & Retry if needed",
          desc: "Not happy with your answer? <br />· Click 'play' to review your answer.<br />· Click 'Retry' to record again.",
        },
        {
          icon: "el-icon-right",
          title: "Submit Your Response",
          desc: "Satisfied with your answer? <br />· Click 'Submit' to send your audio to our backend server for feedback or analysis.",
        },
      ],
      img: require("@/assets/step.png"),
    };
  },
};
</script>

<style scoped>
.guide {
  background-color: #ebefff;
  padding: 30px 8%;
}
.tag {
  background: #54d62c;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.9rem;
}

.feature-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0.8rem;
}
</style>
