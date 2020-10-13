<template>
  <b-tabs class="nav-tabs">
    <b-tab v-for="route in routes" :key="route.label" :title="route.label" @click="changeTab(route)"></b-tab>
  </b-tabs>
</template>

<script>
// we can use this component instead of 'navbar', by just passing 'replaceHistory' value.
export default {
  name: 'nav-bar',
  props: {
    routes: {
      type: Array,
    },
    replaceHistory: {
      type: Boolean,
    },
  },
  methods: {
    changeTab(route) {
      // In order to use it in other places where we don't need to replace the history.
      console.log("route", route);
      if (this.replaceHistory) {
        this.$router.replace({ name: route.to.name });
      } else {
        this.$router.push({ name: route.to.name });
      }
    },
  },
};
</script>

<style scoped>


/deep/ .nav-link.active {
  color: #007bff;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #007bff;
}
/deep/ .nav-link:hover {
  border-color: transparent;
}
/deep/ .nav-link.active:hover {
  border-bottom: 2px solid #007bff;
}
/deep/ .nav-link {
  color: #000;
  padding: 12px 16px;
  border-radius: 0;
}
</style>

