<template>
  <transition name="fade">
      <loader v-show="isActive"></loader>
  </transition>
</template>
<script>

import loader from "../loader/bar-loader";
export default {
    components: {
        "loader" : loader
    },
    props: {
      active: Boolean,
    },
    data() {
      return {
        // Don't mutate the prop
        isActive: this.active
      }
    },
};
</script>
