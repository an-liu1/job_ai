<template>
  <div class="job-portal-container pageContainer">
    <div class="jobContainer">
      <!-- Search Bar -->
      <div class="search-container">
        <el-input
          placeholder="Search jobs by title"
          v-model="searchQuery"
          class="search-input"
          clearable
        >
          <i slot="prefix" class="el-icon-search"></i>
        </el-input>

        <el-select
          v-model="location"
          filterable
          clearable
          placeholder="Select job location"
          class="location-select"
        >
          <el-option v-for="i in locationList" :key="i" :label="i" :value="i">
          </el-option>
        </el-select>

        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </div>

      <el-container class="portal-layout">
        <!-- Left Sidebar - Job List -->
        <el-aside width="400px" class="job-list-container">
          <el-card class="job-list-card">
            <div slot="header" class="list-header">
              <span class="header-title">Job Opportunities</span>
              <span class="job-count"
                >{{ jobSearchResults?.count }} jobs found</span
              >
            </div>

            <div class="job-list-content">
              <div
                v-for="(job, index) in jobSearchResults.jobs"
                :key="index"
                class="job-item"
                :class="{ selected: selectedJob && selectedJob.id === job.id }"
                @click="handleJobClick(job)"
              >
                <div class="job-title">{{ job.title }}</div>
                <div class="job-company">{{ job.hiringOrganization.name }}</div>
                <div class="job-meta">
                  <span class="location"
                    ><i class="el-icon-location"></i>
                    {{
                      job.jobLocation.address.addressLocality +
                      ", " +
                      job.jobLocation.address.addressCountry
                    }}</span
                  >
                  <span class="post-time"
                    ><i class="el-icon-time"></i>
                    <!-- {{ formatDate(job.postTime) }} -->
                    {{ job.datePosted }}
                  </span>
                </div>
              </div>

              <div class="pagination-container">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 20, 30]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next"
                  :total="jobSearchResults?.count"
                ></el-pagination>
              </div>
            </div>
          </el-card>
        </el-aside>

        <!-- Main Content - Job Details -->
        <el-main class="job-details-container">
          <el-card class="job-details-card" v-if="selectedJob">
            <div slot="header" class="details-header">
              <h2>{{ selectedJob.title }}</h2>
              <h3 class="company-name">
                {{ selectedJob.hiringOrganization.name }}
              </h3>
              <div class="job-meta">
                <span class="location"
                  ><i class="el-icon-location"></i>
                  {{
                    selectedJob.jobLocation.address.addressLocality +
                    ", " +
                    selectedJob.jobLocation.address.addressCountry
                  }}</span
                >
                <span class="post-time"
                  ><i class="el-icon-time"></i> Posted
                  <!-- {{ formatDate(selectedJob.postTime) }} -->
                  {{ selectedJob.datePosted }}</span
                >
              </div>
            </div>

            <div class="info-notice">
              <p style="margin: 0; line-height: 1.6; color: var(--text-des)">
                <i class="el-icon-info"></i>
                All job listings are automatically collected from major
                recruitment platforms within the last 7 days. Use these JD
                descriptions for
                <strong style="color: var(--primary)"
                  >"Mock Interview Practice"</strong
                >, or click
                <strong style="color: var(--success)">"Apply Now"</strong> to be
                redirected to the original posting. <br /><br />
                <span style="font-size: 13px">
                  <i class="el-icon-warning" style="color: var(--warning)"></i>
                  Note: Application links are provided by third parties - we
                  recommend verifying the employer's authenticity before
                  submitting personal information.
                </span>
              </p>
            </div>

            <div class="job-description">
              <h4>Employment Type</h4>
              <p>{{ selectedJob.employmentType }}</p>

              <h4>Job Description</h4>
              <p>{{ selectedJob.description }}</p>

              <h4>Job Responsibilities</h4>
              <p>{{ selectedJob.responsibilities }}</p>

              <h4>Job Qualifications</h4>
              <p>{{ selectedJob.qualifications }}</p>

              <h4>Skills</h4>
              <ul>
                <li v-for="(req, index) in selectedJob.skills" :key="index">
                  {{ req }}
                </li>
              </ul>
            </div>

            <div class="action-buttons">
              <el-button
                type="primary"
                @click="startMock"
                class="external-link-btn default-btn"
                icon="el-icon-chat-round"
              >
                Start Mock Interview
              </el-button>

              <el-button
                type="success"
                @click="openJobPosting"
                class="apply-btn default-btn success-btn"
                icon="el-icon-document-copy"
              >
                Apply Now
              </el-button>
            </div>
          </el-card>

          <el-card v-else class="empty-state">
            <div class="empty-content">
              <i class="el-icon-search" style="font-size: 48px"></i>
              <h3>Select a job to view details</h3>
              <p>
                Click on any job listing from the left panel to see the complete
                details here.
              </p>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobPortal",
  data() {
    return {
      searchQuery: "",
      locationList: [
        "Toronto",
        "Montreal",
        "Vancouver",
        "Calgary",
        "Edmonton",
        "Ottawa",
        "Winnipeg",
        "Quebec City",
        "Hamilton",
        "Kitchener",
        "London",
        "Victoria",
        "Halifax",
        "Oshawa",
        "Windsor",
        "Saskatoon",
        "Regina",
        "St. Catharines",
        "Barrie",
        "Guelph",
        "Abbotsford",
        "Kelowna",
        "Kingston",
        "Sherbrooke",
        "Trois-Rivières",
        "Moncton",
        "Thunder Bay",
        "Brantford",
        "Whitehorse",
        "Sudbury",
        "Laval",
        "Surrey",
        "Longueuil",
        "Burnaby",
        "Richmond",
        "Richmond Hill",
        "Markham",
        "Burlington",
        "Oakville",
        "Nepean",
        "Saguenay",
        "Levis",
        "Gatineau",
        "Cambridge",
        "Coquitlam",
        "Ajax",
        "Whitby",
        "Milton",
        "Langley",
        "Chatham-Kent",
      ],
      location: "",
      currentPage: 1,
      pageSize: 5,
      selectedJob: null,
      loading: false,
    };
  },
  computed: {
    jobSearchResults() {
      return this.$store.state.jobSearchResults;
    },
  },
  methods: {
    handleSearch() {
      this.$store
        .dispatch("jobSearch", {
          category: this.searchQuery || "Web Development",
          region: this.location || "Toronto",
        })
        .then(() => {
          if (this.jobSearchResults.jobs.length > 0) {
            this.selectedJob = this.jobSearchResults.jobs[0];
          }
        });
    },
    handleJobClick(job) {
      this.selectedJob = job;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    openJobPosting() {
      if (this.selectedJob && this.selectedJob.url) {
        window.open(this.selectedJob.url, "_blank");
      }
    },
    startMock() {
      this.$store.commit("setJobDetail", this.selectedJob);
      this.$router.push(`/exercise/mock/true`);
    },
  },
};
</script>

<style lang="scss" scoped>
.job-portal-container {
  margin: 0 auto;
  min-height: calc(100vh - 128px);
  display: flex;
  flex-direction: column;

  .jobContainer {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .el-card {
    background-color: var(--bg-white);
  }

  .search-container {
    padding: 20px 15px;
    display: flex;
    justify-content: center;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-base);

    .search-input {
      width: 100%;
      max-width: 600px;

      ::v-deep .el-input__prefix {
        display: flex;
        align-items: center;
        left: 10px;
      }

      .el-icon-search {
        color: var(--icon-color);
      }
    }
  }

  .portal-layout {
    flex: 1;
    overflow: hidden;
    height: calc(100vh - 200px);
    flex-direction: column;

    @media (min-width: 992px) {
      flex-direction: row;
    }
  }

  .job-list-container {
    background-color: var(--bg-white);
    border-right: none;
    width: 100% !important;
    height: auto;

    @media (min-width: 992px) {
      width: 400px !important;
      border-right: 1px solid var(--border-base);
      height: 100%;
    }

    .job-list-card {
      height: 100%;
      border-radius: 0;
      border: none;
      box-shadow: none;
      display: flex;
      flex-direction: column;

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        flex-wrap: wrap;

        .header-title {
          font-size: 18px;
          font-weight: bold;
          color: var(--text-primary);
          margin-right: 10px;
        }

        .job-count {
          font-size: 14px;
          color: var(--text-des);
        }
      }

      .job-list-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 320px);
        overflow: auto;
      }

      .job-item {
        padding: 15px;
        border-bottom: 1px solid var(--border-base);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: var(--bg-light-grey);
        }

        &.selected {
          background-color: var(--bg-tertiary-light);
          border-left: 3px solid var(--primary);
        }

        .job-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 5px;
          color: var(--text-primary);
        }

        .job-company {
          font-size: 14px;
          color: var(--text-blue);
          margin-bottom: 8px;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 15px;
          font-size: 13px;
          color: var(--text-des);

          span {
            display: flex;
            align-items: center;

            i {
              margin-right: 5px;
              font-size: 12px;
            }
          }
        }
      }

      .pagination-container {
        padding: 15px 0;
        margin-top: auto;
        display: flex;
        justify-content: center;
        border-top: 1px solid var(--border-base);

        ::v-deep .el-pagination {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    }
  }

  .job-details-container {
    padding: 20px;
    background-color: var(--bg-white);
    height: auto;
    min-height: 400px;

    @media (min-width: 992px) {
      height: 100%;
    }

    .job-details-card {
      min-height: calc(100% - 10px);
      border-radius: 4px;

      .details-header {
        h2 {
          color: var(--text-primary);
          margin-bottom: 5px;
          font-size: 22px;

          @media (min-width: 768px) {
            font-size: 24px;
          }
        }

        .company-name {
          color: var(--text-blue);
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;

          @media (min-width: 768px) {
            font-size: 20px;
          }
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 20px;
          color: var(--text-des);
          font-size: 14px;

          span {
            display: flex;
            align-items: center;

            i {
              margin-right: 5px;
              color: var(--icon-color);
            }
          }
        }
      }

      .info-notice {
        border-left: 3px solid var(--border-base);
        transition: all 0.3s ease;
        margin-bottom: 25px;
        padding: 15px;
        background-color: var(--bg-grey);
        border-radius: 4px;
        color: var(--text-des);

        i {
          color: var(--primary);
          margin-right: 8px;
        }
        strong {
          font-weight: 600;
        }
      }

      .job-description {
        line-height: 1.6;
        color: var(--text-p);

        h4 {
          color: var(--text-primary);
          margin-top: 20px;
          margin-bottom: 10px;
          font-size: 18px;
        }

        ul {
          padding-left: 20px;
        }
      }

      .action-buttons {
        margin-top: 30px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .el-button {
          flex: 1 1 100%;
          margin-left: 0;

          @media (min-width: 480px) {
            flex: 1 1 auto;
          }
        }

        .external-link-btn {
          background-color: var(--btn-primary);
          border-color: var(--btn-primary);

          &:hover {
            background-color: var(--btn-primary-hover);
            border-color: var(--btn-primary-hover);
          }
        }

        .apply-btn {
          background-color: var(--btn-success);
          border-color: var(--btn-success);

          &:hover {
            background-color: var(--btn-success-hover);
            border-color: var(--btn-success-hover);
          }
        }
      }
    }

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border: none;
      box-shadow: none;
      min-height: 300px;

      .empty-content {
        color: var(--text-des);
        padding: 20px;

        i {
          color: var(--icon-color);
          margin-bottom: 15px;
        }

        h3 {
          color: var(--text-primary);
          margin-bottom: 10px;
          font-size: 18px;
        }

        p {
          max-width: 400px;
          margin: 0 auto;
        }
      }
    }
  }
}

// Mobile-first responsive adjustments
@media (max-width: 767px) {
  .job-portal-container {
    .search-container {
      padding: 15px;
    }

    .job-list-container {
      .job-list-card {
        .job-item {
          padding: 12px;

          .job-meta {
            gap: 8px;
          }
        }
      }
    }

    .job-details-container {
      padding: 15px;

      .job-details-card {
        .details-header {
          h2 {
            font-size: 20px;
          }

          .company-name {
            font-size: 16px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .job-portal-container {
    .job-list-container {
      .job-list-card {
        .list-header {
          flex-direction: column;
          align-items: flex-start;

          .job-count {
            margin-top: 5px;
          }
        }
      }
    }

    .job-details-container {
      .job-details-card {
        .action-buttons {
          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
