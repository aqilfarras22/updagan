<template>
  <p class="text-center foot-style-text">© {{new Date().getFullYear()}} {{copyrightName}}</p>
</template>

<script>
export default {
  name: 'Copyright',
  data() {
    return {
      copyrightName: 'THREAD',
    };
  },
  mounted() {
    // if (window.localStorage.getItem('thread-clientName')) {
    //   this.copyrightName = window.localStorage.getItem('thread-clientName');
    // }
  },
  methods: {},
};
</script>

<style >

</style>
