<template>
  <div class="container">
    <div class="row g-4 align-items-center">
      <!-- 左侧内容区 -->
      <div class="col-lg-6">
        <div class="header-group">
          <span class="tag">Guest</span>
          <h1 class="display-4">Sitemap ✦</h1>
          <p class="text-muted">
            The best way to start off your new project. Use AI to map out all
            your key pages with just a few sentences about your company.
            Effortlessly create a complete sitemap in mere seconds, not hours.
          </p>
        </div>

        <div class="row g-4 mt-5">
          <div
            class="col-md-6"
            v-for="(item, index) in featureList"
            :key="index"
          >
            <div class="feature-card p-4">
              <img
                :src="item.icon"
                alt="icon"
                class="feature-icon mb-3"
                style="width: 40px; height: 40px"
              />
              <h3>{{ item.title }}</h3>
              <p class="text-secondary small">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧图片区 -->
      <div class="col-lg-6">
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
          icon: "https://via.placeholder.com/40x40",
          title: "Map out key content",
          desc: "Easily identify key pages and sections for any website in any industry. Ensure a well-structured foundation from the start",
        },
        {
          icon: "https://via.placeholder.com/40x40",
          title: "Scope projects better",
          desc: "Kick off projects with a clear sitemap to avoid scope creep. Define pages early and stay on track effortlessly",
        },
      ],
      img: require("@/assets/guide1.png"),
    };
  },
  computed: {
    userGuide: function () {
      return [
        {
          img: require("@/assets/guide1.png"),
          title: "Practice & Simulate Real Interviews with Instant Feedback",
          content:
            "Train with common, situational, and tough questions, or experience a full mock interview. Receive AI-powered feedback to refine your answers and improve your performance.",
        },
        {
          img: require("@/assets/guide2.png"),
          title: "Speak Your Answers for a More Realistic Experience",
          content:
            "Use voice input to practice answering naturally, just like in a real interview. Strengthen your confidence and delivery with every response.",
        },
        {
          img: require("@/assets/guide3.png"),
          title: "Track Your Progress with Saved History",
          content:
            "Automatically save your responses and feedback. Review past answers, identify areas for improvement, and see how much you’ve grown!",
        },
      ];
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f8f4f4;
  padding: 30px 50px;
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
