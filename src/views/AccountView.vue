<template>
  <div class="account-dashboard pageContainer">
    <div class="user-profile-container">
      <!-- User Profile Card -->
      <el-card class="profile-card" shadow="hover">
        <div class="profile-header">
          <el-avatar :size="120" class="user-avatar">
            {{ userProfile.username?.charAt(0).toUpperCase() || "A" }}
          </el-avatar>
          <h2 class="user-greeting">Hello, {{ userProfile.username }}!</h2>
          <p class="user-role">
            {{
              userProfile.subscription_status == "active"
                ? "Premium Member"
                : ""
            }}
          </p>
        </div>

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
            class="default-btn warning-btn"
            type="primary"
            icon="el-icon-switch-button"
            @click="logout"
            >Logout</el-button
          >
        </div>
      </el-card>

      <!-- Details Card with Tabs -->
      <el-card class="details-card" shadow="hover">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <!-- Personal Info Tab -->
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
              <!-- <el-descriptions-item label="User ID">{{
                userProfile.id
              }}</el-descriptions-item> -->
              <el-descriptions-item label="Member Since">
                {{ formatDate(userProfile.date_joined || new Date()) }}
              </el-descriptions-item>
              <el-descriptions-item label="Last Login">
                {{ formatDate(userProfile.last_login || new Date()) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- Subscription Tab -->
          <el-tab-pane label="Subscription" name="subscription">
            <div class="subscription-section">
              <el-descriptions title="Subscription Plans" :column="1" border>
                <!-- Monthly Unlimited Plan -->
                <el-descriptions-item label="Monthly Unlimited">
                  <el-tag
                    :type="
                      userProfile.subscription_status == 'active'
                        ? 'success'
                        : 'info'
                    "
                    style="margin-right: 10px"
                  >
                    {{
                      userProfile.subscription_status == "active"
                        ? "ACTIVE"
                        : "INACTIVE"
                    }}
                  </el-tag>
                  <el-button
                    v-if="userProfile.subscription_status !== 'active'"
                    type="text"
                    size="mini"
                    @click="upgradePlan"
                  >
                    Subscribe
                  </el-button>
                </el-descriptions-item>

                <el-descriptions-item
                  label="Monthly Unlimited Start Date"
                  v-if="userProfile.subscription_status == 'active'"
                >
                  <div class="subscription-details">
                    {{ formatDate(userProfile.subscription_created) }}
                  </div>
                </el-descriptions-item>

                <el-descriptions-item
                  label="Monthly Unlimited End Date"
                  v-if="userProfile.subscription_period_end"
                >
                  <div class="subscription-details">
                    {{ formatDate(userProfile.subscription_period_end) }}
                  </div>
                </el-descriptions-item>

                <!-- Credit Balance (from billingProfile) -->
                <el-descriptions-item label="Credit Balance">
                  <el-tag type="warning" style="margin-right: 10px">
                    {{ billingProfile.credit_balance || 0 }} credits
                  </el-tag>
                  <el-button type="text" size="mini" @click="upgradePlan">
                    Add Credits
                  </el-button>
                </el-descriptions-item>

                <!-- Trial Information (from billingProfile) -->
                <el-descriptions-item label="Free Trial Feature interviews">
                  {{ billingProfile.trial_practice_used || 0 }} used of
                  {{
                    (billingProfile.trial_practice_left || 0) +
                    (billingProfile.trial_practice_used || 0)
                  }}
                  total
                </el-descriptions-item>

                <el-descriptions-item label="Free Trial Mock Interviews">
                  {{ billingProfile.trial_mock_used || 0 }} used of
                  {{
                    (billingProfile.trial_mock_left || 0) +
                    (billingProfile.trial_mock_used || 0)
                  }}
                  total
                </el-descriptions-item>

                <el-descriptions-item
                  label="Free Mock interview Final Assessment Report"
                >
                  {{ billingProfile.trial_assessment_report_used || 0 }} used of
                  {{
                    (billingProfile.trial_assessment_report_left || 0) +
                    (billingProfile.trial_assessment_report_used || 0)
                  }}
                  total
                </el-descriptions-item>

                <el-descriptions-item label="Free Trial End Date">
                  {{ formatDate(billingProfile.trial_end_date) }}
                </el-descriptions-item>
              </el-descriptions>

              <div
                class="subscription-actions"
                v-if="userProfile.subscription_status === 'active'"
              >
                <el-button
                  class="default-btn error-btn"
                  type="primary"
                  @click="showCancelDialog"
                >
                  Cancel Monthly Subscription
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- Transactions Tab -->
          <el-tab-pane label="Transactions" name="transactions">
            <div class="transactions-section">
              <div class="transaction-filters">
                <el-select
                  v-model="transactionFilter"
                  placeholder="Filter Transactions"
                  clearable
                >
                  <el-option label="All" value="all"></el-option>
                  <el-option
                    label="Consumption"
                    value="consumption"
                  ></el-option>
                  <el-option
                    label="Credit Purchases"
                    value="credit"
                  ></el-option>
                  <el-option
                    label="Subscriptions"
                    value="subscription"
                  ></el-option>
                </el-select>
              </div>

              <el-timeline>
                <el-timeline-item
                  v-for="(transaction, index) in filteredTransactions"
                  :key="index"
                  :timestamp="formatTime(transaction.created_at)"
                  placement="top"
                  :type="getTransactionType(transaction)"
                >
                  <el-card shadow="hover" class="transaction-card">
                    <div class="transaction-header">
                      <div class="transaction-type">
                        <el-tag :type="getTransactionTagType(transaction)">
                          {{ formatTransactionType(transaction.item_type) }}
                        </el-tag>
                      </div>
                      <div class="transaction-amount">
                        <span
                          v-if="transaction.credits_purchased"
                          class="credit-amount"
                        >
                          +{{ transaction.credits_purchased }} credits
                        </span>
                        <span
                          v-if="transaction.credits_consumed"
                          class="credit-consume"
                        >
                          -{{ transaction.credits_consumed }} credits
                        </span>
                        <span
                          v-if="transaction.subscription_plan"
                          class="subscription-plan"
                        >
                          {{ transaction.subscription_plan }}
                        </span>
                      </div>
                    </div>

                    <div class="transaction-details">
                      <div class="transaction-id">
                        <span>Transaction #{{ transaction.id }}</span>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>

              <div
                class="transaction-pagination"
                v-if="billingTransactions.length > 5"
              >
                <el-pagination
                  small
                  layout="prev, pager, next"
                  :total="billingTransactions.length"
                  :page-size="5"
                  @current-change="handlePageChange"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>

          <!-- Settings Tab -->
          <el-tab-pane label="Settings" name="settings">
            <div class="settings-section">
              <el-form label-position="top">
                <el-form-item label="Notification Preferences">
                  <el-checkbox-group v-model="notificationSettings" disabled>
                    <el-checkbox label="email">Email Notifications</el-checkbox>
                    <el-checkbox label="newsletter"
                      >Monthly Newsletter</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>

                <el-button
                  class="default-btn"
                  type="primary"
                  @click="saveSettings"
                >
                  Save Settings
                </el-button>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- Password Update Dialog -->
    <el-dialog
      title="Update Password"
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

    <!-- Cancel Subscription Dialog -->
    <el-dialog
      title="Cancel Subscription"
      :visible.sync="cancelDialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <p>
        Are you sure you want to cancel your subscription? You'll lose access to
        premium features at the end of your billing period.
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogVisible = false">No, Keep It</el-button>
        <el-button type="danger" @click="cancelSubscription"
          >Yes, Cancel</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { format } from "date-fns";

export default {
  data() {
    return {
      activeTab: "info",
      passwordUpdateDialogVisible: false,
      cancelDialogVisible: false,
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
      notificationSettings: [],
      transactionFilter: "all",
      currentPage: 1,
      pageSize: 5,
    };
  },
  mounted() {
    Promise.all([
      this.$store.dispatch("getUserInfo"),
      this.$store.dispatch("getBillingProfile"),
      this.$store.dispatch("getBillingTransactions"),
    ]).then(() => {
      let tab = this.$route.params.tab;
      if (tab) {
        this.activeTab = tab;
      }
    });
  },
  computed: {
    userProfile() {
      return this.$store.state.userProfile;
    },
    billingProfile() {
      return this.$store.state.billingProfile;
    },
    billingTransactions() {
      return this.$store.state.billingTransactions;
    },
    cancelSubscriptionResponse() {
      return this.$store.state.cancelSubscriptionResponse;
    },
    filteredTransactions() {
      // Ensure billingTransactions is always an array
      let transactions = this.billingTransactions || [];

      // Additional safety check
      if (!Array.isArray(transactions)) {
        transactions = [];
      }

      if (this.transactionFilter === "credit") {
        return transactions
          .filter((t) => t.item_type === "CREDIT_PACKAGES")
          .slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
      } else if (this.transactionFilter === "subscription") {
        return transactions
          .filter((t) => t.item_type === "SUBSCRIPTIONS")
          .slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
      } else if (this.transactionFilter === "consumption") {
        return transactions
          .filter((t) => t.type === "consumption")
          .slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
      }

      return transactions.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  methods: {
    validatePasswordComplexity(rule, value, callback) {
      if (value.length < 8) {
        callback(new Error("Password must be at least 8 characters"));
        return;
      }

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
        callback();
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
      // Return empty string for invalid inputs
      if (!date) return "";

      const parsedDate = new Date(date);
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) return "";

      return format(parsedDate, "MMMM d, yyyy");
    },
    formatTime(date) {
      return format(new Date(date), "h:mm a, MMMM d, yyyy");
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
    showCancelDialog() {
      this.cancelDialogVisible = true;
    },
    updatePassword() {
      this.$refs.passwordUpdateForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("changePassword", {
              old_password: this.passwordUpdateForm.password,
              new_password: this.passwordUpdateForm.password1,
            })
            .then(() => {
              this.$message.success(
                "Password updated successfully, please login again."
              );
              this.passwordUpdateDialogVisible = false;
              this.logout();
            })
            .catch(() => {
              this.$message.error("Password update failed, please try again!");
              this.passwordUpdateDialogVisible = false;
            });
        }
      });
    },
    cancelSubscription() {
      this.$store.dispatch("cancelSubscription").then(() => {
        this.$store.dispatch("getBillingProfile").then(() => {
          if (this.cancelSubscriptionResponse.period_end_date) {
            this.$message.success(
              "Subscription will be canceled at the end of current billing period"
            );
          }
        });
      });
      this.cancelDialogVisible = false;
    },
    upgradePlan() {
      this.$router.push({ path: "/", hash: `#price` });
    },
    saveSettings() {
      this.$message.success("Settings saved successfully");
    },

    formatTransactionType(type) {
      const types = {
        CREDIT_PACKAGES: "Credit Purchase",
        SUBSCRIPTIONS: "Subscription",
        mock: "Mock Interview Consume",
        common: "Common Practice Consume",
        star: "Behavioral Practice Consume",
        tough: "Tough Practice Consume",
      };
      return types[type] || type;
    },
    getTransactionType(transaction) {
      return transaction.item_type === "SUBSCRIPTIONS" ? "primary" : "success";
    },
    getTransactionTagType(transaction) {
      return transaction.item_type === "SUBSCRIPTIONS" ? "" : "success";
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="scss" scoped>
.account-dashboard {
  min-height: calc(100vh - 128px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 150px 20px 20px 20px;
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
  background-color: var(--bg-grey);

  .profile-header {
    margin-bottom: 20px;

    .user-avatar {
      margin-bottom: 15px;
      background-color: var(--avatar-color);
      color: var(--text-white);
      font-size: 48px;
    }

    .user-greeting {
      margin: 10px 0 5px;
    }

    .user-role {
      margin: 0;
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
        color: var(--text-blue);
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-des);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }
}

.details-card {
  padding: 20px;
  background-color: var(--bg-grey);

  .profile-tabs {
    ::v-deep .el-tabs__item {
      font-weight: 500;
    }
  }

  .subscription-section {
    .subscription-actions {
      margin-top: 30px;
      text-align: center;
    }

    .el-descriptions {
      margin-bottom: 20px;
    }
  }
  .subscription-details {
    margin-top: 8px;
    margin: 4px 0;
    font-size: 13px;
  }

  .transactions-section {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 10px;

    .transaction-filters {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .transaction-card {
      margin-bottom: 15px;

      .transaction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .transaction-type {
          flex: 1;
        }

        .transaction-amount {
          font-weight: bold;

          .credit-amount {
            color: var(--success);
          }
          .credit-consume {
            color: var(--error);
          }
          .subscription-plan {
            color: var(--primary);
          }
        }
      }

      .transaction-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 13px;
        color: var(--text-des);

        .transaction-id {
          flex: 1;
        }
      }
    }
  }

  .transaction-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
