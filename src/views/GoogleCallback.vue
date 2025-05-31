<template>
  <div class="google-auth-container pageContainer">
    <div class="auth-card">
      <div class="logo-container">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          class="google-logo me-2"
        />
      </div>

      <div class="loading-section">
        <div class="loading-spinner"></div>
        <h5 class="loading-text">Verifying your Google account...</h5>
        <p class="loading-subtext">
          Please wait, this usually takes just a few seconds
        </p>
        <el-button class="default-btn" type="primary" @click="$router.push('/')"
          >Click to home</el-button
        >
      </div>

      <div class="error-message" v-if="error">
        <p>{{ error }}</p>
        <el-button class="default-btn" type="primary" @click="retryLogin"
          >Try Again</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
    };
  },
  mounted() {
    this.handleGoogleAuth();
  },
  computed: {
    loginFromRoute: function () {
      return this.$store.state.loginFromRoute;
    },
  },
  methods: {
    async handleGoogleAuth() {
      // const query = new URLSearchParams(window.location.search);
      // const code = query.get("code");

      // if (!code) {
      //   this.error =
      //     "Authorization code not found. Please try logging in again.";
      //   return;
      // }

      // try {
      //   await this.$store.dispatch("googleLogin", code);
      //   this.$router.push(this.loginFromRoute);
      // } catch (err) {
      //   console.error("Google login failed:", err);
      //   this.error =
      //     "Login failed: " +
      //     (err.response?.data?.message ||
      //       "Please check your connection and try again");
      // }

      let token = this.$route.query.access;
      if (token) {
        localStorage.setItem("Authorization", token);
        Promise.all([
          this.$store.dispatch("getUserInfo"),
          this.$store.dispatch("getBillingProfile"),
        ]).then(() => {
          this.$store.commit("setLoginStatus", true);
          this.$router.push(this.loginFromRoute || "/");
        });
      }
    },
    retryLogin() {
      this.error = null;
      this.handleGoogleAuth();
    },
  },
};
</script>

<style lang="scss" scoped>
.google-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 128px);
  animation: gradientBG 15s ease infinite;
  padding: 20px;
}

.auth-card {
  background: var(--bg-white);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  transition: all 0.3s ease;
}

.logo-container {
  margin-bottom: 30px;
}

.google-logo {
  height: 40px;
}

.loading-section {
  margin: 20px 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid var(--border-base);
  border-top: 4px solid var(--border-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.loading-subtext {
  font-size: 14px;
}

.error-message {
  color: var(--error);
  margin-top: 20px;
  p {
    margin-bottom: 15px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
