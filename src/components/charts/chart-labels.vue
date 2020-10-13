<template>
  <ul class="pl-0">
    <li v-for="(item, index) in data" :key="index">
      <span :style="{ 'background-color': item.color }"></span>
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'chart-labels',
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style scoped lang="scss">
  ul {
    list-style: none;
    margin-bottom: 0;
    font-size: 12px;
    color: #666;

    li{
      padding: 2px 0 2px 10px;      
    }

    span {
      width: 10px;
      height: 10px;
      display: inline-block;
      border-radius: 50%;
      margin: 0 6px 0 -25px;
    }
  }
</style>
