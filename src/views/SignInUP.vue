<template>
  <div class="login-container pageContainer">
    <div class="login-card" v-if="loginFlag && !forgotPasswordFlag">
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
        <p class="forgot-password text-link">
          <span class="" @click="forgotPasswordFlag = true"
            >Forgot your password?</span
          >
        </p>
      </el-form>
      <el-button
        class="default-btn"
        type="primary"
        @click="handleLogin"
        style="width: 100%"
      >
        Log in
      </el-button>
      <p class="signup-link">
        Don't have an account yet?
        <span class="text-link" @click="loginFlag = false"
          >Sign up for free</span
        >
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
        class="default-btn"
        type="primary"
        @click="handleSignup"
        style="width: 100%"
      >
        Create account
      </el-button>
      <p class="signup-link">
        By clicking "Create account" or "Continue with Google", you agree to the
        <router-link to="/termofuse" class="term text-link"
          >Terms of Service</router-link
        >
        and
        <router-link to="/privacypolicy" class="term text-link"
          >Privacy Policy</router-link
        >.
      </p>
      <p class="signup-link">
        Already a member?
        <span
          class="text-link"
          @click="
            loginFlag = true;
            reload();
          "
          >Log in</span
        >
      </p>
    </div>

    <div class="login-card" v-if="forgotPasswordFlag">
      <h2 class="title">Forgot password</h2>
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
      <el-form
        :model="forgotPasswordForm"
        :rules="forgotPasswordFormRules"
        ref="forgotPasswordForm"
      >
        <el-form-item prop="email" v-if="!isPasswordReset">
          <el-input
            v-model="forgotPasswordForm.email"
            placeholder="Enter your email"
            class="field-input"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword1" v-if="isPasswordReset">
          <el-input
            v-model="forgotPasswordForm.newPassword1"
            type="password"
            class="field-input"
            placeholder="Enter password"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword2" v-if="isPasswordReset">
          <el-input
            v-model="forgotPasswordForm.newPassword2"
            type="password"
            class="field-input"
            placeholder="Re-enter the password above"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        class="default-btn"
        type="primary"
        @click="handleForgotPassword"
        style="width: 100%"
      >
        Submit
      </el-button>
      <p class="signup-link">
        Already a member?
        <span
          class="text-link"
          @click="
            $router.push('/signinup');
            loginFlag = true;
            forgotPasswordFlag = false;
            reload();
          "
          >Log in</span
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      loginFlag: true,
      forgotPasswordFlag: false,
      loginForm: { email: "", password: "" },
      signupForm: { username: "", email: "", password1: "", password2: "" },
      forgotPasswordForm: { email: "", newPassword1: "", newPassword2: "" },
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
          { validator: this.validatePasswordComplexity, trigger: "blur" },
        ],
        password2: [
          {
            required: true,
            message: "Confirm password required",
            trigger: "blur",
          },
          {
            validator: this.validatePasswordMatch,
            trigger: "blur",
          },
        ],
      },
      forgotPasswordFormRules: {
        ...(this.$route.params.id && this.$route.params.token
          ? {
              newPassword1: [
                {
                  required: true,
                  message: "Password required",
                  trigger: "blur",
                },
                { validator: this.validatePasswordComplexity, trigger: "blur" },
              ],
              newPassword2: [
                {
                  required: true,
                  message: "Confirm password required",
                  trigger: "blur",
                },
                {
                  validator: this.validatePasswordResetMatch,
                  trigger: "blur",
                },
              ],
            }
          : {
              email: [
                {
                  required: true,
                  message: "Email required",
                  trigger: "blur",
                },
                { validator: this.validateEmail, trigger: "blur" },
              ],
            }),
      },
    };
  },
  computed: {
    loginResponse: function () {
      return this.$store.state.loginResponse;
    },
    loginFromRoute: function () {
      return this.$store.state.loginFromRoute;
    },
    signupResponse: function () {
      return this.$store.state.signupResponse;
    },
    id: function () {
      return this.$route.params.id;
    },
    token: function () {
      return this.$route.params.token;
    },
    isPasswordReset: function () {
      return this.id && this.token;
    },
    billingProfile: function () {
      return this.$store.state.billingProfile;
    },
  },
  mounted() {
    if (this.isPasswordReset) {
      this.forgotPasswordFlag = true;
    }
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
      if (value !== this.signupForm.password1) {
        callback(new Error("Passwords do not match"));
      } else {
        callback();
      }
    },
    validatePasswordResetMatch(rule, value, callback) {
      if (value !== this.forgotPasswordForm.newPassword1) {
        callback(new Error("Passwords do not match"));
      } else {
        callback();
      }
    },
    validateEmail(rule, value, callback) {
      if (value !== "") {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        regex.test(value) ? callback() : callback(new Error("Invalid email"));
      } else {
        callback();
      }
    },
    handleGoogleLogin() {
      // const clientId =
      //   "1031504744342-761b45kg0q0d7c31s1udvsqovqqo71of.apps.googleusercontent.com";
      // const redirectUri = "https://jobace.ca/api/auth/google/callback/";
      // const scope = "openid email profile";
      // const state = Math.random().toString(36).substring(2);

      // const url =
      //   "https://accounts.google.com/o/oauth2/v2/auth" +
      //   `?client_id=${clientId}` +
      //   `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      //   `&response_type=code` +
      //   `&scope=${encodeURIComponent(scope)}` +
      //   `&access_type=offline` +
      //   `&state=${state}`;

      // window.location.href = url;

      window.location.href = "https://jobace.ca/api/google_authentication/";
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("login", this.loginForm)
            .then(() => {
              Promise.all([
                this.$store.dispatch("getUserInfo"),
                this.$store.dispatch("getBillingProfile"),
              ]).then(() => {
                this.$store.commit("setLoginStatus", true);
                this.$router.push(this.loginFromRoute);
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
    handleForgotPassword() {
      this.$refs.forgotPasswordForm.validate((valid) => {
        if (valid) {
          if (this.isPasswordReset) {
            let data = {
              id: this.id,
              token: this.token,
              new_password: this.forgotPasswordForm.newPassword1,
            };
            this.$store.dispatch("passwordResetConfirm", data).then(() => {
              this.$confirm(
                "Password reset successfully, please login.",
                "Success",
                {
                  confirmButtonText: "Okay",
                  cancelButtonText: "Cancel",
                  type: "warning",
                  center: true,
                }
              ).then(() => {
                this.loginFlag = true;
                this.forgotPasswordFlag = false;
              });
            });
          } else {
            this.$store
              .dispatch("forgotPassword", {
                email: this.forgotPasswordForm.email,
              })
              .then(() => {
                this.$confirm(
                  "Password reset link sent, please check you email.",
                  "Success",
                  {
                    confirmButtonText: "Okay",
                    cancelButtonText: "Cancel",
                    type: "warning",
                    center: true,
                  }
                ).then(() => {
                  this.$router.push("/");
                });
              });
          }
        } else {
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

  .login-card {
    background-color: var(--bg-white);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 480px;

    .title {
      text-align: center;
      margin-bottom: 1.5rem !important;
      font-size: 1.5rem;
    }

    .google-btn {
      margin-bottom: 1rem;
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

      &::before,
      &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: var(--border-base);
      }

      span {
        margin: 0 1rem;
      }
    }

    .field-input {
      .el-input__inner {
        padding: 0.8rem;
        border-radius: 0.5rem;
        font-size: 1rem;
      }
    }

    .forgot-password {
      text-align: right;
      font-size: 0.9rem;
      margin-bottom: 10px;
      span {
        text-decoration: none;
        cursor: pointer;
      }
    }

    .signup-link {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
      span {
        text-decoration: none;
        cursor: pointer;
      }
      .term {
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
