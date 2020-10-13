<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="studyMilestones">
          <h6 class="fw-bold"> STUDY MILESTONES </h6>
          <b-row>
            <b-col cols="2" class="pl-0 pr-0 pb-10" v-for="(milestone,index) in studyMilestones" :key="index">
              <div class="header">
                {{milestone.milestoneName}}
              </div>
              <div class="content">
                Day {{milestone.milestoneDay}}
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: 'milestones-details',
  data() {
    return {
      expandStudyName: false,
      expandIcon: false,
      expandColor: false,
    };
  },
  components: {},
  props: {
    studyMilestones: {
      type: Array,
    },
  },
  methods: {
    expandAll() {
      this.expandStudyName = true;
      this.expandIcon = true;
      this.expandColor = true;
    },
    collapseAll() {
      this.expandStudyName = false;
      this.expandIcon = false;
      this.expandColor = false;
    },
  },
};
</script>
    
<style scoped>
.header {
  font-size: 12px;
  color: #666669;
}
.content {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
</style>
    