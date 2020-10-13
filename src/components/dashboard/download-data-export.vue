<template>
  <div class="studies_bg">
    <div class="container container-style">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-lg-12 col-sm-12" v-if="showErrorMsg">
          <p class="fs-24 text-center text-danger">{{errorMsg}}</p>
        </div>
        <div class="col-xs-12 col-md-12 col-lg-12 col-sm-12" v-else>
          <p class="fs-24 text-center color_ff">Data export file downloaded successfully</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'download-data-export',
    data() {
      return {
        showErrorMsg: false,
        errorMsg: null
      };
    },
    mounted() { 
       this.$api
        .downloadStudyDataZip(this.$route.params.token)
        .then(
          response => {
            console.log(' ==',response);
            if(response.bodyText && response.bodyText!=""){
              window.open(response.bodyText, "_self");
            }
            else{
              this.showErrorMsg = true;
              this.errorMsg = 'No  response from the server';  
            }
          },
          error => {
            this.showErrorMsg = true;
            this.errorMsg = error.body && error.body.message ? error.body.message : 'Error while downloading the file';
          }
        );
    }
  };
</script>
<style>
.studies_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  /*color: #fff;*/
  background-color: #34537d;
  background-blend-mode: soft-light;
}

.container-style {
  padding-top: 120px;
}

@media (max-width:1023px) {
    body{
      width: auto;
      min-width: auto;
    }
}
</style>