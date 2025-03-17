<template>
  <div>
    <div class="withebox"></div>
    <div class="loginContainer col-11 col-md-6 col-xl-4" v-if="loginStatus">
      <h2 class="text-center pt-5 pb-5">Hello {{ userProfile.username }}!</h2>
      <div class="row">
        <el-descriptions
          title="User Information"
          class="col-10 mx-auto"
          column="1"
        >
          <el-descriptions-item label="Username">{{
            userProfile.username
          }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{
            userProfile.email
          }}</el-descriptions-item>
          <el-descriptions-item label="Id">{{
            userProfile.id
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="text-center pb-5">
        <el-button type="primary" round @click="logout">log out</el-button>
      </div>
    </div>
    <div class="loginContainer col-11 col-md-6 col-xl-4" v-else>
      <div class="logo">
        <el-image :src="logoImg"></el-image>
      </div>
      <div class="lgoinplace">
        <div class="text-center">
          <el-radio-group v-model="labelPosition" size="small">
            <el-radio-button label="left">Log in</el-radio-button>
            <el-radio-button label="right">Sign up</el-radio-button>
          </el-radio-group>
        </div>
        <div style="margin: 20px"></div>
        <div v-if="labelPosition == 'left'">
          <el-form
            :label-position="labelPosition"
            :model="loginForm"
            :rules="loginFormRules"
            ref="loginForm"
            label-width="80px"
          >
            <el-form-item label="Email:" prop="email">
              <el-input
                v-model="loginForm.email"
                type="email"
                placeholder="Enter email"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password:" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="Enter password"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="text-center pb-4">
            <el-button type="primary" round @click="login">log in</el-button>
          </div>
          <div class="login-box">
            <button @click="googleLogin" class="google-btn custom-style">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google Logo"
                class="logo"
              />
              Google 登录
            </button>
          </div>
        </div>
        <div v-if="labelPosition == 'right'">
          <el-form
            :label-position="labelPosition"
            :model="signupForm"
            :rules="signupFormRules"
            ref="signupForm"
            label-width="80px"
          >
            <el-form-item label="Username:" prop="username">
              <el-input
                v-model="signupForm.username"
                type="text"
                placeholder="Enter username"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email:" prop="email">
              <el-input
                v-model="signupForm.email"
                type="email"
                placeholder="Enter email"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password:" prop="password1">
              <el-input
                v-model="signupForm.password1"
                type="password"
                placeholder="Enter password"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password:" prop="password2">
              <el-input
                v-model="signupForm.password2"
                type="password"
                placeholder="Re-enter the password above"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="text-center pb-4">
            <el-button type="primary" round @click="signup">Sign up</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoImg: require("@/assets/logo1.png"),
      labelPosition: "left",
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
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
    userProfile: function () {
      return this.$store.state.userProfile;
    },
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
    googleLogin() {
      window.location.href = "https://jobcoach.top/api/google_authentication/";
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("login", this.loginForm)
            .then(() => {
              this.$store.dispatch("getUserInfo");
              this.$router.go(-1);
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
    signup() {
      this.$refs.signupForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch("signup", this.signupForm).then(() => {
            if (this.signupResponse.username) {
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
    logout() {
      this.$store.commit("setLoginStatus", false);
      sessionStorage.clear();
      localStorage.clear();
    },
  },
};
</script>

<style lang="scss" scoped>
.withebox {
  height: 100px;
  width: 100%;
}
.loginContainer {
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  .logo {
    width: 30%;
    margin: 0 auto;
    padding: 20px 0 0 0;
  }
  .lgoinplace {
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
  }
}
.login-box {
  display: flex;
  justify-content: right;
  .google-btn {
    display: flex;
    align-items: center;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .google-btn:hover {
    background-color: #357ae8;
  }
  .logo {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    background-color: white;
    border-radius: 50%;
    padding: 2px;
  }
}
</style>
