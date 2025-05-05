<template>
  <div class="account-dashboard">
    <div class="user-profile-container">
      <!-- 用户头像和信息卡片 -->
      <el-card class="profile-card" shadow="hover">
        <div class="profile-header">
          <el-avatar :size="120" class="user-avatar">
            {{ userProfile.username.charAt(0).toUpperCase() }}
          </el-avatar>
          <h2 class="user-greeting">Hello, {{ userProfile.username }}!</h2>
          <p class="user-role">{{ userProfile.role || "Premium Member" }}</p>
        </div>

        <!-- 用户统计信息 -->
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-value">
              {{ userProfile.numbers_of_interview_practice || 0 }}
            </div>
            <div class="stat-label">Interviews</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ userProfile.average_score || "0.0" }}
            </div>
            <div class="stat-label">Avg Score</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ userProfile.percentage_improvement + "%" || "+0%" }}
            </div>
            <div class="stat-label">Improvement</div>
          </div>
        </div>

        <div class="mt-5">
          <el-button
            type="warning"
            icon="el-icon-switch-button"
            @click="logout"
          >
            Logout
          </el-button>
        </div>
      </el-card>

      <!-- 用户详细信息 -->
      <el-card class="details-card" shadow="hover">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="Personal Info" name="info">
            <el-descriptions title="Account Details" :column="1" border>
              <el-descriptions-item label="Username">
                <el-tag>{{ userProfile.username }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="Email">
                {{ userProfile.email }}
              </el-descriptions-item>
              <el-descriptions-item label="Password">
                ****************
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="showPasswordUpdateDialog"
                ></el-button>
              </el-descriptions-item>
              <el-descriptions-item label="User ID">{{
                userProfile.id
              }}</el-descriptions-item>
              <el-descriptions-item label="Member Since">
                {{ formatDate(userProfile.date_joined || new Date()) }}
              </el-descriptions-item>
              <el-descriptions-item label="Last Login">
                {{ formatDate(userProfile.last_login || new Date()) }}
              </el-descriptions-item>
              <el-descriptions-item label="Subscription">
                <el-tag
                  :type="userProfile.subscription ? 'success' : 'warning'"
                >
                  {{ userProfile.subscription ? "Active" : "Free Tier" }}
                </el-tag>
                <el-button
                  v-if="!userProfile.subscription"
                  type="text"
                  size="mini"
                  @click="showUpgradeDialog"
                >
                  Upgrade
                </el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="Activity" name="activity">
            <div class="activity-section">
              <h4>Recent Activity</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in userActivities"
                  :key="index"
                  :timestamp="formatTime(activity.timestamp)"
                  placement="top"
                >
                  <el-card>
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.description }}</p>
                    <div v-if="activity.score" class="activity-score">
                      <el-rate
                        v-model="activity.score"
                        disabled
                        :max="10"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                        score-template="{value}"
                      />
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Settings" name="settings">
            <div class="settings-section">
              <el-form label-position="top">
                <el-form-item label="Notification Preferences">
                  <el-checkbox-group v-model="notificationSettings">
                    <el-checkbox label="email">Email Notifications</el-checkbox>
                    <el-checkbox label="newsletter"
                      >Monthly Newsletter</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="Dark Mode">
                  <el-switch
                    v-model="darkMode"
                    active-text="Dark"
                    inactive-text="Light"
                    disabled
                  ></el-switch>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveSettings"
                    >Save Settings</el-button
                  >
                </el-form-item>
              </el-form>

              <!-- <div class="danger-zone">
                <h4>Danger Zone</h4>
                <el-button type="danger" plain @click="showDeleteDialog">
                  Delete Account
                </el-button>
              </div> -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 底部操作按钮 -->
      <!-- <div class="action-buttons">
        <el-button type="primary" icon="el-icon-edit" @click="showEditProfile">
          Edit Profile
        </el-button>
        <el-button
          type="info"
          icon="el-icon-setting"
          @click="activeTab = 'settings'"
        >
          Settings
        </el-button>
        <el-button type="warning" icon="el-icon-switch-button" @click="logout">
          Logout
        </el-button>
      </div> -->
    </div>

    <!-- 各种对话框 -->
    <el-dialog
      title="Update Passowrd"
      :visible.sync="passwordUpdateDialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="passwordUpdateForm"
        :rules="passwordUpdateRules"
        ref="passwordUpdateForm"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="passwordUpdateForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Old Password" prop="password">
          <el-input
            type="password"
            v-model="passwordUpdateForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="password1">
          <el-input
            type="password"
            v-model="passwordUpdateForm.password1"
          ></el-input>
        </el-form-item>
        <el-form-item label="Confirm New Password" prop="password2">
          <el-input
            type="password"
            v-model="passwordUpdateForm.password2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordUpdateDialogVisible = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="updatePassword">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 其他对话框类似... -->
  </div>
</template>

<script>
import { format } from "date-fns";

export default {
  data() {
    return {
      activeTab: "info",
      passwordUpdateDialogVisible: false,
      passwordUpdateForm: {
        email: "",
        password: "",
        password1: "",
        password2: "",
      },
      passwordUpdateRules: {
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "Old password required", trigger: "blur" },
        ],
        password1: [
          { required: true, message: "New password required", trigger: "blur" },
          { validator: this.validatePasswordComplexity, trigger: "blur" },
        ],
        password2: [
          {
            required: true,
            message: "Confirm new password required",
            trigger: "blur",
          },
          {
            validator: this.validatePasswordMatch,
            trigger: "blur",
          },
        ],
      },
      darkMode: false,
      notificationSettings: ["email"],
      userActivities: [
        {
          title: "Completed Technical Interview",
          description:
            "You completed a technical interview for Frontend Developer position",
          timestamp: new Date(Date.now() - 3600000),
          score: 8,
        },
        {
          title: "Received Feedback",
          description: "Your last interview feedback is now available",
          timestamp: new Date(Date.now() - 86400000),
          score: 7,
        },
        {
          title: "Account Updated",
          description: "You changed your profile picture",
          timestamp: new Date(Date.now() - 172800000),
        },
      ],
    };
  },
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    },
    billingTransactions() {
      return this.$store.state.billingTransactions;
    },
  },
  methods: {
    validatePasswordComplexity(rule, value, callback) {
      // 长度验证
      if (value.length < 8) {
        callback(new Error("Password must be at least 8 characters"));
        return;
      }

      // 复杂度验证
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);

      if (!hasUpperCase) {
        callback(new Error("Must contain at least one uppercase letter"));
      } else if (!hasLowerCase) {
        callback(new Error("Must contain at least one lowercase letter"));
      } else if (!hasNumber) {
        callback(new Error("Must contain at least one number"));
      } else {
        callback(); // 验证通过
      }
    },
    validatePasswordMatch(rule, value, callback) {
      if (value !== this.passwordUpdateForm.password1) {
        callback(new Error("Passwords do not match"));
      } else {
        callback();
      }
    },
    formatDate(date) {
      return format(new Date(date), "MMMM d, yyyy");
    },
    formatTime(date) {
      return format(new Date(date), "h:mm a, MMM d");
    },
    logout() {
      this.$store.commit("setLoginStatus", false);
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/");
    },
    showPasswordUpdateDialog() {
      this.passwordUpdateForm.email = this.userProfile.email;
      this.passwordUpdateDialogVisible = true;
    },
    updatePassword() {
      this.$refs.passwordUpdateForm.validate((valid) => {
        if (valid) {
          // API call to update email
          this.$store
            .dispatch("changePassword", {
              old_password: this.passwordUpdateForm.password,
              new_password: this.passwordUpdateForm.password1,
            })
            .then(() => {
              this.$message.success(
                "Email updated successfully, please login again."
              );
              this.passwordUpdateDialogVisible = false;
              this.logout();
            })
            .catch(() => {
              this.$message.error("Email updated failed, please try again!");
              this.passwordUpdateDialogVisible = false;
            });
        }
      });
    },
    showEditProfile() {
      this.$message.info("Edit profile feature coming soon!");
    },
    showUpgradeDialog() {
      // this.$message.info("Subscription upgrade feature coming soon!");
      this.$router.push({ path: "/", hash: `#price` });
    },
    showDeleteDialog() {
      this.$confirm(
        "This will permanently delete your account. Continue?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "Account deleted",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deletion canceled",
          });
        });
    },
    saveSettings() {
      this.$message.success("Settings saved successfully");
    },
  },
};
</script>

<style lang="scss" scoped>
.account-dashboard {
  min-height: calc(100vh - 123px);
  // background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 150px 20px 20px 20px;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );
}

.user-profile-container {
  max-width: 1300px;
  width: 100%;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  padding: 30px 0;
  text-align: center;

  .profile-header {
    margin-bottom: 20px;

    .user-avatar {
      margin-bottom: 15px;
      background-color: #409eff;
      color: white;
      font-size: 48px;
    }

    .user-greeting {
      margin: 10px 0 5px;
      color: #303133;
    }

    .user-role {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .user-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .stat-item {
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
      }

      .stat-label {
        font-size: 12px;
        color: #909399;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }
}

.details-card {
  padding: 20px;

  .profile-tabs {
    ::v-deep .el-tabs__item {
      font-weight: 500;
    }
  }

  .activity-section {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;

    .activity-score {
      margin-top: 10px;
    }
  }

  .settings-section {
    .danger-zone {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #f56c6c;

      h4 {
        color: #f56c6c;
        margin-bottom: 15px;
      }
    }
  }
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}
</style>
