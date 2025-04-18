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
          <div class="meta-item" v-if="finalAssessmentDetail.overall_score">
            <i class="el-icon-star-on"></i>
            <span
              >Overall Score: {{ finalAssessmentDetail.overall_score }}/10</span
            >
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
                  <span class="message-time">{{
                    formatTime(message.timestamp)
                  }}</span>
                </div>
                <div
                  class="message-text"
                  v-html="sanitize(message.content.replace(/\n/g, '<br />'))"
                ></div>

                <div class="message-audio" v-if="message.audio_url">
                  <AudioPlayer
                    :src="message.audio_url"
                    :color="message.role === 'user' ? '#409EFF' : '#67c23a'"
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
                          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                          score-template="{value}"
                        />
                        <span class="score-text"
                          >{{ message.evaluation.score }}/10</span
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
                <p>{{ finalAssessmentDetail.improvement_plan }}</p>
              </el-card>

              <el-card shadow="hover" class="career-section">
                <div class="section-header">
                  <i class="el-icon-office-building"></i>
                  <h4>Career Suggestions</h4>
                </div>
                <p>{{ finalAssessmentDetail.career_suggestions }}</p>
              </el-card>
            </div>
          </div>

          <div class="empty-assessment" v-else>
            <el-empty description="No assessment data available">
              <el-button
                type="primary"
                @click="generateAssessment"
                :loading="isGeneratingAssessment"
              >
                Generate Assessment
              </el-button>
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
    finalAssessmentDetail() {
      return this.$store.state.finalAssessmentDetail.final_assessment || {};
    },
    conversationID() {
      return this.$store.state.conversationID;
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
    formatTime(timestamp) {
      if (!timestamp) return "";
      return format(parseISO(timestamp), "h:mm a");
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
      this.isGeneratingAssessment = true;
      this.$store
        .dispatch("getFinalAssessmentDetail", this.conversationID)
        .then(() => {
          this.isGeneratingAssessment = false;
          this.activeTab = "assessment";
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
      border-bottom: 1px solid #ebeef5;

      .interview-title {
        color: #303133;
        margin-bottom: 10px;
        font-weight: 600;
      }

      .interview-meta {
        display: flex;
        gap: 20px;
        color: #909399;
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
            color: #303133;
          }

          .message-time {
            color: #909399;
            font-size: 12px;
          }
        }

        .message-text {
          background-color: #f5f7fa;
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
            border: 1px solid #ebeef5;
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
                color: #ff9900;
              }
            }

            .evaluation-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;

              .evaluation-item {
                h5 {
                  color: #606266;
                  margin-bottom: 5px;
                  display: flex;
                  align-items: center;
                  gap: 5px;
                }

                p {
                  background-color: #f5f7fa;
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
            background-color: #ecf5ff;
            border-left: 4px solid #409eff;
          }
        }
      }

      &.coach-message {
        .message-content {
          .message-text {
            background-color: #f0f9eb;
            border-left: 4px solid #67c23a;
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
      background-color: #f5f7fa;
      border-radius: 8px;

      .score-display {
        text-align: center;

        .score-value {
          font-size: 28px;
          font-weight: 700;
        }

        .score-max {
          font-size: 16px;
          color: #909399;
        }
      }

      .score-summary {
        h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }

        p {
          color: #606266;
          margin: 0;
        }
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
          color: #303133;

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
            color: #606266;
            margin-bottom: 5px;
          }

          p {
            margin: 0;
            line-height: 1.6;
          }
        }
      }

      .strengths-section {
        border-top: 4px solid #67c23a;

        .section-header {
          i {
            color: #67c23a;
          }
        }
      }

      .weaknesses-section {
        border-top: 4px solid #f56c6c;

        .section-header {
          i {
            color: #f56c6c;
          }
        }
      }

      .improvement-section {
        border-top: 4px solid #e6a23c;

        .section-header {
          i {
            color: #e6a23c;
          }
        }
      }

      .career-section {
        border-top: 4px solid #409eff;

        .section-header {
          i {
            color: #409eff;
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
</style>
