<template>
  <div class="interview-container">
    <!-- 面试准备区域 -->
    <div class="interview-header">
      <div class="header-content">
        <h1 class="interview-title">
          {{ practiceModeText }} Interview Practice
        </h1>
        <p class="interview-subtitle">
          Practice makes perfect! Get ready for your next job interview
        </p>

        <div class="interviewMode-selector">
          <el-select
            v-model="interviewMode"
            filterable
            allow-create
            placeholder="Select a feature interview mode"
            class="interviewMode-input"
          >
            <el-option
              v-for="item in interviewModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="interviewSubMode"
            filterable
            allow-create
            placeholder="Select a catergroy mode"
            no-data-text="please select a feature interview mode"
            class="interviewMode-input"
            v-if="interviewMode !== 'mock'"
          >
            <el-option
              v-for="item in interviewSubModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- <el-select v-model="questionNum" class="questionNum-select">
            <el-option
              v-for="level in questionNumList"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select> -->

          <el-button
            type="primary"
            class="start-btn"
            :loading="loading"
            @click="startInterview"
          >
            <i class="el-icon-video-play"></i> Start Practice
          </el-button>
        </div>
      </div>
    </div>

    <!-- 面试内容区域 -->
    <div class="interview-content" v-if="chatHistory.length > 0">
      <!-- 面试计时和统计 -->
      <div class="interview-meta">
        <div class="meta-item">
          <i class="el-icon-time"></i>
          <span>{{ formattedTime }}</span>
        </div>
        <div class="meta-item">
          <i class="el-icon-chat-dot-round"></i>
          <span
            >{{
              chatHistory.filter((m) => m.type === "user").length
            }}
            responses</span
          >
        </div>
        <div class="meta-item">
          <i class="el-icon-star-on"></i>
          <span>{{ averageScore.toFixed(1) }}/10 average</span>
        </div>
      </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="chatContainer">
        <div
          v-for="(msg, index) in chatHistory"
          :key="index"
          class="message"
          :class="[msg.type, { evaluated: msg.evaluation?.score }]"
        >
          <!-- 用户消息 -->
          <div
            v-if="msg.type === 'user'"
            class="message-content user-message"
            style="border-left: 4px solid #409eff"
          >
            <div class="message-header">
              <div class="avatar user-avatar">
                {{ userInitial }}
              </div>
              <div class="message-info">
                <span class="sender-name">You</span>
                <span class="message-time">{{
                  formatTime(msg.timestamp)
                }}</span>
              </div>
            </div>
            <div class="message-text">
              <p>{{ msg.text }}</p>
              <MiniAudioPlayer
                v-if="msg.audio"
                :audio-src="msg.audio"
                :show-progress="true"
                color="#409EFF"
              />
            </div>
          </div>

          <!-- AI 消息 -->
          <div
            v-else
            class="message-content ai-message"
            style="border-left: 4px solid #67c23a"
          >
            <div class="message-header">
              <div class="avatar ai-avatar">
                <i class="el-icon-robot"></i>
              </div>
              <div class="message-info">
                <span class="sender-name">AI Interview Coach</span>
                <span class="message-time">{{
                  formatTime(msg.timestamp)
                }}</span>
              </div>
            </div>
            <div class="message-text">
              <p>{{ msg.text }}</p>
              <MiniAudioPlayer
                v-if="msg.audio"
                :audio-src="msg.audio"
                :auto-play="true"
                :show-progress="true"
                color="#67c23a"
              />

              <!-- 评估部分 -->
              <div v-if="msg.evaluation?.score" class="evaluation-badge">
                <el-tag :type="getScoreTagType(msg.evaluation.score)">
                  {{ msg.evaluation.score }} / 10
                </el-tag>
              </div>

              <el-collapse
                v-if="msg.evaluation"
                class="evaluation-collapse"
                :value="
                  expandedEvaluations.includes(index) ? 'evaluation' : null
                "
                @change="handleCollapseChange(index)"
              >
                <el-collapse-item name="evaluation">
                  <template #title>
                    <div class="evaluation-title">
                      <i class="el-icon-document"></i>
                      <span>Detailed Evaluation</span>
                    </div>
                  </template>

                  <div class="evaluation-details">
                    <div class="evaluation-grid">
                      <div class="evaluation-item">
                        <h5>Question Category</h5>
                        <p>{{ msg.evaluation.question_category || "N/A" }}</p>
                      </div>

                      <div class="evaluation-item">
                        <h5>Difficulty Level</h5>
                        <p>{{ msg.evaluation.question_difficulty || "N/A" }}</p>
                      </div>

                      <div class="evaluation-item full-width">
                        <h5>
                          <i class="el-icon-warning-outline"></i> Assessment
                        </h5>
                        <p>
                          {{
                            msg.evaluation.assessment ||
                            "No assessment provided"
                          }}
                        </p>
                      </div>

                      <div class="evaluation-item full-width">
                        <h5><i class="el-icon-light-rain"></i> Advice</h5>
                        <p>
                          {{ msg.evaluation.advice || "No advice provided" }}
                        </p>
                      </div>

                      <div class="evaluation-item full-width">
                        <h5>
                          <i class="el-icon-magic-stick"></i> Improved Example
                        </h5>
                        <p>
                          {{
                            msg.evaluation.revised_example ||
                            "No example provided"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>

        <!-- 加载指示器 -->
        <div v-if="loading" class="loading-indicator">
          <i class="el-icon-loading"></i>
          <span>AI is thinking...</span>
        </div>
      </div>

      <!-- 录音控制区域 -->
      <div class="recorder-section">
        <div class="recorder-container">
          <voice-recorder
            ref="voiceRecorderRef"
            @record-start="handleRecordStart"
            @record-complete="handleRecordComplete"
            @send="handleSend"
            :disabled="!interviewStarted || loading"
            active-color="#F56C6C"
          />

          <!-- <div class="recorder-tips">
            <p v-if="!isRecording">
              <i class="el-icon-microphone"></i>
              Click and prepare to record your answer
            </p>
            <p v-else class="recording">
              <i class="el-icon-video-pause"></i>
              Recording... {{ recordingDuration }}s
            </p>
          </div> -->
          <el-button
            v-if="interviewStarted"
            class="end-interview-btn"
            type="danger"
            plain
            @click="showEndInterviewDialog"
          >
            End Interview
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-content-wrapper">
        <div class="empty-image-container">
          <img
            src="@/assets/img/home-font.png"
            alt="Start Interview"
            class="empty-image"
            ref="tiltElement"
          />
        </div>

        <div class="empty-content">
          <h3>Ready to Practice Your Interview Skills?</h3>
          <p class="empty-subtitle">
            Select an interview mode and catergroy to begin your mock interview
            session
          </p>
          <div class="empty-cta">
            <i class="fa-regular fa-thumbs-up"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 结束面试对话框 -->
    <el-dialog
      title="End Interview Session"
      :visible.sync="endInterviewDialogVisible"
      width="30%"
      center
    >
      <p>Are you sure you want to end this interview practice session?</p>
      <p>Your progress and evaluations will be saved to your history.</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endInterviewDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="endInterview">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VoiceRecorder from "../components/VoiceRecorder.vue";
import MiniAudioPlayer from "../components/MiniAudioPlayer.vue";
import { format } from "date-fns";
import VanillaTilt from "vanilla-tilt";

export default {
  components: { VoiceRecorder, MiniAudioPlayer },
  data() {
    return {
      interviewMode: "",
      interviewSubMode: "",
      questionNum: 5,
      loading: false,
      isRecording: false,
      recordingDuration: 0,
      recordingInterval: null,
      interviewStarted: false,
      startTime: null,
      currentTime: 0,
      timerInterval: null,
      expandedEvaluations: [],
      endInterviewDialogVisible: false,
      questionNumList: [
        { value: 5, label: "5 questions" },
        { value: 8, label: "8 questions" },
        { value: 10, label: "10 questions" },
      ],
      chatHistory: [],
      // chatHistory: [
      //   {
      //     type: "user",
      //     user_text: "let's start",
      //     text: "Great! Let's dive into the interview. \n\n**Question 1:** Tell me about yourself.",
      //     audio: "/media/tts/dbdc22b7-d24d-4978-a1e2-d03b560755ea.wav",
      //     conversation_id: 401,
      //     mode: "common",
      //     evaluation: null,
      //   },
      //   {
      //     type: "ai",
      //     user_text:
      //       "Hello, I'm Yia Sen, and I would like to find a job at Web2MI5.\n",
      //     text: "Thank you for your response, Yia Sen. I appreciate the introduction, but it's beneficial to provide more detail about your background, experience, and skills that relate to the job you're applying for.\n\n**Revised Response:** \"Hello, my name is Yia Sen. I have a background in [your field/industry], with experience in [relevant skills or experiences]. I am interested in finding a job at Web2MI5 because I believe my expertise aligns well with the company's goals.\"\n\n**Score:** 3/10 - The response is very brief and lacks depth.\n\n**Question 2:** What is your greatest accomplishment?",
      //     audio: "/media/tts/689f950a-c32c-4259-9fad-b2b6d8a7ac38.wav",
      //     conversation_id: 401,
      //     mode: "common",
      //     evaluation: {
      //       question_category: "Behavioral Questions (STAR method)",
      //       question_difficulty: "intermediate",
      //       revised_example:
      //         "One of my greatest accomplishments was when I led a project that resulted in a 20% increase in efficiency by implementing a new workflow system.",
      //       assessment:
      //         "The initial response lacks specific details about the accomplishment. It should follow the STAR method to provide context, actions taken, and results achieved.",
      //       score: 4,
      //       advice:
      //         "Use the STAR method to structure your answer: describe the Situation, Task, Action, and Result clearly.",
      //       is_relevant: true,
      //     },
      //     user_audio_url:
      //       "/media/user_audio/72e5fd9d-2450-4687-abf1-3e5d7dad2f0a.wav",
      //   },
      // ],
    };
  },
  computed: {
    practiceModeText() {
      switch (this.$route.params.mode) {
        case "feature":
          return "Feature";
        case "mock":
          return "Mock";
        default:
          return null;
      }
    },
    interviewModeOptions() {
      return this.$route.params.mode == "mock"
        ? [{ value: "mock", label: "Mock Intervie" }]
        : [
            { value: "common", label: "Common Questions" },
            { value: "star", label: "Master Behavioral Questions" },
            { value: "tough", label: "Tough Questions" },
          ];
    },
    interviewSubModeOptions() {
      return this.interviewMode == "common"
        ? [
            { value: "mock", label: "Background and Experience" },
            { value: "mock", label: "Skills and Qualifications" },
            { value: "mock", label: "Knowledge of the Company and Role" },
            { value: "mock", label: "Motivation and Goals" },
            { value: "mock", label: "Salary and Logistics" },
            { value: "mock", label: "Questions for the Interviewer" },
          ]
        : this.interviewMode == "star"
        ? [
            { value: "freestyle", label: "Teamwork and Collaboration" },
            { value: "common", label: "Leadership and Management" },
            { value: "star", label: "Behavioral Questions (STAR method)" },
          ]
        : this.interviewMode == "tough"
        ? [
            {
              value: "freestyle",
              label: "Problem-Solving and Critical Thinking",
            },
            { value: "common", label: "Situational or Scenario-Based" },
            { value: "star", label: "Cultural Fit and Personality" },
          ]
        : [];
    },
    userInitial() {
      const username = this.$store.state.userProfile?.username || "U";
      return username.charAt(0).toUpperCase();
    },
    averageScore() {
      const evaluations = this.chatHistory
        .filter((msg) => msg.evaluation?.score)
        .map((msg) => msg.evaluation.score);

      if (evaluations.length === 0) return 0;
      return evaluations.reduce((a, b) => a + b, 0) / evaluations.length;
    },
    formattedTime() {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = this.currentTime % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.interviewStarted) {
      this.showEndInterviewDialog();
    } else {
      next();
    }
  },
  mounted() {
    if (this.$refs.tiltElement) {
      VanillaTilt.init(this.$refs.tiltElement, {
        max: 25, // 最大倾斜角度
        speed: 400, // 倾斜动画的速度
        glare: false, // 是否启用眩光效果
        "max-glare": 0.5, // 最大眩光强度
      });
    }
    if (this.$route.params.mode == "mock") {
      this.interviewMode = "mock";
    } else {
      this.interviewMode = "";
    }
  },
  watch: {
    "$route.params.mode": {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (this.interviewStarted) {
            this.showEndInterviewDialog();
          }
          if (this.$route.params.mode == "mock") {
            this.interviewMode = "mock";
          } else {
            this.interviewMode = "";
          }
        }
      },
      immediate: true, // 组件创建时立即执行一次 handler
    },
  },
  methods: {
    startInterview() {
      if (!this.interviewMode) {
        this.$message.warning("Please select a interview mode!");
        return;
      }

      this.loading = true;
      const formData = new FormData();
      formData.append("mode", this.interviewMode);
      formData.append("questionNum", this.questionNum);
      formData.append("new_conversation", true);

      this.$store
        .dispatch("getChatInfo", formData)
        .then(() => {
          this.chatHistory = [];
          this.addAIMessage(
            this.$store.state.chatInfo.response_text,
            this.$store.state.chatInfo.tts_audio_url,
            this.$store.state.chatInfo.evaluation
          );
          this.startInterviewTimer();
          this.interviewStarted = true;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    addUserMessage(text, audio) {
      this.chatHistory.push({
        type: "user",
        text,
        audio,
        timestamp: new Date(),
      });
      this.scrollToBottom();
    },
    addAIMessage(text, audio, evaluation) {
      this.chatHistory.push({
        type: "ai",
        text,
        audio,
        evaluation,
        timestamp: new Date(),
      });
      this.scrollToBottom();
    },
    handleRecordStart() {
      this.isRecording = true;
      this.recordingDuration = 0;
      this.recordingInterval = setInterval(() => {
        this.recordingDuration++;
      }, 1000);
    },
    handleRecordComplete() {
      this.isRecording = false;
      clearInterval(this.recordingInterval);
    },
    handleSend(blob) {
      if (!blob) {
        this.$message.warning("No recording to send");
        return;
      }

      this.loading = true;
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");
      formData.append("mode", this.interviewMode);
      formData.append("new_conversation", false);
      formData.append(
        "conversation_id",
        this.$store.state.chatInfo.conversation_id
      );

      this.$store
        .dispatch("getChatInfo", formData)
        .then(() => {
          if (this.$store.state.chatInfo.user_text) {
            this.addUserMessage(
              this.$store.state.chatInfo.user_text,
              this.$store.state.chatInfo.user_audio_url
            );
          }

          if (this.$store.state.chatInfo.response_text) {
            this.addAIMessage(
              this.$store.state.chatInfo.response_text,
              this.$store.state.chatInfo.tts_audio_url,
              this.$store.state.chatInfo.evaluation
            );
          }
          this.loading = false; // 确保加载状态结束
          this.interviewStarted = true; // 确保面试状态保持
          console.log(this.$refs.voiceRecorderRef);
          this.$refs.voiceRecorderRef.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    startInterviewTimer() {
      this.startTime = new Date();
      this.currentTime = 0;
      this.timerInterval = setInterval(() => {
        this.currentTime = Math.floor((new Date() - this.startTime) / 1000);
      }, 1000);
    },
    clearTimers() {
      if (this.recordingInterval) clearInterval(this.recordingInterval);
      if (this.timerInterval) clearInterval(this.timerInterval);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatTime(timestamp) {
      if (!timestamp) return "";
      return format(new Date(timestamp), "h:mm a");
    },
    getScoreTagType(score) {
      if (score >= 8) return "success";
      if (score >= 6) return "warning";
      return "danger";
    },
    handleCollapseChange(index) {
      const idx = this.expandedEvaluations.indexOf(index);
      if (idx > -1) {
        this.expandedEvaluations.splice(idx, 1);
      } else {
        this.expandedEvaluations.push(index);
      }
    },
    showEndInterviewDialog() {
      this.endInterviewDialogVisible = true;
    },
    endInterview() {
      this.clearTimers();
      this.interviewStarted = false;
      this.endInterviewDialogVisible = false;
      this.$message.success("Interview session saved to your history");
      this.$router.push("/history");
    },
    resetInterview() {
      this.clearTimers();
      this.chatHistory = [];
      this.interviewStarted = false;
    },
  },
  beforeDestroy() {
    this.clearTimers();
  },
};
</script>

<style lang="scss" scoped>
.interview-container {
  margin: 0 auto;
  min-height: calc(100vh - 123px);
  padding: 100px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );

  .interview-header {
    width: 1300px;
    margin: 0 auto;
    background: #f9fafc;
    color: #000;
    border-radius: 10px;
    padding: 30px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .header-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;

      .interview-title {
        margin: 0 0 10px;
        font-size: 2.2rem;
        font-weight: 600;
      }

      .interview-subtitle {
        margin: 0 0 25px;
        font-size: 1.1rem;
        opacity: 0.9;
      }
    }

    .interviewMode-selector {
      display: flex;
      gap: 10px;

      .interviewMode-input {
        flex: 1;
      }

      .questionNum-select {
        width: 180px;
      }

      .start-btn {
        padding-left: 25px;
        padding-right: 25px;

        i {
          margin-right: 8px;
        }
      }
    }
  }

  .interview-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 1300px;
    margin: 0 auto;

    .interview-meta {
      display: flex;
      justify-content: center;
      gap: 25px;
      margin-bottom: 20px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f5f7fa;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 14px;
        color: #606266;

        i {
          font-size: 16px;
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f9fafc;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .message {
        max-width: 80%;

        &.user {
          align-self: flex-end;
        }

        &.ai {
          align-self: flex-start;
        }
      }

      .message-content {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        &.user-message {
          border-top-right-radius: 0;
        }

        &.ai-message {
          border-top-left-radius: 0;
        }
      }

      .message-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-weight: bold;

          &.user-avatar {
            background: #409eff;
            color: white;
          }

          &.ai-avatar {
            background: #67c23a;
            color: white;

            i {
              font-size: 18px;
            }
          }
        }

        .message-info {
          flex: 1;

          .sender-name {
            font-weight: 600;
            color: #303133;
            margin-right: 10px;
          }

          .message-time {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .message-text {
        p {
          margin: 0 0 10px;
          line-height: 1.6;
          color: #606266;
        }

        .evaluation-badge {
          margin-top: 10px;

          .el-tag {
            font-size: 14px;
            padding: 0 10px;
            height: 26px;
            line-height: 26px;
          }
        }
      }

      .evaluation-collapse {
        margin-top: 15px;

        ::v-deep .el-collapse-item__header {
          padding: 0;
          border: none;
          height: auto;
          line-height: 1.5;
        }

        .evaluation-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #409eff;
          font-weight: 500;
          padding: 10px 0;
          font-size: 15px;
          i {
            font-size: 16px;
          }
        }

        .evaluation-details {
          padding: 10px 0;

          .evaluation-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;

            .evaluation-item {
              h5 {
                color: #606266;
                margin: 0 0 5px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;

                i {
                  font-size: 16px;
                }
              }

              p {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: #303133;
                background: #f5f7fa;
                padding: 8px 12px;
                border-radius: 4px;
              }

              &.full-width {
                grid-column: span 2;
              }
            }
          }
        }
      }

      .loading-indicator {
        text-align: center;
        padding: 20px;
        color: #909399;

        i {
          margin-right: 8px;
          font-size: 18px;
        }
      }
    }

    .recorder-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      .recorder-container {
        width: 100%;
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .recorder-tips {
          text-align: center;
          margin-top: 15px;
          color: #909399;
          font-size: 14px;

          p.recording {
            color: #f56c6c;
            font-weight: 500;
          }

          i {
            margin-right: 5px;
          }
        }
      }

      .end-interview-btn {
        display: block;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #ebf2ff 100%);
    border-radius: 16px;
    width: 90%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 40px 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);

    .empty-content-wrapper {
      width: 80%;
      text-align: center;

      .empty-image-container {
        margin-bottom: 30px;

        .empty-image {
          width: 100%;
          max-width: 280px;
          height: auto;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
        }
      }

      .empty-content {
        h3 {
          margin: 0 0 16px;
          font-size: 28px;
          font-weight: 600;
          color: #303133;
          line-height: 1.3;
        }

        .empty-subtitle {
          margin: 0 auto 24px;
          color: #606266;
          font-size: 16px;
          max-width: 600px;
          line-height: 1.6;
        }

        .empty-cta {
          color: #409eff;
          font-size: 24px;
          animation: bounce 2s infinite;
        }
      }
    }
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
}

@media (max-width: 1300px) {
  .interview-header {
    width: 90% !important;
  }
  .interview-content {
    width: 90% !important;
  }
  .empty-state {
    width: 90% !important;
  }
}

@media (max-width: 768px) {
  .empty-state {
    padding: 30px 15px;

    .empty-content-wrapper {
      .empty-content {
        h3 {
          font-size: 22px;
        }

        .empty-subtitle {
          font-size: 15px;
        }
      }
    }
  }
  .interview-container {
    padding: 15px;

    .interview-header {
      padding: 20px 15px;

      .interview-title {
        font-size: 1.8rem !important;
      }

      .interviewMode-selector {
        flex-direction: column;

        .questionNum-select {
          width: 100% !important;
        }
      }
    }

    .chat-messages {
      padding: 15px 10px !important;

      .message {
        max-width: 90% !important;
      }
    }
  }
}
</style>
