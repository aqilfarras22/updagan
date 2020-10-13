<template>
  <div class="main_bg build_bg">
    <!--<mainHeader></mainHeader>-->
    <div class="container pt-40">
      <div class="row pt-40">
        <div class="mt-50 pt-40" style="overflow:hidden;float:none;margin:0 auto;">
          <div class="text-center">
            <div>
              <img src="static/img/study_setup_crane.gif" class="progress_image">
            </div>
            <p class="desc">Give us a second while we start building your mobile study app.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mainHeader from '../common/main-header';

export default {
  name: 'Study-Build-Progress',
  data() {
    return {
      studyId: null,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      this.goToCustomize();
    }, 4000);
  },
  methods: {
    goToCustomize() {
      this.$router.push({ name: 'features-library', params: { studyId: this.studyId } });
    },
  },
  components: { mainHeader },
};
</script>

<style scoped lang="scss">
.build_bg {
  background: url('/static/img/bg/login_bg.png') no-repeat center center fixed;
  min-height: 100vh;
  background-color: #34537d;
  background-blend-mode: soft-light;
  height: 100%;
  background-size: cover;
   -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.desc {
  margin: auto;
  max-width: 380px;
  /*padding-top: 20px;*/
  color: #fff;
  max-width: 450px;
  margin: auto;
  font-weight: 500;
  font-size: 20px;
}

.btn_ok {
  width: 100px;
}

.btn {
  border-radius: 25px;
}

.progress_image {
  max-width: 500px;
  margin: 0 auto;
}
</style>
