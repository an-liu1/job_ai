<template>
  <div class="historyDetailContainer">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="Summary" name="summary"></el-tab-pane>
      <el-tab-pane label="Final assessment" name="assessment"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 'summary'" class="summary">
      <h2 class="title">Summary - {{ conversationID }}</h2>
      <el-collapse
        v-for="(i, index) of chatHistoryDetail.messages"
        :key="index"
        class="detailSection"
      >
        <p class="mt-3">
          <b>{{ i.role == "user" ? "Me: " : "Coach: " }}</b> {{ i.content }}
        </p>
        <div class="audio-container" v-if="i.audio_url">
          <AudioPlayer :src="i.audio_url" style="width: 260px; height: 40px" />
        </div>
        <el-collapse-item
          title="View evaluation"
          :name="index"
          v-if="i.evaluation"
        >
          <div class="row evaluation">
            <div class="col-4">
              <div class="evaluationLeft">
                <div>
                  <h5>Category:</h5>
                  <p>{{ i.evaluation.question_category }}</p>
                </div>
                <div>
                  <h5>Level:</h5>
                  <p>{{ i.evaluation.question_difficulty }}</p>
                </div>
                <div>
                  <h5>Score:</h5>
                  <p>{{ i.evaluation.score + "/10" }}</p>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div class="evaluationRight">
                <div>
                  <h5 style="color: #004aad">Assessment:</h5>
                  <p>{{ i.evaluation.assessment }}</p>
                </div>
                <div>
                  <h5 style="color: #f9943b">Advice:</h5>
                  <p>{{ i.evaluation.advice }}</p>
                </div>
                <div>
                  <h5 style="color: #265d48">Improved example:</h5>
                  <p>{{ i.evaluation.revised_example }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-if="activeName == 'assessment'" class="assessment">
      <h2 class="title">Final assessment - {{ conversationID }}</h2>
      <h3>Your Score: {{ finalAssessmentDetail.overall_score }}/10</h3>
      <div class="row">
        <div class="col-6 Strengths">
          <h4>Strengths:</h4>
          <div
            v-for="(content, title) in finalAssessmentDetail.strength_analysis"
            :key="title"
          >
            <p>
              <strong>{{ title }}:</strong>
            </p>
            <p>{{ content }}</p>
          </div>
        </div>
        <div class="col-6 weaknesses">
          <h4>Weaknesses:</h4>
          <div
            v-for="(content, title) in finalAssessmentDetail.weakness_analysis"
            :key="title"
          >
            <p>
              <strong>{{ title }}:</strong>
            </p>
            <p>{{ content }}</p>
          </div>
        </div>
        <div class="col-12 improvensent">
          <h4>Improvensent plan:</h4>
          <p>{{ finalAssessmentDetail.improvement_plan }}</p>
        </div>
        <div class="col-12 career">
          <h4>Career suggestions:</h4>
          <p>{{ finalAssessmentDetail.career_suggestions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from "../components/AudioPlayer.vue";
export default {
  components: {
    AudioPlayer,
  },
  data() {
    return {
      activeName: "summary",
    };
  },
  computed: {
    chatHistoryDetail: function () {
      return this.$store.state.chatHistoryDetail;
    },
    finalAssessmentDetail: function () {
      return this.$store.state.finalAssessmentDetail;
    },
    conversationID: function () {
      return this.$store.state.conversationID;
    },
  },
  watch: {
    conversationID: function (N, O) {
      if (N && N !== O) {
        this.activeName = "summary";
      }
    },
  },
  methods: {
    handleClick(tab) {
      if (tab.name == "assessment") {
        this.$store.commit("switchLoadingStatus", true);
        this.$store
          .dispatch("getFinalAssessmentDetail", this.conversationID)
          .then(() => {
            this.$store.commit("switchLoadingStatus", false);
          });
      } else {
        this.$store.commit("switchLoadingStatus", true);
        this.$store
          .dispatch("getChatHistoryDetail", this.conversationID)
          .then(() => {
            this.$store.commit("switchLoadingStatus", false);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.historyDetailContainer {
  // width: 80%;
  // margin: 0 auto;
  height: 100%;
  overflow: auto !important;
  .summary {
    .detailSection {
      padding-bottom: 5px;
      border-bottom: 1px #265d48 solid;
    }
    .title {
      text-align: center;
      margin: 30px 0;
      font-weight: bold;
    }
    .audio-container {
      display: flex;
      align-items: center; /* 垂直居中对齐 */
      gap: 10px; /* 元素之间的间距 */
      margin-bottom: 10px;
    }
    ::v-deep .el-collapse-item__header {
      padding-left: 10px !important;
      font-weight: bold !important;
    }
    .evaluation {
      background-color: #ffffff;
    }
    .evaluationLeft {
      width: 60%;
      background-color: #e2fddb;
      margin: 0 auto;
      padding: 20px 10px;
    }
    .evaluationRight {
      width: 90%;
    }
  }
  .assessment {
    width: 90%;
    margin: 0 auto;
    .title {
      text-align: center;
      margin: 30px 0;
      font-weight: bold;
    }
    .Strengths {
      border: 5px solid #265d48;
      border-radius: 20px;
      h4 {
        color: #265d48;
        margin-top: 10px;
      }
    }
    .weaknesses {
      border: 5px solid #bc1823;
      border-radius: 20px;
      h4 {
        color: #bc1823;
        margin-top: 10px;
      }
    }
    .improvensent {
      border: 5px solid #ffcf60;
      border-radius: 20px;
      margin-top: 10px;
      h4 {
        color: #ffcf60;
        margin-top: 10px;
      }
    }
    .career {
      border: 5px solid #c74375;
      border-radius: 20px;
      margin-top: 10px;
      h4 {
        color: #c74375;
        margin-top: 10px;
      }
    }
  }
}
</style>
