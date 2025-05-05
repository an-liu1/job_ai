<template>
  <div>
    <!-- Start Navbar Section -->
    <div class="navbar-section" :class="{ 'is-sticky': isSticky }">
      <!-- 响应式导航部分 -->
      <div class="techvio-responsive-nav">
        <div class="container">
          <div class="techvio-responsive-menu">
            <!--  logo  -->
            <div>
              <a @click="$router.push({ path: '/', hash: '#home' })">
                <img
                  src="../assets/long_logo_white.png"
                  class="white-logo logo"
                  alt="logo"
                  v-show="!isSticky"
                />
                <img
                  src="../assets/long_logo_dark.png"
                  class="black-logo logo"
                  alt="logo"
                  v-show="isSticky"
                />
              </a>
            </div>
            <!-- 汉堡菜单按钮 -->
            <button class="hamburger-menu" @click="toggleMenu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <!-- 响应式导航项 -->
          <div class="responsive-nav" :class="{ show: isMenuOpen }">
            <ul class="navbar-nav">
              <li class="nav-item" v-for="(i, index) in navBar" :key="index">
                <a
                  class="nav-link"
                  @click="
                    redirectTo(i.navLink, i.sectionId);
                    toggleMenu();
                  "
                  >{{ i.name }}</a
                >
                <!-- <ul class="dropdown-menu" v-if="i.name === 'Interview'">
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      @click="
                        $router.push(
                          loginStatus ? '/exercise/common' : '/signinup'
                        )
                      "
                      >Practice</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      @click="
                        $router.push(
                          loginStatus ? '/exercise/mock' : '/signinup'
                        )
                      "
                      >Mock Interview</a
                    >
                  </li>
                </ul> -->
              </li>
            </ul>
            <div
              class="other-option"
              @click="$router.push('/signinup')"
              v-if="!loginStatus"
            >
              <a class="default-btn">Sign in<span></span></a>
            </div>
            <div class="accountAvatar" @click="$router.push('/account')" v-else>
              <span>Hello,</span>
              <el-avatar>
                {{ userProfile.username?.charAt(0).toUpperCase() || "A" }}
              </el-avatar>
            </div>
          </div>
        </div>
      </div>
      <!-- 正常导航部分 -->
      <div class="techvio-nav">
        <div class="container">
          <nav class="navbar navbar-expand-md navbar-light">
            <a
              class="navbar-brand"
              @click="$router.push({ path: '/', hash: '#home' })"
            >
              <img
                src="../assets/long_logo_white.png"
                class="white-logo logo"
                alt="logo"
              />
              <img
                src="../assets/long_logo_dark.png"
                class="black-logo logo"
                alt="logo"
              />
            </a>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav">
                <li class="nav-item" v-for="(i, index) in navBar" :key="index">
                  <a
                    class="nav-link"
                    @click="redirectTo(i.navLink, i.sectionId)"
                    >{{ i.name }}</a
                  >
                  <!-- <ul class="dropdown-menu" v-if="i.name === 'Interview'">
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        @click="
                          $router.push(
                            loginStatus ? '/exercise/common' : '/signinup'
                          )
                        "
                        >Practice</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        @click="
                          $router.push(
                            loginStatus ? '/exercise/mock' : '/signinup'
                          )
                        "
                        >Mock Interview</a
                      >
                    </li>
                  </ul> -->
                </li>
              </ul>
              <div
                class="other-option"
                @click="$router.push('/signinup')"
                v-if="!loginStatus"
              >
                <a class="default-btn">Sign in<span></span></a>
              </div>
              <div
                class="accountAvatar"
                @click="$router.push('/account')"
                v-else
              >
                <span>Hello,</span>
                <el-avatar>
                  {{ userProfile.username?.charAt(0).toUpperCase() || "A" }}
                </el-avatar>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <!-- End Navbar Section -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSticky: false,
      scrollListener: null,
      isMenuOpen: false,
    };
  },
  computed: {
    navBar: function () {
      if (this.loginStatus) {
        return [
          {
            navLink: "/",
            name: "Home",
            sectionId: "home",
          },
          {
            navLink: "/exercise/feature",
            name: "Feature Interview",
            sectionId: "",
          },
          {
            navLink: "/exercise/mock",
            name: "Mock Interview",
            sectionId: "",
          },
          {
            navLink: "/history",
            name: "History",
            sectionId: "",
          },
          {
            navLink: "/",
            name: "Pricing",
            sectionId: "price",
          },
          {
            navLink: "/account",
            name: "My Account",
            sectionId: "",
          },
        ];
      } else {
        return [
          {
            navLink: "/",
            name: "Home",
            sectionId: "home",
          },
          {
            navLink: "/",
            name: "Features",
            sectionId: "features",
          },
          {
            navLink: "/",
            name: "Guide",
            sectionId: "howItWork",
          },
          {
            navLink: "/",
            name: "Interview",
            sectionId: "exercise",
          },
          {
            navLink: "/",
            name: "Why Us",
            sectionId: "why",
          },
          {
            navLink: "/",
            name: "Pricing",
            sectionId: "price",
          },
          {
            navLink: "/",
            name: "FAQ",
            sectionId: "faq",
          },
        ];
      }
    },
    userProfile: function () {
      return this.$store.state.userProfile;
    },
    loginStatus: function () {
      return this.$store.state.loginStatus;
    },
  },
  mounted() {
    // 绑定滚动事件监听器
    this.scrollListener = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeDestroy() {
    // 组件销毁前移除滚动事件监听器
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener);
    }
  },
  methods: {
    handleScroll() {
      // 使用 requestAnimationFrame 优化性能
      requestAnimationFrame(() => {
        this.isSticky = window.scrollY > 120;
      });
    },
    redirectTo(link, sectionId) {
      if (sectionId) {
        this.$router
          .push({ path: "/", hash: `#${sectionId}` })
          .then(() => {
            this.$nextTick(() => {
              const targetElement = document.getElementById(sectionId);
              if (targetElement) {
                window.scrollTo({
                  top: targetElement.offsetTop - 120,
                  behavior: "smooth",
                });
              }
            });
          })
          .catch((error) => {
            console.error("路由跳转出错:", error);
          });
      } else {
        this.$router.push(link);
      }
    },
    toggleMenu() {
      // 切换菜单显示状态
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<!-- height: 85px -->
<style lang="scss" scoped>
@import "../assets/css/style.css";

.techvio-responsive-nav {
  display: none;
}

.techvio-nav {
  padding: 15px 0;
  background-color: transparent;
  .logo {
    width: 170px !important;
    height: 40px !important;
  }
  .navbar {
    padding: 0;

    ul {
      padding-left: 0;
      list-style-type: none;
      margin-bottom: 0;
    }

    .navbar-nav {
      margin: auto;

      .nav-item {
        position: relative;
        padding: 15px 0;

        a {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          text-transform: capitalize;
          padding: 0;
          margin: 0 15px;

          i {
            position: relative;
            top: -1px;
            font-size: 10px;
            margin-left: 2px;
          }

          &:hover,
          &:focus,
          &.active {
            cursor: pointer;
          }
        }

        &:last-child a {
          margin-right: 0;
        }

        &:first-child a {
          margin-left: 0;
        }

        .dropdown-menu {
          position: absolute;
          z-index: 99;
          top: 80px;
          left: 0;
          width: 230px;
          padding: 0;
          display: block;
          opacity: 0;
          visibility: hidden;
          overflow: hidden;
          border-radius: 3px;
          background-color: #ffffff;
          -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
          box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
          -webkit-transition: all 0.3s ease-in-out;
          transition: all 0.3s ease-in-out;
          border: none;

          li {
            padding: 0;
            border-bottom: 1px solid #f1f1f1;

            &:last-child {
              border-bottom: 0px solid transparent;
            }

            a {
              position: relative;
              color: #404040;
              font-size: 16px;
              font-weight: 600;
              text-transform: capitalize;
              padding: 10px 15px;
              margin: 0;

              &:hover,
              &:focus,
              &.active {
                color: #ffffff;
                background-color: #7b68ee;
              }
            }

            .dropdown-menu {
              top: 0;
              left: -245px;
              opacity: 0;
              visibility: hidden;

              li {
                a {
                  color: #696997;

                  &:hover,
                  &:focus,
                  &.active {
                    color: #7b68ee;
                  }

                  &.dropdown-menu {
                    top: 0;
                    left: -245px;
                    opacity: 0;
                    visibility: hidden;

                    li {
                      a {
                        color: #696997;
                        text-transform: capitalize;

                        &:hover,
                        &:focus,
                        &.active {
                          color: #7b68ee;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        &:hover .dropdown-menu {
          top: 100%;
          opacity: 1;
          visibility: visible;
          -webkit-transition: 0.4s;
          transition: 0.4s;
        }
      }

      &.index-navber {
        .nav-item a {
          color: #555;
        }
      }
    }

    .other-option {
      margin-top: 3px;
      margin-left: 0;

      .call-btn {
        color: #fff;
        font-size: 20px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #7b68ee;
        padding: 8px 10px 8px 15px;
        border-radius: 5px;

        i {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          color: #7b68ee;
          background: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 6px;
        }
      }
    }

    .accountAvatar {
      display: flex;
      align-items: center; /* 垂直居中 */
      gap: 8px;
      span {
        color: #ffffff;
        font-weight: bold;
      }
      .el-avatar {
        font-size: 16px;
        background: #7b68ee;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }

  .black-logo {
    display: none;
  }

  &.index-navber .navbar .navbar-nav .nav-item a {
    color: #555;
  }
}

.navbar-section {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  transition: 0.4s;

  &.is-sticky {
    position: fixed;
    background-color: #ffffff !important;
    box-shadow: 0 2px 28px 0 rgba(0, 0, 0, 0.06);
    animation: 500ms ease-in-out 0s normal fadeInDown;

    .techvio-nav .navbar-brand {
      .white-logo {
        display: none;
      }
      .black-logo {
        display: block;
      }
    }

    .navbar-nav .nav-item a {
      color: #505050;

      &:hover,
      &:focus,
      &.active {
        color: #7b68ee;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 20px 0;

    &.is-sticky {
      padding: 20px 0;
      box-shadow: 0 7px 13px 0 rgba(0, 0, 0, 0.1);
    }
  }
}

// 响应式导航部分样式
@media only screen and (max-width: 991px) {
  .techvio-responsive-nav {
    display: block;
    position: relative;
  }

  .techvio-nav {
    display: none;
  }

  .techvio-responsive-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    width: 170px !important;
    height: 40px !important;
  }
  .hamburger-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 25px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    span {
      display: block;
      width: 100%;
      height: 3px;
      background-color: #404040;
      transition: all 0.3s ease;
    }
  }

  .hamburger-menu.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .hamburger-menu.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger-menu.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }

  .responsive-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 99;

    .navbar-nav {
      margin: 0;
      padding: 0;

      .nav-item {
        padding: 10px 15px;
        border-bottom: 1px solid #f1f1f1;

        a {
          color: #404040;
          margin: 0;
        }

        .dropdown-menu {
          position: static;
          opacity: 1;
          visibility: visible;
          width: 100%;
          box-shadow: none;
          border-top: 1px solid #f1f1f1;
        }
      }
    }

    .other-option {
      margin: 10px 15px;
    }
  }

  .responsive-nav.show {
    display: block;
  }

  .accountAvatar {
    display: flex;
    align-items: center; /* 垂直居中 */
    gap: 8px;
    margin: 5px 0 5px 10px;
    span {
      font-weight: bold;
    }
    .el-avatar {
      background: #7b68ee;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
