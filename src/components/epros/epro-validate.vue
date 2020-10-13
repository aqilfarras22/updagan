<template>
  <div class="has-header has-footer">
    <div class="container-style">
      <studyFeatureHeader></studyFeatureHeader>
      <div class="pl-20 pr-20 pb-20">
        <div>
          <div class="fs-24 pt-20 fw-500">ePRO license</div>
          <div
            class="color_666669"
          >Please confirm that you have received contractual permission from the license holder of this ePRO.</div>
          <div class="pt-20">
            <label class>
              <input
                type="checkbox"
                name="multipleSelection"
                v-model="permission"
                v-on:change="validateEPro(permission)"
              />
              <span class>I have obtained contractual permission from the license holder</span>
            </label>
            <div
              class="color_blue fs-12 btn-link cursor_pointer pt-10"
              v-on:click="openFeedbackModal()"
            >Need help from THREAD to acquire a license?</div>
          </div>
          <div class="pt-20">
            <span class="back_link" v-on:click="goBack()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i> Back
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="footerStyle">
      <div class="container">
        <div class="row">
          <button
            class="btn br-25 disable-btn mr-10"
            disabled
            v-on:click="skipForNow()"
          >Skip for now</button>
          <button
            class="btn nextBtn br-25"
            :disabled="!permission"
            v-on:click="nextPage()"
          >Save and Continue</button>
        </div>
      </div>
    </div>
    <div id="feedbackModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div v-if="!feedbackSent">
            <div class="modal-header border-none">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                v-on:click="closeModal"
              >&times;</button>
            </div>
            <div class="modal-body pl-50 pr-50">
              <div class="text-center">
                <img src="static/img/feedback.svg" alt class />
              </div>
              <div class="text-center fw-bold">Submit your help request or feedback below</div>
              <div class="pt-20">
                <form>
                  <div class="form-group">
                    <input
                      type="text"
                      v-validate="'required'"
                      name="subject"
                      :class="{'input': true, 'is-danger': errors.has('subject'), 'is-success': !errors.has('subject') }"
                      class="form-control"
                      v-model="feedbackObj.subject"
                      placeholder="Subject"
                      required
                    />
                    <span
                      v-show="errors.has('subject')"
                      class="error-style"
                      v-if="feedbackObj.subject"
                    >{{ errors.first('subject') }}</span>
                  </div>
                  <div class="form-group">
                    <textarea
                      v-validate="'required'"
                      name="description"
                      :class="{'input': true, 'is-danger': errors.has('description'), 'is-success': !errors.has('description') }"
                      class="form-control"
                      rows="4"
                      cols="126"
                      v-model="feedbackObj.description"
                      placeholder="Describe help request or feedback"
                      required
                    ></textarea>
                    <span
                      v-show="errors.has('description')"
                      class="error-style"
                      v-if="feedbackObj.description"
                    >{{ errors.first('description') }}</span>
                  </div>
                </form>
              </div>
              <div class="text-center fs-12">
                If you need more expedited support, please email us at
                <span
                  class="color_blue"
                >support@THREADresearch.com</span> or call/text
                <span class="color_blue">1-888-94-THREAD</span>
                <div>(1-888-948-4732)</div>
              </div>
              <div class="row pt-20 send_btn">
                <div class="form-group">
                  <button
                    type="submit"
                    class="btn btn-info btn-block br-25"
                    :disabled="!feedbackObj.subject || !feedbackObj.description"
                    v-on:click.prevent="sendFeedback"
                  >Send</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="feedbackSent">
            <div class="modal-body p-40 text-center">
              <img src="static/img/graphic-message.svg" alt class />
              <div class="fs-18 pt-20">Thank you for your message</div>
              <div class="fs-14 pt-10">We will get back to you as soon as possible.</div>
              <div class="row pt-40 send_btn">
                <div class="form-group">
                  <button type="button" class="btn btn-info btn-block br-25" @click="closeModal">Ok</button>
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
// import _ from 'lodash';
import toastr from "toastr";
import studyFeatureHeader from "../common/study-features-header";

export default {
  name: "mark-survey-template",
  data() {
    return {
      keyValidate: null,
      eproId: null,
      studyId: null,
      surveyId: null,
      surveyData: {},
      questionAnswers: [],
      introQuestions: [],
      permission: false,
      feedbackObj: {
        subject: "",
        description: ""
      },
      feedbackSent: false
    };
  },
  components: { studyFeatureHeader },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.eproId = this.$route.params.eproId;
  },
  methods: {
    goBack() {
      window.history.back();
    },
    nextPage() {
      this.$router.push({
        name: "epro-scheduler",
        params: { studyId: this.studyId, surveyId: this.eproId }
      });
    },
    validateEPro(permission) {
      this.$api.validateEproFact(this.eproId, { license: permission }).then(
        () => {},
        error => {
          toastr.success(
            error.body
              ? error.body.message
              : "Error while getting the epro details"
          );
        }
      );
    },
    openFeedbackModal() {
      window.$("#feedbackModal").modal("show");
      this.feedbackSent = false;
    },
    sendFeedback() {
      if (this.feedbackObj.subject && this.feedbackObj.description) {
        this.$api.postFeedbackDataFact(this.feedbackObj).then(
          () => {
            this.feedbackSent = true;
            toastr.success("Your request has been sent.");
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting the study details"
            );
          }
        );
      }
    },
    closeModal() {
      window.$("#feedbackModal").modal("hide");
      this.feedbackSent = false;
      this.feedbackObj = {
        subject: "",
        description: ""
      };
    }
  }
};
</script>

<style scoped lang="scss">
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.feedbackStyle {
  z-index: 99;
  position: fixed;
  right: 15px;
  bottom: 80px;
  text-align: right;
}

.oval {
  padding: 18px 14px;
  background-color: #ffffff;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 25px;
}

.img-size {
  width: 25px;
  height: 25px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}

.send_btn {
  display: block;
}
</style>
