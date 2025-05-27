<template>
  <div class="pricing-plans">
    <div class="section-header">
      <h2 class="main-title">Choose Your Perfect Plan</h2>
      <p class="sub-desc">
        Select the most suitable option based on your needs
      </p>
    </div>

    <!-- <div class="plan-tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        :class="{ active: activeTab === index }"
      >
        <span class="tab-icon" :class="'icon-' + index"></span>
        {{ tab }}
      </button>
    </div> -->

    <div class="plan-list">
      <!-- Free Plan -->
      <div class="plan-card free" :class="{ highlighted: activeTab === 0 }">
        <div class="popular-badge">Best for Starters</div>
        <div class="plan-header">
          <h3 class="plan-title">7-day Free Trial</h3>
          <p class="plan-desc">Experience basic features</p>
        </div>

        <div class="price-wrap">
          <span class="price-num">$0</span>
          <!-- <small class="price-unit">7-day free trial</small> -->
          <small class="price-unit"></small>
        </div>

        <!-- <div class="trial-offer">
          <span class="trial-icon">🎁</span>
          7-day free trial
        </div> -->

        <button class="cta-btn" @click="handleStartFree">
          <span class="btn-icon">🚀</span>
          Get Started
        </button>

        <div class="divider"></div>

        <ul class="features-list">
          <li>
            <span class="feature-icon">✓</span>6 Feature interviews (up to 5
            questions)
          </li>
          <li>
            <span class="feature-icon">✓</span>1 Mock interview (up to 10
            questions)
          </li>
          <li>
            <span class="feature-icon">✓</span>1 Mock interview final assessment
            report
          </li>
          <li>
            <span class="feature-icon">✓</span>Use on any day within 7 days
            after sign up
          </li>
          <li><span class="feature-icon">✓</span>Real-time voice feedback</li>
          <li><span class="feature-icon">✓</span>Instant evaluation details</li>
          <li><span class="feature-icon">✓</span>Community support</li>
          <li><span class="feature-icon">✓</span>No credit card needed</li>
        </ul>
      </div>

      <!-- Credit -->
      <div class="plan-card credit" :class="{ highlighted: activeTab === 1 }">
        <div class="popular-badge">Most Flexible</div>
        <div class="plan-header">
          <h3 class="plan-title">Credit</h3>
          <p class="plan-desc">Flexible access to premium features</p>
        </div>

        <div class="credit-options">
          <div
            class="credit-option"
            v-for="(option, index) in tokenOptions"
            :key="index"
          >
            <input
              type="radio"
              name="credit"
              :id="'credit' + index"
              :value="option.value"
              v-model="selectedCreditOption"
            />
            <label :for="'credit' + index">
              <span class="amount">{{ option.amount }} Credits</span>
              <span class="price"
                >${{ option.price }}
                <span class="per-unit"
                  >= ${{ (option.price / option.amount).toFixed(2) }}/C</span
                >
                <!-- <span class="per-unit"
                  >≈ ${{
                    (
                      option.price /
                      (option.amount + (option.bonus || 0))
                    ).toFixed(2)
                  }}/C</span
                > -->
              </span>
              <span class="bonus" v-if="option.bonus"
                >{{ option.bonus }} Bonus</span
              >
            </label>
          </div>
        </div>

        <button class="cta-btn" @click="handleGetCredits(false)">
          <span class="btn-icon">🎁</span>
          Get Credits
        </button>

        <div class="credit-usage">
          <h4>Credit Usage</h4>
          <div class="usage-item">
            <span class="usage-name">Feature interview practice</span>
            <span class="usage-cost">2 Credits/session</span>
          </div>
          <div class="usage-item">
            <span class="usage-name">Mock interview</span>
            <span class="usage-cost">3 Credits/session</span>
          </div>
          <div class="usage-item">
            <span class="usage-name">Final accessment</span>
            <span class="usage-cost">1 Credit/session</span>
          </div>
        </div>
      </div>

      <!-- Subscription -->
      <div class="plan-card premium" :class="{ highlighted: activeTab === 2 }">
        <div class="popular-badge">Best Deal</div>
        <div class="plan-header">
          <h3 class="plan-title">Premium</h3>
          <p class="plan-desc">Unlimited access to all features</p>
        </div>

        <div class="price-wrap">
          <span class="price-num">$29</span>
          <small class="price-unit">per month</small>
          <div class="saving-info">Only $0.97 per day</div>
        </div>

        <button class="cta-btn" @click="handleGetCredits(true)">
          <span class="btn-icon">⭐</span>
          Subscribe Now
        </button>

        <div class="divider"></div>

        <ul class="features-list">
          <li>
            <span class="feature-icon">✓</span>Unlimited practice sessions
          </li>
          <li>
            <span class="feature-icon">✓</span>Unlimited Feature interview
          </li>
          <li><span class="feature-icon">✓</span>Unlimited Mock interview</li>
          <li>
            <span class="feature-icon">✓</span>Unlimited interview final
            assessment
          </li>
          <li><span class="feature-icon">✓</span>Advanced AI feedback</li>
          <li><span class="feature-icon">✓</span>Real-time voice feedback</li>
          <li><span class="feature-icon">✓</span>Instant evaluation details</li>
          <li>
            <span class="feature-icon">✓</span>Industry-specific questions
          </li>
          <li><span class="feature-icon">✓</span>Interview analytics</li>
          <li><span class="feature-icon">✓</span>Community support</li>
        </ul>
      </div>
    </div>

    <!-- Payment Confirmation Dialog -->
    <el-dialog
      title="Payment in Progress"
      :visible.sync="paymentDialogVisible"
      width="500px"
      class="beautified-payment-dialog"
    >
      <div class="payment-modal">
        <p>We've opened the payment page in a new tab.</p>
        <p>After completing your payment:</p>
        <ol>
          <li>Return to this window</li>
          <li>Click the button below when payment is complete</li>
        </ol>
        <p class="note">
          Note: It may take a few moments to process your payment.
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="closePaymentDialog">
          Cancel
        </el-button>
        <el-button
          type="primary"
          class="confirm-btn"
          @click="handlePaymentComplete"
        >
          I've Completed Payment
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 1,
      tabs: ["Free", "Credits", "Subscription"],
      selectedCreditOption: "10_credits",
      tokenOptions: [
        { amount: 10, price: 10, bonus: 0, value: "10_credits" },
        { amount: 20, price: 18, bonus: 2, value: "20_credits" },
        { amount: 30, price: 24, bonus: 6, value: "30_credits" },
      ],
      paymentDialogVisible: false,
    };
  },
  computed: {
    checkOutUrl() {
      return this.$store.state.checkOutUrl.checkout_url;
    },
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
    loginFromRoute: function () {
      return this.$store.state.loginFromRoute;
    },
  },
  methods: {
    handleStartFree() {
      if (!this.loginStatus) {
        this.$store.commit("setLogininFrom", this.$route.fullPath);
        this.$router.push("/signinup");
        return;
      }
      this.$router.push("/exercise/feature");
    },
    handleGetCredits(isMonthlyPlan) {
      if (!this.loginStatus) {
        this.$store.commit("setLogininFrom", this.$route.fullPath);
        this.$router.push("/signinup");
        return;
      }
      let key = isMonthlyPlan ? "monthly_unlimited" : this.selectedCreditOption;
      let type = isMonthlyPlan ? "SUBSCRIPTIONS" : "CREDIT_PACKAGES";
      this.$store
        .dispatch("createCheckoutSession", {
          item_type: type,
          item_key: key,
        })
        .then(() => {
          if (!this.checkOutUrl) {
            throw new Error("No checkout URL received from server");
          }
          window.open(this.checkOutUrl, "_blank");
          this.paymentDialogVisible = true;
        });
    },
    handlePaymentComplete() {
      this.$router.push("/account/subscription");
    },
    closePaymentDialog() {
      this.paymentDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pricing-plans {
  padding: 80px 100px;
  margin: 0 auto;

  .section-header {
    text-align: center;
    margin-bottom: 50px;

    .main-title {
      font-size: 36px;
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #3498db, #646cff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .sub-desc {
      font-size: 18px;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .plan-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    gap: 10px;

    button {
      padding: 12px 24px;
      margin: 0 5px;
      border: none;
      background: white;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      color: #5a6a7e;

      &.active {
        background: #646cff;
        color: white;
        box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
        transform: translateY(-2px);
      }

      .tab-icon {
        margin-right: 8px;
        font-size: 18px;

        &.icon-0 {
          color: #3498db;
        }
        &.icon-1 {
          color: #9b59b6;
        }
        &.icon-2 {
          color: #2ecc71;
        }
        &.icon-3 {
          color: #e67e22;
        }
      }

      &.active .tab-icon {
        color: white !important;
      }
    }
  }

  .plan-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    padding: 0 20px;
  }

  .plan-card {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);

    &.highlighted {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      border-color: rgba(100, 108, 255, 0.2);
    }

    &.premium {
      border-top: 4px solid #646cff;

      .cta-btn {
        background: linear-gradient(135deg, #646cff, #9b59b6);
      }
    }

    &.free {
      border-top: 4px solid #3498db;

      .cta-btn {
        background: linear-gradient(135deg, #3498db, #2ecc71);
      }
    }

    &.pay-per-use {
      border-top: 4px solid #9b59b6;

      .cta-btn {
        background: linear-gradient(135deg, #9b59b6, #e67e22);
      }
    }

    &.credit {
      border-top: 4px solid #e67e22;

      .cta-btn {
        background: linear-gradient(135deg, #e67e22, #f1c40f);
      }
    }

    .popular-badge {
      position: absolute;
      top: 15px;
      right: -30px;
      background: #ff4444;
      color: white;
      padding: 3px 30px;
      font-size: 12px;
      font-weight: 600;
      transform: rotate(45deg);
      width: 120px;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .plan-header {
      margin-bottom: 20px;
      text-align: center;

      .plan-title {
        font-size: 24px;
        color: #2c3e50;
        margin-bottom: 8px;
        font-weight: 700;
      }

      .plan-desc {
        color: #7f8c8d;
        font-size: 15px;
      }
    }

    .price-wrap {
      text-align: center;
      margin: 25px 0;

      .price-num {
        font-size: 42px;
        font-weight: 800;
        color: #2c3e50;
        line-height: 1;
      }

      .price-unit {
        font-size: 16px;
        color: #7f8c8d;
        display: block;
        margin-top: 5px;
      }

      .original-price {
        text-decoration: line-through;
        color: #95a5a6;
        font-size: 14px;
        margin-top: 5px;
      }

      .saving-info {
        font-size: 14px;
        color: #2ecc71;
        font-weight: 600;
        margin-top: 10px;
      }
    }

    .trial-offer {
      background: rgba(46, 204, 113, 0.1);
      color: #2ecc71;
      padding: 8px;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      margin: 15px 0;
      font-size: 14px;

      .trial-icon {
        margin-right: 5px;
      }
    }

    .cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 16px;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
      margin: 25px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .btn-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .divider {
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0)
      );
      margin: 20px 0;
    }

    .bulk-discount {
      margin: 20px 0;
      border-radius: 8px;
      overflow: hidden;

      .discount-option {
        display: flex;
        justify-content: space-between;
        padding: 12px 15px;
        background: rgba(155, 89, 182, 0.05);
        margin-bottom: 8px;
        border-radius: 6px;
        position: relative;
        align-items: center;

        &.best-value {
          background: rgba(155, 89, 182, 0.1);
          border: 1px solid rgba(155, 89, 182, 0.3);

          .best-tag {
            position: absolute;
            top: -10px;
            right: -10px;
            background: #e67e22;
            color: white;
            padding: 2px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
          }
        }

        .amount {
          font-weight: 600;
          color: #2c3e50;
        }

        .price {
          font-weight: 700;
          color: #9b59b6;
        }

        .per-unit {
          font-size: 12px;
          color: #7f8c8d;
          margin-left: 5px;
        }
      }
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;

      li {
        margin: 12px 0;
        display: flex;
        align-items: center;
        color: #34495e;

        .feature-icon {
          color: #2ecc71;
          margin-right: 10px;
          font-weight: bold;
        }
      }
    }

    .credit-options {
      margin: 20px 0;

      .credit-option {
        margin-bottom: 10px;

        input {
          display: none;

          &:checked + label {
            border-color: #646cff;
            background: rgba(100, 108, 255, 0.05);
            box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
          }
        }

        label {
          display: block;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;

          &:hover {
            border-color: #646cff;
          }

          .amount {
            font-weight: bold;
            color: #2c3e50;
            font-size: 16px;
          }

          .price {
            color: #646cff;
            font-size: 18px;
            font-weight: 700;
            margin: 5px 0;
            display: block;
          }

          .bonus {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #2ecc71;
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
          }

          .per-unit {
            font-size: 12px;
            color: #7f8c8d;
          }
        }
      }
    }

    .credit-usage {
      margin-top: 20px;
      background: rgba(230, 126, 34, 0.05);
      padding: 15px;
      border-radius: 8px;

      h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #e67e22;
        font-size: 16px;
      }

      .usage-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;

        .usage-name {
          color: #5a6a7e;
        }

        .usage-cost {
          color: #e67e22;
          font-weight: 600;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .pricing-plans {
    padding: 40px 15px;

    .section-header {
      .main-title {
        font-size: 28px;
      }

      .sub-desc {
        font-size: 16px;
      }
    }

    .plan-tabs {
      flex-wrap: wrap;

      button {
        padding: 10px 15px;
        font-size: 14px;
      }
    }

    .plan-list {
      grid-template-columns: 1fr;
    }

    .plan-card {
      padding: 25px;

      &.highlighted {
        transform: none;
      }
    }
  }
}
/* Payment Dialog Styles */
.beautified-payment-dialog {
  ::v-deep .el-dialog {
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    margin-top: 35vh !important;
  }

  ::v-deep .el-dialog__header {
    border-bottom: 1px solid var(--border-base);
    padding: 15px 20px;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
  }

  ::v-deep .el-dialog__body {
    padding: 20px;
  }

  .payment-modal {
    text-align: left;
    font-size: 14px;
    line-height: 1.6;
    color: #5a5a5a;

    p {
      margin: 8px 0;
    }

    ol {
      padding-left: 24px;
      margin: 12px 0;

      li {
        margin-bottom: 6px;
        padding-left: 4px;
      }
    }

    .note {
      font-size: 13px;
      color: #888;
      margin-top: 16px;
      font-style: italic;
    }
  }

  .dialog-footer {
    text-align: right;

    .el-button {
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .confirm-btn {
      background-color: #409eff;
      border-color: #409eff;

      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }

    .cancel-btn {
      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }
  }
}
</style>
