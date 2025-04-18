<template>
  <div class="mainContainer">
    <div class="interview-container">
      <h1 class="text-center mb-5">{{ practiceMode }}</h1>
      <div class="header">
        <input
          type="text"
          v-model="position"
          placeholder="Enter position"
          class="position-input"
        />
        <button class="start-btn" @click="startInterview">
          Start Interview
        </button>
      </div>

      <div class="question-section">
        <div v-for="(msg, index) in chatHistory" :key="index" class="message">
          <div v-if="msg.type == 'user'" class="user-message">
            <div class="message-header" style="justify-content: flex-end">
              <h4>You</h4>
              <div class="avatar user-avatar" style="margin-left: 8px"></div>
            </div>
            <div class="message-content">
              <p>{{ msg.text }}</p>
            </div>
          </div>

          <div v-else class="ai-message">
            <div class="message-header">
              <div class="avatar ai-avatar"></div>
              <h4>AI Interview Coach</h4>
            </div>

            <div class="message-content">
              <p>{{ msg.text }}</p>
              <div v-if="msg.evaluation && msg.evaluation.score" class="score">
                {{ msg.evaluation.score + "/10" }}
              </div>
              <MiniAudioPlayer
                v-if="msg.audio"
                :audio-src="msg.audio"
                class="d-inline-block"
              />
              <el-collapse
                v-if="
                  msg.evaluation &&
                  msg.evaluation.score !== 0 &&
                  msg.evaluation.score !== null
                "
              >
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
              <!-- <div class="divider"></div>
              <div class="next-question">
                <p>Next question: {{ msg.nextQuestion }}</p>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <voice-recorder
        class="mt-5 mb-5"
        @record-complete="handleRecord"
        @send="handleSend"
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
      position: "marketing",
    };
  },
  computed: {
    mode: function () {
      return this.$route.params.mode;
    },
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
    practiceMode: function () {
      return this.$store.state.practiceMode;
    },
    startPracticeFlag: function () {
      return this.$store.state.startPracticeFlag;
    },
    chatInfo: function () {
      return this.$store.state.chatInfo;
    },
  },
  mounted() {
    this.$store.commit("setStartPractice", false);
  },
  beforeRouteLeave(to, from, next) {
    if (this.startPracticeFlag) {
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
          this.chatHistory = [];
          next();
        })
        .catch(() => {
          console.log(123);
        });
    } else {
      next();
    }
  },
  watch: {
    mode: function (newValue) {
      this.$store.commit("setStartPractice", false);
      this.$store.commit("setPracticeMode", newValue);
    },
  },
  methods: {
    startInterview() {
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
        this.$store.commit("setStartPractice", true);
        this.$store.commit("switchLoadingStatus", false);
        this.scrollToBottom();
      });
    },
    handleRecord(blob) {
      console.log(blob);
      // const audioURL = URL.createObjectURL(blob);
      // const audio = new Audio(audioURL);
      // audio.play();
    },
    handleSend(blob) {
      this.$store.commit("setPracticeRequest", true);
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");
      formData.append("mode", this.practiceMode);
      formData.append("new_conversation", false);
      formData.append("conversation_id", this.chatInfo.conversation_id);

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
        this.$store.commit("setPracticeRequest", false);
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
$blue: #3498db;
$red: #f44336;
$gray: #bdc3c7;

.mainContainer {
  min-height: calc(100vh - 123px);
  padding: 150px 20px 20px 20px;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );
}

.interview-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #f0f4f8;
  .header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .position-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .start-btn {
      background: $blue;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .question-section {
    flex: 1;
    margin-bottom: 20px;
    overflow-y: auto;

    .message {
      margin-bottom: 15px;
      border-radius: 10px;
      padding: 15px;
      position: relative;

      .ai-message {
        background: #e3f2fd; // 浅蓝背景（与图中一致）
        border: 1px solid #d8e9f7; // 新增浅蓝边框，增强轮廓感
        padding: 20px;
      }
      .user-message {
        background: #e1e2e2;
        border: 1px solid #d8e9f7;
        padding: 20px;
      }

      .message-header {
        display: flex;
        align-items: center;
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 12px;
          &.ai-avatar {
            background: $blue;
          }
          &.user-avatar {
            background: $gray;
          }
        }

        h4 {
          color: #333;
          font-weight: 600;
          font-size: 18px;
          line-height: 1; /* 重置行高避免冲突 */
          display: inline-block;
          vertical-align: middle; /* 确保垂直居中 */
        }
      }

      .message-content {
        // display: inline-block;
        // vertical-align: top;

        p {
          color: #666;
          font-size: 16px;
          line-height: 1.4;
          margin: 12px 0;
          overflow-wrap: break-word; /* 允许在单词内换行，保证内容不溢出容器 */
          word-break: keep-all; /* 保持单词完整性，不拆分单词 */
        }

        .score {
          position: absolute;
          top: 12px;
          right: 12px;
          background: $blue;
          color: white;
          padding: 4px 8px;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 500;
        }

        .detailed-btn {
          background: none;
          border: none;
          color: $blue;
          cursor: pointer;
          margin-top: 10px;
          font-size: 16px;
          text-align: center;
        }

        .next-question {
          margin-top: 20px;
          p {
            color: #333;
            font-size: 18px;
            font-weight: 500;
            margin: 0;
          }
        }
      }
    }
  }

  ::v-deep .el-collapse-item__header {
    padding-left: 10px !important;
    font-weight: bold !important;
    text-align: center !important;
  }
  .evaluation {
    border-radius: 10px;
    padding: 10px;
    background-color: #ffffff;
    margin: 0;
  }

  @media (max-width: 600px) {
    .header {
      flex-direction: column;
    }

    .position-input {
      margin-bottom: 10px;
    }
  }
}
</style>
