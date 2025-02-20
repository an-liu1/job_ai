<template>
  <div>
    <div class="loginContainer" v-if="loginStatus">
      <h2 class="text-center pt-5 pb-5">Logged in</h2>
      <div class="text-center pb-5">
        <el-button type="primary" round @click="logout">log out</el-button>
      </div>
    </div>
    <div class="loginContainer" v-else>
      <div class="logo">
        <el-image :src="logoImg"></el-image>
      </div>
      <div class="lgoinplace">
        <!-- <el-radio-group v-model="labelPosition" size="small">
          <el-radio-button label="left">登录</el-radio-button>
          <el-radio-button label="right">注册</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px"></div> -->
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="loginForm"
        >
          <el-form-item label="邮箱">
            <el-input v-model="loginForm.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <!-- <el-form-item label="活动形式">
        <el-input v-model="loginForm.type"></el-input>
      </el-form-item> -->
        </el-form>
      </div>
      <div class="text-center pb-4">
        <el-button type="primary" round @click="login">log in</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoImg: require("@/assets/logo.png"),
      labelPosition: "left",
      loginForm: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.loginForm);
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
.loginContainer {
  width: 500px;
  margin: 0 auto;
  margin-top: 100px;
  background-color: #ffffff;
  border-radius: 10px;
  .logo {
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
  }
  .lgoinplace {
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
  }
}
</style>
