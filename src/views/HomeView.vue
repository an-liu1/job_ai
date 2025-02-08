<template>
  <div>
    <div class="mainContainer row">
      <div class="col-6">
        <div class="text-left title">
          <vue-typer text="Hello, Job Interview Training!"></vue-typer>
        </div>
        <div class="text-left subTitle">
          <h4>
            Cognitive enhancement app for job interviews. Improve skills via
            exercises and mock practice.
          </h4>
        </div>
        <div class="text-left startBtn">
          <el-button
            type="primary"
            round
            @click="startPractice"
            icon="el-icon-edit-outline"
          >
            Get Started</el-button
          >
        </div>
      </div>
      <div class="guideVideo col-6"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    startPractice: function () {
      this.$router.push("/exercise");
    },
  },
};
</script>

<style lang="scss" scoped>
.mainContainer {
  padding: 200px 5% 0 5%;
}
.title {
  font-size: 24px;
  margin: 50px 0;
}
.subTitle {
  margin-top: 30px;
}
.startBtn {
  margin-top: 50px;
}
.guideVideo {
  height: 350px;
  border-radius: 50px;
  background-color: #413535;
}
</style>
