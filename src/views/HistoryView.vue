<template>
  <div class="row">
    <div class="col-11 col-lg-4 mx-auto">
      <el-table
        :data="chatHistory"
        height="830"
        border
        class="histroyTable"
        highlight-current-row
        @row-click="openHistoryDetail"
      >
        <el-table-column
          :sortable="true"
          prop="conversation_id"
          label="Conversation ID"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :sortable="true"
          prop="mode"
          label="Mode"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :sortable="true"
          prop="started_at"
          label="Time"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
    <HistoryViewDetail class="col-11 col-lg-8 mx-auto historyDetail" />
  </div>
</template>

<script>
import HistoryViewDetail from "./HistoryViewDetail.vue";
export default {
  components: { HistoryViewDetail },
  data() {
    return {};
  },
  computed: {
    chatHistory: function () {
      return this.$store.state.chatHistory.map((i) => {
        i.started_at = this.$moment(i.started_at).format("YYYY-MM-DD HH:MM:SS");
        return i;
      });
    },
  },
  mounted() {
    this.$store.commit("switchLoadingStatus", true);
    this.$store.dispatch("getChatHistory").then(() => {
      this.$store.commit("switchLoadingStatus", false);
    });
  },
  methods: {
    openHistoryDetail(rows) {
      this.$store.commit("switchLoadingStatus", true);
      this.$store
        .dispatch("getChatHistoryDetail", rows.conversation_id)
        .then(() => {
          this.$store.commit("setConversationID", rows.conversation_id);
          this.$store.commit("switchLoadingStatus", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
