<template>
  <div>
    <div :class="!showPractice ? 'withebox' : ''"></div>
    <div class="practiceContainer" v-if="!showPractice">
      <div class="practiceBtnContainer">
        <div class="practiceBtn">
          <el-button type="success" @click="startPractice('mock')"
            >Mock Interview</el-button
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

      <div class="chat-container mt-5">
        <!-- 新增对话容器 -->
        <div v-for="(msg, index) in chatHistory" :key="index">
          <!-- 用户消息 -->
          <div v-if="msg.type === 'user'" class="clientPop">
            <h6><b>You:</b></h6>
            <p class="d-inline-block">{{ msg.text }}</p>
            <!-- <MiniAudioPlayer
              v-if="msg.audio"
              :audioSrc="msg.audio"
              class="d-inline-block"
            /> -->
          </div>

          <!-- AI消息 -->
          <div v-else class="AIpop">
            <h6><b>Coach:</b></h6>
            <vue-typer :text="msg.text" :repeat="0"></vue-typer>
            <div class="d-inline-block whiteSpace"></div>
            <MiniAudioPlayer
              v-if="msg.audio"
              :audio-src="msg.audio"
              class="d-inline-block"
            />

            <el-collapse>
              <el-collapse-item
                title="View evaluation"
                name="evaluation"
                v-if="msg.evaluation"
              >
                <div class="row evaluation">
                  <div class="col-4">
                    <div class="evaluationLeft">
                      <div>
                        <h5>Category:</h5>
                        <p>{{ msg.evaluation.question_category }}</p>
                      </div>
                      <div>
                        <h5>Level:</h5>
                        <p>{{ msg.evaluation.question_difficulty }}</p>
                      </div>
                      <div>
                        <h5>Score:</h5>
                        <p>{{ msg.evaluation.score + "/10" }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-8">
                    <div class="evaluationRight">
                      <div>
                        <h5 style="color: #004aad">Assessment:</h5>
                        <p>{{ msg.evaluation.assessment }}</p>
                      </div>
                      <div>
                        <h5 style="color: #f9943b">Advice:</h5>
                        <p>{{ msg.evaluation.advice }}</p>
                      </div>
                      <div>
                        <h5 style="color: #265d48">Improved example:</h5>
                        <p>{{ msg.evaluation.revised_example }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <voice-recorder
        class="mt-5 mb-5"
        @record-complete="handleRecord"
        @send="handleSend"
        main-color="#409EFF"
      />
    </div>
  </div>
</template>

<script>
import VoiceRecorder from "../components/VoiceRecorder.vue";
import MiniAudioPlayer from "../components/MiniAudioPlayer.vue";
export default {
  components: { VoiceRecorder, MiniAudioPlayer },
  data() {
    return {
      chatHistory: [], // 新增历史记录数组
    };
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
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
      return {
        img: require("@/assets/common.png"),
        title: "Mock Interview",
        des: [
          "Conducting a mock interview is a way to prepare for a job interview. A mock interview experience allows you to develop your nonverbal body language, craft responses to behavioural interview questions, and become comfortable in an interview environment. A mock interview can simulate any real-world interview experience, be it over the phone, in person, or leverage this powerfull mock interview training bot.",
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
        this.$store.dispatch("getChatInfo", formData).then(() => {
          this.chatHistory = []; // 清空历史记录
          if (this.chatInfo.response_text) {
            this.chatHistory.push({
              type: "ai",
              text: this.chatInfo.response_text,
              audio: this.chatInfo.tts_audio_url,
              evaluation: this.chatInfo.evaluation,
            });
          }
          this.$store.commit("switchLoadingStatus", false);
          this.scrollToBottom();
        });
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.showPractice && this.loginStatus) {
      this.$confirm(
        "Leaving will interrupt this interview. Do you want to continue?",
        "warning",
        {
          cancelButtonText: "Back",
          confirmButtonText: "Ok",
          type: "warning",
        }
      )
        .then(() => {
          this.$store.commit("switchShowPractice", false);
          this.chatHistory = [];
          next();
        })
        .catch(() => {
          console.log(123);
        });
    } else {
      this.$store.commit("switchShowPractice", false);
      next();
    }
  },
  methods: {
    startPractice: function (mode) {
      if (this.loginStatus) {
        this.$store.commit("setPracticeMode", mode);
        this.$store.commit("switchShowPractice", true);
      } else {
        this.$router.push("/account");
      }
    },
    handleRecord(blob) {
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play();
    },
    handleSend(blob) {
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");
      formData.append("mode", this.practiceMode);
      formData.append("new_conversation", false);
      formData.append("conversation_id", this.chatInfo.conversation_id);

      this.$store.commit("switchLoadingStatus", true);
      this.$store.dispatch("getChatInfo", formData).then(() => {
        // 添加用户消息
        if (this.chatInfo.user_text) {
          this.chatHistory.push({
            type: "user",
            text: this.chatInfo.user_text,
            audio: this.chatInfo.user_audio_url,
          });
        }

        // 添加AI回复
        if (this.chatInfo.response_text) {
          this.chatHistory.push({
            type: "ai",
            text: this.chatInfo.response_text,
            audio: this.chatInfo.tts_audio_url,
            evaluation: this.chatInfo.evaluation,
          });
        }
        this.$store.commit("switchLoadingStatus", false);
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".chat-container");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.withebox {
  height: 130px;
  width: 100%;
}
.whiteSpace {
  width: 10px;
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
  height: 150px;
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
  .chat-container {
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .AIpop {
    background-color: #fcf1d8;
    border-radius: 10px;
    padding: 10px;
    p {
      line-height: 1.5; /* 调整行高，让文字垂直方向更合理，可根据需要调整数值 */
      overflow-wrap: break-word; /* 允许在单词内换行，保证内容不溢出容器 */
      word-break: keep-all; /* 保持单词完整性，不拆分单词 */
      margin: 0;
    }
  }
  .clientPop {
    background-color: #c0f0f7;
    border-radius: 10px;
    padding: 10px;
    p {
      line-height: 1.5; /* 调整行高，让文字垂直方向更合理，可根据需要调整数值 */
      overflow-wrap: break-word; /* 允许在单词内换行，保证内容不溢出容器 */
      word-break: keep-all; /* 保持单词完整性，不拆分单词 */
      margin: 0;
    }
  }
  ::v-deep .el-collapse-item__header {
    padding-left: 10px !important;
    font-weight: bold !important;
  }
  .evaluation {
    border-radius: 10px;
    padding: 10px;
    background-color: #ffffff;
    margin: 0;
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
