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
        {
          id: 3,
          title: "Backend Developer",
          company: "CodeWorks",
          location: "New York, NY",
          postTime: "2023-06-01",
          description:
            "We are seeking a skilled Backend Developer to build and maintain our server-side applications. You will work with Node.js and Express to create robust APIs.",
          requirements: [
            "5+ years of experience with Node.js",
            "Strong knowledge of Express.js and MongoDB",
            "Experience with RESTful API design",
            "Familiarity with Docker and Kubernetes is a plus",
            "Bachelor's degree in Computer Science or related field",
          ],
          externalUrl: "https://codeworks.com/careers/backend-dev",
        },
        {
          id: 4,
          title: "Data Scientist",
          company: "DataInsights",
          location: "Austin, TX",
          postTime: "2023-06-10",
          description:
            "Join our data team to analyze large datasets and extract meaningful insights. You will use Python and SQL to build predictive models and data visualizations.",
          requirements: [
            "3+ years of experience in data analysis",
            "Proficiency in Python and SQL",
            "Experience with data visualization tools like Tableau or Power BI",
            "Strong analytical skills and attention to detail",
            "Master's degree in Data Science or related field is preferred",
          ],
          externalUrl: "https://datainsights.com/jobs/data-scientist",
        },
        {
          id: 5,
          title: "DevOps Engineer",
          company: "CloudSolutions",
          location: "Seattle, WA",
          postTime: "2023-06-15",
          description:
            "We are looking for a DevOps Engineer to automate our deployment processes and manage our cloud infrastructure. You will work with AWS and CI/CD tools.",
          requirements: [
            "3+ years of experience in DevOps",
            "Strong knowledge of AWS services",
            "Experience with Docker and Kubernetes",
            "Familiarity with CI/CD pipelines",
            "Bachelor's degree in Computer Science or related field",
          ],
          externalUrl: "https://cloudsolutions.com/careers/devops-engineer",
        },
        {
          id: 6,
          title: "Product Manager",
          company: "InnovateTech",
          location: "Boston, MA",
          postTime: "2023-06-20",
          description:
            "Join our product team to define and execute the product roadmap. You will work closely with stakeholders to gather requirements and prioritize features.",
          requirements: [
            "5+ years of experience in product management",
            "Strong understanding of Agile methodologies",
            "Excellent communication and leadership skills",
            "Experience with product management tools like JIRA or Trello",
            "Bachelor's degree in Business or related field is preferred",
          ],
          externalUrl: "https://innovatetech.com/jobs/product-manager",
        },
        {
          id: 7,
          title: "Mobile App Developer",
          company: "AppCreators",
          location: "Chicago, IL",
          postTime: "2023-06-25",
          description:
            "We are seeking a Mobile App Developer to create engaging mobile applications for iOS and Android. You will work with React Native and Firebase.",
          requirements: [
            "3+ years of experience in mobile app development",
            "Proficiency in React Native or Flutter",
            "Experience with Firebase or similar backend services",
            "Strong understanding of mobile UI/UX principles",
            "Bachelor's degree in Computer Science or related field",
          ],
          externalUrl: "https://appcreators.com/careers/mobile-app-dev",
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
      min-height: calc(100% - 40px);
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
