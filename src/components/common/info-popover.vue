<template functional>
  <i v-if="props.info" class="fa fa-info" v-b-popover.hover="props.info" />
</template>

<style scoped>
.fa-info {
  border-radius: 50%;
  background: #b5bbbf;
  line-height: 11px;
  width: 15px;
  text-align: center;
  color: #fff;
  padding: 0 0 2px 0;
  margin: 0 0 0 2px;
}
.fa-info:before {
  font-size: 8px;
}
</style>
