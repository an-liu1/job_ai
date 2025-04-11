<template>
  <div>
    <!-- Start Navbar Section -->
    <div class="navbar-section" :class="{ 'is-sticky': isSticky }">
      <div class="techvio-responsive-nav">
        <div class="container">
          <div class="techvio-responsive-menu">
            <div class="logo">
              <a @click="$router.push({ path: '/', hash: '#home' })">
                <img
                  src="../assets/img/logo.png"
                  class="white-logo"
                  alt="logo"
                />
                <img
                  src="../assets/img/logo-black.png"
                  class="black-logo"
                  alt="logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="techvio-nav">
        <div class="container">
          <nav class="navbar navbar-expand-md navbar-light">
            <a
              class="navbar-brand"
              @click="$router.push({ path: '/', hash: '#home' })"
            >
              <img src="../assets/img/logo.png" class="white-logo" alt="logo" />
              <img
                src="../assets/img/logo-black.png"
                class="black-logo"
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
                  <ul
                    class="dropdown-menu"
                    v-if="i.name == 'Interview Features'"
                  >
                    <li class="nav-item">
                      <a class="nav-link" @click="$router.push('/exercise')"
                        >Interview Exercises</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        @click="$router.push('/mockInterview')"
                        >Mock Interview</a
                      >
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="other-option" @click="$router.push('/signinup')">
                <a class="default-btn">Sign in<span></span></a>
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
    };
  },
  computed: {
    navBar: function () {
      return [
        {
          navLink: "/",
          name: "Home",
          sectionId: "home",
        },
        {
          navLink: "/",
          name: "Guide",
          sectionId: "howItWork",
        },
        {
          navLink: "/",
          name: "Interview Features",
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
        // {
        //   navLink: "/history",
        //   name: "History",
        //   sectionId: "",
        // },
      ];
    },
  },
  mounted() {
    // Bind the scroll handler to maintain Vue instance context
    this.scrollListener = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeDestroy() {
    // Clean up the event listener when component is destroyed
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener);
    }
  },
  methods: {
    handleScroll() {
      // Use requestAnimationFrame for smoother performance
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
                  top: targetElement.offsetTop,
                  behavior: "smooth",
                });
              }
            });
          })
          .catch((error) => {
            console.error("路由跳转出错:", error);
          });
      } else {
        console.log(link);
        this.$router.push(link);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/style.css";
.techvio-responsive-nav {
  display: none;
}

.techvio-nav {
  padding: 15px 0;
  background-color: transparent;

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
  // background-color: transparent;
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

.techvio-responsive-nav {
  @media only screen and (max-width: 991px) {
    display: block;

    .techvio-responsive-menu {
      position: relative;

      &.mean-container {
        .mean-nav ul {
          font-size: 15px;

          li a {
            color: #101834;
            font-size: 16px;
            font-weight: 500;

            &.active {
              color: #7b68ee;
            }
          }

          li li a {
            font-size: 15px;
          }
        }

        .navbar-nav {
          height: 300px;
          overflow-y: scroll;
          box-shadow: 0 7px 13px 0 rgba(0, 0, 0, 0.1);
        }

        .others-options {
          display: none;
        }

        a.meanmenu-reveal {
          color: #404040;

          span {
            background-color: #404040;
          }
        }
      }
    }

    .logo {
      position: relative;
      width: 50%;
      z-index: 999;

      .white-logo {
        display: block;
      }

      .black-logo {
        display: none;
      }
    }
  }
}
</style>
