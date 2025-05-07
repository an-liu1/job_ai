<template>
  <div>
    <!-- Start Home Section -->
    <div class="home-section">
      <div class="d-table">
        <div class="d-table-cell">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-7 col-md-12">
                <div class="main-banner-content">
                  <h1>Ace Your Interviews With Personalized AI Coaching</h1>
                  <p>
                    Experience realistic, voice-based interview simulations that
                    tailor to your needs and boost your performance.
                  </p>
                  <div class="banner-btn">
                    <a class="default-btn-two" @click="startPractice"
                      >Free Practice <span></span
                    ></a>
                    <!-- <a class="default-btn-one" @click="startPractice"
                      >Free Practice <span></span
                    ></a>
                    <a class="default-btn-two" @click="startMock"
                      >Mock Interview <span></span
                    ></a> -->
                  </div>
                </div>
              </div>
              <div class="col-lg-5 col-md-12" ref="tiltElement">
                <div class="banner-image">
                  <img src="../../assets/img/home-font.png" alt="image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="creative-shape">
        <img src="../../assets/img/home-bottom-shape.png" alt="svg shape" />
      </div>
    </div>
    <!-- End Home Section -->
  </div>
</template>

<script>
import VanillaTilt from "vanilla-tilt";
export default {
  mounted() {
    if (this.$refs.tiltElement) {
      VanillaTilt.init(this.$refs.tiltElement, {
        max: 25, // 最大倾斜角度
        speed: 400, // 倾斜动画的速度
        glare: false, // 是否启用眩光效果
        "max-glare": 0.5, // 最大眩光强度
      });
    }
  },
  computed: {
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
  },
  methods: {
    startPractice: function () {
      if (this.loginStatus) {
        this.$router.push("/exercise/common");
      } else {
        this.$store.commit("setLogininFrom", this.$route.fullPath);
        this.$router.push("/signinup");
      }
    },
    // startMock: function () {
    //   this.$router.push("/exercise/mock");
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/style.css";
.home-section {
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 800px;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #0295ff,
    #3cabff,
    #76c1ff,
    #b0d7ff,
    #ebefff
  );

  .creative-shape {
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: auto;
    z-index: -1;
  }

  .banner-image {
    text-align: center;
    padding-top: 50px;
  }
}

.main-banner-content {
  padding-top: 50px;

  h1 {
    color: #ffffff;
    font-size: 68px;
    font-weight: 700;
    margin: 0 0 20px;
  }

  h6 {
    color: #ff9800;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }

  p {
    color: #ffffff;
    font-size: 20px;
    margin: 0;
  }

  .banner-btn {
    margin-top: 25px;
  }
}
@media (max-width: 769px) {
  .home-section {
    padding-top: 260px;
  }
}
@media (max-width: 431px) {
  .home-section {
    padding-top: 300px;
  }
}
@media (max-width: 391px) {
  .home-section {
    padding-top: 380px;
  }
}
</style>
