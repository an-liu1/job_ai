<template>
  <div class="why-choose-us">
    <h1>Why Choose Us</h1>
    <p>
      Our clients have been choosing PixLab for a number of reasons including
      reliability, latest technologies, and constant updates & support. Read
      more about other advantages below.
    </p>
    <transition-group name="fade" tag="div" class="feature-list">
      <div class="feature-item" v-for="item in features" :key="item.title">
        <div class="icon-box">
          <img :src="item.icon" alt="icon" />
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          title: "Quick Results",
          desc: "We work quickly and effectively to provide the best results.",
          icon: "clock-icon.png", // 替换为实际图标路径
        },
        {
          title: "Powerful Apps",
          desc: "Our team offers a wide variety of powerful and sustainable apps.",
          icon: "app-icon.png",
        },
        {
          title: "Money Saving",
          desc: "Our products cost less than their analogs by other companies.",
          icon: "money-icon.png",
        },
        {
          title: "Efficient Support",
          desc: "PixLab offers extensive support to its customers all over the world.",
          icon: "support-icon.png",
        },
        {
          title: "Innovative Technologies",
          desc: "Our developers use the latest technologies to deliver the best apps.",
          icon: "tech-icon.png",
        },
        {
          title: "Great Usability",
          desc: "Improved usability and UX are distinctive features of our products.",
          icon: "usability-icon.png",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
$text-color: #333;
$desc-color: #999;
$icon-size: 60px;
$gap-size: 40px;

.why-choose-us {
  text-align: center;
  padding: 40px;
  position: relative;
  background: url("../../assets/img/bg-whyUs.jpg") center/cover no-repeat; // 背景图

  // 添加半透明遮罩层
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8); // 白色半透明，降低背景图透明度
  }

  h1 {
    font-size: 28px;
    color: $text-color;
    margin-bottom: 20px;
    position: relative; // 确保文字在遮罩层之上
    z-index: 1;
    animation: fadeInDown 1s ease-out;
  }

  p {
    font-size: 14px;
    color: #777;
    max-width: 600px;
    margin: 0 auto 40px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 1s ease-out;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $gap-size;

    .feature-item {
      text-align: center;
      position: relative;
      z-index: 1;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.5s ease-out forwards;
      animation-delay: calc(var(--index) * 0.1s);

      .icon-box {
        width: $icon-size;
        height: $icon-size;
        margin: 0 auto 20px;
        background-color: #f5f5f5;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      h3 {
        font-size: 16px;
        color: $text-color;
        margin-bottom: 10px;
      }

      p {
        font-size: 12px;
        color: $desc-color;
      }
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

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .feature-list {
      grid-template-columns: 1fr;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
