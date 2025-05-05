<template>
  <div class="google-container">
    <p>正在登录中...</p>
  </div>
</template>

<script>
export default {
  mounted() {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (!code) {
      console.error("没有获取到 code");
      return;
    }

    this.$store.dispatch("googleLogin", JSON.stringify({ code })).then(() => {
      this.$router.push("/account");
    });
  },
};
</script>

<style lang="scss" scoped>
.google-container {
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
</style>
