<template>
  <div class="component">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'research-site',
  data() {
    return {
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.component {
  background-color: $color_content_background;
}

</style>
