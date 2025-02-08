<template>
  <div>
    <div class="text-center title">
      <vue-typer
        text="Hello, Job Interview Training!"
        :pre-erase-delay="3000"
        :repeat="0"
      ></vue-typer>
    </div>
    <div class="text-center subTitle">
      <vue-typer
        text="Cognitive enhancement app for job interviews. Improve skills via exercises and mock practice."
        caret-animation="expand"
        erase-style="select-back"
        :erase-delay="50"
      ></vue-typer>
    </div>
    <div class="practiceBtn">
      <el-button type="primary" round @click="startPractice"
        >Common Questions</el-button
      >
      <el-button type="primary" round @click="startPractice"
        >STAR Method</el-button
      >
      <el-button type="primary" round @click="startPractice"
        >Tough Question</el-button
      >
    </div>
    <div class="testmode"></div>
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
      console.log(123);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 48px;
  margin-top: 100px;
}
.subTitle {
  font-size: 24px;
  margin-top: 30px;
}
.practiceBtn {
  text-align: center !important;
  margin-top: 50px;
}
.testmode {
  width: 50%;
  height: 300px;
  margin: 30px auto;
  border-radius: 50px;
  background-color: #413535;
}
</style>
