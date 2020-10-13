<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="engagementContentDetails">
          <h6 class="fw-bold"> LEARN </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-if="engagementContentDetails.sections">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!engagementContent" @click.prevent="engagementContent = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="engagementContent" @click.prevent="engagementContent = false"></i>
              Content
            </div>
            <div v-if="engagementContent">
              <div class="card inner-card br-2">
                <div class="p-10" v-for="(section, index) in engagementContentDetails.sections" :key="index">
                  <b-row class="content">
                    Screen {{index + 1}}
                  </b-row>
                  <b-row class="header">
                    {{section.sectionTitle}}
                  </b-row>
                  <b-row class="content">
                    <span v-html="section.sectionHtmlDetails"></span>
                  </b-row>
                  <b-row class="pb-6">
                    <img class="content-img" :src="section.sectionIcon" alt="section-image" />
                  </b-row>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8 pb-10" v-if="engagementContentDetails.feedback">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandFeedback" @click.prevent="expandFeedback = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandFeedback" @click.prevent="expandFeedback = false"></i>
             Participant feedback
            </div>
            <div v-if="expandFeedback">
              <div class="card inner-card br-2 p-10">
                <b-row class="header">
                  {{engagementContentDetails.feedback.title}}
                </b-row>
                <b-row class="content">
                  {{engagementContentDetails.feedback.summary}}
                </b-row>
                <b-row class="pb-15">
                  <img class="content-img" :src="engagementContentDetails.feedback.icon" alt="" />
                </b-row>
                <div class="pb-10" v-for="(question, index) in engagementContentDetails.feedback.quiz" :key="index">
                  <b-row class="content">
                    Question {{index+1}}
                  </b-row>
                  <b-row class="header pb-5">
                    {{question.body}}
                  </b-row>
                  <div v-if="question.type === 'text'">
                    <input type="text" class="input-text readonly" placeholder="" readonly>
                    <label class="fw-normal display-block" v-if="question.limit">
                      <span class="position_relative fs-12">Text limit: {{question.limit}}</span>
                    </label>
                  </div>
                  <div v-if="question.type === 'numberScale'">
                    <vue-slider v-if="question.direction.toLowerCase() === 'horizontal'" ref="slider" :value="question.minValue" :piecewise="true" direction="horizontal"
                      class="horizontal-vue-slider pl-20 pt-35" :min="question.minValue" :max="question.maxValue" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                    <vue-slider v-if="question.direction.toLowerCase() === 'vertical'" ref="slider" :value="question.minValue" :piecewise="true" direction="vertical"
                      class="vertical-vue-slider pl-20" width="2" :min="question.minValue" :max="question.maxValue" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                  </div>
                  <div v-if="question.type === 'customScale'">
                    <vue-slider v-if="question.direction.toLowerCase() === 'horizontal'" ref="slider" :value="1" :piecewise="true" direction="horizontal"
                      class="horizontal-vue-slider pl-20 pt-35" :min="parseInt(question.labels[0])" :max="question.labels[question.labels.length]" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :data="question.labels"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                    <vue-slider v-if="question.direction.toLowerCase() === 'vertical'" ref="slider" :value="1" :piecewise="true" direction="vertical"
                      class="vertical-vue-slider pl-20" width="2" :min="parseInt(question.labels[0])" :max="question.labels[question.labels.length]" :disabled="true"
                      :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle" :data="question.labels"
                      :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></vue-slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';

export default {
  name: 'engagement-content-details',
  data() {
    return {
      engagementContent: false,
      expandFeedback: false,
      labelActiveStyle: {
        color: '#3498db',
      },
      piecewiseStyle: {
        backgroundColor: '#ccc',
        visibility: 'visible',
        width: '12px',
        height: '12px',
      },
    };
  },
  components: {
    vueSlider: VueSlider,
  },
  props: {
    engagementContentDetails: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    expandAll() {
      this.engagementContent = true;
      this.expandFeedback = true;
    },
    collapseAll() {
      this.engagementContent = false;
      this.expandFeedback = false;
    },
  },
};
</script>

<style scoped>
.link_style {
  border-right: 1px solid #959fa4;
  margin: 0px 5px 0px 2px !important;
}
.inner-card {
  border: none;
  margin: 5px 20px;
  border-radius: 3px !important;
  background-color: #d3dfe4;
}
.content {
  font-size: 12px;
  color: #666669;
}
.header {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
 p {
  margin-top: 0;
  margin-bottom: 0 !important;
}
.sub-header {
  opacity: 0.7;
  font-size: 12px;
  color: #666669;
}
.radio-style {
  position: relative;
  top: 2px;
}
.doc-style {
  color: #4c8ce4;
}
.content-img {
  width: auto;
  height: 100%;
  max-height: 80px;
}

/deep/ img {
  padding-right: 10px;
  padding-left: 10px;
  width: auto !important;
  height: 100% !important;
  max-width: 90px !important;
  max-height: 90px !important;
  padding-top: 2px !important;
}

.input-text {
  width: 80%;
  border-radius: 2px;
  outline: none;
  border: 1px solid #ccc;
  height: 30px;
  text-indent: 10px;
}

.vertical-vue-slider {
  height: 200px !important;
  width: 4px;
  padding: 11px;
  margin-left: 30px;
}

.horizontal-vue-slider {
  height: 8px;
  width: 80% !important;
  padding: 10px;
}
.make-link {
   color: #1e8fe1 !important;
}
</style>
