<template>
  <div class="bg-color">
    <studyHeader></studyHeader>
    <div class="container pt-40">
      <div class="has-header has-footer">
        <div class="row text-center pb-30">
          <div class="col-1"></div>
          <div class="col-10">
            <div class="fs-24 color_ff">Your study has been submitted to THREAD for a final review.<br>
              You will be notified when your study is approved and ready to go live.</div>          
          </div>
        </div>
        <div class="row">
          <div class="card">
            <div class="fs-22 color_34537d">
              How long will the submission review process take?
            </div>
            <div class="fs-14 pt-5">
              Typically, it will take about one week (5 business days). 
              If your study is content heavy, this may take longer. 
              If you are planning to submit to the App Store or Play Store, 
              they will individually have their own app review time and timing may vary 
              depending on where your submission sits within their queue.
            </div>
            <div class="fs-22 color_34537d pt-20">
              What if I need to make an update to my study?
            </div>
            <div class="fs-14 pt-5 pb-20">
              You can always make changes to your study and resubmit, however, this may restart the review process.
            </div>
            <div class="pt-20 br-30 pl-0 text-center">              
                <button class="btn btn-block btn-style br-25" style="display: inline-block; padding-left: 28px; padding-right: 28px; width: auto; margin: 0 auto;" v-on:click="nextClick()">Go to Study Dashboard</button>              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import studyHeader from '../../common/study-header';

  export default {
    name: 'launch',
    data() {
      return {
        studyId: null,
      };
    },
    components: {
      studyHeader,
    },
    methods: {
      nextClick() {
        this.$router.push({ name: 'dashboard', params: { studyId: this.studyId } }); // eslint-disable-line
      },
    },
    mounted() {
      this.studyId = this.$route.params.studyId;
      window.scrollTo(0, 0);
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  // Style for quick fixes bootstrap after migration (before redesign should be removed)

  .btn{
    font-size: 14px;
  }

  .card{
    display: block;
    margin: 0 auto;
    max-width: 700px;
  }

  // END of style for quick fixes bootstrap after migration (before redesign should be removed) 

.bg-color {
  background: url("/static/img/bg/login_bg.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  background-color: #34537d;
  background-blend-mode: soft-light;
}
.card{
  border-radius: 3px;
  background-color: #ffffff;
  padding: 20px;
}
.btn-style {
  background-color: #4c8ce4;
  color: #ffffff;
}
</style>
