<template>
  <b-card :title="title" class="scroll picker-container">
    <vue-slider
      class="mr-20 ml-20"
      v-model="chosenRange" 
      :enable-cross="false"
      :tooltip="'always'" 
      :tooltip-dir="['bottom', 'bottom']"
      :formatter="dateFormatter"
      :min="minTime"
      :max="maxTime"
      :interval="86400000"
      @drag-end="dragEnd"
     />
  </b-card>
</template>
<script>
// This component will return %d/%m/%Y format
import * as d3 from 'd3';
import vueSlider from 'vue-slider-component';

const parseTime = d3.timeParse("%d/%m/%Y");
const formatTime = d3.timeFormat("%d/%m/%Y");

export default {
  components: {
    vueSlider,
  },
  props: {
    maxDateStr: {
      type: String,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    },
    minDateStr: {
      type: String,
      default: null
    },
    minDate: {
      type: Date,
      default: null
    },
    minDateTime: {
      type: Number,
      default: 0
    },
    maxDateTime: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: 'Date Picker'
    },
  },
  data() {
    return {
      minTime: null,
      maxTime: null,
      minDateLabel: '',
      maxDateLabel: '',
      chosenRange: [],
      dateFormatter: v => formatTime(new Date(v))
    };
  },
  methods: {
    dragEnd(v1, v2 = null){
      const chosenRangeStr = this.chosenRange.map(v=> formatTime(new Date(v)))
      this.$emit('onDragEnd', {chosenRangeStr, chosenRange: this.chosenRange});
    },
    renderTime(){
      if (this.maxDate !== null) {
        this.maxTime = this.maxDate.getTime();
      }
      if (this.minDate !== null){
        this.minTime = this.minDate.getTime();
      }
      if (this.maxTime !== null && this.minTime !== null){
        this.renderSliderComponent();
        return;
      }
      if (this.minDateTime) {
        this.minTime = this.minDateTime;
      }
      if (this.maxDateTime) {
        this.maxTime = this.maxDateTime;
      }
      if (this.maxTime !== null && this.minTime !== null){
        this.renderSliderComponent();
        return;
      }
      if (this.maxDateStr !== null) {
        this.maxTime = parseTime(this.maxDateStr).getTime();
      }
      if (this.minDateStr !== null) {
        this.minTime = parseTime(this.minDateStr).getTime();
      }
      this.renderSliderComponent();
    },
    renderSliderComponent(){
      this.chosenRange = [this.minTime, this.maxTime];
      this.minDateLabel = formatTime(new Date(this.minTime));
      this.maxDateLabel = formatTime(new Date(this.maxTime));
    }
  },
  mounted() {
    this.renderTime();
  }
};
</script>
