<template>
  <div id="home">
    <MainBanner />
    <HowItWork id="howItWork" />
    <Exercise id="exercise" />
    <WhyUs id="why" />
    <Banner />
    <PriceView id="price" />
    <FAQ id="faq" />
  </div>
</template>

<script>
import MainBanner from "@/views/home/MainBanner.vue";
import HowItWork from "@/views/home/HowItWork.vue";
import WhyUs from "@/views/home/WhyUs.vue";
import FAQ from "@/views/home/FAQ.vue";
import Banner from "@/views/home/BannerView.vue";
import Exercise from "@/views/home/ExerciseView.vue";
import PriceView from "@/views/home/PriceView.vue";
export default {
  components: {
    MainBanner,
    HowItWork,
    FAQ,
    Banner,
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
