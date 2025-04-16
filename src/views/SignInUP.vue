<template>
  <div class="login-container">
    <div class="login-card" v-if="loginFlag">
      <h2 class="title">Welcome back.</h2>
      <el-button
        class="google-btn"
        @click="handleGoogleLogin"
        style="width: 100%; padding: 0.8rem"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          class="google-logo me-2"
        />
        Continue with Google
      </el-button>
      <div class="or-divider">OR</div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="Enter your email"
            class="field-input"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            class="field-input"
            placeholder="Enter password"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        class="continue-btn"
        :disabled="!loginForm.email || !loginForm.password"
        @click="handleLogin"
        style="width: 100%"
      >
        Log in
      </el-button>
      <p class="signup-link">
        Don't have an account yet?
        <span @click="loginFlag = false">Sign up for free</span>
      </p>
    </div>

    <div class="login-card" v-if="!loginFlag">
      <h2 class="title">Let's get started!</h2>
      <el-button
        class="google-btn"
        @click="handleGoogleLogin"
        style="width: 100%; padding: 0.8rem"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
          class="google-logo me-2"
        />
        Continue with Google
      </el-button>
      <div class="or-divider">OR</div>
      <el-form :model="signupForm" :rules="signupFormRules" ref="signupForm">
        <el-form-item prop="username">
          <el-input
            v-model="signupForm.username"
            placeholder="Enter username"
            class="field-input"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="signupForm.email"
            placeholder="Enter your email"
            class="field-input"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password1">
          <el-input
            v-model="signupForm.password1"
            type="password"
            class="field-input"
            placeholder="Enter password"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
            v-model="signupForm.password2"
            type="password"
            class="field-input"
            placeholder="Re-enter the password above"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        class="continue-btn"
        :disabled="
          !signupForm.username ||
          !signupForm.email ||
          !signupForm.password1 ||
          !signupForm.password2
        "
        @click="handleSignup"
        style="width: 100%"
      >
        Create account
      </el-button>
      <p class="signup-link">
        By clicking "Create account" or "Continue with Google", you agree to the
        <span @click="loginFlag = true">Terms & Conditions</span>
        and
        <span @click="loginFlag = true">Privacy Policy</span>.
      </p>
      <p class="signup-link">
        Already a member?
        <span @click="loginFlag = true">Log in</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFlag: true,
      loginForm: { email: "", password: "" },
      signupForm: { username: "", email: "", password1: "", password2: "" },
      loginFormRules: {
        email: [
          {
            required: true,
            message: "Email required",
            trigger: "blur",
          },
          { validator: this.validateEmail, trigger: "blur" },
        ],
        password: [
          { required: true, message: "Password required", trigger: "blur" },
        ],
      },
      signupFormRules: {
        username: [
          { required: true, message: "Username required", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "Email required",
            trigger: "blur",
          },
          { validator: this.validateEmail, trigger: "blur" },
        ],
        password1: [
          { required: true, message: "Password required", trigger: "blur" },
        ],
        password2: [
          {
            required: true,
            message: "Confirm password required",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    loginResponse: function () {
      return this.$store.state.loginResponse;
    },
    signupResponse: function () {
      return this.$store.state.signupResponse;
    },
  },
  methods: {
    validateEmail(rule, value, callback) {
      if (value !== "") {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        regex.test(value) ? callback() : callback(new Error("Invalid email"));
      } else {
        callback();
      }
    },
    handleGoogleLogin() {
      window.location.href = "https://jobcoach.top/api/google_authentication/";
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("login", this.loginForm)
            .then(() => {
              this.$store.dispatch("getUserInfo").then(() => {
                this.$store.commit("setLoginStatus", true);
                this.$router.push("/account");
              });
            })
            .catch(() => {
              this.$alert(
                this.loginResponse.message || "Incorrect Email or Password",
                "Error",
                {
                  confirmButtonText: "Ok",
                }
              );
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSignup() {
      this.$refs.signupForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch("signup", this.signupForm).then(() => {
            if (this.signupResponse.success == true) {
              this.$alert(
                "Your registration was successful. Please check your email and activate your account.",
                "Success",
                {
                  confirmButtonText: "Ok",
                }
              ).then(() => {
                this.labelPosition = "left";
              });
            } else {
              let errorMessage = "";
              const errors = this.signupResponse.errors;
              if (errors) {
                for (const field in errors) {
                  if (Object.prototype.hasOwnProperty.call(errors, field)) {
                    const fieldErrors = errors[field];
                    if (Array.isArray(fieldErrors)) {
                      fieldErrors.forEach((error) => {
                        errorMessage += error + "\n";
                      });
                    }
                  }
                }
              }
              this.$alert(errorMessage, "Error", {
                confirmButtonText: "Ok",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 480px;

    .title {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .google-btn {
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 18px;
      font-weight: bold;

      .google-logo {
        height: 26px;
        width: auto;
      }
    }

    .or-divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      text-align: center;
      color: #666;

      &::before,
      &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #ddd;
      }

      span {
        margin: 0 1rem;
        color: #666;
      }
    }

    .field-input {
      .el-input__inner {
        padding: 0.8rem;
        border-radius: 0.5rem;
        font-size: 1rem;
      }
    }

    .continue-btn {
      background: #ddd;
      color: #666;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background 0.3s;

      &:not(:disabled) {
        background: #409eff;
        color: white;
      }
    }

    .signup-link {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
      .link {
        color: #409eff;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      span {
        color: #409eff;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .login-card {
    padding: 1.5rem;
    width: 90%;
  }
}
</style>
