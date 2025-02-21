<template>
  <div>
    <div :class="!showPractice ? 'withebox' : ''"></div>
    <div class="practiceContainer" v-if="!showPractice">
      <h3 class="text-center mt-5 mb-3">What would you like to practice?</h3>
      <div class="practiceBtnContainer">
        <div class="practiceBtn">
          <el-button type="success" @click="startPractice('common')"
            >Common Questions</el-button
          >
        </div>
        <div class="practiceBtn">
          <el-button type="warning" @click="startPractice('star')"
            >Behavioural Questions</el-button
          >
        </div>
        <div class="practiceBtn">
          <el-button type="danger" @click="startPractice('tough')"
            >Tough Question</el-button
          >
        </div>
      </div>
    </div>

    <div class="textareaContainer row" v-if="showPractice">
      <h6 @click="$store.commit('switchShowPractice', false)" class="backBtn">
        <i class="el-icon-arrow-left"></i> Back
      </h6>
      <div class="banner">
        <el-image :src="practiceInfo.img"></el-image>
      </div>
      <h2 class="text-center mt-3 mb-3">{{ practiceInfo.title }}</h2>
      <div class="col-11 mx-auto">
        <div v-for="(i, index) of practiceInfo.des" :key="index">
          <p v-html="i" class="m-0 text-center"></p>
        </div>
      </div>

      <div class="mt-5">
        <div class="AIpop">
          <!-- <p>{{ chatInfo.response_text }}</p> -->
          <vue-typer :text="chatInfo.response_text" :repeat="0"></vue-typer>
        </div>
        <div class="clearfix"></div>
        <div class="clientPop">
          <p>
            Good day Jennifer! I'm pleased to meet with you and discuss the
            opportunity with your company.
          </p>
        </div>
      </div>
      <voice-recorder
        @record-complete="handleRecord"
        @send="handleSend"
        main-color="#409EFF"
      />
      <AudioRecorder :practiceMode="practiceMode" />
    </div>
  </div>
</template>

<script>
import AudioRecorder from "../components/AudioRecorder.vue";
import VoiceRecorder from "../components/VoiceRecorder.vue";
export default {
  components: { AudioRecorder, VoiceRecorder },
  data() {
    return {};
  },
  computed: {
    showPractice: function () {
      return this.$store.state.showPractice;
    },
    practiceMode: function () {
      return this.$store.state.practiceMode;
    },
    practiceModeInfo: function () {
      return this.$store.state.practiceModeInfo.hide_on_mobile;
    },
    practiceInfo: function () {
      return this.practiceMode == "common"
        ? {
            img: require("@/assets/common.png"),
            title: "Common Interview Questions",
            des: [
              "These are the questions you’re most likely to be asked in an interview—so be ready!",
              "Try answering out loud to build confidence and improve your delivery.",
              "Stuck on a question? Ask your AI coach for an example!",
            ],
          }
        : this.practiceMode == "star"
        ? {
            img: require("@/assets/star.png"),
            title: "Behavioural Questions (STAR Method)",
            des: [
              "The STAR method helps you answer interview questions with clear, structured responses.",
              "Describe the <b>Situation</b>, explain the <b>Task</b>, outline your <b>Actions</b>, and highlight the <b>Results</b>.",
              "Try using this approach to give compelling answers and showcase your impact!",
            ],
          }
        : {
            img: require("@/assets/tough.png"),
            title: "Tough Interview Questions",
            des: [
              "Tough questions are tricky, challenging, and designed to test your thinking under pressure.",
              "Practice by giving clear, structured answers—and refine them through conversation with your AI coach.",
              "Need a specific type of question? Just ask, and your AI coach will tailor the challenge for you!",
            ],
          };
    },
    chatInfo: function () {
      return this.$store.state.chatInfo;
    },
  },
  watch: {
    showPractice: function (N) {
      if (N == true) {
        const formData = new FormData();
        formData.append("mode", this.practiceMode);
        formData.append("new_conversation", true);
        this.$store.commit("switchLoadingStatus", true);
        this.$store
          .dispatch("getChatInfo", formData)
          .then(() => {
            this.$store.commit("switchLoadingStatus", false);
          })
          .catch(() => {
            this.$store.commit("switchLoadingStatus", false);
          });
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("switchShowPractice", false);
    next();
  },
  methods: {
    startPractice: function (mode) {
      this.$store.commit("setPracticeMode", mode);
      this.$store.commit("switchShowPractice", true);
    },
    handleRecord(blob) {
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play();
    },
    handleSend(blob) {
      console.log(blob);
      // 处理发送逻辑
    },
    // async startAudioPractice() {
    //   try {
    //     // 引入音频文件
    //     const audioUrl = require("@/assets/letStart.wav");

    //     // 使用 fetch 获取音频文件的 Blob 对象，并处理可能的错误
    //     const response = await fetch(audioUrl);
    //     if (!response.ok) {
    //       throw new Error(`请求音频文件失败: ${response.statusText}`);
    //     }
    //     const audioBlob = await response.blob();

    //     console.log(audioBlob);

    //     // 创建 FormData 实例
    //     const formData = new FormData();

    //     // 添加音频文件到 FormData
    //     formData.append("audio", audioBlob, "recording.wav");

    //     // 添加其他数据到 FormData
    //     formData.append("mode", this.practiceMode);
    //     formData.append("new_conversation", true);

    //     // 开启加载状态
    //     this.$store.commit("switchLoadingStatus", true);

    //     // 分发 Vuex action 并处理可能的错误
    //     await this.$store.dispatch("getChatInfo", formData);

    //     // 关闭加载状态
    //     this.$store.commit("switchLoadingStatus", false);
    //   } catch (error) {
    //     // 关闭加载状态
    //     this.$store.commit("switchLoadingStatus", false);
    //     console.error("音频练习出错:", error);
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.withebox {
  height: 130px;
  width: 100%;
}
.backBtn {
  padding-top: 10px;
  &:hover {
    cursor: pointer;
  }
}
.practiceContainer {
  border: 1px solid #000000;
  width: 550px;
  height: 400px;
  background-color: #ffffff;
  margin: 0 auto;
  .practiceBtnContainer {
    text-align: center !important;
    margin-top: 50px;
    .practiceBtn {
      margin-top: 30px;
      .el-button {
        width: 300px;
        height: 50px;
        color: #000000;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
.textareaContainer {
  // border: 1px solid #000000;
  width: 1000px;
  // background-color: #ffffff;
  margin: 0 auto;
  .banner {
    height: 150px;
    width: 100%;
    text-align: center;
    .el-image {
      height: 150px;
    }
  }
  h2 {
    font-weight: bold;
  }
  .AIpop {
    float: left;
    background-color: #fcf1d8;
    border-radius: 50px;
    padding: 10px;
    width: fit-content;
    max-width: 45%;
    margin-left: 20px;
    p {
      line-height: 1.5; /* 调整行高，让文字垂直方向更合理，可根据需要调整数值 */
      overflow-wrap: break-word; /* 允许在单词内换行，保证内容不溢出容器 */
      word-break: keep-all; /* 保持单词完整性，不拆分单词 */
      margin: 0;
    }
  }
  .clientPop {
    float: right;
    background-color: #c0f0f7;
    border-radius: 50px;
    padding: 10px;
    width: fit-content;
    max-width: 45%;
    margin-right: 20px;
    p {
      line-height: 1.5; /* 调整行高，让文字垂直方向更合理，可根据需要调整数值 */
      overflow-wrap: break-word; /* 允许在单词内换行，保证内容不溢出容器 */
      word-break: keep-all; /* 保持单词完整性，不拆分单词 */
      margin: 0;
    }
  }
  .clearfix {
    clear: both;
  }
  .btnGroup {
    clear: both;
    width: 100%;
    .el-button {
      width: 200px;
      font-size: 16px;
    }
  }
}
</style>
