<template>
  <div class="accountContainer">
    <div class="loginContainer col-11 col-md-6 col-xl-4">
      <h2 class="text-center pt-5 pb-5">Hello {{ userProfile.username }}!</h2>
      <div class="row">
        <el-descriptions
          title="User Information"
          class="col-10 mx-auto"
          :column="1"
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
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    userProfile: function () {
      return this.$store.state.userProfile;
    },
  },
  methods: {
    logout() {
      this.$store.commit("setLoginStatus", false);
      sessionStorage.clear();
      localStorage.clear();
    },
  },
};
</script>

<style lang="scss" scoped>
.accountContainer {
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
</style>
