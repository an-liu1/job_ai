<template>
  <div>
    <div class="mainContainer row">
      <div class="bannerContainer col-11 col-lg-8 mx-auto">
        <div class="text-center title">
          <vue-typer
            text="Your AI Interview Coach – Practice. Improve. Succeed."
          ></vue-typer>
        </div>
        <div class="text-center subTitle">
          <h5>
            Sharpen your skills with three interview modes and full mock
            interviews. Get instant feedback, boost your confidence, and ace
            your next interview!
          </h5>
        </div>
        <div class="text-center">
          <el-button
            type="primary"
            round
            @click="startPractice"
            class="startBtn"
            style="margin-right: 50px"
          >
            Practice now <i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
          <el-button type="primary" round @click="startMock" class="startBtn">
            Mock interview <i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="guideVideo">
        <div class="col-6 mx-auto">
          <el-image
            :src="bannerImg"
            fit="cover"
            style="width: 960px; height: 430px"
          ></el-image>
        </div>
      </div>
      <div class="guideSection">
        <div class="col-9 mx-auto row">
          <div
            v-for="(i, index) in userGuide"
            :key="index"
            class="col-12 col-lg-4 cardsection"
          >
            <el-image :src="i.img"></el-image>
            <h4>{{ i.title }}</h4>
            <p>{{ i.content }}</p>
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
      bannerImg: require("@/assets/banner.png"),
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
  methods: {
    startPractice: function () {
      this.$router.push("/exercise");
    },
    startMock: function () {
      this.$router.push("/mockInterview");
    },
  },
};
</script>

<style lang="scss" scoped>
.bannerContainer {
  padding: 150px 0;
  .title {
    font-size: 32px;
    margin: 20px 0;
    font-weight: bold;
  }
  .subTitle {
    margin-top: 60px;
  }
  .startBtn {
    margin-top: 80px;
    font-size: 18px;
    font-weight: bold;
  }
}

.guideVideo {
  background-color: #ffffff;
  padding: 150px 0;
}
.guideSection {
  background-color: #fcf1d8;
  padding: 150px 0;
  .cardsection {
    padding: 20px 50px;
    h4 {
      margin-top: 20px;
      font-weight: bold;
    }
    p {
      font-size: 18px;
    }
  }
}
</style>
