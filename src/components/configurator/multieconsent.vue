<template>
  <div class="container">
    <div class>
      <div class="mt-100 container-style mb-100 pb-40">
        <studyFeatureHeader></studyFeatureHeader>

        <div v-if="consentData.opType === 'toAdd'">
          <editMultiConsent
            :options="consentData"
            :existingConsent="existingConsents"
            @exit="closeModal"
          ></editMultiConsent>
        </div>

        <div v-if="consentData.opType === 'toEdit'">
          <editMultiConsent
            :options="consentData"
            :existingConsent="existingConsents"
            @exit="closeModal"
          ></editMultiConsent>
        </div>

        <div v-if="privacyReadMode">
          <privacyPolicy
            :operationType="privacyPolicyOPType"
            :privacyPolicyData="privacyPolicy"
            @save="savePrivacyPolicy"
            @cancel="cancelEditingPrivacyPolicy"
            @delete="deletePrivacyPolicy"
          ></privacyPolicy>
        </div>

        <div v-if="licenseReadMode">
          <licenseAgreement @done="closeLicenseAgreementReading" :option="licenses"></licenseAgreement>
        </div>

        <div class="multiconsent-box1" v-if="multiconsent.box1">
          <div class="multiconsent-box1-heading1">Consents and agreements</div>
          <div
            class="multiconsent-box1-content1"
          >All consents and/or agreements required for this study. This may include the general study consent, child assent, HIPAA authorization, etc.</div>
          <div class="multiconsent-box1-btn1">
            <button
              class="add-consent-btn white-btn"
              v-on:click="addNewConsent()"
            >Add a consent or agreement</button>
          </div>
          <div class="multiconsent-box1-divider"></div>
          <draggable
            v-if="existingConsents.length > 0"
            v-model="existingConsents"
            v-for="(v, key) in existingConsents"
            v-bind:key="key"
            class="multiconsent-box1-bottom"
          >
            <div class="left-block">
              <span class="consent-name">{{v.consentName}}</span>
            </div>

            <div class="right-block">
              <span class="link" v-on:click="editConsent(v)">Edit</span>
              <span class="edit-icon" v-on:click="deleteConsent(v)">
                <img src="static/img/econsent/collapse_consent.svg" />
              </span>
            </div>

            <div class="clearfix"></div>
          </draggable>
          <div
            class="multiconsent-box1-content2"
            v-if="existingConsents.length === 0"
          >No consents added</div>
        </div>
        <div class="multiconsent-box2" v-if="multiconsent.box2">
          <div class="multiconsent-box2-heading1">Assign consents and agreements</div>
          <div
            class="multiconsent-box2-content1"
          >Assign the consents and/or agreements you have created to your participants. You may create multiple cohorts and assign them different consents/agreements. If you have more than one cohort, your participants will be asked to select the cohort that best describes them.</div>
          <div class="multiconsent-box2-btn1" v-if="cohorts.addButton">
            <button class="white-btn add-cohort-btn" v-on:click="addNewCohort()">Add a cohort</button>
          </div>
          <div v-if="cohort.opType === 'toAdd'">
            <addEditCohort
              :options="cohort"
              :existingCohort="existingCohorts"
              @cancel="cancelEditing"
              @save="saveCohort"
            ></addEditCohort>
          </div>
          <div v-if="cohort.opType === 'toEdit'">
            <addEditCohort
              :options="cohort"
              :existingCohort="existingCohorts"
              @cancel="cancelEditing"
              @save="saveCohort"
            ></addEditCohort>
          </div>
          <div class="multiconsent-box2-divider"></div>
          <div class="multiconsent-box2-bottom">
            <div v-if="existingCohorts.length > 0">
              <div
                v-for="(v, key) in existingCohorts"
                v-bind:key="key"
                class="multiconsent-box1-bottom"
              >
                <div v-if="cohort.editCurrentCohort === 'toEdit' && cohort.cohortId === v.cohortId">
                  <cohortConsentAssociation
                    :cohort="v"
                    :existingCohort="existingCohorts"
                    @cancelEditing="cancelAssociationEditing"
                    @deleteCohort="deleteCohort"
                  ></cohortConsentAssociation>
                </div>
                <div v-else v-bind:class="{ 'disable-row': isDisable }">
                  <div class="left-block">
                    <div class="multiconsent-box2-content2">{{v.cohortName}}</div>
                    <div
                      class="cohort-consent-name"
                      v-if="v.associatedConsent != null"
                    >{{ v.associatedConsent.map(item=>item.consentName).join(' > ') }}</div>
                  </div>
                  <div class="right-block">
                    <div
                      v-if="v.associatedConsent != null && v.associatedConsent.length > 0"
                      style="display:inline-block;"
                    >
                      <span class="link" v-on:click="editCohort(v)">Edit</span>
                    </div>
                    <div v-else style="display:inline-block;">
                      <button
                        class="colored-btn select-consent-btn"
                        v-on:click="editCohort(v)"
                      >Select consents</button>
                    </div>
                    <span class="edit-icon" v-on:click="deleteCohort(v)">
                      <img src="static/img/econsent/collapse_consent.svg" />
                    </span>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="multiconsent-box2-content1">No cohort available</div>
            </div>
          </div>
        </div>

        <div class="multiconsent-box3" v-if="multiconsent.box3">
          <div class="multiconsent-box3-heading1">Legal</div>
          <div class="multiconsent-box3-divider"></div>
          <div class="multiconsent-box3-bottom1">
            <div class="left-block">
              <div class="multiconsent-box3-bottom1-content1">Privacy Policy</div>
            </div>
            <div class="right-block" v-if="privacyPolicy == ''">
              <button
                class="white-btn add-privacy-policy-btn"
                v-on:click="addPrivacyPolicy()"
              >Add privacy policy</button>
            </div>
            <div class="right-block" v-else>
              <button
                class="white-btn add-privacy-policy-btn"
                v-on:click="editPrivacyPolicy()"
              >Edit a privacy policy</button>
            </div>
            <div class="clearfix"></div>
          </div>

          <div class="multiconsent-box3-bottom2">
            <div class="left-block">
              <div
                class="multiconsent-box3-bottom2-content1"
              >THREAD Study Application End User License Agreement</div>
            </div>
            <div class="right-block">
              <span class="link" v-on:click="viewLicenseAgreement()">View</span>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>

        <div class="footerStyle">
          <div class="container">
            <div class="row">
              <div class="row" v-if="isStudySummary">
                <b-btn class="btn nextBtn float-left br-25" @click="cancelModify">Cancel modifying</b-btn>
                <button
                  class="btn br-25 continue-btn mr-10"
                  v-on:click="nextClick()"
                >Save and Continue</button>
                <b-btn
                  class="btn br-25 disable-btn p-0 pt-5 mr-10"
                  :to="{ name: 'study-summary', params: {   studyId: studyId } }"
                >Back to study summary</b-btn>
              </div>
              <div class="row" v-if="!isStudySummary">
                <button
                  class="btn br-25 disable-btn mr-10"
                  style="float:none;"
                  v-on:click="skipForNow()"
                >Skip for now</button>
                <button class="btn nextBtn br-25" v-on:click="nextClick()">Save and Continue</button>
              </div>
            </div>
          </div>
        </div>
        <CancelModal ref="cancelConfirmation" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import toastr from "toastr";
import draggable from "vuedraggable";
import swal from "sweetalert2";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import studyFeatureHeader from "../common/study-features-header";
import addEditConsent from "../common/add-edit-multi-consent";
import addEditQuiz from "../common/add-edit-multi-consent-quiz";
import addEditCohort from "../common/add-edit-cohort";
import cohortConsentAssociation from "../common/cohort-consent-association";
import privacyPolicy from "../common/add-edit-multi-consent-privacy-policy";
import licenseAgreement from "../common/view-license-agreement";
import editMultiConsent from "../common/edit-multi-consent";
import CancelModal from "./cancel-modify-modal";

export default {
  name: "multieconsent",
  data() {
    return {
      isDisable: false,
      multiconsent: {
        box1: true,
        box2: true,
        box3: true
      },
      cohorts: {
        addButton: true
      },
      existingConsents: [],
      existingCohorts: [],
      selectedConsentSection: {
        sectionId: "",
        sectionType: "default",
        sectionNumber: "",
        sectionTitle: "",
        sectionImage: "",
        sectionImageTemp: "",
        sectionSummary: "",
        sectionHtmlContent: "",
        opType: ""
      },
      consentData: {
        consentName: "",
        consentId: "",
        consentType: "default",
        opType: ""
      },
      cohort: {
        cohortName: "",
        cohortId: "",
        opType: "",
        associatedConsent: [],
        editCurrentCohort: ""
      },
      consentSections: [],
      quizQuestions: [],
      consentDocReadMode: true,
      fileSelected: null,
      studyData: {},
      branding: {},
      consentDocData: {
        file: null,
        htmlDocument: null,
        pdfLink: null
      },
      privacyPolicyOriginal: null,
      privacyPolicy: "",
      privacyReadMode: false,
      privacyPolicyOPType: "",
      licenses: null,
      licenseReadMode: false,
      addEditQuizQuestion: {
        type: "default",
        body: "",
        sequence: 1,
        description: "",
        expectedAnswer: "",
        options: [{ body: "", sequence: 1 }, { body: "", sequence: 2 }],
        opType: ""
      },
      studyId: null,
      expand: false,
      collapse: true,
      addQuiz: false,
      editQuiz: false,
      tempDocData: null,
      editorOptionsMore: {
        placeholder: "Enter your study consent",
        readOnly: false,
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"]
          ]
        }
      },
      editorOptionsFew: {
        placeholder: "Enter your privacy policy",
        readOnly: false,
        modules: {
          toolbar: [["bold", "italic", "underline"], ["clean"]]
        }
      },
      isStudySummary: JSON.parse(
        window.localStorage.getItem("thread-studySummary")
      )
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      const scrollableSection = window.document.getElementById(
        "feature_menu_scroll"
      );
      scrollableSection.scrollLeft += 100;
    }, 1500);
    this.studyId = this.$route.params.studyId;
    this.getExistingConsents();
    this.getExistingCohorts();
    this.getPrivacyPolicy();
    this.generateLicenseInfo();
  },
  computed: {},
  watch: {},
  methods: {
    generateLicenseInfo() {
      this.licenses =
        '<div><p><i>Last updated: April 13, 2020</i></p> <p>THREAD End User License Agreement</p> <p><strong>DO NOT USE THIS SOFTWARE UNTIL YOU HAVE CAREFULLY READ THE TERMS OF THIS END USER LICENSE AGREEMENT (&ldquo;AGREEMENT&rdquo;). BY DOWNLOADING, USING OR INSTALLING THE SOFTWARE, YOU AGREE TO ALL OF THE TERMS OF THIS AGREEMENT AND OUR PRIVACY POLICY, INCLUDING WARRANTY DISCLAIMERS AND OTHER LANGUAGE THAT LIMITS THREAD&rsquo;S LIABILITY TO YOU. YOU AGREE THAT THESE TERMS ARE FAIR AND REASONABLE, AND YOUR AGREEMENT TO FOLLOW THE RULES OF THIS AGREEMENT IS NOT BECAUSE ANYONE HAS FORCED YOU TO DO SO.&nbsp; IF YOU DO NOT AGREE TO ALL OF THE TERMS, DO NOT USE THE SOFTWARE.</strong></p> <p>This End User License Agreement (&ldquo;Agreement&rdquo;) sets forth the terms and conditions upon which you may download and use the THREAD mobile application, related services, and all updates provided to you (collectively, &ldquo;Study App&rdquo;) by Definitive Media Corp. dba &ldquo;THREAD&rdquo; (&ldquo;THREAD&rdquo;) and/or its authorized distributors. &ldquo;You&rdquo;, &ldquo;your&rdquo;, &ldquo;yourself&rdquo; means you, as an individual.</p> <div><strong>1. General</strong></div> <p>The terms of this Agreement will govern the Study App and any software updates that change the original Study App. You agree to all terms, conditions, and restrictions in this Agreement. You agree that any use of the Study App that violates this Agreement invalidates this license. By downloading and using this Study App, you represent and warrant that you are at least 18 years old. If you are under 18 years of age, you represent and warrant that you have obtained your parent or legal guardian&rsquo;s permission to use this Study App. You must not use the Study App if you are not allowed to do so under the laws of the country in which you are resident or from which you access or use the Study App.</p> <div><strong>2. Permitted Use and Restrictions</strong></div> <p>Grant of License and Reservations. Subject to the terms of this Agreement, THREAD grants you a limited, non-exclusive, revocable, non-transferable license to install and use the Study App and any future updates provided to you solely for use in connection with your participation in a remote patient study. This Study App is licensed, not sold, to you by THREAD for use only under the terms of this Agreement. THREAD reserves all rights not expressly granted to you. You may own the phone or other device on which the Study App is stored, but THREAD owns the Study App itself.</p> <ol type="a"> <li>Reverse Engineering. Unless we allow you to do so in another part of this Agreement, you agree not to do the following activities related to the Study App:</li> <ol type="i"> <li>reverse engineer, duplicate, modify, sublicense, make copies, create derivative works from, distribute or provide others with the Study App, in whole or part;</li> <li>lease, loan, distribute, or otherwise provide others access to or with any aspect of the Study App; and</li> <li>develop, sell, or distribute applications that are capable of launching, being launched from, or are otherwise integrated with, the Study App unless we give you written permission.</li> </ol> <li>Further Restrictions. You further agree to not use the Study App to do the following:</li> <ol type="i"> <li>Transmit, access, or communicate any data that you do not have the right to transmit, access, or communicate under applicable laws;</li> <li>transmit or communicate any data that contains software viruses or any other computer code, files, or programs designed, intended, or likely to interrupt, destroy or limit the functionality of any computer software or hardware;</li> <li>interfere with or disrupt or circumvent the Study App; and</li> <li>transmit or communicate any data that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another&rsquo;s privacy, hateful or racially, ethnically or otherwise objectionable.</li> </ol> </ol> <div><strong>3. Your Data</strong></div> <p>The primary purpose of the Study App is to collect data about you and/or your health when you agree to participate in a remote patient study. The types of data that are collected by the Study App and how we use that data are described more fully in our Privacy Policy, which you should fully review and agree to before using the Study App.</p> <p>You agree that the data stored by THREAD shall not serve as the system of record for you, your personal representative, health care provider, any business associate of a health care provider, or any affiliates of the above. You understand and agree that the THREAD web portal allows an authorized partner or sponsor or research institution to access and analyze your data collected from the Study App. Your consent is required prior to THREAD disclosing any identifiable data of yours, and will only be made available to those partners or sponsors to whom you provide consent.</p> <div><strong>4. No Medical Advice or Treatment</strong></div> <p>THREAD does not provide medical advice, diagnosis, or treatment. You agree that the Study App is merely a tool to allow the collection and analysis of certain data and information from you in support of a clinical study. During the course of a clinical study, the Study App may be used along with the provision of healthcare to you by independent third party healthcare providers including physicians, physician assistants, nurses, healthcare systems, healthcare facilities, or other providers of healthcare services (collectively, &ldquo;Healthcare Provider(s)&rdquo;). You agree that the Healthcare Providers are solely responsible for and will have complete responsibility and control over the provision of all medical services, advice, instructions, treatment decisions, and other professional health care services performed.</p> <p>You further agree that THREAD does not provide or endorse any medical advice on or through the Study App and no information obtained through the Study App can be so construed or used. THREAD will have and exercise absolutely no control, authority, or supervision over the provision of any medical services or other professional health care services. THREAD will make all reasonable efforts in accordance with applicable laws and agreements to protect the integrity and availability of the Study App, and have implemented robust administrative, logical and physical controls to ensure the confidentiality, integrity and availability of the data provided on or made available through the Study App. Further, when using the Study App, information may be transmitted over a medium that may be beyond the control and jurisdiction of THREAD and its suppliers. Accordingly, THREAD assumes no liability for or relating to the delay, failure, interruption, or corruption of any data or other information transmitted in connection with use of the Study App that is reasonably determined to be beyond THREAD&rsquo;s control.</p> <div><strong>5. Registration</strong></div> <p>Upon registration, you agree to provide current, accurate, and complete information about yourself as is required by the customer or sponsor of a study to register to use the Study App and at other points as may be required in the course of using the Study App, including your complete legal name, email address, and such other information as may be requested by the customer or sponsor via THREAD (&ldquo;Registration Data&rdquo;). &nbsp;The sole information required by THREAD for your registration is an e-mail address. Further, you agree to maintain and update your Registration Data as required to keep it current, accurate, and complete. You agree that THREAD may store and use the Registration Data you provide in connection with your use of the Study App in accordance with the Privacy Policy. THREAD has the right, but not the duty, to confirm or otherwise verify or check, in its sole discretion, the truth and accuracy of any registration information at any time. THREAD may terminate your rights to the entire Study App, if any information you provide is false, incomplete or inaccurate.</p> <div><strong>6. Third Party Technology</strong></div> <p>Any and all third party technology and third party websites provided, made available, linked to, or otherwise accessible through the Study App (&ldquo;Third Party Technology&rdquo;) is provided solely as a convenience to you and is not under the control of THREAD. THREAD does not endorse, recommend, or otherwise make any representations or warranties with respect to any Third Party Technology. You agree to comply with any and all terms and conditions applicable to the use of Third Party Technology.</p> <div><strong>7. Authorized Use</strong></div> <p>Except as stated elsewhere in this Agreement, you will keep the Study App confidential and will not give anyone else access to it. Any rights you may have in the Study App expire upon termination of this Agreement.</p> <div><strong>8. Export Law Assurances</strong></div> <p>You will not use or otherwise export or re-export this Study App except as authorized by United States law and the laws of the jurisdiction in which the Study App was obtained. In particular, but without limitation, the Study App will not be exported or re-exported (1) into (or to a national or resident of) any U.S. embargoed countries, or (2) to anyone on the U.S. Treasury Department&rsquo;s list of Specially Designated Nationals or the U.S. Department of Commerce Denied Persons&rsquo; List or Entity List. By using the Study App, you represent and warrant that you are not located in, under control of, or a national or resident of any such country or on any such list.</p> <div><strong>9. Trademarks</strong></div> <p>Trademarks, service marks, graphics and logos used in connection with the Study App are the trademarks of their respective owners. THREAD&trade;, eDRO&trade; and the trademarks related to the Study App are trademarks of THREAD. You are not granted any right or license with respect to any of the trademarks mentioned above and any use of such trademarks.</p> <div><strong>10. Ownership and Title</strong></div> <p>All title to and the rights in the Study App, any derivatives, and all associated goodwill are the exclusive property of THREAD and/or third parties.</p> <div><strong>11. Representations &amp; Warranties</strong></div> <p>In addition to the other representations and warranties contained in this Agreement, you further represent, warrant, and covenant to THREAD the following:</p> <ol type="a"> <li>All information you provide to THREAD as part of the registration process or otherwise will be truthful, accurate and complete, even if THREAD does not independently verify your information;</li> <li>Your use of the Study App will comply with all applicable laws and regulations within the United States and/or your country of jurisdiction, as applicable; and</li> <li>You represent that you have full power, capacity and authority to enter into this Agreement and understand and accept its terms.</li> </ol> <div><strong>12. Disclaimer of Warranties</strong></div> <p>THE STUDY APP, AND ANY THIRD PARTY TECHNOLOGY ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF TITLE, NON-INFRINGEMENT, AND IMPLIED WARRANTIES OF MERCHANTABILITY, MERCHANTABLE QUALITY OR FITNESS FOR A PARTICULAR PURPOSE.</p> <div><strong>13. Limitation of Liability</strong></div> <p>EXCEPT WHERE PROHIBITED BY LAW, UNDER NO CIRCUMSTANCES WILL THREAD BE LIABLE TO YOU OR ANY OTHER PERSON FOR DIRECT, CONSEQUENTIAL, SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, OR EXEMPLARY DAMAGES, COSTS, EXPENSES OR LOSSES OR LOST PROFITS IN CONNECTION WITH THE STUDY APP OR OTHERWISE RELATED TO THIS AGREEMENT.</p> <p>THE PROVISIONS OF THIS SECTION WILL APPLY REGARDLESS OF THE FORM OF ACTION, DAMAGE, CLAIM, LIABILITY, COST, EXPENSE, OR LOSS, WHETHER IN CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE), FAILURE OF ESSENTIAL PURPOSE OR OTHERWISE, AND EVEN IF ADVISED OF THE LIKELIHOOD OF SUCH DAMAGES. THREAD WILL NOT BE LIABLE FOR ANY FAILURE TO PERFORM ITS OBLIGATIONS UNDER THIS AGREEMENT BECAUSE OF CIRCUMSTANCES BEYOND ITS CONTROL, WHICH CIRCUMSTANCES INCLUDE NATURAL DISASTER, TERRORISM, THIRD PARTY LABOR DISPUTES, WAR, DECLARATIONS OF GOVERNMENTS, TRANSPORTATION DELAYS, FAILURE OF HARDWARE, EQUIPMENT, OR TELECOMMUNICATIONS FAILURE. THREAD WILL NOT BE LIABLE FOR ANY FAILURE TO PERFORM ITS OBLIGATIONS UNDER THIS AGREEMENT BECAUSE OF YOUR MISUSE OF THE STUDY APP BY YOU OR ANY OTHER PERSON.</p> <p>THIS SECTION WILL BE GIVEN FULL EFFECT EVEN IN THE EVENT THAT ANY EXCLUSIVE REMEDY PROVIDED HAS FAILED OF ITS ESSENTIAL PURPOSE. FURTHER, IN NO EVENT WILL THREAD BE LIABLE TO YOU OR ANYONE ELSE FOR ANY CLAIMS, LOSSES, OR DAMAGES ARISING OUT OF ANY USE OR MISUSE OF ANY THIRD PARTY TECHNOLOGY. THE PARTIES ACKNOWLEDGE THAT THE TERMS OF THIS SECTION REFLECT THE ALLOCATION OF RISK SET FORTH IN THIS AGREEMENT AND THAT THE PARTIES WOULD NOT ENTER INTO THIS AGREEMENT WITHOUT THESE LIMITATIONS OF LIABILITY. IN NO EVENT SHALL THE LIABILITY OF THREAD FOR ANY LOSS RELATED TO USE OR INABILITY TO USE THE STUDY APP EXCEED $20.00 U.S.&nbsp;</p> <p>SOME JURISDICTIONS MAY NOT ALLOW EXCLUSIONS OR LIMITATIONS OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, EXCLUSIONS OR LIMITATIONS OF IMPLIED WARRANTIES, DUTIES OR CONDITIONS, OR ALLOW LIMITATIONS ON HOW LONG AN IMPLIED WARRANTY, DUTY OR CONDITION LASTS, SO THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU.</p> <p>NOTHING IN THIS SECTION OR AGREEMENT IS INTENDED TO, OR WILL BE INTERPRETED TO, GIVE UP ANY LEGAL RIGHT THAT YOU HAVE AS A CLINICAL RESEARCH SUBJECT.</p> <div><strong>14. Release</strong></div> <p>IN THE EVENT THAT YOU HAVE A DISPUTE FOR ANY REASON WITH THE RESEARCHER, SPONSOR, OR ACADEMIC INSTITUTION CONDUCTING THE REMOTE PATIENT STUDY FOR WHICH THE STUDY APP IS UTILIZED, YOU RELEASE THREAD (AND ITS OFFICERS, DIRECTORS, MANAGERS, MEMBERS, AGENTS, SUBSIDIARIES, REPRESENTATIVES, AND EMPLOYEES) FROM ALL CLAIMS, DEMANDS AND DAMAGES (ACTUAL AND CONSEQUENTIAL) OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, SUSPECTED AND UNSUSPECTED, DISCLOSED AND UNDISCLOSED, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTES. IF YOU ARE A CALIFORNIA RESIDENT, YOU WAIVE CALIFORNIA CIVIL CODE &sect;1542, WHICH PROVIDES: &ldquo;A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR.&rdquo;&nbsp;&nbsp;</p> <p>NOTHING IN THIS SECTION OR AGREEMENT IS INTENDED TO, OR WILL BE INTERPRETED TO, GIVE UP ANY LEGAL RIGHT THAT YOU HAVE AS A CLINICAL RESEARCH SUBJECT.&nbsp;</p> <div><strong>15. Term</strong></div> <p>Unless otherwise terminated by THREAD as provided for in this Agreement, this Agreement will remain in effect for so long as THREAD licenses the use of the Study App to you.</p> <div><strong>16. Termination</strong></div> <p>THREAD may, in its sole discretion and without prior notice, terminate your access to the Study App for violations of this Agreement, the Privacy Policy or other agreements or guidelines, which may be associated with your use of the Study App, or if THREAD deems it necessary in its sole discretion. Further, the researcher, sponsor, or academic institution conducting the remote patient study may terminate, or request that THREAD terminate your access to the Study App. In any such event, you must de-install and permanently delete or destroy all copies of the Study App and all of its component parts. Failure to abide by this Agreement is a material breach of this Agreement for which THREAD may pursue all rights and remedies it has pursuant to this Agreement, and any other rights and remedies it may have at law or in equity. You also agree that any violation by you of this Agreement will constitute an unlawful and unfair business practice and will cause irreparable harm to THREAD, for which monetary damages would be inadequate, and you consent to THREAD obtaining any injunctive or equitable relief that THREAD deems necessary or appropriate in such circumstances without the need to post a bond or satisfy any similar requirements. These remedies are in addition to any other remedies THREAD may have at law or in equity.</p> <div><strong>17. U.S. Government End Users</strong></div> <p>The Study App is a &ldquo;commercial item&rdquo; as that term is defined at FAR 2.101, consisting of &ldquo;commercial computer software&rdquo; and &ldquo;commercial computer software documentation&rdquo; as such terms are used in 48 C.F.R. 12.212 and is provided to the U.S. Government only as a commercial end item. Consistent with FAR 12.212 and DFARS 227.7202, all U.S. Government End Users acquire the Study App with only those rights expressly set forth in this Agreement.</p> <div><strong>18. General Provisions</strong></div> <ol type="a"> <li>Entire Agreement. This Agreement, the Privacy Policy, and any other terms of use, or other guidelines (collectively, &ldquo;Other Terms&rdquo;) provided by THREAD through or in connection with the Study App contain the entire understanding of the parties with respect to the subject matter of this Agreement and supersede all previous verbal and written agreements between the parties concerning the subject matter of this Agreement. To the extent that any Other Terms conflict with any provision of this Agreement, this Agreement will control. Notwithstanding the above, to the extent that there is a conflict between the Privacy Policy and this Agreement, this Agreement will control with respect to your use of the Study App; the Privacy Policy controls with respect to the collection, use, disclosure and disposal of your information. THREAD reserves the right to change, add or remove the Study App at any time and at its sole discretion. Your continued use of the Study App following the posting or delivery to you of any changes means that you accept and agree to such changes.</li> <li>Assignment. This Agreement, and any rights or obligations in this Agreement will not be assigned by you without the prior written consent of THREAD. Any attempt to assign or transfer this Agreement other than in accordance with this provision will be null and void. Subject to the forgoing, this Agreement and its terms and provisions inure to the benefit of and are binding upon the parties and their respective successors, heirs, personal representatives, and assigns.</li> <li> Governing Law/Waiver of Trial by Jury. <ol> <li>Except to the extent expressly provided in the following paragraph, You agree that all matters relating to Your access to or use of the Study App, including all disputes, will be governed by the laws of the United States and by the laws of the State of California without regard to its conflicts of laws provisions. You agree to the personal jurisdiction by and venue in the state and federal courts in Orange County, California.</li> <li>If You are a citizen of any country outside of the United States, You agree that all matters relating to Your access to or use of the Study App, including all disputes, shall be determined by arbitration administered by the International Centre for Dispute Resolution (&ldquo;ICDR&rdquo;) in accordance with its International Arbitration Rules. The number of arbitrators shall be one, and the place of arbitration shall be 725 South Figueroa, Suite 400, Los Angeles, California, 90017, United States. The language of the arbitration shall be English. Each party submits to the exclusive jurisdiction of the ICDR and agrees not to commence any legal action under or in connection with the subject matter of this Agreement in any other court or forum.</li> <li>This Agreement will not be governed by the United Nations Convention on Contracts for the International Sale of Goods, the application of which is expressly excluded. If for any reason a court of competent jurisdiction finds any provision, or portion of any provision, to be unenforceable, the remainder of this Agreement will continue in full force and effect.</li> <li>EXCEPT WHERE PROHIBITED BY LAW, THE PARTIES EXPRESSLY WAIVE TRIAL BY JURY IN ANY JUDICIAL PROCEEDING INVOLVING ANY DISPUTE, CONTROVERSY, OR CLAIM ARISING OUT OF OR RELATING TO THIS AGREEMENT.</li> </ol> </li> <li> <p>Notices. All notices, requests, or consents sent to THREAD that are required or permitted under this Agreement must be in writing (including electronic form) and must be delivered to the address designated below in a notice served in the manner provided for below. Each notice, request, consent, or other communication will be given and will be effective: (1) if delivered by hand, when so delivered; (2) if delivered by nationally recognized overnight courier service or sent by United States Express Mail, upon confirmation of delivery; (3) if delivered by certified or registered mail, on the third following day after deposit with the United States Postal Service; or (4) if delivered by email, upon confirmation of receipt by the other party in writing by return email.</p> <p>THREAD<br /> 155 El Camino Real, Suite B<br /> Tustin, CA 92780</p> <p><a href="mailto:info@threadresearch.com">info@threadresearch.com</a></p> </li> <li>Severability. The provisions of this Agreement are severable. The invalidity, in whole or in part, of any provision of this Agreement will not affect the validity or enforceability of any other of its provisions. If one or more provisions of this Agreement are declared invalid or unenforceable, the remaining provisions will remain in full force and effect and will be construed in the broadest possible manner to effectuate the purposes of this Agreement.</li> <li>Captions. The headings and captions of this Agreement are inserted for reference convenience and do not define, limit, or describe the scope or intent of this Agreement or any particular section, paragraph, or provision of this Agreement. Unless otherwise expressly provided, the words &ldquo;include(s),&rdquo; &ldquo;included,&rdquo; or &ldquo;including&rdquo; do not limit the preceding words or terms. Pronouns will refer to the masculine, feminine, neuter, singular, or plural as the context will require.</li> <li>Waiver. The failure or delay of THREAD to exercise or enforce any rights or provision of this Agreement does not constitute a waiver of such right or provision.</li> <li>Survival. All provisions which must survive in order to give effect to their meaning will survive any expiration or termination of this Agreement, including without limitation, Sections 2(b), 16, 17, 18 and 19 and all of your representations, warranties and indemnification obligations, which will survive any expiration or termination of this Agreement indefinitely.</li> <li>Nothing in this section or Agreement is intended to, or will be interpreted to, give up any legal right that you have as a clinical research subject.</li> </ol></div>'
    },
    closeModal() {
      this.getExistingConsents();
      this.multiconsent.box1 = true;
      this.multiconsent.box2 = true;
      this.multiconsent.box3 = true;
      this.consentData.opType = "";
      window.scrollTo(0, 0);
    },
    deletePrivacyPolicy() {
      this.privacyPolicyOPType = "toAdd";
      this.privacyPolicy = "";
      this.privacyPolicyOriginal = "";
      this.privacyReadMode = false;
      this.multiconsent.box1 = true;
      this.multiconsent.box2 = true;
      this.multiconsent.box3 = true;
      this.getPrivacyPolicy();
    },
    cancelEditingPrivacyPolicy() {
      this.privacyPolicyOPType = "toAdd";
      this.privacyReadMode = false;
      this.multiconsent.box1 = true;
      this.multiconsent.box2 = true;
      this.multiconsent.box3 = true;
    },
    savePrivacyPolicy(privacyPolicy) {
      // eslint-disable-line
      this.privacyPolicyOPType = "toEdit";
      this.privacyPolicy = privacyPolicy;
      this.privacyPolicyOriginal = privacyPolicy;
      this.privacyReadMode = false;
      this.multiconsent.box1 = true;
      this.multiconsent.box2 = true;
      this.multiconsent.box3 = true;
      this.getPrivacyPolicy();
    },
    goBack() {
      window.history.back();
    },
    cancelEditing() {
      this.cohort.opType = "";
      this.cohorts.addButton = true;
    },
    cancelAssociationEditing(data) {
      // eslint-disable-line
      const that = this;
      that.existingCohorts = new Array(); // eslint-disable-line
      that.getExistingCohorts();
      that.cohort.editCurrentCohort = "";
      that.cohort.cohortId = "";
      that.isDisable = false;
    },
    saveCohort(addedCohort) {
      this.existingCohorts.push(addedCohort);
    },
    getExistingConsentData(consentId) {
      let self = this;
      nprogress.start();
      this.$api.getCosentDataApi(this.studyId, consentId).then(
        response => {
          self.consentData.sections = response.data.sections;
          // this.consentData.data.push(response.data);
          self.consentData.quiz = response.data.quiz;
          if(response.data && response.data.documentProperties && response.data.documentProperties) {
            self.consentData.documents = response.data.documentProperties;
          } else if(response.data && response.data.listOfdocumentProperties && response.data.listOfdocumentProperties.length > 0) {
            self.consentData.documents = response.data.listOfdocumentProperties;
          } else {
            self.consentData.documents = null;
          }
          self.multiconsent.box1 = false;
          self.multiconsent.box2 = false;
          self.multiconsent.box3 = false;
          self.consentData.opType = "toEdit";
          self.consentData.consentType = "default";
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting consent data after adding consent."
          ); // eslint-disable-line
          nprogress.done();
        }
      );
    },
    getExistingConsents() {
      nprogress.start();
      this.$api.getExistingConsentData(this.studyId).then(
        response => {
          this.existingConsents = response.data;
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
          nprogress.done();
        }
      );
    },
    getExistingCohorts() {
      nprogress.start();
      this.$api.getExistingCohorts(this.studyId).then(
        response => {
          for (let i = 0; i < response.data.length; i++) {
            this.existingCohorts.push(response.data[i]);
          }
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the study details"
          );
          nprogress.done();
        }
      );
    },
    getPrivacyPolicy() {
      nprogress.start();
      this.$api.getStudyPrivacyPolicyFact(this.studyId).then(
        response => {
          this.privacyPolicy = response.bodyText;
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the privacy details"
          );
          nprogress.done();
        }
      );
    },
    collapseFunc() {
      this.collapse = false;
      this.expand = true;
    },
    expandFunc() {
      this.collapse = true;
      this.expand = false;
    },
    viewLicenseAgreement() {
      this.licenseReadMode = true;
      this.multiconsent.box1 = false;
      this.multiconsent.box2 = false;
      this.multiconsent.box3 = false;
    },
    closeLicenseAgreementReading() {
      this.licenseReadMode = false;
      this.multiconsent.box1 = true;
      this.multiconsent.box2 = true;
      this.multiconsent.box3 = true;
    },
    editPrivacyPolicy() {
      this.privacyPolicyOPType = "toEdit";
      this.privacyReadMode = true;
      this.multiconsent.box1 = false;
      this.multiconsent.box2 = false;
      this.multiconsent.box3 = false;
    },
    addPrivacyPolicy() {
      this.privacyPolicyOPType = "toAdd";
      this.privacyReadMode = true;
      this.multiconsent.box1 = false;
      this.multiconsent.box2 = false;
      this.multiconsent.box3 = false;
    },
    addNewConsent() {
      this.consentData.opType = "toAdd";
      this.consentData.consentType = "default";

      this.multiconsent.box1 = false;
      this.multiconsent.box2 = false;
      this.multiconsent.box3 = false;
    },
    addNewCohort() {
      this.cohort.opType = "toAdd";
      this.cohorts.addButton = false;
    },
    editConsent(v) {
      this.consentData.consentName = v.consentName;
      this.consentData.consentId = v.consentId;
      this.getExistingConsentData(v.consentId);
    },
    deleteConsent(v) {
      swal({
        title: "Are you sure you want to delete this consent?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          nprogress.start();
          this.$api.deleteConsentData(this.studyId, v.consentId).then(
            () => {
              this.getExistingConsents();
              toastr.success("Consent deleted successfully.");
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while getting the study details"
              );
              nprogress.done();
            }
          );
        }
      });
    },
    deleteCohort(v) {
      const that = this;
      swal({
        title: "Are you sure you want to delete this cohort?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          nprogress.start();
          that.$api.deleteCohortData(that.studyId, v.cohortId).then(
            () => {
              const index = that.existingCohorts.findIndex(
                x => x.cohortId == v.cohortId // eslint-disable-line
              );
              if (index >= 0) {
                that.existingCohorts.splice(index, 1);
              }
              that.cancelAssociationEditing();
              toastr.success("Cohort deleted successfully.");
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while deleting the cohort"
              );
              nprogress.done();
            }
          );
        }
      });
    },
    editCohort(currentCohort) {
      this.cohort.editCurrentCohort = "toEdit";
      this.cohort.cohortId = currentCohort.cohortId;
      this.isDisable = true;
    },
    nextClick() {
      const that = this;

      if (that.existingConsents.length === 0) {
        toastr.error("Please add at least one consent");
      } else if (that.existingCohorts.length === 0) {
        toastr.error("Please add at least one cohort");
      } else {
        nprogress.start();
        this.doneReading();
        that.$api.postStudyMultiConsentFact(that.studyId).then(
          () => {
            const selectedFeatures = that.$store.getters.getSelectedFeatures;

            const featureIndex = _.findIndex(selectedFeatures, [
              "route",
              that.$route.name
            ]);

            if (featureIndex === selectedFeatures.length - 1) {
              that.$router.push({ name: "features-library-final" });
            } else {
              that.$router.push({
                name: selectedFeatures[featureIndex + 1].route,
                params: { studyId: that.studyId }
              });
            }
            nprogress.done();
          },
          error => {
            const err =
              error.body && error.body.message
                ? error.body.message
                : "Error while saving the data";
            toastr.error(err);
            nprogress.done();
          }
        );
      }
    },
    skipForNow() {
      const selectedFeatures = this.$store.getters.getSelectedFeatures;
      const featureIndex = _.findIndex(selectedFeatures, [
        "route",
        this.$route.name
      ]);
      if (featureIndex === selectedFeatures.length - 1) {
        this.$router.push({ name: "features-library-final" });
      } else {
        this.$router.push({
          name: selectedFeatures[featureIndex + 1].route,
          params: { studyId: this.studyId }
        }); // eslint-disable-line
      }
    },
    cancelModify() {
      this.$refs.cancelConfirmation.show();
    },
    doneReading() {
      this.$api
        .addLicenseV2Fact(this.studyId, { licenses: this.licenses })
        .then(
          () => {
            toastr.success("License added successfully");
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body ? error.body.message : "Error while adding the license"
            );
            nprogress.done();
          }
        );
    }
  },
  components: {
    studyFeatureHeader,
    draggable,
    addEditConsent,
    addEditQuiz,
    addEditCohort,
    cohortConsentAssociation,
    privacyPolicy,
    licenseAgreement,
    editMultiConsent,
    CancelModal
  }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

button:hover,
.blue-btn:hover,
.white-btn:hover {
  opacity: 0.5;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  margin: 20px 0 10px;
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

.card {
  display: block;
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

.bg-color {
  background-color: #f5f8fa;
  background-size: cover;
  // height: 100%;
  // min-height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.collapse_card {
  border: 1px solid #d3dfe4 !important;
  background-color: #f5f8fa;
  padding-left: 5px;
}
.icon_section {
  width: 28px;
  height: 28px;
  border-radius: 2px;
  background-color: #d3dfe4;
  display: inline-block;
  text-align: center;
  padding-top: 5px;
}
.read_only_card {
  border-left: 6px solid #d3dfe4 !important;
}
.navbar-style {
  background: linear-gradient(to left, #7478e6, #09b9e0);
}

.btn {
  border-radius: 25px;
}
.form-control {
  border-radius: 2px;
}
.container-style {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.consent-header {
  margin: 0px;
  padding: 40px 0px 10px 0px;
  font-weight: 500;
  font-size: 16px;
}

.card {
  border-radius: 3px;
  background-color: #f5f8fa;
  /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  border: solid 1px #d3dfe4;
  padding: 5px 20px;
  margin-top: 10px;
}
.doc_desc {
  display: inline-block;
  word-break: break-all;
}
.license_info {
  background-color: #eee;
  padding: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.font-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1f95f2;
}

.header-style {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
}
.edit_only_screen {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.add-btn {
  font-size: 14px;
  min-width: 150px;
  border: 1px solid#f06559;
  color: #f06559;
  background: transparent;
}

.save_btn {
  width: 100px;
}

.misplaced-card {
  border-radius: 8px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}

.edit-btn {
  padding: 5px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
  color: #1f95f2;
}

.radio-style {
  bottom: 2px;
  text-align: center;
}

.close-style {
  padding: 25px 30px 10px 0px !important;
}

.align_justify {
  text-align: justify;
}

.disable-row {
  pointer-events: none;
  opacity: 0.2;
}

.btn {
  padding: 0;
  float: right;
  cursor: pointer;

  button {
    &.white-btn {
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

    &.blue-btn {
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
.cohort-consent-name {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-top: 5px;
}
.delete-div {
  margin-bottom: 20px;
  vertical-align: middle;
  margin-top: 20px;

  .delete-icon {
    cursor: pointer;
  }
}
</style>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
button {
  cursor: pointer;
}
.multiconsent-box1 {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
  margin-top: 40px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 20px;
}

.multiconsent-box1-heading1 {
  font-family: Lato-Regular;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #2d3752;
}

.multiconsent-box1-content1 {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.multiconsent-box1-bottom {
  margin-top: 20px;

  .consent-name {
    font-family: Lato-Regular;
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
  }

  .edit-icon {
    margin-left: 30px;
    cursor: pointer;
  }
}

.multiconsent-box1-btn1 {
  padding-top: 20px;
}

.multiconsent-box1-divider,
.multiconsent-box2-divider,
.multiconsent-box3-divider {
  width: 1040px;
  height: 1px;
  background-color: #e4e8eb;
  margin-top: 30px;
}

.multiconsent-box3-divider {
  margin-top: 10px;
}

.multiconsent-box1-content2 {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #9b9b9b;
  margin-top: 20px;
}

.multiconsent-box2 {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 20px;
}

.multiconsent-box2-heading1 {
  font-family: Lato-Regular;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #2d3752;
}

.multiconsent-box2-content1 {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.multiconsent-box2-btn1 {
  padding-top: 20px;
}

.multiconsent-box2-divider {
  width: 1040px;
  height: 1px;
  background-color: #e4e8eb;
  margin-top: 30px;
}

.multiconsent-box2-content2 {
  font-family: Lato-Regular;
  font-size: 17px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.multiconsent-box2-bottom {
  margin-top: 20px;
}

.left-block {
  float: left;
}

.right-block {
  float: right;
}

.clearfix {
  clear: both;
}

.white-btn {
  color: #1e8fe1;
  border-radius: 4px;
  border: solid 1px #1e8fe1;
  background-color: #ffffff;
}

.white-btn:hover {
  opacity: 0.9;
}

.colored-btn {
  border-radius: 4px;
  border: solid 2px #ffffff;
  background-color: #1e8fe1;
  color: #fff;
}

.add-consent-btn {
  width: 190px;
  height: 30px;
  font-family: Lato-Regular;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #1e8fe1;
}

.add-cohort-btn {
  width: 150px;
  height: 30px;
  font-family: Lato-Regular;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #1e8fe1;
}

.select-consent-btn {
  width: 120px;
  height: 30px;
  font-family: Lato-Regular;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
}

.multiconsent-box3 {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
  margin-top: 40px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 20px;
}

.multiconsent-box3-heading1 {
  font-family: Lato-Regular;
  font-size: 22px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #2d3752;
}

.multiconsent-box3-bottom1 {
  margin-top: 20px;
}

.multiconsent-box3-bottom2 {
  margin-top: 24px;
}

.multiconsent-box3-bottom1-content1 {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.add-privacy-policy-btn {
  width: 140px;
  height: 30px;
  font-family: Lato-Regular;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #1e8fe1;
}

.multiconsent-box3-bottom2-content1 {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.link {
  font-family: Lato-Regular;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #1e8fe1;
  cursor: pointer;
}
</style>
