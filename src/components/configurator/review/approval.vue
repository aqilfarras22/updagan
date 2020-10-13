<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyReviewHeader></studyReviewHeader>
      <div class="pl-20 pr-20 pb-100">
        <h2 class="pt-10">Your study is ready for launch.</h2>
        <div>
          Before your study goes live, you must ensure that your internal organizational approval is confirmed and that you have received
          IRB/EC approval. Please carefully review and approve the following authorizations.
        </div>
        <h4 class="font-style pt-20">Study Administrator and Organizational Approval</h4>
        <div class="box-style">
          <div class="pb-10">
            By checking the box below, the Administrator User is agreeing to the approval and activation of the THREAD Service or Subscriber
            study and the Administrator User verifies that they are authorized to take such action and that all verifications,
            signatures and authorizations by the Subscriber and any Sponsor for any Service or study has been obtained and
            are recorded and in the possession of the Subscriber. Furthermore, the Administrator User and the Subscriber
            verify that no additional authorizations, signatures or approvals are necessary to initiate the Service or the
            study.
          </div>
          <div class="fw-500">
            THREAD MAKES NO, AND HEREBY DISCLAIMS ANY REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, WITH RESPECT TO
            THE SERVICES PROVIDED, THE APP OR THE AVAILABILITY, FUNCTIONALITY, PERFORMANCE OR RESULTS OF USE OF THE SERVICES.
            THREAD DISCLAIMS ANY WARRANTY THAT THE SERVICES PROVIDED BY THREAD, OR THE OPERATION THEREOF ARE, OR WILL BE,
            ACCURATE, ERROR­FREE OR UNINTERRUPTED. THREAD MAKES NO, AND HEREBY DISCLAIMS ANY, IMPLIED WARRANTIES, INCLUDING
            WITHOUT LIMITATION, ANY IMPLIED WARRANTY OF NONINFRINGEMENT, MERCHANTABILITY, OF FITNESS FOR A PARTICULAR PURPOSE
            OR ARISING BY USAGE OF TRADE, COURSE OF DEALING OR COURSE OF PERFORMANCE. THREAD HAS NO LIABILITY WITH RESPECT
            TO THE SERVICES, OR ITS OTHER OBLIGATIONS UNDER THIS AGREEMENT OR OTHERWISE FOR CONSEQUENTIAL, EXEMPLARY, SPECIAL,
            INCIDENTAL, OR PUNITIVE DAMAGES (INCLUDING WITHOUT LIMITATION LOSS OF PROFITS AND THE COST OF COVER EVEN IF THREAD
            HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </div>
        </div>
        <div class="row pt-20 pb-40 text-right">
          <span
            class="pr-10 fs-12 color_959fa4"
            v-if="isInternalOrganizationalApproved"
          >Approval provided {{new Date(studyDate) | formatGMTDate}}</span>
          <label class="switch">
            <input
              type="checkbox"
              v-model="isInternalOrganizationalApproved"
              v-on:click="checkedStudy"
            />
            <span class="slider"></span>
          </label>
          <span class="font-style pl-10">I Authorize and Approve this Study to Launch</span>
        </div>
        <h4 class="font-style">IRB/EC Approval</h4>
        <div class="box-style">
          By checking below and initiating the activation of the THREAD Service or Subscriber study the Administrator User confirms
          that the Internal Review Board (“IRB”) or Ethics Committee (“EC”) of the Subscriber has approved the study as
          proscribed by the internal process controls of the Subscriber. Furthermore, the Administrator User and the Subscriber
          verify that no additional authorizations, signatures, or approvals are necessary to initiate the Service or the
          study.
        </div>
        <div class="row pt-20 pb-40 text-right">
          <span
            class="pr-10 fs-12 color_959fa4"
            v-if="isIrbEcApproved"
          >Approval provided {{new Date(irbDate) | formatGMTDate}}</span>
          <label class="switch">
            <input type="checkbox" v-model="isIrbEcApproved" v-on:click="checkedIrb" />
            <span class="slider"></span>
          </label>
          <span class="font-style pl-10">I Obtained an IRB / EC Approval to Launch</span>
        </div>
      </div>
      <div class="footerStyle">
        <div class="container">
          <div class="row">
            <button
              type="button"
              class="btn nextBtn br-25"
              v-on:click="nextClick()"
              :class="{ 'disabledbtn' : !isInternalOrganizationalApproved || !isIrbEcApproved }"
              :disabled="!isInternalOrganizationalApproved || !isIrbEcApproved"
            >Save and Continue</button>
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
      isInternalOrganizationalApproved: false,
      isIrbEcApproved: false,
      studyDate: null,
      irbDate: null,
      studyId: null
    };
  },
  components: {
    studyReviewHeader
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    checkedIrb() {
      this.irbDate = new Date();
    },
    checkedStudy() {
      this.studyDate = new Date();
    },
    nextClick() {
      this.$api
        .studyApprovalFact(
          this.studyId,
          this.isInternalOrganizationalApproved,
          this.isIrbEcApproved
        )
        .then(
          () => {
            toastr.success("Approval sent");
            this.$router.push({
              name: "launch",
              params: { studyId: this.studyId }
            });
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while building the study"
            );
          }
        );
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

.font-style {
  font-weight: 500;
  color: #1f95f2 !important;
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
.box-style {
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  padding: 10px;
  /*height: 200px;
  overflow-y: auto;*/
}

.disabledbtn {
  background-color: #d3dfe4;
  color: #959fa4;
}
</style>
