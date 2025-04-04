<template>
  <div class="footer-container">
    <div class="container">
      <!-- 顶部链接与社交图标 -->
      <div class="row align-items-center mb-4">
        <div class="col-md-6">
          <div class="link-group">
            <span class="me-3">Cookies Policy</span>
            <span class="me-3">Legal Terms</span>
            <span class="me-3">Privacy Policy</span>
          </div>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="social-icons">
            <i class="fab fa-facebook-f me-2"></i>
            <i class="fab fa-x-twitter me-2"></i>
            <i class="fab fa-instagram me-2"></i>
            <i class="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      <!-- 底部Logo部分 -->
      <div class="row align-items-center">
        <div class="col-12">
          <i class="fas fa-upload upload-icon me-3"></i>
          <div class="c2a-info d-inline-block">
            <h3 class="mb-1">C2A</h3>
            <p class="fs-6 m-0">Creative Communication Agency</p>
          </div>
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

<style scoped>
.footer-container {
  background: #6a5acd;
  color: white;
  padding: 20px 0;
}

.upload-icon {
  font-size: 30px;
}
</style>

<!-- 需先安装并引入Bootstrap -->
<!-- 在main.js中添加 -->
import 'bootstrap/dist/css/bootstrap.min.css' import 'bootstrap'
