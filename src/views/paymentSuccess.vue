<template>
  <div class="payment-success-container pageContainer">
    <el-card class="success-card">
      <div class="success-content">
        <i class="el-icon-success success-icon"></i>
        <h1 class="success-title">Payment Successful!</h1>
        <p class="success-message">
          Thank you for your purchase. Your transaction is complete.
        </p>
        <div v-if="canCloseProgrammatically">
          <p class="success-instruction">
            This window will close automatically in {{ countdown }} seconds...
          </p>
          <el-button
            type="primary"
            class="close-button default-btn success-btn"
            @click="closeWindow"
          >
            Close Now
          </el-button>
        </div>
        <div v-else>
          <p class="success-instruction">
            Please manually close this window to return to the application.
          </p>
          <el-button class="default-btn" type="primary" @click="redirectToApp">
            Return to Application
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canCloseProgrammatically: false,
      countdown: 5,
      timer: null,
    };
  },
  methods: {
    checkCloseAbility() {
      // Try to close a test window to check if we have permission
      const testWindow = window.open("", "_self");
      this.canCloseProgrammatically = !!testWindow;
      if (testWindow) testWindow.close();
    },
    closeWindow() {
      if (this.canCloseProgrammatically) {
        window.close();
      }
    },
    redirectToApp() {
      this.$router.push("/");
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.closeWindow();
        }
      }, 1000);
    },
  },
  mounted() {
    this.checkCloseAbility();
    if (this.canCloseProgrammatically) {
      this.startCountdown();
    }
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  margin: 0 auto;
  min-height: calc(100vh - 128px);
  padding: 300px 20px 20px 20px;
  display: flex;
  flex-direction: column;

  .success-card {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: var(--bg-grey);

    .success-content {
      padding: 40px;
      text-align: center;

      .success-icon {
        font-size: 60px;
        color: var(--success);
        margin-bottom: 20px;
      }

      .success-title {
        color: var(--success);
        margin-bottom: 20px;
      }

      .success-message {
        font-size: 16px;
        margin-bottom: 10px;
      }

      .success-instruction {
        margin-bottom: 25px;
      }

      .close-button {
        padding: 12px 24px;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
}
</style>
