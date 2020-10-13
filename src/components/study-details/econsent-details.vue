<template>
  <div class="details">
    <div class="card br-2">
      <div class="p-10">
        <div v-if="eConsentDetails">
          <h6 class="fw-bold" v-if="!isMultipleConsent">eCONSENT</h6>
          <h6 class="fw-bold" v-if="isMultipleConsent">eCONSENTS</h6>
          <div class v-if="!isMultipleConsent">
            <a href class="col-1 p-0 make-link" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href class="col-1 p-0 make-link" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class v-if="isMultipleConsent">
            <a href class="col-1 p-0 make-link" @click.prevent="expandAllMulti(eConsentDetails)">Expand all</a>
            <span class="link_style"></span>
            <a
              href
              class="col-1 p-0 make-link"
              @click.prevent="collapseAllMulti(eConsentDetails)"
            >Collapse all</a>
          </div>
          <!--For existing Consent-->
          <div v-if="!isMultipleConsent">
            <div
              class="pt-8 pb-10"
              v-if="eConsentDetails.sections && eConsentDetails.sections.length > 0"
            >
              <div>
                <i
                  class="fa fa-plus-circle pr-6"
                  v-if="!expandConsentEdu"
                  @click.prevent="expandConsentEdu = true"
                ></i>
                <i
                  class="fa fa-minus-circle pr-6"
                  v-if="expandConsentEdu"
                  @click.prevent="expandConsentEdu = false"
                ></i>
                Consent education
              </div>
              <div v-if="expandConsentEdu">
                <div class="card inner-card br-2">
                  <div
                    class="p-10"
                    v-for="(section, index) in eConsentDetails.sections"
                    :key="index"
                  >
                    <b-row class="content">Screen {{index + 1}}</b-row>
                    <b-row class="header">{{section.sectionTitle}}</b-row>
                    <b-row class="content">{{section.sectionSummary}}</b-row>
                    <b-row class="pb-6">
                      <img class="content-img" :src="section.sectionImage" alt="section-image">
                    </b-row>
                    <b-row class="sub-header">Screen {{index + 1}} {{section.sectionMoreTitle}}</b-row>
                    <b-row class="content">
                      <span v-html="section.sectionHtmlContent"></span>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
            <div class="pb-10" v-if="eConsentDetails.quiz && eConsentDetails.quiz.questions">
              <div>
                <i
                  class="fa fa-plus-circle pr-6"
                  v-if="!expandQuiz"
                  @click.prevent="expandQuiz = true"
                ></i>
                <i
                  class="fa fa-minus-circle pr-6"
                  v-if="expandQuiz"
                  @click.prevent="expandQuiz = false"
                ></i>
                Consent comprehension quiz
              </div>
              <div v-if="expandQuiz">
                <div class="card inner-card br-2 p-10">
                  <div
                    class="pb-10"
                    v-for="(question, index) in eConsentDetails.quiz.questions"
                    :key="index"
                  >
                    <b-row class="content">Question {{index+1}}</b-row>
                    <b-row class="header pb-5">{{question.body}}</b-row>
                    <b-row class="content radio">
                      <b-form-radio-group
                        class="col-12 pl-0"
                        :id="question.identifier"
                        stacked
                        v-model="question.expectedAnswer"
                        :name="question.identifier"
                        v-for="(choice, index) in question.options"
                        :key="index"
                        :disabled="true"
                      >
                        <b-col align-self="center" class="pl-0">
                          <b-form-radio type="radio" class="pl-0" v-bind:value="choice.sequence">
                            <span class="pl-20 text-align">{{choice.body}}</span>
                          </b-form-radio>
                        </b-col>
                      </b-form-radio-group>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="pb-10"
              v-if="eConsentDetails.documentProperties && eConsentDetails.documentProperties.pdfName"
            >
              <b-row>
                <b-col cols="2">Consent document</b-col>
                <b-col
                  cols="7"
                  class="doc-style cursor_pointer"
                  @click="openPdf"
                >{{eConsentDetails.documentProperties.pdfName}}</b-col>
                <b-col cols="3"></b-col>
              </b-row>
            </div>
            <div class="pb-10" v-if="eConsentDetails.privacyPolicy">
              <div>
                <i
                  class="fa fa-plus-circle pr-6"
                  v-if="!expandPrivacyPolicy"
                  @click.prevent="expandPrivacyPolicy = true"
                ></i>
                <i
                  class="fa fa-minus-circle pr-6"
                  v-if="expandPrivacyPolicy"
                  @click.prevent="expandPrivacyPolicy = false"
                ></i>
                Privacy policy
              </div>
              <div v-if="expandPrivacyPolicy">
                <div class="card inner-card br-2 p-10">
                  <span v-html="eConsentDetails.privacyPolicy"></span>
                </div>
              </div>
            </div>
          </div>
          <!--For existing Consent-->
          <!--For Multi Consent-->
          <div v-if="isMultipleConsent">
            <div
              v-for="(multiconsent, index) in eConsentDetails.consentConfigurationSort"
              :key="index"
            >
              <div class="mConsentName">{{multiconsent.consentName}}</div>
              <div
                class="pt-8 pb-10"
                v-if="multiconsent.sections && multiconsent.sections.length > 0"
              >
                <div>
                  <i
                    class="fa fa-plus-circle pr-6"
                    v-if="!inArray(multiconsent.consentId, eduMulti)"
                    @click.prevent="showMultiEducation(multiconsent.consentId)"
                  ></i>
                  <i
                    class="fa fa-minus-circle pr-6"
                    v-if="inArray(multiconsent.consentId, eduMulti)"
                    @click.prevent="hideMultiEducation(multiconsent.consentId)"
                  ></i>
                  Consent education
                </div>
                <div v-if="inArray(multiconsent.consentId, eduMulti)">
                  <div class="card inner-card br-2">
                    <div
                      class="p-10"
                      v-for="(section, index) in multiconsent.sections"
                      :key="index"
                    >
                      <b-row class="content">Screen {{index + 1}}</b-row>
                      <b-row class="header">{{section.sectionTitle}}</b-row>
                      <b-row class="content">{{section.sectionSummary}}</b-row>
                      <b-row class="pb-6">
                        <img class="content-img" :src="section.sectionImage" alt="section-image">
                      </b-row>
                      <b-row class="sub-header">Screen {{index + 1}}
                        <a target="_blank" :href="section.sectionHtmlContent">{{section.sectionMoreTitle}}</a>
                      </b-row>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-10" v-if="multiconsent.quiz && multiconsent.quiz.questions">
                <div>
                  <i
                    class="fa fa-plus-circle pr-6"
                    v-if="!inArray(multiconsent.consentId, quizMulti)"
                    @click.prevent="showMultiQuiz(multiconsent.consentId)"
                  ></i>
                  <i
                    class="fa fa-minus-circle pr-6"
                    v-if="inArray(multiconsent.consentId, quizMulti)"
                    @click.prevent="hideMultiQuiz(multiconsent.consentId)"
                  ></i>
                  Consent comprehension quiz
                </div>
                <div v-if="inArray(multiconsent.consentId, quizMulti)">
                  <div class="card inner-card br-2 p-10">
                    <div
                      class="pb-10"
                      v-for="(question, index) in multiconsent.quiz.questions"
                      :key="index"
                    >
                      <b-row class="content">Question {{index+1}}</b-row>
                      <b-row class="header pb-5">{{question.body}}</b-row>
                      <b-row class="content radio">
                        <b-form-radio-group
                          class="col-12 pl-0"
                          :id="question.identifier"
                          stacked
                          v-model="question.expectedAnswer"
                          :name="question.identifier"
                          v-for="(choice, index) in question.options"
                          :key="index"
                          :disabled="true"
                        >
                          <b-col align-self="center" class="pl-0">
                            <b-form-radio type="radio" class="pl-0" v-bind:value="choice.sequence">
                              <span class="pl-20 text-align">{{choice.body}}</span>
                            </b-form-radio>
                          </b-col>
                        </b-form-radio-group>
                      </b-row>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pb-10"
                v-if="multiconsent.documentProperties && multiconsent.documentProperties.pdfName"
              >
                <b-row>
                  <b-col cols="2">Consent document</b-col>
                  <b-col
                    cols="7"
                    class="doc-style cursor_pointer"
                    @click="openPdfMulticonsent(multiconsent)"
                  >{{multiconsent.documentProperties.pdfName}}</b-col>
                  <b-col cols="3"></b-col>
                </b-row>
              </div>
              <div v-else-if="multiconsent.listOfdocumentProperties && multiconsent.listOfdocumentProperties.length > 0">
                <div v-for="(doc, index) in multiconsent.listOfdocumentProperties" :key="index">
                  <div class="pb-10" v-if="doc && doc.pdfName">
                    <b-row>
                      <b-col cols="2">Consent document - <b>{{doc.language.display_name}}</b></b-col>
                      <b-col
                        cols="7"
                        class="doc-style cursor_pointer"
                        @click="openPdfMulticonsentLanguageBased(doc)">{{doc.pdfName}}</b-col>
                      <b-col cols="3"></b-col>
                    </b-row>
                  </div>
                </div>
              </div>
              <!-- DISCLAIMERS -->
              <div class="pb-10" v-if="multiconsent.listOfDisclaimer && multiconsent.listOfDisclaimer.length>0">
                <div>
                  <i class="fa fa-plus-circle pr-6" v-if="!inArray(multiconsent.consentId, disclaimerMulti)"
                    @click.prevent="toggleDisclaimer(multiconsent.consentId)"></i>
                  <i class="fa fa-minus-circle pr-6" v-if="inArray(multiconsent.consentId, disclaimerMulti)"
                    @click.prevent="toggleDisclaimer(multiconsent.consentId)"></i>
                  Disclaimer
                </div>
                <div v-if="inArray(multiconsent.consentId, disclaimerMulti)">
                  <div class="card inner-card br-2 p-10">
                    <div
                      class="pb-10"
                      v-for="(disclaimerObj, dindex) in multiconsent.listOfDisclaimer"
                      :key="disclaimerObj.disclaimerId"
                    >
                      <b-row class="content">Disclaimer {{dindex+1}}</b-row>
                      <b-row class="content">{{disclaimerObj.disclaimer}}</b-row>
                    </div>
                  </div>
                </div>
              </div>
              <!-- DISCLAIMERS END -->
            </div>
            <div class="pb-10" v-if="eConsentDetails.privacyPolicy">
              <div>
                <i
                  class="fa fa-plus-circle pr-6"
                  v-if="!expandPrivacyPolicy"
                  @click.prevent="expandPrivacyPolicy = true"
                ></i>
                <i
                  class="fa fa-minus-circle pr-6"
                  v-if="expandPrivacyPolicy"
                  @click.prevent="expandPrivacyPolicy = false"
                ></i>
                <div class="mConsentName">Privacy policy</div>
              </div>
              <div v-if="expandPrivacyPolicy">
                <div class="card inner-card br-2 p-10">
                  <span v-html="eConsentDetails.privacyPolicy"></span>
                </div>
              </div>
            </div>
          </div>
          <!--For Multi Consent-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'econsent-details',
  data() {
    return {
      expandConsentEdu: false,
      expandQuiz: false,
      expandPrivacyPolicy: false,
      expandConsentEduMulti: false,
      expandQuizMulti: false,
      expandPrivacyPolicyMulti: false,
      eduMulti: [],
      quizMulti: [],
      disclaimerMulti: []
    };
  },
  components: {},
  props: {
    eConsentDetails: {
      default: () => {},
    },
    isMultipleConsent: Boolean,
  },
  methods: {
    expandAll() {
      this.expandConsentEdu = true;
      this.expandQuiz = true;
      this.expandPrivacyPolicy = true;
    },
    collapseAll() {
      this.expandConsentEdu = false;
      this.expandQuiz = false;
      this.expandPrivacyPolicy = false;
    },
    expandAllMulti(eConsentDetails) {
      for (let i = 0; i < eConsentDetails.consentConfigurationSort.length; i++) {
        // eslint-disable-line
        if (!this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.eduMulti)) {
          this.eduMulti.push(eConsentDetails.consentConfigurationSort[i].consentId);
        }
        if (!this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.quizMulti)) {
          this.quizMulti.push(eConsentDetails.consentConfigurationSort[i].consentId);
        }
        if (!this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.disclaimerMulti)) {
          this.disclaimerMulti.push(eConsentDetails.consentConfigurationSort[i].consentId);
        }
      }
      this.expandPrivacyPolicy = true;
    },
    collapseAllMulti(eConsentDetails) {
      for (let i = 0; i < eConsentDetails.consentConfigurationSort.length; i++) {
        // eslint-disable-line
        if (this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.eduMulti)) {
          this.eduMulti.splice(eConsentDetails.consentConfigurationSort[i].consentId);
        }
        if (this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.quizMulti)) {
          this.quizMulti.splice(eConsentDetails.consentConfigurationSort[i].consentId);
        }
        if (this.inArray(eConsentDetails.consentConfigurationSort[i].consentId, this.disclaimerMulti)) {
          this.disclaimerMulti.splice(eConsentDetails.consentConfigurationSort[i].consentId);
        }
      }
      this.expandPrivacyPolicy = false;
    },
    openPdf() {
      window.open(this.eConsentDetails.documentProperties.pdfLink, '_blank');
    },
    openPdfMulticonsent(multiconsent) {
      window.open(multiconsent.documentProperties.pdfLink, '_blank');
    },
    openPdfMulticonsentLanguageBased(doc) {
      window.open(doc.pdfLink, '_blank');
    },
    showMultiEducation(consentId) {
      if (!this.inArray(consentId, this.eduMulti)) {
        this.eduMulti.push(consentId);
      }
    },
    hideMultiEducation(consentId) {
      if (this.inArray(consentId, this.eduMulti)) {
        this.eduMulti.splice(this.eduMulti.indexOf(consentId), 1);
      }
    },
    showMultiQuiz(consentId) {
      if (!this.inArray(consentId, this.quizMulti)) {
        this.quizMulti.push(consentId);
      }
    },
    hideMultiQuiz(consentId) {
      if (this.inArray(consentId, this.quizMulti)) {
        this.quizMulti.splice(this.quizMulti.indexOf(consentId), 1);
      }
    },
    inArray(needle, haystack) {
      const length = haystack.length; // eslint-disable-line
      for (let i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
      }
      return false;
    },
    toggleDisclaimer(consentId) {
      if (!this.inArray(consentId, this.disclaimerMulti)) {
        this.disclaimerMulti.push(consentId);
      }else{
        this.disclaimerMulti.splice(this.disclaimerMulti.indexOf(consentId), 1);
      }
    }
  },
};
</script>

<style scoped>
.mConsentName {
  font-weight: bold;
  font-size: 16px;
  margin-top:10px;
  padding:0;
  display: inline-block;
}
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
/deep/ p {
  margin-top: 0;
  margin-bottom: 0 !important;
}
.sub-header {
  opacity: 0.7;
  font-size: 12px;
  color: #666669;
}
.radio-style {
  position: relative;
  top: 2px;
}
.doc-style {
  color: #4c8ce4;
}
.content-img {
  width: auto;
  height: 100%;
  max-height: 80px;
}
.make-link {
  color: #007bff !important;
}
</style>
