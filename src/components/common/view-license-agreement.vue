<template>
    <div class="container">
        <div class="box">
            <div class='inner-box'>
                 <div class="new-license-agreement">
                    <div class="license-heading">THREAD Study Application End User License Agreement</div>
                </div>
                <div class="license-viewer" v-html="licenses">
                </div>
                <div class="delete-div">
                    <div class="btn">
                        <button class="blue-btn" v-on:click="doneReading()">Done</button>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2'; // eslint-disable-line
import 'nprogress/nprogress.css';

export default {
  name: 'privacy-policy',
  data() {
    return {
      licenses: this.option,
    };
  },

  props: ['option'],
  mounted() {
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    doneReading() {
      // code moved to muticonsent
      this.$emit('done');
    },
  },
};
</script>
<style scoped lang="scss">
.license-heading{
    font-family: Lato-Regular;
    font-size: 34px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: normal;
    color: #2d3752;
}

.license-viewer{
  height: 340px;
  overflow-y: auto;
  max-height: 340px;
  border-radius: 3px;
  border: solid 1px #e4e8eb;
  background-color: #f5f6f7;
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
  padding:10px;
  margin-top:20px;
}

.delete-div{
  margin-bottom: 20px;
  vertical-align: middle;
  margin-top: 20px;
  line-height: 40px;

  .delete-icon{
    cursor: pointer;
  }

  .btn{
    float: right;
    margin: 0;
    padding: 0;
    cursor: pointer;

    button{
      outline: none;
      &.white-btn{
          width: 100px;
          height: 36px;
          border-radius: 3px;
          font-family: Lato-Regular;
          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          letter-spacing: normal;
          text-align: center;
          color: #1e8fe1;
          border: solid 1px #1e8fe1;
          background-color: #ffffff;
      }

      &.blue-btn{
          width: 100px;
          height: 36px;
          border-radius: 3px;
          font-family: Lato-Regular;
          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          letter-spacing: normal;
          text-align: center;
          color: #ffffff;
          border: solid 1px #1e8fe1;
          background-color: #1e8fe1;
      }
    }
  }
}
</style>

<style scoped lang="scss" src="./styles/add-edit-multi-consent.scss"></style>


