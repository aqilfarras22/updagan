<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyReviewHeader></studyReviewHeader>
      <div class="pl-20 pr-20 pb-100">
        <h2 class="pt-10">We have automated your remote participant research study documentation.</h2>
        <div class="fs-14 fw-bold pb-5 pt-20">IRB/EC Documentation</div>
        <div class="box-style">
          <div class="row">
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
              <div class="color_blue pt-5">
                <i class="fa fa-file fs-16" aria-hidden="true"></i>
                <span class="pl-5">{{document.fileName}}</span>
              </div>
              <!-- <div class="row pt-10">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="support"
                    v-on:click="sendEmail(support)"
                    :disabled="!document.fileName || !document.size"
                  />
                  <span class="slider"></span>
                </label>
                <span class="pl-10">
                  I would like support with my central Institutional Review Board (IRB) or Ethics Committee (EC) submission.
                </span>
              </div>-->
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <button
                type="button"
                class="btn btn-info btn-block downloadBtn br-25"
                v-on:click="downloadIrbDoc()"
                :disabled="!document.fileName"
              >Download ({{document.size}})</button>
            </div>
          </div>
        </div>
        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <button
                type="button"
                class="btn nextBtn br-25"
                v-on:click="nextClick()"
              >Save and Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import studyReviewHeader from "../../common/study-review-header";

export default {
  name: "approval",
  data() {
    return {
      studyId: null,
      support: false,
      document: {}
    };
  },
  components: {
    studyReviewHeader
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.generateIRB();
  },
  methods: {
    sendEmail(support) {
      if (support) {
        this.$api.emailIrbFact(this.studyId).then(
          () => {},
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while sending email"
            );
          }
        );
      }
    },
    generateIRB() {
      this.$api.generateIRBFact(this.studyId).then(
        response => {
          this.document = response.body;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
        }
      );
    },
    downloadIrbDoc() {
      this.$api.downloadIrbFact(this.studyId).then(
        response => {
          window.open(response.body.downloadableUrl, "_blank");
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while downloading the study document"
          );
        }
      );
    },
    nextClick() {
      this.$router.push({
        name: "approval",
        params: { studyId: this.studyId }
      });
    }
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.box-style {
  border-radius: 3px;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  margin-top: 7px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 25px;
  width: 26px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}
input:checked + .slider:before {
  position: absolute;
  content: url("/static/img/checkmark.svg");
  top: -5px;
  left: 0;
  bottom: 0;
  color: #2ecc71;
  font-size: 23px;
}
input:checked + .slider {
  background-color: #ffffff;
  width: 26px;
  height: 25px;
}
.downloadBtn {
  background-color: #4c8ce4;
}
</style>
