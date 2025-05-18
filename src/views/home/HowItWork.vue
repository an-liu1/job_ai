<template>
  <div class="guide">
    <div class="row g-4 align-items-center">
      <!-- 左侧内容区 -->
      <div class="col-lg-8">
        <div class="header-group">
          <!-- <span class="tag">Job ACE</span> -->
          <h1 class="display-4">Step-by-Step Guidance</h1>
          <p class="text-muted">
            Practice like it’s the real thing. Each module simulates realistic
            interview settings and helps you improve with every answer. The more
            you practice, the more confident and job-ready you become.
          </p>
        </div>

        <div class="row g-4 mt-3">
          <div
            class="col-md-6"
            v-for="(item, index) in featureList"
            :key="index"
          >
            <div class="feature-card p-4">
              <!-- <i :class="item.icon" class="feature-icon mb-2"></i> -->
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
          title: "Choose Practice Module",
          desc: "· Select a mode: <b>Feature Interview</b> or <b>Mock Interview</b> <br />· Pick a <b>Category</b> based on your goal: <br />· Click <b>Start Practice</b> to begin",
        },
        {
          icon: "el-icon-right",
          title: "Record Your Answer",
          desc: "· Click <b>Record</b> to answer <br />· Speak clearly into your microphone <br />· Click <b>Send</b> or <b>Retry</b> if needed",
        },
        {
          icon: "el-icon-right",
          title: "Get Instant Feedback",
          desc: "· Replay your answer anytime <br />· Hear AI voice feedback: score, tips & sample answer <br />· Tap <b>Evaluation Details</b> for full insights",
        },
        {
          icon: "el-icon-right",
          title: "Review Final Assessment",
          desc: "· Get your overall score, strengths & weaknesses <br />· See improvement tips & career suggestions <br />· Access anytime in <b>History</b>",
        },
      ],
      img: require("@/assets/feature.png"),
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
