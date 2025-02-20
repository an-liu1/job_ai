<template>
  <div class="about">
    <h1>This is an about page</h1>
    <pre>{{ blogs }}</pre>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getBlogs");
  },
  computed: {
    blogs: function () {
      return this.$store.state.blogs;
    },
  },
  methods: {
    // getBlogs() {},
  },
};
</script>
