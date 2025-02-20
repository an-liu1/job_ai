<template>
  <div>
    <div class="mainContainer row">
      <div class="col-8 mx-auto">
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
      <div class="guideVideo col-6 mx-auto">
        <el-image :src="bannerImg"></el-image>
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
  computed: {},
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
.mainContainer {
  padding: 100px 5% 0 5%;
}
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

.guideVideo {
  margin-top: 100px;
  // height: 350px;
}
</style>
