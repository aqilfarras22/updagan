<template>
  <div class="line_graph">
    <div class="single_main" v-if="options.type === 'single'">
      <div class="data" v-bind:style="{ backgroundColor: options.color, width: options.data + '%' }"></div>
    </div>
    <div class="double_main" v-if="options.type === 'double'">
      <div v-for="(item, index) in options.data" class="data" v-bind:style="{ backgroundColor: item.color, width: item.value / dataTotal * 100 + '%', left: (options.data[index-1] ? options.data[index-1].value : 0) / dataTotal * 100 + '%'}"></div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'line-graph',
    data() {
      return {
        dataTotal: null,
      };
    },
    props: ['options'],
    mounted() {
      if (this.options.data && this.options.data.length > 0) {
        this.calculatePercentage(this.options.data);
      }
    },
    methods: {
      calculatePercentage(data) {
        this.dataTotal = _.sum(_.map(data, (o) => { return Number(o.value) })); // eslint-disable-line
      },
    },
  };
</script>

<style scoped lang="scss">
.line_graph {
  .single_main {
    width: 100%;
    height: 6px;
    margin: 5px 0;
    background-color: #d3dfe4;
    border-radius: 10px;
    position: relative;
  }
  .data {
    height: 6px;
    border-radius: 10px;
    position: absolute;
  }
  .double_main {
    @extend .single_main;
  }
}
</style>
