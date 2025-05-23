<template>
  <el-card
    class="interview-detail-container"
    v-loading="$store.state.isLoading"
  >
    <div class="interview-header">
      <div class="header-content">
        <h2 class="interview-title">Interview Review: {{ conversationID }}</h2>
        <div class="interview-meta">
          <div class="meta-item">
            <i class="el-icon-date"></i>
            <span>{{ formatDate(chatHistoryDetail.started_at) }}</span>
          </div>
          <div class="meta-item">
            <i class="el-icon-tickets"></i>
            <span>Category Mode: {{ chatHistoryDetail.sub_mode_label }}</span>
          </div>
          <div class="meta-item" v-if="chatHistoryDetail.average_score">
            <i class="el-icon-star-on"></i>
            <span>Average Score: {{ chatHistoryDetail.average_score }}/10</span>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="Conversation" name="conversation">
          <div class="conversation-view mt-3">
            <div
              v-for="(message, index) in chatHistoryDetail.messages"
              :key="index"
              class="message-container"
              :class="{
                'user-message': message.role === 'user',
                'coach-message': message.role !== 'user',
              }"
            >
              <div class="message-avatar">
                <el-avatar
                  :icon="
                    message.role === 'user'
                      ? 'el-icon-user'
                      : 'el-icon-coordinate'
                  "
                />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="sender-name">{{
                    message.role === "user" ? "You" : "Interview Coach"
                  }}</span>
                </div>
                <div
                  class="message-text"
                  v-html="sanitize(message.content.replace(/\n/g, '<br />'))"
                ></div>

                <div class="message-audio" v-if="message.audio_url">
                  <AudioPlayer
                    :src="message.audio_url"
                    :color="
                      message.role === 'user'
                        ? 'var(--chat-ai)'
                        : 'var(--chat-user)'
                    "
                  />
                </div>

                <el-collapse
                  v-if="message.evaluation && message.evaluation.score"
                  class="evaluation-collapse"
                  :class="{ 'has-evaluation': message.evaluation }"
                >
                  <el-collapse-item
                    title="View Evaluation Details"
                    :name="index"
                  >
                    <div class="evaluation-details">
                      <div class="evaluation-score">
                        <el-rate
                          v-model="message.evaluation.score"
                          disabled
                          :max="10"
                          :colors="{
                            9: '#67C23A',
                            7: '#E6A23C',
                            5: '#F56C6C',
                            3: '#909399',
                          }"
                          score-template="{value}"
                        />
                        <span
                          class="score-text"
                          :style="
                            'color:' + getScoreColor(message.evaluation.score)
                          "
                        >
                          {{ message.evaluation.score }}/10</span
                        >
                      </div>

                      <div class="evaluation-grid">
                        <div class="evaluation-item">
                          <h5>Question Category</h5>
                          <p>{{ message.evaluation.question_category }}</p>
                        </div>

                        <div class="evaluation-item">
                          <h5>Difficulty Level</h5>
                          <p>{{ message.evaluation.question_difficulty }}</p>
                        </div>

                        <div class="evaluation-item full-width">
                          <h5><i class="el-icon-document"></i> Assessment</h5>
                          <p>{{ message.evaluation.assessment }}</p>
                        </div>

                        <div class="evaluation-item full-width">
                          <h5><i class="el-icon-light-rain"></i> Advice</h5>
                          <p>{{ message.evaluation.advice }}</p>
                        </div>

                        <div class="evaluation-item full-width">
                          <h5>
                            <i class="el-icon-magic-stick"></i> Improved Example
                          </h5>
                          <p>{{ message.evaluation.revised_example }}</p>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Final Assessment" name="assessment">
          <div
            class="assessment-view"
            v-if="Object.keys(finalAssessmentDetail).length"
          >
            <div class="assessment-score">
              <el-progress
                type="dashboard"
                :percentage="finalAssessmentDetail.overall_score * 10"
                :color="getScoreColor(finalAssessmentDetail.overall_score)"
                :width="120"
              >
                <template #default>
                  <div class="score-display">
                    <span class="score-value">{{
                      finalAssessmentDetail.overall_score
                    }}</span>
                    <span class="score-max">/ 10</span>
                  </div>
                </template>
              </el-progress>
              <div class="score-summary">
                <h3>Overall Interview Performance</h3>
                <p>
                  {{ getPerformanceText(finalAssessmentDetail.overall_score) }}
                </p>
              </div>
              <div class="download-report">
                <button class="default-btn" @click="downloadReport">
                  Download Report
                </button>
              </div>
            </div>

            <div class="assessment-sections">
              <el-card shadow="hover" class="strengths-section">
                <div class="section-header">
                  <i class="el-icon-success"></i>
                  <h4>Strengths</h4>
                </div>
                <div
                  v-for="(
                    content, title
                  ) in finalAssessmentDetail.strength_analysis"
                  :key="'strength-' + title"
                  class="analysis-item"
                >
                  <h5>{{ title }}</h5>
                  <p>{{ content }}</p>
                </div>
              </el-card>

              <el-card shadow="hover" class="weaknesses-section">
                <div class="section-header">
                  <i class="el-icon-warning"></i>
                  <h4>Areas for Improvement</h4>
                </div>
                <div
                  v-for="(
                    content, title
                  ) in finalAssessmentDetail.weakness_analysis"
                  :key="'weakness-' + title"
                  class="analysis-item"
                >
                  <h5>{{ title }}</h5>
                  <p>{{ content }}</p>
                </div>
              </el-card>

              <el-card shadow="hover" class="improvement-section">
                <div class="section-header">
                  <i class="el-icon-aim"></i>
                  <h4>Improvement Plan</h4>
                </div>
                <div
                  v-for="(
                    content, title
                  ) in finalAssessmentDetail.improvement_plan"
                  :key="'strength-' + title"
                  class="analysis-item"
                >
                  <h5>{{ title }}</h5>
                  <p>{{ content }}</p>
                </div>
              </el-card>

              <el-card shadow="hover" class="career-section">
                <div class="section-header">
                  <i class="el-icon-office-building"></i>
                  <h4>Career Suggestions</h4>
                </div>
                <div
                  v-for="(
                    content, title
                  ) in finalAssessmentDetail.career_suggestions"
                  :key="'strength-' + title"
                  class="analysis-item"
                >
                  <h5>{{ title }}</h5>
                  <p>{{ content }}</p>
                </div>
              </el-card>
            </div>
          </div>

          <div class="empty-assessment" v-else>
            <el-empty description="No assessment data available">
              <el-tooltip
                content="Chat session must be finished to generate assessment"
                placement="top"
                :disabled="chatHistoryDetail.finished"
              >
                <div style="display: inline-block">
                  <el-button
                    type="primary"
                    @click="generateAssessment"
                    :loading="isGeneratingAssessment"
                    :disabled="!chatHistoryDetail.finished"
                  >
                    Generate Assessment
                  </el-button>
                </div>
              </el-tooltip>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import DOMPurify from "dompurify";
import AudioPlayer from "../components/AudioPlayer.vue";
import { format, parseISO } from "date-fns";

export default {
  components: { AudioPlayer },
  data() {
    return {
      activeTab: "conversation",
      isGeneratingAssessment: false,
    };
  },
  computed: {
    chatHistoryDetail() {
      return this.$store.state.chatHistoryDetail;
    },
    billingProfile() {
      return this.$store.state.billingProfile;
    },
    finalAssessmentDetail() {
      return this.chatHistoryDetail.final_assessment
        ? this.chatHistoryDetail.final_assessment
        : this.$store.state.finalAssessmentDetail.final_assessment || {};
    },
    finalAssessmentReport() {
      return this.$store.state.finalAssessmentReport;
    },
    conversationID() {
      return this.$store.state.conversationID;
    },
    isMonthlyUser() {
      return this.billingProfile.has_active_subscription;
    },
    isTrialUser() {
      return this.billingProfile.is_trial_active;
    },
  },
  watch: {
    conversationID(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.activeTab = "conversation";
      }
    },
  },
  methods: {
    sanitize(html) {
      return DOMPurify.sanitize(html);
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMMM d, yyyy - h:mm a");
    },
    getScoreColor(score) {
      if (score >= 8) return "#67C23A";
      if (score >= 6) return "#E6A23C";
      if (score >= 4) return "#F56C6C";
      return "#909399";
    },
    getPerformanceText(score) {
      if (score >= 9)
        return "Exceptional performance! You demonstrated outstanding skills and knowledge.";
      if (score >= 7) return "Strong performance with a few areas to polish.";
      if (score >= 5)
        return "Average performance with several areas needing improvement.";
      if (score >= 3)
        return "Below average performance with significant room for improvement.";
      return "Needs substantial improvement in most areas.";
    },
    generateAssessment() {
      // 检查用户订阅状态并处理
      if (this.isMonthlyUser) {
        // 月度用户直接开始
        this.generateAssessmentRepost();
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
      if (this.billingProfile.trial_assessment_report_left <= 0) {
        this.handleCreditUsage("Your trial sessions have been used up.");
      } else {
        const confirmText = `This will use 1 of your remaining trial interview final assessment report. Continue?`;

        this.$confirm(confirmText, "Free Trial Session", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "info",
        })
          .then(() => {
            this.generateAssessmentRepost();
          })
          .catch(() => {
            console.log("User cancel the prictice");
          });
      }
    },
    // 信用用户处理
    handleCreditUsage(msg) {
      if (this.billingProfile.credit_balance >= 1) {
        this.$confirm(
          `${msg ? msg : ""} This report will cost 1 credit. Continue?`,
          "Credit Deduction",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "info",
          }
        )
          .then(() => {
            this.generateAssessmentRepost();
          })
          .catch(() => {
            console.log("User canceled the action");
          });
      } else {
        this.promptCreditPurchase(
          `You don't have enough credits (needed: 1). Would you like to purchase more credits?`
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
    generateAssessmentRepost() {
      this.isGeneratingAssessment = true;
      this.$store
        .dispatch("getFinalAssessmentDetail", this.conversationID)
        .then(() => {
          this.isGeneratingAssessment = false;
          this.activeTab = "assessment";
        });
    },
    downloadReport() {
      const reportContent = `
      <div class="download-confirm-content">
        <p style="margin-bottom:15px;">Your complete performance analysis report will include:</p>
        <ul class="report-features">
          <li>1. Full practice conversation content</li>
          <li>2. Detailed assessment scores</li>
          <li>3. Comprehensive feedback analysis</li>
          <li>4. Personalized improvement suggestions</li>
          <li>5. Career development directions</li>
          <li>6. Summary of strengths and weaknesses</li>
        </ul>
        <p class="download-note">
          The report will be generated as a PDF document for easy sharing and reference.
        </p>
      </div>
    `;
      this.$confirm(reportContent, "Download Performance Report", {
        confirmButtonText: "Confirm Download",
        cancelButtonText: "Cancel",
        type: "info",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          if (this.chatHistoryDetail.pdf_generated) {
            this.$message.success("Report downloaded successfully!");
            window.open(this.chatHistoryDetail.pdf_file_url, "_blank");
          } else {
            this.$store
              .dispatch("getFinalAssessmentReport", this.conversationID)
              .then(() => {
                this.$message.success("Report downloaded successfully!");
                window.open(this.finalAssessmentReport.pdf_url, "_blank");
              });
          }
        })
        .catch(() => {
          console.log("no download");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.interview-detail-container {
  height: 100%;
  border-radius: 8px;

  .interview-header {
    margin-bottom: 20px;

    .header-content {
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-base);

      .interview-title {
        margin-bottom: 10px;
        font-weight: 600;
      }

      .interview-meta {
        display: flex;
        gap: 20px;
        color: var(--text-des);
        font-size: 14px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            font-size: 16px;
          }
        }
      }
    }
  }

  .detail-tabs {
    ::v-deep .el-tabs__header {
      margin: 0;
    }

    ::v-deep .el-tabs__item {
      font-weight: 500;
    }
  }

  .conversation-view {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    padding-right: 10px;

    .message-container {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;

      .message-avatar {
        flex-shrink: 0;
      }

      .message-content {
        flex-grow: 1;

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;

          .sender-name {
            font-weight: 600;
            color: var(--text-primary);
          }
        }

        .message-text {
          background-color: var(--bg-grey);
          padding: 12px 15px;
          border-radius: 8px;
          line-height: 1.6;
          word-break: break-word;
        }

        .message-audio {
          margin-top: 10px;
        }

        .evaluation-collapse {
          margin-top: 15px;

          &.has-evaluation {
            border: 1px solid var(--border-base);
            border-radius: 8px;
          }

          ::v-deep .el-collapse-item__header {
            padding: 0 15px;
            font-weight: 500;
          }

          ::v-deep .el-collapse-item__content {
            padding: 15px;
          }

          .evaluation-details {
            .evaluation-score {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 15px;

              .score-text {
                font-weight: 600;
              }
            }

            .evaluation-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;

              .evaluation-item {
                h5 {
                  margin-bottom: 5px;
                  display: flex;
                  align-items: center;
                  gap: 5px;
                }

                p {
                  background-color: var(--bg-grey);
                  padding: 10px;
                  border-radius: 4px;
                  margin: 0;
                }

                &.full-width {
                  grid-column: span 2;
                }
              }
            }
          }
        }
      }

      &.user-message {
        .message-content {
          .message-text {
            background-color: var(--bg-grey);
            border-left: 4px solid var(--chat-user);
          }
        }
      }

      &.coach-message {
        .message-content {
          .message-text {
            background-color: var(--bg-grey);
            border-left: 4px solid var(--chat-ai);
          }
        }
      }
    }
  }

  .assessment-view {
    .assessment-score {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 30px;
      padding: 20px;
      background-color: var(--bg-grey);
      border-radius: 8px;
      position: relative;

      .score-display {
        text-align: center;

        .score-value {
          font-size: 28px;
          font-weight: 700;
        }

        .score-max {
          font-size: 16px;
        }
      }

      .score-summary {
        flex: 1;
        h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }

        p {
          margin: 0;
        }
      }
      .download-report {
        margin-left: auto; /* This will push the button to the right */
      }
    }

    .assessment-sections {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;

      .el-card {
        border-radius: 8px;

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;

          i {
            font-size: 20px;
          }

          h4 {
            margin: 0;
          }
        }

        .analysis-item {
          margin-bottom: 15px;

          h5 {
            margin-bottom: 5px;
          }

          p {
            margin: 0;
            line-height: 1.6;
          }
        }
      }

      .strengths-section {
        border-top: 4px solid var(--success);

        .section-header {
          i {
            color: var(--success);
          }
        }
      }

      .weaknesses-section {
        border-top: 4px solid var(--error);

        .section-header {
          i {
            color: var(--error);
          }
        }
      }

      .improvement-section {
        border-top: 4px solid var(--warning);

        .section-header {
          i {
            color: var(--warning);
          }
        }
      }

      .career-section {
        border-top: 4px solid var(--primary);

        .section-header {
          i {
            color: var(--primary);
          }
        }
      }
    }
  }

  .empty-assessment {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }
}

@media (max-width: 992px) {
  .assessment-view {
    .assessment-sections {
      grid-template-columns: 1fr !important;
    }
  }
}

.download-confirm-dialog {
  .el-message-box__content {
    padding: 20px;

    .download-confirm-content {
      .report-features {
        padding-left: 10px;
        margin: 15px 0;

        li {
          padding: 8px 0;
          display: flex;
          align-items: center;
        }
      }

      .download-note {
        margin-top: 20px;
        padding-top: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
