<template>
  <b-card v-if="data && data.length" class="border-0 shadow">
    <b-row>
      <b-col class="p-0 pb-20">
        <strong :style="{ color: titleColor }">{{ title }}</strong>
        <InfoPopover :info="info"/>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col lg="7" class="pl-30 pl-10-xl chart-wrap">
        <DonutChart :data="data" />
      </b-col>
      <b-col cols="6" lg="5" class="pl-30 pl-10-xl pr-0">
        <ChartLabels :data="data" />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import ChartLabels from '@/components/charts/chart-labels';
import DonutChart from '@/components/charts/donut-chart';
import InfoPopover from '@/components/common/info-popover';

export default {
  name: 'donut-chart-widget',
  components: {
    DonutChart,
    ChartLabels,
    InfoPopover,
  },
  props: {
    title: {
      type: String,
    },
    info: {
      type: String,
    },
    titleColor: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.card-body {
  padding: 14px 11px 28px;
  font-size: 14px;
}
@media (min-width: 1350px) {
  .chart-wrap {
    max-width: 190px;
  }
}
@media (max-width: 1199px) {
  .card-body {
    padding: 14px 11px;
  }
}
</style>
