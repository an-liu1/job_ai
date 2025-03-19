<template>
  <div>
    <p>{{ token }}</p>
    <p>132165</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: null,
    };
  },
  mounted() {
    // 获取 URL 中的 access 参数（即 token）
    this.token = this.$route.query.access;
    console.log("获取到的 Token:", this.token);
    // 这里可以添加处理 token 的逻辑，例如存储到本地存储或发送到后端验证
    if (this.token) {
      // 示例：将 token 存储到本地存储
      localStorage.setItem("Authorization", this.token);
      this.$store.dispatch("getUserInfo").then(() => {
        this.$store.commit("setLoginStatus", true);
        this.$router.push("/account");
      });
    }
  },
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
</style>
