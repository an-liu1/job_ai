<template>
  <div class="history-viewer-container">
    <div class="history-list-panel">
      <el-card shadow="hover" class="history-card">
        <div class="search-toolbar">
          <!-- <el-input
            v-model="searchQuery"
            placeholder="Search conversations..."
            clearable
            prefix-icon="el-icon-search"
            class="search-input"
          /> -->
          <el-select
            v-model="filterMode"
            placeholder="Filter by mode"
            clearable
            class="mode-filter"
          >
            <el-option
              v-for="item in availableModes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <el-table
          :data="filteredChatHistory"
          height="calc(100vh - 180px)"
          style="width: 100%"
          @row-click="openHistoryDetail"
          class="history-table"
          highlight-current-row
        >
          <el-table-column
            prop="mode"
            label="Interview Type"
            width="150"
            align="left"
            sortable
          >
            <template #default="{ row }">
              {{ row.conversation_id }} -
              <el-tag>
                {{ availableModes.filter((i) => i.value == row.mode)[0].title }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="started_at"
            label="Date"
            width="140"
            align="center"
            sortable
          >
            <template #default="{ row }">
              {{ formatDate(row.started_at) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="average_score"
            label="Score"
            width="90"
            align="center"
            sortable
          >
            <template #default="{ row }">
              {{ row.average_score || 0 }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="history-detail-panel">
      <HistoryViewDetail :key="refreshKey" class="history-detail-component" />
    </div>
  </div>
</template>

<script>
import HistoryViewDetail from "./HistoryViewDetail.vue";
import { format, parseISO } from "date-fns";

export default {
  components: { HistoryViewDetail },
  data() {
    return {
      searchQuery: "",
      filterMode: "",
      refreshKey: 0,
      availableModes: [
        {
          value: "common",
          label: "Common Questions",
          title: "Common",
        },
        {
          value: "star",
          label: "Behavioral Questions",
          title: "Behavioral",
        },
        {
          value: "tough",
          label: "Tough Questions",
          title: "Tough",
        },
        {
          value: "mock",
          label: "Mock Interview",
          title: "Mock",
        },
      ],
    };
  },
  computed: {
    filteredChatHistory() {
      let filtered = this.$store.state.chatHistory || [];

      // Ensure all items have required properties
      filtered = filtered.map((item) => ({
        mode: item.mode || "unknown",
        conversation_id: item.conversation_id || "",
        started_at: item.started_at || new Date().toISOString(),
        average_score: item.average_score || 0,
        ...item,
      }));

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.mode.toLowerCase().includes(query) ||
            item.conversation_id.toLowerCase().includes(query)
        );
      }

      if (this.filterMode) {
        filtered = filtered.filter((item) => item.mode === this.filterMode);
      }

      return filtered;
    },
  },
  methods: {
    formatDate(dateString) {
      return format(parseISO(dateString), "yyyy-MM-dd HH:MM");
    },
    formatDuration(seconds) {
      if (!seconds) return "N/A";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    },
    calculateDuration(item) {
      if (!item.messages?.length) return 0;
      const first = new Date(item.messages[0].timestamp);
      const last = new Date(item.messages[item.messages.length - 1].timestamp);
      return Math.round((last - first) / 1000);
    },
    openHistoryDetail(row) {
      this.$store.commit("switchLoadingStatus", true);
      this.$store
        .dispatch("getChatHistoryDetail", row.conversation_id)
        .then(() => {
          this.$store.commit("setConversationID", row.conversation_id);
          this.refreshKey += 1;
          this.$store.commit("switchLoadingStatus", false);
        });
    },
  },
  mounted() {
    this.$store.commit("switchLoadingStatus", true);
    this.$store.commit("getFinalAssessmentDetail", {});
    this.$store.dispatch("getChatHistory").then(() => {
      this.$store
        .dispatch(
          "getChatHistoryDetail",
          this.filteredChatHistory[0].conversation_id
        )
        .then(() => {
          this.$store.commit(
            "setConversationID",
            this.filteredChatHistory[0].conversation_id
          );
          this.refreshKey += 1;
          this.$store.commit("switchLoadingStatus", false);
        });
    });
  },
};
</script>

<style lang="scss" scoped>
.history-viewer-container {
  display: grid;
  grid-template-columns: 430px 1fr;
  gap: 20px;
  padding: 100px 20px 20px 20px;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );

  .history-list-panel {
    .history-card {
      height: 100%;

      .search-toolbar {
        display: flex;
        // gap: 10px;
        margin-bottom: 15px;

        // .search-input {
        //   flex: 1;
        // }

        .mode-filter {
          flex: 1;
          // width: 160px;
        }
      }

      .history-table {
        border-radius: 8px;

        ::v-deep .el-table__row {
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #f0f7ff;
          }
        }

        ::v-deep .current-row {
          background-color: #e6f7ff !important;
        }
      }
    }
  }

  .history-detail-panel {
    .history-detail-component {
      height: 100%;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

@media (max-width: 992px) {
  .history-viewer-container {
    grid-template-columns: 1fr;

    .history-list-panel {
      height: 400px;
    }
  }
}
</style>
