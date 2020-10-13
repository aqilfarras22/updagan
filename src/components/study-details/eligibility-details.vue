<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="eligibilityDetails">
          <h6 class="fw-bold"> ELIGIBILITY </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8 pb-10">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandScreener" @click.prevent="expandScreener = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandScreener" @click.prevent="expandScreener = false"></i>
              Eligibility screener
            </div>
            <div v-if="expandScreener">
              <div class="card inner-card br-2 p-10">
                <div class="pb-10" v-for="(question, index) in eligibilityDetails" :key="index">
                  <b-row class="content">
                    Question {{index + 1}}
                  </b-row>
                  <b-row class="header pb-5">
                    {{question.body}}
                  </b-row>
                  <b-row class="content radio">
                    <b-form-checkbox-group :disabled="true" id="checkboxes" v-model="question.expectedAnswers" :name="question.identifier" v-for="(choice, index) in question.options" :key="index" class="pl-0 pr-0 col-12">
                      <b-form-checkbox :value="choice.value" class="pl-0">
                        <span class="pl-20 text-align">{{choice.label}}</span>
                      </b-form-checkbox>
                    </b-form-checkbox-group>
                  </b-row>
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
export default {
  name: 'eligibility-details',
  data() {
    return {
      expandScreener: false,
    };
  },
  components: {},
  props: {
    eligibilityDetails: {
      type: Array,
    },
  },
  methods: {
    expandAll() {
      this.expandScreener = true;
    },
    collapseAll() {
      this.expandScreener = false;
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
.radio-style {
  position: relative;
  top: 2px;
}
.make-link {
  color: #007bff !important;
}
</style>
