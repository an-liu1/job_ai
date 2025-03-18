<template>
  <div></div>
</template>

<script>
export default {
  computed: {
    verifyEmailResponse: function () {
      return this.$store.state.verifyEmailResponse;
    },
  },
  mounted() {
    const token = this.$route.params.token;
    this.$store.commit("switchLoadingStatus", true);
    this.$store
      .dispatch("verifyEmail", token)
      .then(() => {
        this.$store.commit("switchLoadingStatus", false);
        this.$alert(this.verifyEmailResponse.message, "Success", {
          confirmButtonText: "Ok",
        }).then(() => {
          this.$store.commit("setLoginStatus", false);
          this.$router.push("/account");
        });
      })
      .catch(() => {
        this.$store.commit("switchLoadingStatus", false);
        this.$alert(
          this.verifyEmailResponse.response?.data?.error ||
            "Invalid or expired token",
          "Error",
          {
            confirmButtonText: "Ok",
          }
        );
      });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  padding-top: 200px;
}
</style>
