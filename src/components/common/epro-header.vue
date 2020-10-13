<template>
  <div class="epro-header">
    <nav class="navbar navbar-default navbar-fixed-top navbar-style">
      <div class="container">
        <div class="row p-0">
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3 p-0 text-left">
            <router-link class="text-left pl-10-xs" :to="{ name: 'epros', params: { studyId: studyId } }">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back to epros
            </router-link>
          </div>
          <div class="col-lg-8 col-md-8 col-sm-8 col-xs-6">ePROs</div>
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3 p-0 text-right">
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'SurveyHeader',
    data() {
      return {
        studyId: null,
        surveyId: null,
      };
    },
    mounted() {
      this.studyId = this.$route.params.studyId;
      this.surveyId = this.$route.params.surveyId;
    },
    methods: {
    },
  };
</script>

<style scoped lang="scss">
  .epro-header {
    background-image: linear-gradient(125deg, #09b9e0, #7478e6);
  }
  a {
    color: #fff;
  }
  
  .header-content {
    margin: auto;
    width: 100%;
    max-width: 1160px;
  }
  
  .navbar-style {
    color: #fff;
    text-align: center;
    background-image: linear-gradient(125deg, #09b9e0, #7478e6);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 60px;
    padding-top: 20px;
  }

  .float-left {
    float: left;
  }


  .float-none {
    float: none;
  }
</style>
