<template>
  <div class="footer-container">
    <div class="container">
      <!-- 顶部链接与社交图标 -->
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <div class="link-group">
            <span class="me-3">Terms of Service</span>
            <span class="me-3">Privacy Policy</span>
          </div>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="social-icons">
            <i class="fa-brands fa-instagram me-2"></i>
            <i class="fa-brands fa-linkedin me-2"></i>
            <i class="fa-brands fa-tiktok me-2"></i>
            <i class="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      <!-- 底部Logo部分 -->
      <div class="row align-items-center">
        <div class="col-6">
          <img src="../assets/img/logo.png" class="white-logo" alt="logo" />
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
<style scoped>
.footer-container {
  background: #0295ff;
  color: white;
  padding: 20px 0;
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
</style>
