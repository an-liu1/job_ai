<template>
  <div class="job-portal-container pageContainer">
    <div class="jobContainer">
      <!-- Search Bar -->
      <div class="search-container">
        <el-input
          placeholder="Search jobs by title, company or location..."
          v-model="searchQuery"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <i slot="prefix" class="el-icon-search"></i>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </div>

      <el-container class="portal-layout">
        <!-- Left Sidebar - Job List -->
        <el-aside width="400px" class="job-list-container">
          <el-card class="job-list-card">
            <div slot="header" class="list-header">
              <span class="header-title">Job Opportunities</span>
              <span class="job-count"
                >{{ filteredJobs.length }} jobs found</span
              >
            </div>

            <div class="job-list-content">
              <div
                v-for="job in paginatedJobs"
                :key="job.id"
                class="job-item"
                :class="{ selected: selectedJob && selectedJob.id === job.id }"
                @click="handleJobClick(job)"
              >
                <div class="job-title">{{ job.title }}</div>
                <div class="job-company">{{ job.company }}</div>
                <div class="job-meta">
                  <span class="location"
                    ><i class="el-icon-location"></i> {{ job.location }}</span
                  >
                  <span class="post-time"
                    ><i class="el-icon-time"></i>
                    {{ formatDate(job.postTime) }}</span
                  >
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
                  :total="filteredJobs.length"
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
              <h3 class="company-name">{{ selectedJob.company }}</h3>
              <div class="job-meta">
                <span class="location"
                  ><i class="el-icon-location"></i>
                  {{ selectedJob.location }}</span
                >
                <span class="post-time"
                  ><i class="el-icon-time"></i> Posted
                  {{ formatDate(selectedJob.postTime) }}</span
                >
              </div>
            </div>

            <div class="job-description">
              <h4>Job Description</h4>
              <p>{{ selectedJob.description }}</p>

              <h4>Requirements</h4>
              <ul>
                <li
                  v-for="(req, index) in selectedJob.requirements"
                  :key="index"
                >
                  {{ req }}
                </li>
              </ul>
            </div>

            <div class="action-buttons">
              <el-button
                type="primary"
                @click="openJobPosting"
                class="external-link-btn default-btn"
                icon="el-icon-chat-round"
              >
                Start Mock Interview
              </el-button>

              <el-button
                type="success"
                @click="navigateToApplication"
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
      jobs: [
        {
          id: 1,
          title: "Frontend Developer",
          company: "TechCorp",
          location: "San Francisco, CA",
          postTime: "2023-05-15",
          description:
            "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user interfaces using Vue.js and Element UI.",
          requirements: [
            "3+ years of experience with Vue.js",
            "Strong knowledge of JavaScript, HTML, and CSS",
            "Experience with Element UI or similar component libraries",
            "Understanding of RESTful APIs",
            "Bachelor's degree in Computer Science or related field",
          ],
          externalUrl: "https://techcorp.com/careers/frontend-dev",
        },
        {
          id: 2,
          title: "UX Designer",
          company: "DesignHub",
          location: "Remote",
          postTime: "2023-05-20",
          description:
            "Join our design team to create beautiful and intuitive user experiences for our products. You will work closely with product managers and developers.",
          requirements: [
            "Portfolio demonstrating UI/UX design skills",
            "2+ years of experience in UX design",
            "Proficiency in Figma or Sketch",
            "Understanding of user-centered design principles",
            "Excellent communication skills",
          ],
          externalUrl: "https://designhub.com/jobs/ux-designer",
        },
      ],
      searchQuery: "",
      currentPage: 1,
      pageSize: 10,
      selectedJob: null,
      loading: false,
    };
  },
  computed: {
    filteredJobs() {
      if (!this.searchQuery) return this.jobs;
      return this.jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredJobs.slice(start, end);
    },
  },
  methods: {
    handleSearch() {
      // In a real application, you would make an API call here
      // For now, we'll just reset to page 1
      this.currentPage = 1;
      // Select first job if available
      if (this.filteredJobs.length > 0) {
        this.selectedJob = this.filteredJobs[0];
      } else {
        this.selectedJob = null;
      }
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
      if (this.selectedJob && this.selectedJob.externalUrl) {
        window.open(this.selectedJob.externalUrl, "_blank");
      }
    },
    navigateToApplication() {
      this.$router.push(`/apply/${this.selectedJob.id}`);
    },
  },
  mounted() {
    // Select first job by default if available
    if (this.filteredJobs.length > 0) {
      this.selectedJob = this.filteredJobs[0];
    }
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
    width: 1300px;
    margin: 0 auto;
  }
  
  .el-card {
    background-color: var(--bg-white);
  }

  .search-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-base);

    .search-input {
      width: 600px;

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
  }

  .job-list-container {
    background-color: var(--bg-white);
    border-right: 1px solid var(--border-base);
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

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

        .header-title {
          font-size: 18px;
          font-weight: bold;
          color: var(--text-primary);
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
        overflow: hidden;
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
          gap: 15px;
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
      }
    }
  }

  .job-details-container {
    padding: 20px;
    background-color: var(--bg-white);
    height: 100%;
    overflow-y: auto;

    .job-details-card {
      min-height: calc(100% - 40px);
      border-radius: 4px;

      .details-header {
        h2 {
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .company-name {
          color: var(--text-blue);
          margin-top: 0;
          margin-bottom: 15px;
        }

        .job-meta {
          display: flex;
          gap: 20px;
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

      .job-description {
        line-height: 1.6;
        color: var(--text-p);

        h4 {
          color: var(--text-primary);
          margin-top: 20px;
          margin-bottom: 10px;
        }

        ul {
          padding-left: 20px;
        }
      }

      .action-buttons {
        margin-top: 30px;
        display: flex;
        gap: 15px;

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

      .empty-content {
        color: var(--text-des);

        i {
          color: var(--icon-color);
          margin-bottom: 15px;
        }

        h3 {
          color: var(--text-primary);
          margin-bottom: 10px;
        }
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 992px) {
  .job-portal-container {
    .portal-layout {
      flex-direction: column;
      height: auto;

      .job-list-container {
        width: 100% !important;
        height: 400px;
      }

      .job-details-container {
        height: auto;
      }
    }
  }
}
</style>
