<template>
  <div class="historyDetailContainer">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="Summary" name="summaty"></el-tab-pane>
      <el-tab-pane label="Final assessment" name="assessment"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == 'summaty'">
      <h2 class="title">Summary</h2>
      <el-collapse
        v-for="(i, index) of chatHistoryDetail.messages"
        :key="index"
        class="detailSection"
      >
        <p class="mt-3">
          <b>{{ i.role == "user" ? "Me: " : "Coach: " }}</b> {{ i.content }}
        </p>
        <div class="audio-container">
          <mini-audio :audio-source="i.audio_url"></mini-audio>
          <el-button
            icon="el-icon-download"
            circle
            @click="downloadAudio(i.audio_url)"
          ></el-button>
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
    <div v-if="activeName == 'assessment'">
      <h2 class="title">Final assessment</h2>
      <h3>Your Score: {{ finalAssessmentDetail.overall_score }} /10</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "summaty",
    };
  },
  computed: {
    chatHistoryDetail: function () {
      return this.$store.state.chatHistoryDetail;
    },
    finalAssessmentDetail: function () {
      return this.$store.state.finalAssessmentDetail.final_assessment;
    },
    conversationID: function () {
      return this.$store.state.conversationID;
    },
  },
  methods: {
    handleClick(tab) {
      console.log(tab.name);
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
    downloadAudio(fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "audio.wav"; // 可自定义下载后的文件名
      link.click();
      link.remove();
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
  .detailSection {
    padding-bottom: 5px;
    border-bottom: 1px #265d48 solid;
  }
  .title {
    text-align: center;
    margin: 30px 0;
  }
  .audio-container {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
    gap: 10px; /* 元素之间的间距 */
  }
  ::v-deep .el-collapse-item__header {
    padding-left: 10px !important;
    font-weight: bold !important;
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
.evaluation {
  background-color: #ffffff;
}
</style>
