<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="mobileHealthDetails">
          <h6 class="fw-bold"> MOBILE HEALTH DATA ACCESS </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8 pb-10" v-if="mobileHealthDetails.length > 0">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!expandDetails" @click.prevent="expandDetails = true"></i>
              <i class="fa fa-minus-circle pr-6" v-if="expandDetails" @click.prevent="expandDetails = false"></i>
              {{mobileHealthDetails.length}} data points selected
            </div>
            <div v-if="expandDetails">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row class="content" >
                    <b-col class="pb-10" cols=3 v-for="(healthData, index) in mobileHealthDetails" :key="index">
                      <li>{{healthData}}</li>
                    </b-col>
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
  name: 'health-data-access-details',
  data() {
    return {
      expandDetails: false,
    };
  },
  components: {},
  props: {
    mobileHealthDetails: {
      type: Array,
    },
  },
  methods: {
    expandAll() {
      this.expandDetails = true;
    },
    collapseAll() {
      this.expandDetails = false;
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
.radio-option {
  margin: 0px;
}
input {
  color: #666769;
  font-size: 14px;
}
.make-link {
  color: #007bff !important
}
</style>
