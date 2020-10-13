<template>
  <div class="bg-color">
    <studyHeader></studyHeader>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import studyHeader from '../common/study-header';

  export default {
    name: 'customize-features',
    data() {
      return {
      };
    },
    components: {
      studyHeader,
    },
    methods: {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.bg-color {
  background-color: #f5f8fa;
  background-size: cover;
  // height: 100%;
  // min-height: 100vh;
} 
</style>