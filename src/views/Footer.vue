<template>
  <div class="footer-container">
    <div class="container">
      <!-- 顶部链接与社交图标 -->
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <div class="link-group">
            <router-link to="/termofuse" class="me-3 link text-decoration-none"
              >Terms of Service</router-link
            >
            <router-link
              to="/privacypolicy"
              class="me-3 link text-decoration-none"
              >Privacy Policy</router-link
            >
          </div>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="social-icons">
            <i class="fa-brands fa-instagram me-2"></i>
            <i class="fa-brands fa-linkedin me-2"></i>
            <i class="fa-brands fa-tiktok"></i>
          </div>
        </div>
      </div>

      <!-- 底部Logo部分 -->
      <div class="row align-items-center">
        <div class="col-6" @click="$router.push({ path: '/', hash: '#home' })">
          <img src="../assets/long_logo_white.png" class="logo" alt="logo" />
        </div>
        <div class="col-6 contact">
          Copyright © 2025 JobACE. All Rights Reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BootstrapFooter",
};
</script>

<!-- height: 123px -->
<style scoped lang="scss">
.footer-container {
  background: var(--bg-tertiary);
  color: var(--text-white);
  padding: 20px 0;
}
.logo {
  width: 170px !important;
  height: 40px !important;
}
.upload-icon {
  font-size: 30px;
}
.contact {
  text-align: right;
}
.social-icons:hover {
  cursor: pointer;
}
.link-group {
  .link {
    color: var(--text-white);
  }
}
</style>
