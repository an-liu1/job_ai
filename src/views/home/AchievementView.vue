<template>
  <div class="container-fluid px-4 py-5 bg-purple">
    <div class="row g-4">
      <div
        v-for="(item, index) in stats"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <div
          class="card shadow rounded-3 border-0 h-100 bg-white"
          @mouseenter="onMouseEnter(index)"
        >
          <div
            class="card-body d-flex flex-column justify-content-center text-center"
          >
            <h2 class="fw-bold fs-1 text-purple">{{ item.value }}</h2>
            <p class="card-text text-muted text-uppercase fs-6">
              {{ item.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stats: [
        { value: "3250", label: "Happy Client" },
        { value: "10 k", label: "Completed Project" },
        { value: "200 +", label: "Award Wins" },
        { value: "150", label: "Experienced Engineer" },
      ],
    };
  },
  methods: {
    onMouseEnter(index) {
      this.$el.querySelectorAll(".card")[index].style.transform = "scale(1.05)";
      this.$el.querySelectorAll(".card")[index].style.boxShadow =
        "0 10px 20px rgba(0,0,0,0.2)";
    },
    onMouseLeave(index) {
      this.$el.querySelectorAll(".card")[index].style.transform = "scale(1)";
      this.$el.querySelectorAll(".card")[index].style.boxShadow =
        "0 4px 8px rgba(0,0,0,0.1)";
    },
  },
};
</script>

<style scoped>
.bg-purple {
  background-color: #6f42c1 !important;
}
/* 定制化样式 */
@media (min-width: 992px) {
  .card {
    height: 220px;
  }
}

@media (min-width: 1200px) {
  .card {
    height: 250px;
  }
}

.fs-1 {
  font-size: 2.5rem !important;
}

.fs-6 {
  font-size: 0.875rem !important;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
