<template>
  <div>
    <!-- Start Navbar Section -->
    <div class="navbar-section" :class="{ 'is-sticky': isSticky }">
      <!-- Responsive Navigation -->
      <div class="responsive-nav-container">
        <div class="container">
          <div class="responsive-menu-header">
            <a @click="$router.push({ path: '/', hash: '#home' })">
              <img
                src="../assets/long_logo_white.png"
                class="logo white-logo"
                alt="logo"
                v-show="!isSticky"
              />
              <img
                src="../assets/long_logo_dark.png"
                class="logo black-logo"
                alt="logo"
                v-show="isSticky"
              />
            </a>
            <button class="menu-toggle" @click="toggleMenu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div class="responsive-menu-content" :class="{ show: isMenuOpen }">
            <ul class="nav-links">
              <li v-for="(item, index) in navBar" :key="index">
                <a
                  @click="
                    redirectTo(item.navLink, item.sectionId);
                    toggleMenu();
                  "
                >
                  {{ item.name }}
                </a>
              </li>
            </ul>
            <button class="default-btn" @click="login" v-if="!loginStatus">
              Sign in
            </button>
            <div class="user-avatar" @click="$router.push('/account')" v-else>
              <span>Hello,</span>
              <el-avatar>
                {{ userProfile.username?.charAt(0).toUpperCase() || "A" }}
              </el-avatar>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        <div class="container">
          <div class="nav-content">
            <a @click="$router.push({ path: '/', hash: '#home' })">
              <img
                src="../assets/long_logo_white.png"
                class="logo white-logo"
                alt="logo"
              />
              <img
                src="../assets/long_logo_dark.png"
                class="logo black-logo"
                alt="logo"
              />
            </a>
            <ul class="nav-links">
              <li v-for="(item, index) in navBar" :key="index">
                <a @click="redirectTo(item.navLink, item.sectionId)">
                  {{ item.name }}
                </a>
              </li>
            </ul>
            <div class="nav-actions">
              <button
                class="theme-toggle"
                @click="toggleTheme"
                aria-label="Toggle theme"
              >
                <div class="theme-switch-track">
                  <div
                    class="theme-switch-thumb"
                    :class="{ 'dark-active': currentTheme === 'dark' }"
                  >
                    <i class="fas fa-sun sun-icon"></i>
                    <i class="fas fa-moon moon-icon"></i>
                  </div>
                </div>
              </button>
              <button class="default-btn" @click="login" v-if="!loginStatus">
                Sign in
              </button>
              <div class="user-avatar" @click="$router.push('/account')" v-else>
                <span>Hello,</span>
                <el-avatar>
                  {{ userProfile.username?.charAt(0).toUpperCase() || "A" }}
                </el-avatar>
              </div>
            </div>
          </div>
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
      currentTheme: "light",
    };
  },
  computed: {
    navBar() {
      return this.loginStatus
        ? [
            { navLink: "/", name: "Home", sectionId: "home" },
            { navLink: "/exercise/feature", name: "Feature Interview" },
            { navLink: "/exercise/mock", name: "Mock Interview" },
            { navLink: "/history", name: "History" },
            { navLink: "/", name: "Pricing", sectionId: "price" },
            { navLink: "/account", name: "My Account" },
          ]
        : [
            { navLink: "/", name: "Home", sectionId: "home" },
            { navLink: "/", name: "Features", sectionId: "features" },
            { navLink: "/", name: "Guide", sectionId: "howItWork" },
            { navLink: "/", name: "Interview", sectionId: "exercise" },
            { navLink: "/", name: "Why Us", sectionId: "why" },
            { navLink: "/", name: "Pricing", sectionId: "price" },
            { navLink: "/", name: "FAQ", sectionId: "faq" },
          ];
    },
    userProfile() {
      return this.$store.state.userProfile;
    },
    loginStatus() {
      return this.$store.state.loginStatus;
    },
  },
  mounted() {
    this.scrollListener = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.scrollListener);
    // Initialize theme from localStorage or prefer-color-scheme
    this.initializeTheme();
  },
  beforeDestroy() {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener);
    }
  },
  methods: {
    initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      this.currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", this.currentTheme);
    },

    toggleTheme() {
      this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", this.currentTheme);
      localStorage.setItem("theme", this.currentTheme);
    },
    login() {
      this.$store.commit("setLogininFrom", this.$route.fullPath);
      this.$router.push("/signinup");
    },
    handleScroll() {
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
            console.error("Routing error:", error);
          });
      } else {
        this.$router.push(link);
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar-section {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 0.4s ease;

  &.is-sticky {
    position: fixed;
    background-color: var(--bg-white);
    box-shadow: 0 2px 28px rgba(0, 0, 0, 0.06);
    animation: fadeInDown 0.5s ease-in-out;

    .white-logo {
      display: none;
    }
    .black-logo {
      display: block;
    }

    .nav-links a {
      color: var(--nav-light);

      &:hover {
        color: var(--nav-light-hover);
      }
    }

    .user-avatar span {
      color: var(--nav-light);
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 60px;
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
}

.theme-switch-track {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 12px;
  background-color: var(--bg-secondary);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--bg-white);
  }
}

.theme-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);

  i {
    position: absolute;
    font-size: 14px;
    transition: opacity 0.3s ease;
  }

  .sun-icon {
    color: #f59e0b;
    opacity: 0;
    left: -18px;
  }

  .moon-icon {
    color: #64748b;
    opacity: 1;
    right: -18px;
  }

  &.dark-active {
    transform: translateX(28px);

    .sun-icon {
      opacity: 1;
    }

    .moon-icon {
      opacity: 0;
    }
  }
}

// Shared styles
.container {
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
}

.logo {
  width: 170px;
  height: 40px;
  cursor: pointer;
}

.black-logo {
  display: none;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;

  li {
    position: relative;
    padding: 15px 0;

    a {
      color: var(--nav-dark);
      font-size: 16px;
      font-weight: 600;
      text-transform: capitalize;
      padding: 0;
      margin: 0 15px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--nav-dark-hover);
      }
    }

    &:last-child a {
      margin-right: 0;
    }
    &:first-child a {
      margin-left: 0;
    }
  }
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  span {
    color: var(--text-white);
    font-weight: bold;
  }

  .el-avatar {
    background-color: var(--avatar-color);
    font-size: 16px;
  }
}

// Desktop Navigation
.desktop-nav {
  padding: 15px 0;
  background-color: transparent;

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    margin: 0 auto;
  }
}

// Responsive Navigation
.responsive-nav-container {
  display: none;
}

.menu-toggle {
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
    background-color: var(--nav-phone);
    transition: all 0.3s ease;
  }
}

.responsive-menu-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--bg-white);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 99;

  &.show {
    display: block;
  }

  .nav-links {
    flex-direction: column;

    li {
      padding: 10px 15px;
      border-bottom: 1px solid var(--border-base);

      a {
        color: var(--nav-phone);
        margin: 0;
      }
    }
  }

  .default-btn,
  .user-avatar {
    margin: 10px 15px;
  }
}

// Media Queries
@media (max-width: 991px) {
  .desktop-nav {
    display: none;
  }

  .responsive-nav-container {
    display: block;
  }

  .responsive-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-section.is-sticky {
    padding: 15px 0;
    box-shadow: 0 7px 13px rgba(0, 0, 0, 0.1);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
