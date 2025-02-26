<template>
  <div>
    <h3>{{ msg }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "",
    };
  },
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
        this.msg = this.verifyEmailResponse.message;
        this.$alert(
          "Your registration was successful. Please click okay and login.",
          "Success",
          {
            confirmButtonText: "Ok",
          }
        ).then(() => {
          this.$router.push("/account");
        });
        this.$store.commit("switchLoadingStatus", false);
      })
      .catch(() => {
        this.msg =
          this.verifyEmailResponse.response?.data?.error ||
          "Invalid or expired token";
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
