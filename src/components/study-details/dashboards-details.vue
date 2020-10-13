<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="dashboardDetails.activities && dashboardCollapse">
          <h6 class="fw-bold"> DASHBOARDS </h6>
          <div class="">
            <a href="" class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href="" class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8" v-for="(activity, index) in dashboardDetails.activities" :key="index" v-if="dashboardDetails.activities && activity.showInDashboard">
            <div>
              <i class="fa fa-plus-circle pr-6" v-if="!dashboardCollapse[activity.identifier]" @click.prevent="expandActivity(activity.identifier)"></i>
              <i class="fa fa-minus-circle pr-6" v-if="dashboardCollapse[activity.identifier]" @click.prevent="collapseActivity(activity.identifier)"></i>
              {{activity.title}}
            </div>
            <div v-if="dashboardCollapse[activity.identifier]">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <b-row class="content">
                    <b-col class="p-0 pb-10">
                      {{activity.description}}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="4" class="p-0" v-for="(graph, index) in activity.graphs" :key="index" v-if="graph">
                    <img class="content-img" :src="graph" alt="" />
                    </b-col >
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
  name: 'dashboard-details',
  data() {
    return {
      studyId: this.$route.params.studyId,
      selectedActivity: {
        identifier: '',
      },
      dashboardCollapse: {},
    };
  },
  components: {},
  props: {
    dashboardDetails: {
      type: Object,
    },
  },
  methods: {
    expandActivity(identifier) {
      this.selectedActivity.identifier = identifier;
      this.dashboardCollapse[identifier] = true;
      this.$forceUpdate();
    },
    collapseActivity(identifier) {
      this.selectedActivity.identifier = '';
      this.dashboardCollapse[identifier] = false;
      this.$forceUpdate();
    },
    expandAll() {
      this.dashboardDetails.activities.forEach(dashboard => {
        this.dashboardCollapse[dashboard.identifier] = true;
      });
      this.$forceUpdate();
    },
    collapseAll() {
      this.selectedActivity.identifier = '';
      this.dashboardDetails.activities.forEach(dashboard => {
        this.dashboardCollapse[dashboard.identifier] = false;
      });
      this.$forceUpdate();
    },
  },
  watch: {
    dashboardDetails: {
      handler() {
        if (this.dashboardDetails && this.dashboardDetails.activities) {
          this.dashboardDetails.activities.forEach(dashboard => {
            this.dashboardCollapse[dashboard.identifier] = false;
          });
        }
      },
      deep: true,
      immediate: true,
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
.link-color {
  font-size: 12px;
  color: #4c8ce4;
}
.make-link {
  color: #4c8ce4 !important;
}
</style>
