<template>
  <div id="home">
    <BannerView />
    <HowItWork id="howItWork" />
    <Exercise id="exercise" />
    <WhyUs id="why" />
    <AchievementView />
    <PriceView id="price" />
    <FAQ id="faq" />
  </div>
</template>

<script>
import BannerView from "@/views/home/BannerView.vue";
import HowItWork from "@/views/home/HowItWork.vue";
import WhyUs from "@/views/home/WhyUs.vue";
import FAQ from "@/views/home/FAQ.vue";
import AchievementView from "@/views/home/AchievementView.vue";
import Exercise from "@/views/home/ExerciseView.vue";
import PriceView from "@/views/home/PriceView.vue";
export default {
  components: {
    BannerView,
    HowItWork,
    FAQ,
    AchievementView,
    WhyUs,
    PriceView,
    Exercise,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
