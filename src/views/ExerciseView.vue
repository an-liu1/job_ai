<template>
  <div class="interview-container">
    <!-- 订阅状态显示区域 -->
    <div class="subscription-status-container">
      <div class="status-card">
        <div class="status-icon">
          <i v-if="isMonthlyUser" class="el-icon-success"></i>
          <i v-else-if="isTrialUser" class="el-icon-time"></i>
          <i v-else class="el-icon-coin"></i>
        </div>

        <div class="status-content">
          <div class="status-header">
            <h4 class="status-title">{{ subscriptionStatusText }}</h4>
            <el-tag v-if="isTrialUser" type="warning" size="mini">
              Free Trial Ends At {{ formatDate(billingProfile.trial_end_date) }}
            </el-tag>
          </div>
          <div class="status-details">
            <div v-if="showCreditBalance" class="detail-item">
              <span class="detail-label">Credits:</span>
              <span class="detail-value">{{
                billingProfile.credit_balance
              }}</span>
            </div>

            <div v-if="showTrialRemaining" class="detail-item">
              <span class="detail-label">Trial Feature Interview Left:</span>
              <span class="detail-value">{{
                billingProfile.trial_practice_left
              }}</span>
            </div>

            <div v-if="showTrialRemaining" class="detail-item">
              <span class="detail-label">Trial Mocks Interview Left:</span>
              <span class="detail-value">{{
                billingProfile.trial_mock_left
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试准备区域 -->
    <div class="interview-header" v-if="!interviewStarted">
      <div class="header-content">
        <h1 class="interview-title">
          {{ practiceModeText }} Interview Practice
        </h1>
        <p class="interview-subtitle">
          Practice makes perfect! Get ready for your next job interview
        </p>

        <div class="interviewMode-selector">
          <div class="select-row">
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
              placeholder="Select a category mode"
              no-data-text="please select a feature interview mode"
              class="interviewMode-input"
              @change="handleSubModeChange"
            >
              <el-option
                v-for="item in interviewSubModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- Dynamic fields container -->
          <div class="dynamic-fields-container" v-if="showDynamicFields">
            <!-- Job Description Field -->
            <div class="dynamic-field" v-if="showJobDescriptionField">
              <el-input
                type="textarea"
                v-model="jobDescription"
                :rows="4"
                placeholder="Enter job description"
                resize="none"
                class="job-description-input"
              ></el-input>
              <p
                class="field-hint"
                v-if="!jobDescription && jobDescriptionRequired"
              >
                <i class="el-icon-warning"></i> Job description is required for
                this mode
              </p>
            </div>

            <!-- Resume Upload Field -->
            <div class="dynamic-field" v-if="showResumeUploadField">
              <el-upload
                class="resume-upload"
                action="#"
                :file-list="resumeFileList"
                :on-change="handleResumeChange"
                :auto-upload="false"
                :multiple="false"
                accept=".doc, .docx, .txt"
              >
                <el-button size="medium" type="primary" plain>
                  <i class="el-icon-upload"></i> Upload Resume
                </el-button>
                <div slot="tip" class="upload-tip">
                  Supported formats: .doc, .docx, .txt (max 3MB)
                </div>
              </el-upload>
              <p
                class="field-hint"
                v-if="resumeFileList.length === 0 && resumeUploadRequired"
              >
                <i class="el-icon-warning"></i> Resume upload is required for
                this mode
              </p>
            </div>
          </div>
        </div>
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

    <!-- 面试内容区域 -->
    <div class="interview-content" v-if="chatHistory.length > 0">
      <!-- 面试计时和统计 -->
      <div class="interview-meta">
        <div class="meta-item">
          <i class="el-icon-document"></i>
          <span>{{
            interviewSubModeOptions.find(
              (option) => option.value == interviewSubMode
            ).label
          }}</span>
        </div>
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
              <div
                v-if="msg.evaluation?.score && $route.params.mode !== 'mock'"
                class="evaluation-badge"
              >
                <el-tag :type="getScoreTagType(msg.evaluation.score)">
                  {{ msg.evaluation.score }} / 10
                </el-tag>
              </div>

              <el-collapse
                v-if="msg.evaluation && $route.params.mode !== 'mock'"
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
      jobDescription: "",
      resumeFileList: [],
      jobDescriptionRequired: false,
      resumeUploadRequired: false,
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
        ? [{ value: "mock", label: "Mock Interview" }]
        : [
            { value: "common", label: "Common Questions" },
            { value: "star", label: "Behavioral Questions" },
            { value: "tough", label: "Tough Questions" },
          ];
    },
    interviewSubModeOptions() {
      return this.interviewMode == "common"
        ? [
            { value: "C-be", label: "Background and Experience" },
            { value: "C-sq", label: "Skills and Qualifications" },
            { value: "C-kc", label: "Knowledge of the Company and Role" },
            { value: "C-mq", label: "Motivation and Goals" },
            { value: "C-sl", label: "Salary and Logistics" },
            { value: "C-qi", label: "Questions for the Interviewer" },
          ]
        : this.interviewMode == "star"
        ? [
            { value: "S-tc", label: "Teamwork and Collaboration" },
            { value: "S-lm", label: "Leadership and Management" },
            { value: "S-bq", label: "Behavioral Questions (STAR method)" },
          ]
        : this.interviewMode == "tough"
        ? [
            {
              value: "T-pc",
              label: "Problem-Solving and Critical Thinking",
            },
            { value: "T-ss", label: "Situational or Scenario-Based" },
            { value: "T-cp", label: "Cultural Fit and Personality" },
          ]
        : this.interviewMode == "mock"
        ? [
            { value: "M-gm", label: "General Mock" },
            { value: "M-jd", label: "Job Description (input)" },
            { value: "M-ru", label: "Resume upload (doc or txt)" },
            { value: "M-jr", label: "Job Description(input) & Resume(upload)" },
          ]
        : [];
    },
    showDynamicFields() {
      return this.showJobDescriptionField || this.showResumeUploadField;
    },
    showJobDescriptionField() {
      return ["M-jd", "M-jr"].includes(this.interviewSubMode);
    },
    showResumeUploadField() {
      return ["M-ru", "M-jr"].includes(this.interviewSubMode);
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
    billingProfile() {
      return this.$store.state.billingProfile || {};
    },
    isMonthlyUser() {
      return this.billingProfile.has_active_subscription;
    },
    isTrialUser() {
      return this.billingProfile.is_trial_active;
    },
    subscriptionStatusText() {
      if (this.isMonthlyUser) {
        return "Monthly Subscription Active - Unlimited Practice";
      } else if (this.isTrialUser) {
        return "Free Trial Active";
      } else {
        return "Credit Plan - Credits will be deducted for practice";
      }
    },
    showCreditBalance() {
      return !this.isMonthlyUser && !this.isTrialUser;
    },
    showTrialRemaining() {
      return this.isTrialUser;
    },
    // 根据面试模式获取消耗的credit数量
    creditCost() {
      switch (this.interviewMode) {
        case "common":
          return 2;
        case "star":
          return 2;
        case "tough":
          return 2;
        case "mock":
          return 3;
        default:
          return 0;
      }
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
          this.interviewSubMode = "";
        }
      },
      immediate: true, // 组件创建时立即执行一次 handler
    },
  },
  methods: {
    startInterview() {
      if (!this.interviewMode) {
        this.$message.error("Please select a interview mode!");
        return;
      }

      if (!this.interviewSubMode) {
        this.$message.error("Please select a interview catergory!");
        return;
      }

      if (this.jobDescriptionRequired && !this.jobDescription.trim()) {
        this.$message.error("Please enter the job description!");
        return;
      }

      if (this.resumeUploadRequired && this.resumeFileList.length === 0) {
        this.$message.error("Please upload your resume!");
        return;
      }

      if (this.showResumeUploadField) {
        const isAllowedFormat = [".txt", ".doc", ".docx"].some((ext) =>
          this.resumeFileList[0].raw.name.toLowerCase().endsWith(ext)
        );
        if (!isAllowedFormat) {
          this.$message.error("Resume can only be in txt/doc/docx format!");
          return;
        }

        const isSizeValid =
          this.resumeFileList[0].raw.size / (1024 * 1024) <= 3; // 3MB
        if (!isSizeValid) {
          this.$message.error("Resume size cannot exceed 200KB!");
          return;
        }
      }
      // 检查用户订阅状态并处理
      if (this.isMonthlyUser) {
        // 月度用户直接开始
        this.startInterviewSession();
      } else if (this.isTrialUser) {
        // 试用用户检查剩余次数
        this.handleTrialUsage();
      } else {
        // 信用用户检查余额
        this.handleCreditUsage();
      }
    },
    // 试用用户处理
    handleTrialUsage() {
      const isMock = this.interviewMode === "mock";
      const remaining = isMock
        ? this.billingProfile.trial_mock_left
        : this.billingProfile.trial_practice_left;

      if (remaining <= 0) {
        this.handleCreditUsage("Your trial sessions have been used up.");
      } else {
        const type = isMock ? "Mock" : "Feature";
        const confirmText = `This will use 1 of your remaining trial ${type} interviews. Continue?`;

        this.$confirm(confirmText, "Free Trial Session", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "info",
        })
          .then(() => {
            this.startInterviewSession();
          })
          .catch(() => {
            console.log("User cancel the prictice");
          });
      }
    },
    // 信用用户处理
    handleCreditUsage(msg) {
      if (this.billingProfile.credit_balance >= this.creditCost) {
        this.$confirm(
          `${msg ? msg : ""} This session will cost ${
            this.creditCost
          } credits. Continue?`,
          "Credit Deduction",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "info",
          }
        )
          .then(() => {
            this.startInterviewSession();
          })
          .catch(() => {
            console.log("User canceled the action");
          });
      } else {
        this.promptCreditPurchase(
          `You don't have enough credits (needed: ${this.creditCost}). Would you like to purchase more credits?`
        );
      }
    },

    // 提示用户购买信用
    promptCreditPurchase(message) {
      this.$confirm(message, "Insufficient Credits", {
        confirmButtonText: "Purchase Credits",
        cancelButtonText: "Cancel",
        type: "info",
      })
        .then(() => {
          this.$router.push({ path: "/", hash: "#price" });
        })
        .catch(() => {
          console.log("User chose not to purchase credits");
        });
    },
    handleSubModeChange(value) {
      this.jobDescriptionRequired = ["M-jd", "M-jr"].includes(value);
      this.resumeUploadRequired = ["M-ru", "M-jr"].includes(value);

      // Clear fields when switching modes
      if (!this.showJobDescriptionField) {
        this.jobDescription = "";
      }
      if (!this.showResumeUploadField) {
        this.resumeFileList = [];
      }
    },
    handleResumeChange(file, fileList) {
      this.resumeFileList = [fileList[fileList.length - 1]];
    },
    // 开始面试会话
    startInterviewSession() {
      this.loading = true;
      const formData = new FormData();

      formData.append("mode", this.interviewMode);
      formData.append("sub_mode", this.interviewSubMode);
      formData.append("questionNum", this.questionNum);
      if (this.showJobDescriptionField) {
        let jobDescription = this.jobDescription
          ?.replace(/[^\x20-\x7E]/g, "") // \x20 (space) to \x7E (~)
          .replace(/\s+/g, " ")
          .trim();
        formData.append("job_description", jobDescription);
      }
      if (this.showResumeUploadField) {
        formData.append("resume_file", this.resumeFileList[0].raw);
      }
      formData.append("new_conversation", true);
      this.$store
        .dispatch("getChatInfo", formData)
        .then(() => {
          this.$store.dispatch("getBillingProfile");
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
          this.$message.error("Failed to start interview session");
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
      formData.append("sub_mode", this.interviewSubMode);
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
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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
  min-height: calc(100vh - 128px);
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

  .subscription-status-container {
    width: 1300px;
    margin: 0 auto;
    margin-bottom: 20px;

    .status-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      .status-icon {
        margin-right: 16px;
        i {
          font-size: 28px;
        }
      }

      .status-content {
        flex: 1;

        .status-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;

          .status-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }

          .el-tag {
            font-size: 12px;
            height: 20px;
            line-height: 18px;
            padding: 0 6px;
          }
        }

        .status-details {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;

          .detail-item {
            display: flex;
            align-items: center;
            background: #f5f7fa;
            padding: 6px 12px;
            border-radius: 16px;

            .detail-label {
              font-size: 13px;
              color: #909399;
              margin-right: 6px;
            }

            .detail-value {
              font-size: 14px;
              font-weight: 500;
              color: #606266;
            }
          }
        }
      }
    }
  }

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
      flex-direction: column;
      gap: 15px;
      width: 100%;

      .select-row {
        display: flex;
        gap: 15px;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 10px;
        }

        .interviewMode-input {
          flex: 1;

          @media (max-width: 768px) {
            width: 100%;
          }
        }
      }
    }

    .dynamic-fields-container {
      width: 100%;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 20px;
      margin-top: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .dynamic-field {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .job-description-input {
        margin-bottom: 5px;

        textarea {
          font-family: inherit;
        }
      }

      .resume-upload {
        margin-bottom: 5px;

        .el-upload {
          display: block;
        }
      }

      .upload-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
      }

      .field-hint {
        font-size: 13px;
        color: #f56c6c;
        margin: 5px 0 0;
        display: flex;
        align-items: center;

        i {
          margin-right: 5px;
        }
      }
    }
    .start-btn {
      padding-left: 25px;
      padding-right: 25px;
      margin-top: 10px;
      i {
        margin-right: 8px;
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
  .subscription-status-container {
    width: 90% !important;
  }
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
  .subscription-status-container {
    width: 100%;
    padding-top: 70px;

    .status-card {
      .status-icon i {
        font-size: 24px;
      }

      .status-content {
        .status-header {
          flex-wrap: wrap;
          .status-title {
            font-size: 15px;
          }
        }

        .status-details {
          gap: 8px;

          .detail-item {
            padding: 4px 10px;

            .detail-label {
              font-size: 12px;
            }

            .detail-value {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
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
