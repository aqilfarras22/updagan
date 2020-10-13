<template>
  <div class="participant_content participant-bg" @click="hideModal()">
    <nav v-if="canResearchSiteTeamAccess && composeMessageId" aria-label="breadcrumb" class="participant-breadcrumb">
      <ol class="breadcrumb">
          <li class="breadcrumb-item">
              <router-link :to="{ name: 'study-participant-messages'}">Messages</router-link>
          </li>
          <li class="breadcrumb-item">
              <router-link :to="{ name: 'study-participant-compose-message', params: {composeMessageId: composeMessageId}}">Compose Message</router-link>
          </li>
          <li class="breadcrumb-item current-label">
              <span>Select Participants</span>
          </li>
      </ol>
    </nav>
    <div class="modal fade"  v-if="eligibilityScreenQuestionsAnsOfParticipnt" id="eligibilityScreenQuestionsAns" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-w-h-style modal-content p-0 m-0">
          <div class="modal-header header-rectangle border-none m-0 p-0">
            <p class="agreement-accepted-style m-0 mr-45 mt-14 p-0">Agreement Accepted on {{agreementAcceptedDate}} at {{agreementAcceptedTime}} UTC</p>
            <select
              class="lang-slection-style"
              name="language"
              v-model="selectedLang"
            >
              <option :value="undefined" selected="selected" disabled>Select</option>
              <option
              >{{getLanguageText(displayLanguage)}}</option>
            </select>
            <button type="button" class="close-btn" data-dismiss="modal">x</button>
          </div>
          <div class="modal-body m-4 p-0">
            <div class="eligibility-heading-style">Eligibility Responses</div>
            <div class="row margin-style-2 p-0">
              <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 pl-0 mb-8 mt-8 question-answer-style-heading" >
                QUESTION
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pr-0 mb-8 mt-8 question-answer-style-heading">
                ANSWER
              </div>
            </div>
            <div v-if="isLoading === true" class="loading-style">
              <i
                class="fa fa-spinner fa-spin"
                aria-hidden="true"
              ></i>
            </div>
            <div v-if="isLoading === false" class="question-wrapper">
              <div class="row margin-style-1 p-0 gray-color" v-for="(queAndAns, index) in eligibilityScreenQuestionsAnsOfParticipnt" :key="index">
                <div class="d-flex col-xs-8 col-sm-8 col-md-8 col-lg-8 pl-0">
                  <span class="pr-14">{{index+1}}.</span> 
                  <span v-html="queAndAns.question"></span>
                </div>
                <div v-if="queAndAns.question_type === 'MultiChoiceQuestion'" v-html="queAndAns.answer_text" class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pr-0"></div>
                <div v-if="queAndAns.question_type === 'BooleanQuestion'" class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pr-0">
                  {{queAndAns.answer_text}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="changeScreeningStatus" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content p-20">
          <div class="modal-header border-none m-4 p-0">
            <p class="change-screening-status m-0 p-0">Change participant screening status</p>
          </div>
          <div class="modal-body m-4 p-0">
            <div class="rectangle">
              <div class="field-wrapper">
                <p class="participant-ID"> Participant ID </p>
                <p class="participant-ID-field" v-if="selectedParticipantForChangeStatusValue.userDefinedParticipantId">{{ selectedParticipantForChangeStatusValue.userDefinedParticipantId }}</p>
              </div>
              <div class="field-wrapper">
                <p class="thread-ID">Thread ID</p> 
                <p class="thread-ID-field" v-if="selectedParticipantForChangeStatusValue.id">{{selectedParticipantForChangeStatusValue.id}}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center mt-8 mb-6 m-4 p-0">
            <button
              type="button" 
              class="cancel-modal-but" 
              data-dismiss="modal" 
              v-on:click="resetSelectedParticipant"
            >
              <span>Cancel</span>
            </button>
            <button 
              type="button" 
              class="screening-failed-but" 
              data-dismiss="modal" 
              v-on:click="screeningFailed(selectedParticipantForChangeStatusValue.id, selectedParticipantForChangeStatusValue.email, selectedParticipantForChangeStatusValue.siteId)"
            >
              <span class="screening-failed-span">Screening failed</span>
            </button>
            <button 
              type="button" 
              class="screening-passed-but"
              data-toggle="modal" 
              data-target="#inviteParticipantNow" 
              data-dismiss="modal"
              v-on:click="screeningPassed(selectedParticipantForChangeStatusValue.id, selectedParticipantForChangeStatusValue.email, selectedParticipantForChangeStatusValue.siteId)"
            >
              <span class="screening-passed-span">Screening passed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="inviteParticipantNow" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content p-20">
          <div class="modal-header border-none m-4 p-0">
            <p class="change-screening-status m-0 p-0">Change participant screening status</p>
          </div>
          <div class="modal-body m-4 p-0">
            <div class="rectangle">
              <div class="field-wrapper">
                <p class="participant-ID"> Participant ID </p>
                <p class="participant-ID-field" v-if="selectedParticipantForChangeStatusValue.userDefinedParticipantId">{{ selectedParticipantForChangeStatusValue.userDefinedParticipantId }}</p>
              </div>
              <div class="field-wrapper">
                <p class="thread-ID">Thread ID</p> 
                <p class="thread-ID-field" v-if="selectedParticipantForChangeStatusValue.id">{{selectedParticipantForChangeStatusValue.id}}</p>
              </div>
            </div>
          </div>
          <div class="row invite-que-style m-4 p-0">
            <div class="col text-center font-weight-bold">Participant has passed screening</div>
            <div class="col text-center">Do you want to send as invite ?</div>
          </div>
          <div class="modal-footer justify-content-center m-4 p-0">
            <button 
              type="button" 
              class="cancel-modal-but" 
              data-dismiss="modal" 
              v-on:click="resetSelectedParticipant"
            >
              <span>Invite later</span>
            </button>
            <button 
              type="button" 
              class="screening-passed-but" 
              data-dismiss="modal" 
              v-on:click="invitedParticipant(selectedParticipantForChangeStatusValue.id, selectedParticipantForChangeStatusValue.email, selectedParticipantForChangeStatusValue.siteId)"
            >
              <span class="screening-passed-span">Invite participant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="pl-30 pr-30" :class="{'pt-30': !composeMessageId}">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
        <div class="participant-header">
          <div class="row">
            <div class="row pb-15">
              <span class="color_2d3752 fs-22">
                <b>
                  <span v-if="canResearchSiteTeamAccess && composeMessageId">Select Participants</span>
                  <span v-else>My Participants</span>
                </b>
              </span>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2 pl-0">
              <div class="form-group has-feedback">
                <input
                  type="text"
                  class="form-control mb-10 br-3 search-field"
                  placeholder="Search"
                  v-model="searchTerm"
                  @keyup.enter="searchParticipantFilterStudies()"
                >
              </div>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 pl-0 fs-14 select_section">
              <select
                class="form-control br-3 input-bg select_control"
                v-model="filterTerm"
                v-on:change="searchParticipantFilterStudies()"
              >
                <option disabled value>Status</option>
                <option value>None</option>
                <option :value="getStatuses.ACTIVE">{{getStatusText({status: getStatuses.ACTIVE})}}</option>
                <option
                  :value="getStatuses.REGISTERED"
                >{{getStatusText({status: getStatuses.REGISTERED})}}</option>
                <option
                  :value="getStatuses.VERIFIED"
                >{{getStatusText({status: getStatuses.VERIFIED})}}</option>
                <option
                  v-if="studyData.onboardingType!=='OpenEnrollment'"
                  :value="getStatuses.INVITED"
                >{{getStatusText({status: getStatuses.INVITED})}}</option>
                <option
                  v-if="studyData.onboardingType!=='OpenEnrollment'"
                  :value="getStatuses.NOTINVITED"
                >{{getStatusText({status: getStatuses.NOTINVITED})}}</option>
                <option
                  :value="getStatuses.WITHDRAWSTUDY"
                >{{getStatusText({status: getStatuses.WITHDRAWSTUDY})}}</option>
                <option
                  :value="getStatuses.DISQUALIFIED"
                >{{getStatusText({status: getStatuses.DISQUALIFIED})}}</option>
                <option
                  :value="getStatuses.PRESCREENED"
                >{{getStatusText({status: getStatuses.PRESCREENED})}}</option>
                <option
                  :value="getStatuses.SCREENPASSED"
                >{{getStatusText({status: getStatuses.SCREENPASSED})}}</option>
                <option
                  :value="getStatuses.SCREENFAILED"
                >{{getStatusText({status: getStatuses.SCREENFAILED})}}</option>
              </select>
            </div>
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-2 pl-0 fs-14 select_section">
              <select
                class="form-control br-3 input-bg select_control"
                v-model="sourcefilter"
                v-on:change="searchParticipantFilterStudies()"
              >
                <option disabled value>Source</option>
                <option value>None</option>
                <option :value="getSources.WEB">{{getSourceText({source: getSources.WEB})}}</option>
                <option
                  :value="getSources.APP"
                >{{getSourceText({source: getSources.APP})}}</option>
                <option
                  :value="getSources.MANUAL"
                >{{getSourceText({source: getSources.MANUAL})}}</option>
              </select>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 pl-0">
              <div class="form-group has-feedback">
                
                <label for="checkWithdrawn" class="Show-Withdrawn-or-Failed-participants">
                  <input
                    id="checkWithdrawn" 
                    type="checkbox"
                    class="check-withwrawn"
                    :checked="setWithdrawnOrFailedFilter"
                    v-on:change="changeWithdrawnOrFailedFilter"
                  />
                   Show Withdrawn or Failed participants
                   <span class="checkmark"></span>
                   </label>
              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-6 xs-pl-0 mob-pt15 text-right pr-0">
              <!-- Back to compose button section -->
              <div v-if="canResearchSiteTeamAccess && composeMessageId" class="back-to-compose">
                <button :disabled="composeParticipants.length<=0" @click="backToComposeMessage" class="btn newBtn br-3 ml-5">Back to Compose Message</button>
              </div>
              <!-- Back to compose button section ends here -->
              <div v-else >
                <button
                  class="btn newBtn br-3"
                  v-if="byInvite && participantNotInvited && canInviteParticipants()"
                  @click="batchInvite()"
                >Invite all</button>
                <button
                  class="btn newBtn br-3 ml-5"
                  @click="openAddModal"
                  v-if="byInvite && canInviteParticipants()"
                >Add participants</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 pb-20 pl-0 pr-0">
              <div class="table-column">
                <div class="row pl-15 pr-6">
                  <div class="col-sm-10 col-md-10 col-lg-10 col-xs-10 p-0 lh-36 fs-17 fw-bold">
                    <span class="color_f16559">{{totalParticipants}} &nbsp;</span>
                    <span class="color_2d3752">Participants</span>
                    <span v-if="canResearchSiteTeamAccess && composeMessageId && composeParticipants.length" class="compose-part-sel-text">{{composeParticipants.length}} participant(s) selected</span>
                  </div>
                  <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0 show_section text-right">
                    <b-form-select
                      v-model="selectedShowOption"
                      :options="participantListOptions"
                      class="input-bg select_control mb-3 fs-12"
                      size="sm"
                      @change="showParticipants"
                    />
                  </div>
                </div>
                <div class="wrapper height-500 position-relative">
                  <table class="table pb-20 mb-50">
                    <thead class="table-border fs-12">
                      <tr>
                        <th
                          class="heading-color pl-16"
                          v-if="composeMessageId && canResearchSiteTeamAccess"
                        ></th>
                        <th
                          class="heading-color w-160 cursor_pointer pl-16"
                          v-if="canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess"
                          @click="sortList('email')"
                        >
                          <span class="pr-3 position-relative">
                            Email
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['email'] === true) ? 'link-color':'']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['email'] === false) ? 'link-color':'']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color cursor_pointer pl-16"
                          :class="{'w-200': canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess, 'w-260': !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)}"
                          @click="sortList('id')"
                        >
                          <span class="pr-3 position-relative">
                            THREAD ID
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['id'] === true) ? 'link-color':'']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['id'] === false) ? 'link-color':'']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-160 cursor_pointer"
                          @click="sortList('userDefinedParticipantId')"
                        >
                          <span class="pr-3 position-relative">
                            Participant ID
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['userDefinedParticipantId'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['userDefinedParticipantId'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-80 cursor_pointer"
                          v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess)"
                          @click="sortList('userSiteId')"
                        >
                          <span class="pr-3 position-relative">
                            Site
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['userSiteId'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['userSiteId'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-119 cursor_pointer pl-0 pr-0"
                          @click="sortList('status')"
                        >
                          <span class="pr-3 position-relative">
                            Status
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['status'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['status'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-110 cursor_pointer pl-0 pr-0"
                          @click="sortList('invitationDate')"
                        >
                          <span class="pr-3 position-relative">
                            Invited on
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['invitationDate'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['invitationDate'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-110 cursor_pointer pl-0 pr-0"
                          @click="sortList('source')"
                        >
                          <span class="pr-3 position-relative">
                            Source
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['source'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['source'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-110 cursor_pointer pl-0 pr-0"
                          @click="sortList('consentedTime')"
                        >
                          <span class="pr-3 position-relative">
                            Consented on
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['consentedTime'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['consentedTime'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="heading-color w-120 cursor_pointer"
                          @click="sortList('participantStudyDays')"
                        >
                          <span class="pr-3 position-relative">
                            Days in study
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantStudyDays'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantStudyDays'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="xs-none heading-color w-100 cursor_pointer"
                          @click="sortList('participantStudyCompletionPercentage')"
                        >
                          <span class="pr-3 position-relative">
                            Completion
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantStudyCompletionPercentage'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantStudyCompletionPercentage'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          class="xs-none heading-color w-110 cursor_pointer"
                          @click="sortList('participantCompliancePercentage')"
                        >
                          <span class="pr-3 position-relative">
                            Compliance
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantCompliancePercentage'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>
                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantCompliancePercentage'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th
                          v-if="studyData.language && studyData.language.length>1"
                          class="xs-none heading-color w-110 cursor_pointer"
                          @click="sortList('participantLanguage')"
                        >
                          <span class="pr-3 position-relative">
                            Language
                            <span class="sortUp">
                              <i
                                class="fa fa-angle-up"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantLanguage'] === true) ? 'link-color' : '']"
                              ></i>
                            </span>

                            <span class="sortDown">
                              <i
                                class="fa fa-angle-down"
                                aria-hidden="true"
                                :class="[(headersAscSortFlags['participantLanguage'] === false) ? 'link-color' : '']"
                              ></i>
                            </span>
                          </span>
                        </th>
                        <th class="xs-none heading-color w-110 cursor_pointer">
                          <span class="pr-3 position-relative">Country</span>
                        </th>
                        <th class="xs-none heading-color w-150" v-if="canInviteParticipants()">
                          <span>Action</span>
                        </th>
                        <th
                          class="xs-none heading-color w-150"
                          :class="{ 'new-label-width': item.keyReference == newLabel.keyReference }"
                          v-for="(item, index) in newLabelsList"
                          :key="index"
                        >
                          <span
                            class="trigger row"
                            v-if="item.keyReference !== newLabel.keyReference"
                          >
                            <span
                              class="col-10 pr-0 position-relative"
                              @click="sortList(item.key,'custom')"
                            >
                              {{item.value}}
                              <span class="sortUp">
                                <i
                                  class="fa fa-angle-up"
                                  aria-hidden="true"
                                  :class="[headersAscSortFlags[item.key] === true ? 'link-color': '']"
                                ></i>
                              </span>
                              <span class="sortDown">
                                <i
                                  class="fa fa-angle-down"
                                  aria-hidden="true"
                                  :class="[headersAscSortFlags[item.key] === false ? 'link-color': '']"
                                ></i>
                              </span>
                              <span v-if="!canQualityAccess && !canSiteDataLockAccess" class="col-2 p-0 edit" @click="updateLabel(item)">
                                <i class="fa fa-pencil heading-color"></i>
                              </span>
                            </span>
                          </span>
                          <span v-if="item.keyReference == newLabel.keyReference && !canQualityAccess">
                            <div class="row">
                              <div class="col-sm-7 pr-0 pl-0">
                                <input
                                  type="text"
                                  class="form-control"
                                  maxlength="40"
                                  required
                                  v-model="newLabel.value"
                                  placeholder="Enter label name"
                                >
                              </div>
                              <div class="col-sm-5 pr-0 pl-5 pt-2">
                                <span
                                  class="cursor_pointer label-icon"
                                  @click="createUpdateLabel(newLabel, index)"
                                >
                                  <i class="fa fa-check"></i>
                                </span>
                                <span
                                  class="cursor_pointer label-icon ml-3"
                                  v-if="updateLabelMode"
                                  @click="discardChanges()"
                                >
                                  <i class="fa fa-times"></i>
                                </span>
                                <span
                                  class="cursor_pointer label-icon ml-3"
                                  @click="deleteLabel(index,newLabel)"
                                >
                                  <i class="fa fa-trash"></i>
                                </span>
                              </div>
                            </div>
                          </span>
                        </th>
                        <th class="xs-none w-2 pr-0 text-right pt-5" v-if="!canQualityAccess && !canSiteDataLockAccess">
                          <span class="dropdown" id="columnDropDown">
                            <button
                              class="btn bg-white dropdown-toggle"
                              size="sm"
                              type="button"
                              id="dropdownMenuButton"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <img src="static/img/drawer.svg" class="img-mr">
                            </button>
                            <div class="dropdown-menu fs-12 h-45 pt-3">
                              <div class="dropdown-item cursor_pointer" @click="addNewLabel()">
                                <img src="static/img/expand.svg" alt class="img-size mb-2">
                                <span class="ml-10 text-color">Add a new label</span>
                              </div>
                            </div>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="currentParticipantsList && currentParticipantsList.length > 0">
                      <tr v-for="(participant, index) in currentParticipantsList" :key="index">
                        <td class="table-content-color pl-16" v-if="composeMessageId && canResearchSiteTeamAccess">
                          <label class="select-participant">
                            <input :id="participant.id" :value="{participantId: participant.id, emailId: participant.email}" type="checkbox" v-model="composeParticipants">
                            <span class></span>
                          </label>
                        </td>                        
                        <td class="table-content-color w-160 pl-16" v-if="(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess)">
                          <a class="link" @click="changeState(participant.id)" v-if="participant.email.length >= 16">{{participant.email.slice(0, 14)}}...</a>
                          <a class="link" @click="changeState(participant.id)" v-if="participant.email.length < 16">{{participant.email}}</a>
                        </td>
                        <td class="table-content-color pl-16" :class="{'w-200': (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess), 'w-260': !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)}">
                          <span v-if="(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) && !participant.showMore">{{participant.id.slice(0, 15)}}...</span>
                          <span v-if="(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) && participant.showMore">{{participant.id}}</span>
                          <a class="link" @click="changeState(participant.id)" v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) && !participant.showMore" :to="{ name: 'study-participant-details', params: {participantId :participant.id }}">
                            {{participant.id.slice(0, 20)}}...
                          </a>
                          <a v-if="!participant.showMore" class="cursor_pointer table-content-color fs-12" @click="toggleShowMore(index)">
                            <u>Show</u>
                          </a>
                          <a class="link" @click="changeState(participant.id)" v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) && participant.showMore" :to="{ name: 'study-participant-details', params: {participantId :participant.id }}">
                            {{participant.id}}
                          </a>
                          <a v-if="participant.showMore" class="cursor_pointer table-content-color fs-12" @click="toggleShowMore(index)">
                            <u>Less</u>
                          </a>
                        </td>
                        <td class="table-content-color w-160">
                          <span
                            v-if="participant.userDefinedParticipantId"
                          >{{participant.userDefinedParticipantId}}</span>
                        </td>
                        <td class="table-content-color w-80" v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess)">{{participant.userSiteId}}</td>
                        <td class="xs-none w-110 table-content-color pl-0 pr-0" v-bind:class="{ 'color_red': participant.status === getStatuses.WITHDRAWSTUDY || participant.status === getStatuses.DISQUALIFIED || participant.status === getStatuses.WITHDRAWCONSENT,
                            'color_yellow': participant.status === getStatuses.INVITED || participant.status=== getStatuses.VERIFIED }">
                          <span class="pr-10">{{getStatusText(participant)}}<span class="pl-5" v-b-popover.hover="participant.disqualifyReason" v-if="participant.status === getStatuses.DISQUALIFIED"><i class="fa fa-info-circle help_icon cursor_pointer"></i></span></span>
                        </td>
                        <td class="xs-none table-content-color w-110 pl-0 pr-0">
                          <span
                            v-if="participant.invitationDate"
                          >{{ new Date(participant.invitationDate) | dateFormat('DD MMM YYYY') }}</span>
                        </td>
                        <td class="xs-none table-content-color w-110 pl-0 pr-0">
                          <span
                           v-if="participant.source"
                          >{{ getSourceText(participant) }}</span>
                          <img 
                            v-if="participant.source === 'WEB'"
                            src="../../../public/static/img/participant-web-img/eligibility-questions-popup.svg"
                            data-toggle="modal"
                            data-target="#eligibilityScreenQuestionsAns"
                            class="eligibility-popup-icon"
                            v-on:click="getEligibilityAnswers(participant.id)" />
                        </td>
                        <td class="xs-none table-content-color w-110 pl-0 pr-0">
                          <span
                            v-if="participant.consentedTime"
                          >{{ new Date(participant.consentedTime) | dateFormat('DD MMM YYYY') }}</span>
                        </td>
                        <td class="xs-none table-content-color w-120">
                          <span
                            v-if="participant.participantStudyDays >= 0 && !((participant.status === getStatuses.INVITED || participant.status=== getStatuses.NOTINVITED)||(participant.status === getStatuses.DISQUALIFIED || participant.status=== getStatuses.WITHDRAWSTUDY)|| (participant.status === getStatuses.WITHDRAWCONSENT))"
                          >{{participant.participantStudyDays}}</span>
                          <span
                            v-if="(participant.status === getStatuses.DISQUALIFIED) || (participant.status=== getStatuses.WITHDRAWSTUDY) || (participant.status=== getStatuses.WITHDRAWCONSENT)"
                          >N/A</span>
                        </td>
                        <td class="xs-none table-content-color w-100">
                          <span
                            v-if="participant.participantStudyCompletionPercentage >= 0 && !(participant.status === getStatuses.INVITED || participant.status=== getStatuses.NOTINVITED)"
                          >{{participant.participantStudyCompletionPercentage}}%</span>
                        </td>
                        <td class="xs-none table-content-color w-110">
                          <span
                            v-if="participant.participantCompliancePercentage >= 0 && !(participant.status === getStatuses.INVITED || participant.status=== getStatuses.NOTINVITED)"
                          >{{participant.participantCompliancePercentage}}%</span>
                        </td>
                        <td
                          v-if="studyData.language && studyData.language.length>1"
                          class="xs-none table-content-color w-110"
                        >
                          <select
                            :disabled="participant.disabled || canSiteDataLockAccess"
                            class="select_control change-caret"
                            v-bind:class="{'hide-caret': participant.disabled }"
                            v-model="participant.language"
                            v-on:change="setForNonInvitedUser(participant)"
                            name="language"
                          >
                            <option :value="undefined" selected="selected" disabled>Select</option>
                            <option
                              :value="lang.language_id"
                              v-for="(lang, index) in studyData.language"
                              :key="index"
                            >{{lang.display_name}}</option>
                          </select>
                        </td>
                        <td class="xs-none table-content-color w-110">{{ participant.countryName ? participant.countryName : 'US' }}</td>
                        <td v-if="canInviteParticipants()" class="xs-none table-content-color w-120">
                          <div
                            class="br-30 p-0"
                            v-if="participant.status == getStatuses.NOTINVITED || participant.status == getStatuses.INVITED"
                            @click="createUpdateParticipant(participant, true)"
                          >
                            <b-btn
                              size="sm"
                              class="fs-12 pl-15 pr-15"
                              variant="outline-primary"
                              v-if="participant.status==getStatuses.NOTINVITED"
                            >Send invite</b-btn>
                            <b-btn
                              size="sm"
                              class="fs-12"
                              variant="outline-primary"
                              v-if="participant.status==getStatuses.INVITED"
                            >Resend invite</b-btn>
                          </div>
                           <div
                            class="br-30 p-0"
                            v-if="participant.status == getStatuses.REGISTERED"
                            @click="resendVerification(participant)"
                          >
                            <b-btn
                              size="sm"
                              class="fs-12"
                              variant="outline-primary"
                            >Resend verification</b-btn>
                            </div>
                            <div
                              class="br-30 p-0"       
                              data-toggle="modal" 
                              data-target="#changeScreeningStatus"
                              v-if="participant.status == getStatuses.PRESCREENED"
                              v-on:click="selectedParticipantForChangeStatus(participant)"
                            >
                              <b-btn
                                size="sm"
                                class="fs-12"
                                variant="outline-primary"
                                
                            >Change status</b-btn>
                            </div>
                            <div
                              class="br-30 p-0"       
                              data-toggle="modal" 
                              data-target="#inviteParticipantNow"
                              v-if="participant.status == getStatuses.SCREENPASSED"
                              v-on:click="selectedParticipantForChangeStatus(participant)"
                            >
                              <b-btn
                                size="sm"
                                class="fs-12"
                                variant="outline-primary"
                                
                            >Change status</b-btn>
                            </div>
                          <div class="br-30 p-0" @click="triggerDayZeroPopup(participant)">
                            <b-btn size="sm"
                            class="fs-12 pr-15 pl-15"
                            v-if="isSiteTeamMember() && studyData.isManualStudyStart && (participant.participantStudyStartTrigger.createdBy == null) && canAccessTriggerBtn(participant)"
                            variant="outline-primary">Start Study</b-btn>
                          </div>
                        </td>
                        <td
                          class="xs-none w-150"
                          :class="{ 'new-label-width':item.id === newLabelValue.id && participant.id === newLabelValue.participantId }"
                          v-for="(item, index) in newLabelsList"
                          :key="index"
                        >
                          <span v-if="item.id">
                            <span v-if="item.id === newLabelValue.id ">
                              <span v-if="participant.id === newLabelValue.participantId">
                                <div class="row">
                                  <div class="col-sm-7 pr-0 pl-0">
                                    <!-- <input class="mb-1" maxlength="40" placeholder="Enter label name" v-model="newLabelValue[item.key]"> -->
                                    <input
                                      type="text"
                                      class="form-control"
                                      maxlength="40"
                                      required
                                      v-model="newLabelValue[item.key]"
                                      placeholder="Enter label name"
                                    >
                                  </div>
                                  <div v-if="!canQualityAccess && !canDMAccess && !canCRAccess && !canSiteDataLockAccess" class="col-sm-5 pr-0 pl-5 pt-2">
                                    <span
                                      class="cursor_pointer label-icon"
                                      @click="createUpdateLabelValue(newLabelValue, participant)"
                                    >
                                      <i class="fa fa-check"></i>
                                    </span>
                                    <span
                                      class="cursor_pointer label-icon ml-3"
                                      @click="discardLabelValueChanges()"
                                    >
                                      <i class="fa fa-times"></i>
                                    </span>
                                    <span
                                      class="cursor_pointer label-icon ml-3"
                                      v-if="updateLabelValueMode"
                                      @click="deleteLabelValue(index,newLabelValue)"
                                    >
                                      <i class="fa fa-trash"></i>
                                    </span>
                                  </div>
                                </div>
                              </span>
                              <span v-else>
                                <span v-if="participant[item.key]">{{participant[item.key]}}</span>
                                <span v-else @click="addLabelValue(participant, item)">CLICK TO ADD</span>
                              </span>
                            </span>
                            <span v-if="item.id !== newLabelValue.id" class="cursor_pointer">
                              <span class="trigger2 row" v-if="participant[item.key]">
                                <span class="col-10 pr-0">{{participant[item.key]}}</span>
                                <span
                                  v-if="!canQualityAccess && !canDMAccess && !canCRAccess && !canSiteDataLockAccess"
                                  class="edit col-2 pr-0"
                                  @click="updateLabelValue(item, participant)"
                                >
                                  <i class="fa fa-pencil heading-color"></i>
                                </span>
                              </span>
                              <span
                                v-else-if="!canQualityAccess && !canDMAccess && !canCRAccess"
                                class="cursor_pointer pl-10"
                                @click="addLabelValue(participant, item)"
                                >
                                CLICK TO ADD
                              </span>
                            </span>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <tbody
                      v-if="allParticipants && allParticipants.length <= 0 && filterTerm === '' && (searchTerm === null)"
                    >
                      <tr>
                        <td
                          :colspan="Object.keys(headersAscSortFlags).length + 1"
                          class="text-center"
                        >
                          <div class="row pt-150 text-center">
                            <div class="fs-20"><b>No participants in this study yet</b></div>
                            <div v-if="canInviteParticipants()">
                              <div v-if="byInvite" class="fs-15 line-height pb-15 pt-10">You may start inviting participants or load participants<br> now and send out invitations at a later time.</div>
                              <button class="btn newBtn br-3 fs-15" @click="openAddModal" v-if="byInvite">
                                Start inviting now
                              </button>
                            </div>

                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tbody
                      v-if="allParticipants && allParticipants.length <= 0 && (filterTerm !== '' || searchTerm !== null)"
                    >
                      <tr>
                        <td
                          :colspan="Object.keys(headersAscSortFlags).length + 1"
                          class="text-center"
                        >
                          <div class="row pt-150 text-center">
                            <div class="fs-20">
                              <b>0 participants found</b>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    class="pb-20 pl-15 position-absolute bottom-0"
                    v-if="currentParticipantsList && currentParticipantsList.length"
                  >
                    <div class="row display-inline-flex">
                      <div
                        @click="prevPage"
                        class="arrow-icon cursor_pointer"
                        :class="{ 'disabledPagination': currentPage <= 1}"
                      >
                        <i class="fa fa-angle-left fs-23 pt-3"></i>
                      </div>
                      <div class="pagination pt-3">{{currentPage}}</div>
                      <div class="pagination2 pt-3">of {{totalPages}}</div>
                      <div
                        @click="nextPage"
                        class="arrow-icon pt-3 cursor_pointer"
                        :class="{ 'disabledPagination': currentPage >= totalPages}"
                      >
                        <i class="fa fa-angle-right fs-23"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="import-participant-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <button type="button" class="close close-style" data-dismiss="modal"></button>
          <div v-if="showDefaultImport">
            <div class="modal-title pl-20 pr-20 pt-20">Import Participant List</div>
            <div class="modal-body modal-style">
              <p class="mb-80 modal-info">
                If you already have a list of participants ready, you may insert their information into our
                <a
                  class="link-color cursor_pointer"
                  @click="downloadTemplate()"
                >.csv template</a> and upload them into this study’s participant list.
              </p>
            </div>
            <div class="form-group">
              <!-- <div class="btn btn-lg btn-block btn-info-blue br-30 file-upload file-upload-participant">
                <input type="file" class="file-input" id="file_upload" @change="onFileChange($event)">
                <span>Upload</span>
              </div>-->
              <button
                class="btn btn-lg btn-block btn-info-blue br-30"
                @click="importCSV(setImportValue)"
                :disabled="!setImportValue"
              >Confirm</button>
            </div>
            <div class="footer-close-style" data-dismiss="modal" @click="clearImport()">Close</div>
          </div>
          <div v-if="showImporting">
            <h2 class="color_import text-center">Importing csv file…</h2>
            <div class="file-style">
              <i class="fa fa-file fs-40" aria-hidden="true"></i>
              <br>
              {{fileName}}
            </div>
            <!--<vue-progress-bar class="progress-position"></vue-progress-bar>-->
            <div class="form-group">
              <p class="text-center">Uploading! Thanks for being patient.</p>
              <!--<div class="footer-close-style" @click="clearImport()" data-dismiss="modal">Cancel upload</div>-->
            </div>
          </div>
          <div v-if="afterImporting">
            <h2 class="color_import text-center" v-if="importPassed">Upload completed</h2>
            <h2 class="color_import text-center" v-if="!importPassed">Upload failed</h2>
            <div class="file-style">
              <i class="fa fa-file fs-40" aria-hidden="true"></i>
              <br>
              <span class="color_import">{{fileName}}</span>
            </div>
            <div class="form-group">
              <button
                class="btn btn-lg btn-block btn-info-blue br-30"
                @click="uploadAnotherCSV()"
              >Upload another csv file</button>
              <button
                class="btn btn-lg btn-block btn-info-blue br-30"
                @click="clearImport()"
                data-dismiss="modal"
              >Done</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="invite-all-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content width-650 p-0">
          <div class="pr-5">
            <button type="button" class="close" data-dismiss="modal" @click="cancelInvite">&times;</button>
          </div>
          <div class="modal-body p-0">
            <div class="row download-modal">
              <h3 class="invite-text">
                <b>Invite {{notInvitedUsers.length}} participants?</b>
              </h3>
            </div>
            <div class="row download-modal pt-6 color_4a4a4a">
              <span v-for="(participant, index) in notInvitedUsers" :key="index">
                {{participant.email}}
                <span v-if="index != notInvitedUsers.length-1">,</span>
              </span>
            </div>
            <div class="row text-center pt-30 pb-20">
              <button class="btn no-btn br-2 mr-4" @click="cancelInvite()">No</button>
              <button class="btn yes-btn br-2" @click="inviteAll()">Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="batch-import-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content width-650 height-250 pl-24">
          <div class="modal-header border-none">
            <h3 class="modal-title invite-text color_2d3752">
              <b>Batch import</b>
            </h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              @click="closeImportModal"
            >&times;</button>
          </div>
          <div class="modal-body pl-0 pt-6">
            <div class="row pb-90 color_4a4a4a">
              <b>You are about to import {{fileLength}} participant(s). Please confirm to continue.</b>
            </div>
            <div class="row text-center">
              <button class="btn cancel-btn br-3 width-100 mr-10" @click="closeImportModal">Cancel</button>
              <button
                class="btn add-invite-btn br-3 width-100"
                @click="importCSV(setImportValue)"
              >Import</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="uploading-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content height-250 pl-24">
          <div class="modal-body pt-40 text-center color_2d3752">
            <div class="row">
              <h3>
                <b>Importing participants…</b>
              </h3>
            </div>
            <div class="fs-16">Thanks for your patience</div>
            <div class="pt-20">
              <b-progress :value="value" :max="100" height="6px" variant="success"></b-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="download-report-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog" role="document">
        <!-- Modal content-->
        <div class="modal-content width-650 p-0">
          <div class="pr-5">
            <button
              type="button"
              class="close pt-10 pr-10"
              data-dismiss="modal"
              @click="closeDownloadModal"
            >&times;</button>
          </div>
          <div class="modal-body p-0">
            <div class="row download-modal">
              <h3 class="invite-text">
                <b>Batch import</b>
              </h3>
            </div>
            <div
              class="row color_e74c3c download-modal pt-10 pb-6"
              v-if="skippedParticipantsCount > 0"
            >
              <b>{{skippedParticipantsCount}} participant(s) failed to import</b>
            </div>
            <div class="bb-e4e8eb" v-if="skippedParticipantsCount > 0"></div>
            <div class="autoScroll">
              <div
                class="row download-modal pt-6 color_4a4a4a"
                v-for="(participant, index) in skippedParticipants"
                :key="index"
              >{{participant.email}}</div>
            </div>
            <div class="row download-modal pt-30 pb-20">
              <button class="btn add-invite-btn br-3" @click="exportCSV()">Download report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="add-participant-modal" class="modal fade" role="dialog" data-backdrop="static">
      <div
        class="modal-dialog"
        :class="[(studyData.countryList && studyData.countryList.length==1) && (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)? 'width-850':'width-1100']"
       >
        <!-- Modal content-->
        <div class="modal-content pl-24">
          <div>
            <div class="modal-header border-none">
              <h3 class="modal-title invite-text">
                <b>Add participants</b>
              </h3>
              <button type="button" class="close" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body pl-0 pr-0">
              <div class="row">
                <div class="btn importBtn file-upload mr-4">
                  <input
                    type="file"
                    accept=".csv"
                    class="file-input"
                    id="file_upload"
                    @change="onFileChange($event)"
                  >
                  <span>
                    <img src="static/img/batch-upload.svg" class="pl-4 pr-7 img-mr">Batch upload
                  </span>
                </div>
                <!-- <button class="importBtn pr-10 mr-8"  id="file_upload" @change="onFileChange($event)">
                  <img src="static/img/batch-upload.svg" class="pl-4 pr-7 img-mr" />Batch upload
                </button>-->
                <div class="btn importBtn lh-15" @click="downloadTemplate()">
                  <img src="static/img/download.svg" class="pl-4 pr-7 img-mr">Download batch upload template
                </div>
              </div>
              <div class="row pt-20 fs-14 text-color font-weight-bold pb-8">
                <div class="p-0"
                  :class="[(studyData.countryList && studyData.countryList.length==1) && (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)? 'col-lg-4 col-md-4 col-sm-12 col-xs-12':'col-lg-3 col-md-3 col-sm-12 col-xs-12']"
                >
                  Participant email address
                </div>
                <div
                  v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)"
                  class="p-0"
                  :class="[(studyData.countryList && studyData.countryList.length==1)? 'col-lg-3 col-md-3 col-sm-12 col-xs-12':'col-lg-2 col-md-2 col-sm-12 col-xs-12']"
                >Site</div>
                <div
                  class="p-0"
                  :class="{
                    'col-lg-2 col-md-2 col-sm-12 col-xs-12': (studyData.countryList && studyData.countryList.length>1 && !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)),
                    'col-lg-3 col-md-3 col-sm-12 col-xs-12': (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) || (studyData.countryList && studyData.countryList.length<=1),
                    }">
                  Participant ID (optional)
                </div>
                <div
                  v-if="studyData.countryList && studyData.countryList.length>1"
                  class="p-0 col-lg-2 col-md-2 col-sm-12 col-xs-12"
                >Country</div>
                <div
                  class="p-0"
                  :class="[((studyData.countryList && studyData.countryList.length>1) || !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess))?'col-lg-2 col-md-2 col-sm-12 col-xs-12':'col-lg-3 col-md-3 col-sm-12 col-xs-12']"
                >Invitation language</div>
              </div>
              <div class="autoScrollList">
                <div
                  class="row pb-12"
                  v-for="(participant, index) in participantsList"
                  :key="participant.dynamicInputID"
                  v-if="!participant.added"
                >
                  <div class="pl-0"
                    :class="[(studyData.countryList && studyData.countryList.length==1) && (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)? 'col-lg-4 col-md-4 col-sm-12 col-xs-12':'col-lg-3 col-md-3 col-sm-12 col-xs-12']"
                  >
                    <input
                      type="text"
                      v-validate="'required|email'"
                      :name="`email${participant.dynamicInputID}`"
                      :class="{'input': true, 'is-danger': participant.emailError || (participant.email && errors.has(`email${participant.dynamicInputID}`)), 'is-success': !errors.has('email') }"
                      class="form-control"
                      v-model="participant.email"
                      placeholder="Enter email address"
                      v-on:keyup="validateParticipants(index)"
                    >
                    <span
                      v-show="participant.email && errors.has(`email${participant.dynamicInputID}`)"
                      class="error-style"
                    >Please enter a valid email.</span>
                  </div>
                  <div
                    v-if="!(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)"
                    class="pl-0"
                    :class="[(studyData.countryList && studyData.countryList.length==1)? 'col-lg-3 col-md-3 col-sm-12 col-xs-12':'col-lg-2 col-md-2 col-sm-12 col-xs-12']"
                  >
                    <div class="show_section siteId">
                      <select
                        class="form-control input-bg select_control"
                        v-model="participant.siteId"
                        v-validate="'required'"
                        :name="`siteId${participant.dynamicInputID}`"
                        :class="{'input': true, 'is-danger': participant.siteId && errors.has('siteId'), 'is-success': !errors.has('siteId') }"
                        @change="validateParticipants(index); populateCountryOptions(participant)"
                      >
                        <option :value="null" disabled>Select site</option>
                        <option
                          :value="site.id"
                          v-for="site in researchSites"
                          :key="site.id"
                        >{{site.userSiteId}}</option>
                      </select>
                    </div>
                    <span
                      v-show="participant.errorSite && errors.has(`siteId${participant.dynamicInputID}`)"
                      class="error-style"
                    >Please enter a valid siteId.</span>
                  </div>
                  <div
                    class="pl-0"
                    :class="{
                      'col-lg-2 col-md-2 col-sm-12 col-xs-12': (studyData.countryList && studyData.countryList.length>1 && !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)),
                      'col-lg-3 col-md-3 col-sm-12 col-xs-12': (canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess) || (studyData.countryList && studyData.countryList.length<=1)}">
                    <input type="text" class="form-control" v-model="participant.userDefinedParticipantId" placeholder="Enter participant ID">
                  </div>
                  <div
                    v-if="studyData.countryList && studyData.countryList.length>1"
                    class="pl-0 col-lg-2 col-md-2 col-sm-12 col-xs-12"
                  >
                    <div class="show_section country">
                      <select
                        class="form-control input-bg select_control"
                        v-model="participant.countryId"
                        v-validate="'required'"
                        :name="`countryId${participant.dynamicInputID}`"
                        :class="{'input': true, 'is-danger': participant.countryId && errors.has('countryId'), 'is-success': !errors.has('countryId') }"
                        @change="validateParticipants(index)"
                      >
                        <option :value="null" disabled>Select country</option>
                        <option
                          :value="c.countryId"
                          v-for="c in participant.countrySiteOptions"
                          :key="c.countryId"
                        >{{c.countryName}}</option>
                      </select>
                    </div>
                    <span v-show="participant.errorCountry && errors.has(`countryId${participant.dynamicInputID}`)" class="error-style" >
                      Participant country is required
                    </span>
                  </div>
                  <div
                    class="pl-0"
                    :class="[((studyData.countryList && studyData.countryList.length>1) || !(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess))?'col-lg-2 col-md-2 col-sm-12 col-xs-12':'col-lg-3 col-md-3 col-sm-12 col-xs-12']"
                  >
                    <div class="show_section langugage">
                      <select
                        class="form-control input-bg select_control"
                        v-model="participant.language"
                        v-validate="'required'"
                        :name="`language${participant.dynamicInputID}`"
                        :class="{'input': true, 'is-danger': participant.language && errors.has('language'), 'is-success': !errors.has('language') }"
                        @change="validateParticipants(index)"
                        :disabled="canSiteDataLockAccess"
                      >
                        <option :value="null" disabled>Select language</option>
                        <option
                          :value="lang.language_id"
                          v-for="lang in studyData.language"
                          :key="lang.language_id"
                        >{{lang.display_name}}</option>
                      </select>
                    </div>
                    <span
                      v-show="participant.errorLanguage && errors.has(`language${participant.dynamicInputID}`)"
                      class="error-style"
                    >Please select language.</span>
                  </div>
                  <div class="cursor_pointer col-lg-1 col-md-1 col-sm-12  col-xs-12"
                    v-if="participantsList.length > 1" @click="removeParticipant(index)">
                    <img src="/static/img/collapse.svg"  class="pl-4 pr-7 pt-10"/>
                  </div>
                </div>
                <div class="row color_1e8fe1 pb-10">
                  <span class="cursor_pointer" @click="addParticipant">Add another participant</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class>
                <button
                  class="btn mb-10 add-invite-btn br-3 mr-10"
                  :disabled="errors.any() || disableInvite || hasErrorInParticipantList()"
                  @click="inviteParticipantNew(participantsList, false)"
                >Load only, do not invite</button>
                <button
                  class="btn mb-10 add-invite-btn br-3"
                  :disabled="errors.any() || disableInvite || hasErrorInParticipantList()"
                  @click="inviteParticipantNew(participantsList, true)"
                >Send invites</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ParticipantTriggerDayZeroModal
      :triggeredParticipant="triggeredParticipant"
      @resetParticipantDayZeroStatus="resetParticipantDayZeroStatus"
      :showModal="modalStatus"
      :studyId="studyId"
      :piId="user.id"
    ></ParticipantTriggerDayZeroModal>
  </div>
</template>

<script>

import moment from "moment";
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import cloneDeep from 'lodash/cloneDeep';
import max from 'lodash/max';
import { AclRule } from 'vue-acl';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { mapGetters } from 'vuex';
import { participantStatuses, participantLanguageText, participantSources, participantStatusesText, participantSourcesText, PI, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, QUALITY,  CRA, DM, SITEDATALOCK } from '@/constants/authRoles';
import mainHeader from '../common/main-header';
import sideMenu from '../common/side-menu';
import ParticipantTriggerDayZeroModal from "@/components/participants/participant-trigger-day-zero-modal";
import LocalStorageService from "../../services/localStorage";

let dynamicInputID = 0;
export default {
  name: "Participants",
  components: { mainHeader, sideMenu, ParticipantTriggerDayZeroModal },
  props: {
    studyData: Object
  },
  data() {
    return {
      isLoading: false,
      setWithdrawnOrFailedFilter: false,
      selectedLang: '',
      selectedParticipantForChangeStatusValue: {},
      eligibilityScreenQuestionsAnsOfParticipnt: [],
      agreementAcceptedTime: '',
      agreementAcceptedDate: '',
      modalStatus: false,
      uploadFileName : '',
      participantsList: [{
        dynamicInputID: dynamicInputID,
        email: '',
        siteId: null,
        language: null,
        countryId: null,
        countrySiteOptions: null
      }],
      getCallDone : false,
      participant: {},
      mismatchEmail: false,
      byInvite: false,
      enableAddInviteBtn: false,
      importPassed: false,
      participantId: null,
      searchTerm: null,
      setImportValue: null,
      exportData: null,
      allParticipants: {},
      totalParticipants: 0,
      participantNotInvited: false,
      notInvitedUsers: [],
      batchClick: false,
      userDetails: {
        username: "",
        password: null
      },
      downloadStarted: false,
      downloadCompleted: false,
      afterImporting: false,
      showImporting: false,
      showDefaultImport: true,
      filterTerm: "",
      sourcefilter: "",
      withdrawnOrFailedFilter: "",
      sortValue: "",
      sortOrder: "",
      customKey: "",
      newLabelsList: [],
      participantStatuses,
      participantStatusesText,
      participantSourcesText,
      participantLanguageText,
      newLabel: {},
      updateLabelMode: false,
      addLabelDisable: false,
      addLabelValueMode: false,
      updateLabelValueMode: false,
      newLabelValue: {},
      labelName: "",
      researchSites: [],
      disableInvite: true,
      value: 10,
      skippedParticipants: [],
      displayLanguage: '',
      skippedParticipantsCount: 0,
      fileLength: 0,
      downloadList: {},
      headersAscSortFlags: {
        id: "",
        email: "",
        userDefinedParticipantId: "",
        status: "",
        userSiteId: "",
        participantStudyDays: "",
        participantStudyCompletionPercentage: "",
        participantCompliancePercentage: "",
        participantLanguage: "",
        invitationDate: "",
        source: "",
        consentedTime: ""
      },
      participants: {},
      selectedParticipants: {},
      currentParticipantsList: {},
      currentPage: 1,
      totalPages: 1,
      selectedShowOption: 15,
      participantListOptions: [{
        value: 15,
        text: 'Show 15 items',
      },
      {
        value: 50,
        text: 'Show 50 items',
      },
      {
        value: 100,
        text: 'Show 100 items',
      }],
      siteDetails: null,
      isOldProfileViewEnbaled: false,
      triggeredParticipant: null,
      composeParticipants: [],
      composeMessageId: this.$route.query.composeMessageId
    };
  },
  computed: {
    ...mapGetters(['token', 'user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    userToken() {
      return this.token;
    },
    studyId() {
      return this.$route.params.studyId;
    },
    getStatuses() {
      return participantStatuses;
    },
    getSources() {
      return participantSources;
    },
    getStatusesText() {
      return participantStatusesText;
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check('userAccess');
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check('userAccess');
    },
    canDMAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check('userAccess');
    },
    canCRAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
    canResearchSiteTeamAccess(){
      return (this.canPiAccess || this.canSubPIAccess || this.canStudyCoordinatorAccess || this.canHomeHealthAccess);
    }
  },
  watch: {
    studyData(newData, oldData) {
      if(newData.countryList){
        this.studyData.countryList = sortBy(newData.countryList, "sortOrder");
      }
      if (newData !== oldData) {
        this.getStudyDetails();
      }
    },
    $route (to, from){
      //The below code looks for the route change, so if a user is on this page and clicks on the participants link
      // provided in the left side bar then the below code will act accordingly.
      if(!to.query.composeMessageId){
        this.composeMessageId = null;
      }else{
        this.composeMessageId = to.query.composeMessageId;
      }
    }
  },
  methods: {
    screeningPassed (participantId, email, siteId) {
      if (this.$route.params.studyId) {
        let currentDateObj = new Date();
        let data = {
          participantId: participantId,
          siteId: siteId,
          screeningFailed: "0",
          screeningPassed: "1",
          invite: "0",
          email: email,
          participantLocalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          participantLocalOffset: currentDateObj.getTimezoneOffset()
        }
        this.$api
          .postUpatedScreeningStatus(
            this.$route.params.studyId,
            data
          )
          .then(response => {
            if (response) {
              this.getAllParticipants(
                this.selectedShowOption,
                this.currentPage,
                this.searchTerm,
                this.filterTerm,
                this.sortValue,
                this.sortOrder,
                this.customKey,
                this.sourcefilter,              
                this.withdrawnOrFailedFilter
              );
              this.$toastr.success('Screening passed status updated successfully');
            }
          })
          .catch(err => {
            this.$toastr.error('Screening passed status not updated');
            throw err;
          });
      }
    },

    screeningFailed (participantId, email, siteId) {
      if (this.$route.params.studyId) {
        let currentDateObj = new Date();
        let data = {
          participantId: participantId,
          siteId: siteId,
          screeningFailed: "1",
          screeningPassed: "0",
          invite: "0",
          email: email,
          participantLocalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          participantLocalOffset: currentDateObj.getTimezoneOffset()
        }
        this.$api
          .postUpatedScreeningStatus(
            this.$route.params.studyId,
            data
          )
          .then(response => {
            if (response) {
              this.getAllParticipants(
                this.selectedShowOption,
                this.currentPage,
                this.searchTerm,
                this.filterTerm,
                this.sortValue,
                this.sortOrder,
                this.customKey,
                this.sourcefilter,              
                this.withdrawnOrFailedFilter
              );
              this.$toastr.success('Screening failed status updated successfully');
            }
          })
          .catch(err => {
            this.$toastr.error('Screening failed status not updated');
            throw err;
          });
      }
    },

    invitedParticipant(participantId, email, siteId) {
      if (this.$route.params.studyId) {
        let currentDateObj = new Date();
        let data = {
          participantId: participantId,
          siteId: siteId,
          screeningFailed: "0",
          screeningPassed: "0",
          invite: "1",
          email: email,
          participantLocalTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          participantLocalOffset: currentDateObj.getTimezoneOffset()
        }
        
        this.$api
          .postUpatedScreeningStatus(
            this.$route.params.studyId,
            data
          )
          .then(response => {
            if (response) {
              this.getAllParticipants(
                this.selectedShowOption,
                this.currentPage,
                this.searchTerm,
                this.filterTerm,
                this.sortValue,
                this.sortOrder,
                this.customKey,
                this.sourcefilter,              
                this.withdrawnOrFailedFilter
              );
              this.$toastr.success('Invited successfully');
            }
          })
          .catch(err => {
            this.$toastr.error('Invitation failed');
            throw err;
          });
      }
    },

    getEligibilityAnswers(participantId) {
      this.isLoading = true;
      this.eligibilityScreenQuestionsAnsOfParticipnt = [];
      this.agreementAcceptedTime = '';
      this.agreementAcceptedDate = '';
      this.displayLanguage = '';
      this.selectedLang = ''
      this.$api
          .getParticipantWebeligibilityAnswers(
            this.$route.params.studyId,
            participantId
          )
          .then(response => {
            if (response) {
              const m = moment.utc(new Date(response.data.data.disclaimer_checked_on_utc));
              this.agreementAcceptedTime = m.format('h:mma').toUpperCase();
              this.displayLanguage = response.data.data.display_language;
              this.selectedLang = this.getLanguageText(this.displayLanguage);
              this.agreementAcceptedDate = moment.utc(response.data.data.disclaimer_checked_on_utc).format('MMMM DD, YYYY'); 
              if (response.data.data.eligibilityData){
                this.eligibilityScreenQuestionsAnsOfParticipnt = response.data.data.eligibilityData;
              }
            }
            this.isLoading = false;
          })
          .catch(err => {
            throw err;
            this.isLoading = false
          });
    },
    hideModal() {
      setTimeout(() => {
        let ifElementExists = document.getElementById('trigger-day-zero-popup');
        if(ifElementExists == undefined) {
          return;
        }
        if(!ifElementExists.classList.contains('show') && this.modalStatus) {
          this.modalStatus = false;
        }
      }, 100);
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          let toggleFeatures = response.body.studyFeatures;
          toggleFeatures.forEach(feature => {
            if(feature.featureKey === "OLDPROFILEVIEW"){
              this.isOldProfileViewEnbaled = feature.enabled;
            }
          });
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    },
    changeState(participantId) {
      if(this.isOldProfileViewEnbaled) {
        this.$router.push({
          name: "study-participant-details",
          params: { participantId: participantId }
        });
      } else {
        this.$router.push({
          name: "participant-profile",
          params: { participantId: participantId }
        });
        this.setFiltersData(participantId);
      }
    },
    // toggle show more flag for the given index participant
    toggleShowMore(index) {
      this.currentParticipantsList[index].showMore = !this
        .currentParticipantsList[index].showMore;
      this.$forceUpdate();
    },
    resetParticipantDayZeroStatus(dayZeroStatus) {
      if(!dayZeroStatus) {
        this.modalStatus = false;
        return;
      }
      let self = this;
      let participant = _.find(self.allParticipants, function(p) {
        return p.id === self.triggeredParticipant.id;
      });
      participant.participantStudyStartTrigger.createdBy = this.user.id;
      this.modalStatus = false;
    },
    isSiteTeamMember() {
      return this.canHomeHealthAccess || this.canPiAccess || this.canStudyCoordinatorAccess || this.canSubPIAccess;
    },
    canAccessTriggerBtn(participant) {
      return participant.status == this.getStatuses.VERIFIED;
    },
    triggerDayZeroPopup(participant) {
      this.triggeredParticipant = participant;
      this.modalStatus = true;
    },
    setForNonInvitedUser(participant) {
      this.notInvitedUsers.map((user) => {
        if(user.id == participant.id) {
          user.language = participant.language;
        }
      });
    },
    // change the previous page number and update the participants list
    prevPage() {
      if (this.currentPage <= this.totalPages) {
        if (this.getCallDone) {
          this.currentPage -= 1;
          this.getAllParticipants(
            this.selectedShowOption,
            this.currentPage,
            this.searchTerm,
            this.filterTerm,
            this.sortValue,
            this.sortOrder,
            this.customKey,
            this.sourcefilter,              
            this.withdrawnOrFailedFilter
          );
        }
      }
    },
    // change the next page number and update the participants list
    nextPage() {
      if (this.currentPage < this.totalPages) {
        if (this.getCallDone) {
          this.currentPage += 1;
          this.getAllParticipants(
            this.selectedShowOption,
            this.currentPage,
            this.searchTerm,
            this.filterTerm,
            this.sortValue,
            this.sortOrder,
            this.customKey,
            this.sourcefilter,              
            this.withdrawnOrFailedFilter
          );
        }
      }
    },
    // search and filter participants list
    searchParticipantFilterStudies(label) {
      if (!label) {
        this.currentPage = 1;
      }
      this.getAllParticipants(
        this.selectedShowOption,
        this.currentPage,
        this.searchTerm,
        this.filterTerm,
        this.sortValue,
        this.sortOrder,
        this.customKey,
        this.sourcefilter,              
        this.withdrawnOrFailedFilter
      );
    },
    changeWithdrawnOrFailedFilter() {
      this.setWithdrawnOrFailedFilter = !this.setWithdrawnOrFailedFilter;
      this.withdrawnOrFailedFilter = this.setWithdrawnOrFailedFilter === true ? true : "";
      this.getAllParticipants(
      this.selectedShowOption,
      this.currentPage,
      this.searchTerm,
      this.filterTerm,
      this.sortValue,
      this.sortOrder,
      this.customKey,
      this.sourcefilter,
      this.withdrawnOrFailedFilter
       );
     },
    //sort participants list
    sortList(sortValue, custom) {
      if (custom) {
        this.sortValue = "customLabel";
        this.customKey = sortValue;
      } else {
        this.sortValue = sortValue;
        this.customKey = "";
      }
      this.resetSortValues(sortValue);
      this.headersAscSortFlags[sortValue] = cloneDeep(
        !this.headersAscSortFlags[sortValue]
      );
      if (this.headersAscSortFlags[sortValue]) {
        this.sortOrder = "asc";
      } else {
        this.sortOrder = "desc";
      }
      this.currentPage = 1;
      this.getAllParticipants(
        this.selectedShowOption,
        this.currentPage,
        this.searchTerm,
        this.filterTerm,
        this.sortValue,
        this.sortOrder,
        this.customKey,
        this.sourcefilter,              
        this.withdrawnOrFailedFilter
      );
    },
    resetSortValues(sortValue) {
      Object.keys(this.headersAscSortFlags).forEach(key => {
        if (sortValue !== key) {
          this.headersAscSortFlags[key] = "";
        }
      });
    },
    closeModal() {
       let noParticipants = false;
       this.participantsList.forEach(element => {
          if((element.email !== '' || element.siteId !== null) || element.language !== "" || element.userDefinedParticipantId || element.countryId !== "" || element.countryId !== null) {
            noParticipants = true;
          }
        });
      if(noParticipants === false) {
          window.$('#add-participant-modal').modal('hide');
           this.participantsList = [{
            email: '',
            siteId: null,
          }];
      }
      else {
      this.$swal({
        title: 'Are you sure you want to cancel? Not saved data will be lost.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4a4a4a',
        cancelButtonColor: '#1e8fe1',
        confirmButtonText: 'No',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          window.$('#add-participant-modal').modal('hide');
          this.disableInvite = true;
          this.participantsList = [{
            dynamicInputID: dynamicInputID,
            email: '',
            siteId: null,
            language: null,
            countryId: null
          }];
        }
      });
      }
    },
    openAddModal() {
      window.$('#add-participant-modal').modal('show');
      if (this.user.userRole !== 'Pi' && this.user.userRole !== 'SubPi' && this.user.userRole !== 'StudyCoordinator' && this.user.userRole !== 'HomeHealth') {
        this.getSiteDetails();
      }else{
        //Get the site details when any of the site team user logs in.
        if(this.user.siteIds && this.user.siteIds.length>0 && !this.siteDetails){
          this.getSiteDetailsFact();
        }else if(this.siteDetails){
          //Since the API to get the site details has already been called, no need to call it again
          this.participantsList[0].countrySiteOptions = this.siteDetails.countryList;
          //If there is only one country associated to the site then set it as default selected country
          this.setDefaultCountry(this.participantsList[0], this.siteDetails.countryList)
          this.$forceUpdate();
        }
      }
    },
    downloadTemplate() {
      this.downloadStarted = true;
      this.downloadCompleted = true;
      this.$api.downloadTemplateParticipantDataFact(this.studyId).then(
        response => {
          this.downloadCompleted = false;
          const donwloadFileName = "import_participant.csv";
          //Work around for IE Browsers
          if (window.navigator.msSaveOrOpenBlob) {
            let blobObject = new Blob([response.body]);
            window.navigator.msSaveBlob(blobObject, donwloadFileName);
          }else{
            const csvContent = `data:text/csv;charset=utf-8,${response.body}`;
            const encodedUri = encodeURI(csvContent);
            const link = window.document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', donwloadFileName);
            window.document.body.appendChild(link); // Required for FF
            link.click();
          }

          this.$toastr.success('Participant template downloaded successfully');
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while downlaoding participants."
          );
        }
      );
    },
    getStudyDetails() {
      if (this.studyData.onboardingType === "ByInvitation") {
        this.byInvite = true;
      }
    },

    selectedParticipantForChangeStatus(participant) {
      this.selectedParticipantForChangeStatusValue = participant;
    },
    resetSelectedParticipant() {
      this.selectedParticipantForChangeStatusValue = {};
    },

    createUpdateParticipant(participant, invite) {
      let p = this.processTheLanguageKey(participant);
      const participantData = cloneDeep(p);
      participantData.sendInvite = invite;
      const payload = {
        studyId: this.studyId,
        participantId: participantData.id,
        data: participantData
      };
      this.$api.updateParticipantInfoFact(payload).then(
        () => {
          this.$toastr.success("Participants updated successfully");
          this.$router.push({
            name: "study-participants-list",
            params: { studyId: this.studyId }
          });
          this.getAllParticipants(
            this.selectedShowOption,
            this.currentPage,
            this.searchTerm,
            this.filterTerm,
            this.sortValue,
            this.sortOrder,
            this.customKey,
            this.sourcefilter,              
            this.withdrawnOrFailedFilter
          );
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while updating participant."
          );
        }
      );
    },

    resendVerification(participant) {
      const payload = {
        studyId: this.studyId,
        participantId: participant.id,
      };
      this.$api.resendVerificationFact(payload).then(
        () => {
          this.$toastr.success("Verification email sent");
          this.$router.push({
            name: "study-participants-list",
            params: { studyId: this.studyId }
          });
          this.getAllParticipants(
            this.selectedShowOption,
            this.currentPage,
            this.searchTerm,
            this.filterTerm,
            this.sortValue,
            this.sortOrder,
            this.customKey,
            this.sourcefilter,              
            this.withdrawnOrFailedFilter
          );
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while updating participants."
          );
        }
      );
    },


    getAllParticipants(
      selectedShowOption,
      currentPage,
      search,
      filter,
      sortValue,
      sortOrder,
      customKey,
      sourcefilter,              
      withdrawnOrFailedFilter
    ) {
      this.$api
        .getParticipantsListFact(
          this.studyId,
          selectedShowOption,
          currentPage,
          search,
          filter,
          sortValue,
          sortOrder,
          customKey,
          sourcefilter,              
          withdrawnOrFailedFilter
        )
        .then(
          response => {
            this.allParticipants = response.body.participants;
            this.allParticipants = this.processParticipant(
              this.allParticipants
            );
            this.totalParticipants = response.body.totalParticipants;
            this.participantNotInvited = response.body.isParticipantNotInvited;
            this.totalPages = response.body.totalPages;
            this.currentPage = response.body.currentPage;
            this.participants = this.allParticipants;
            this.currentParticipantsList = this.allParticipants;
            this.currentParticipantsList.forEach((element, index) => {
              this.currentParticipantsList[index].showMore = false;
            });
            this.getCallDone = true;
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting participants."
            );
          }
        );
      this.getCallDone = false;
    },
    // Show the participants list in the table as per the number selected
    showParticipants(selectedShowOption) {
      this.getAllParticipants(
        selectedShowOption,
        1,
        this.searchTerm,
        this.filterTerm,
        this.sortValue,
        this.sortOrder,
        this.customKey,
        this.sourcefilter,
        this.withdrawnOrFailedFilter
      );
    },

    viewParticipant(participantId) {
      this.$router.push({
        name: "add-edit-participant",
        params: { participantId }
      });
    },

    getSiteDetails() {
      this.$api.getSitesFact(this.studyId).then(
        response => {
          this.researchSites = sortBy(response.body, "createdTime");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the list of sites"
          );
        }
      );
    },

    addParticipant() {
      this.disableInvite = true;
      dynamicInputID++;
      let particpantInviteObj = { dynamicInputID: dynamicInputID, email: '', siteId: null, language: null, countryId: null };
      if(this.siteDetails){
        particpantInviteObj.countrySiteOptions = this.siteDetails.countryList;
        //If there is only one country associated to the site then set it as default selected country
        this.setDefaultCountry(particpantInviteObj, this.siteDetails.countryList)
      }
      this.participantsList.push(particpantInviteObj);
      this.disableInvite = true;
    },

    removeParticipant(index) {
      this.participantsList.splice(index, 1);
      this.participantsList.forEach((element, i) => {
        this.validateParticipants(i);
      });
    },

    validateParticipants(index) {
      this.disableInvite = true;
      this.participantsList[index].emailError = false;
      if (this.user.userRole === 'Pi' || this.user.userRole === 'SubPi' || this.user.userRole === 'StudyCoordinator' || this.user.userRole === 'HomeHealth') {
        const siteId = this.user.siteIds[0];
        this.participantsList[index].siteId = siteId;
      }

      if(this.errors.has(`email${this.participantsList[index].dynamicInputID}`) || this.participantsList[index].email.trim() == ""){
        this.participantsList[index].emailError = true;
        this.disableInvite = true;
        this.$forceUpdate();
      }
      if (this.participantsList[index].siteId === null) {
        this.participantsList[index].errorSite = true;
        this.disableInvite = true;
      }
      else {
        this.participantsList[index].errorSite = false;
      }
      if (this.participantsList[index].language === null) {
        this.participantsList[index].errorlanguage = true;
        this.disableInvite = true;
      }
      else {
        this.participantsList[index].errorlanguage = false;
      }
      if (this.participantsList[index].countryId == null) {
        this.participantsList[index].errorCountry = true;
        this.disableInvite = true;
      }
      else {
        this.participantsList[index].errorCountry = false;
      }

      this.$nextTick(function () {
        if (this.participantsList[index].email.trim() != "" && !this.participantsList[index].errorSite && !this.participantsList[index].errorCountry && !this.participantsList[index].errorlanguage) {
          this.disableInvite = false;
        }
      })

      this.$forceUpdate();
    },

    inviteParticipant(list, invite) {
      const self = this;
      let totalCount = 0;
      let successCount = 0;
      const addedList = filter(list, o => !o.added);
      addedList.forEach(async participant => {
        const data = participant;
        data.sendInvite = invite;
        try {
          await self.$api.addNewParticipantInfoFact(self.studyId, data);
          data.added = true;
          self.$forceUpdate();
          self.validate(list);
          totalCount += 1;
          successCount += 1;
          self.showMessage(successCount, invite, totalCount, addedList.length);
        } catch (error) {
          data.added = false;
          self.validate(list);
          data.emailError = true;
          self.$forceUpdate();
          totalCount += 1;
          self.showMessage(successCount, invite, totalCount, addedList.length);
          self.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while adding participants."
          );
        }
      });
    },
    processTheLanguageKey(list) {
      if(Array.isArray(list)) {
          list.map(participant => {
          participant.languageKey = participant.language;
          delete participant.language;
          delete participant.countrySiteOptions;
        });
      } else {
        let participantObj = {...list};
        participantObj.languageKey = participantObj.language;
        delete participantObj.language;
        delete participantObj.countrySiteOptions;
        return participantObj;
      }

    },
    inviteParticipantNew(list, invite) {
      this.processTheLanguageKey(list);
      this.disableInvite = true;
       this.$api.addParticipantListFact(this.studyId,invite,list).then(
        response => {
          this.downloadList = response.body;
          this.skippedParticipants = response.body.skippedParticipants;
          this.skippedParticipantsCount =
            response.body.skippedParticipantsCount;
          window.$("#add-participant-modal").modal("hide");
          if (this.skippedParticipantsCount > 0) {
            window.$("#download-report-modal").modal("show");
            window.$('#download-report-modal').on('shown.bs.modal', function (e) {
              $('body').addClass('modal-open');
            })
          }
          if (response.body.importParticipantsCount > 0) {
            if (invite) {
              this.$toastr.success(
                `${
                  response.body.importParticipantsCount
                } Participant(s) invited`
              );
            } else {
              this.$toastr.success(
                `${response.body.importParticipantsCount} Participant(s) loaded`
              );
            }
          }
          this.getAllParticipants(this.selectedShowOption, this.currentPage);
          this.filterTerm = "";
          this.searchTerm = "";
          this.sourcefilter ="",
          this.withdrawnOrFailedFilter = "",
          this.resetSortValues("");
          this.participantsList = [
            {
              email: "",
              siteId: null,
              language: null,
              countryId: null,
              countrySiteOptions: null
            }
          ];
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while adding participants."
          );
        }
      );
    },

    showMessage(successCount, invite, count, length) {
      if (count === length) {
        if (invite) {
          this.$toastr.success(`${successCount} Participant(s) invited`);
        } else {
          this.$toastr.success(`${successCount} Participant(s) imported`);
        }
      }
    },
    validate(list) {
      const addedList = filter(list, o => o.added);
      if (addedList.length === list.length) {
        this.getAllParticipants(this.selectedShowOption, this.currentPage);
        this.filterTerm = "";
        this.searchTerm = "";
        this.sourcefilter ="",
        this.withdrawnOrFailedFilter = "",
        this.resetSortValues("");
        window.$("#add-participant-modal").modal("hide");
        this.participantsList = [
          {
            email: "",
            siteId: null,
            language: null,
            countryId: null,
            countrySiteOptions: null
          }
        ];
      }
    },

    goToEditParticipantProfile() {
      this.editable = false;
    },

    closeImportModal() {
      window.$("#batch-import-modal").modal("hide");
      this.setImportValue = null;
      window.$('#file_upload[type="file"]').val(null);
    },
    closeDownloadModal() {
      window.$("#download-report-modal").modal("hide");
      window.$('#download-report-modal').on('hidden.bs.modal', function (e) {
        $('body').removeClass('modal-open');
      })
    },
    onFileChange() {
      const fd = new FormData();
      const input = window.document.getElementById("file_upload");
      fd.append("file", input.files[0]);
      fd.append("sendInvite", false);
      this.setImportValue = fd;
      this.uploadFileName = input.files[0].name;
      Papa.parse(input.files[0], {
        complete: results => {
          const data = filter(results.data, o => o.length === 5);
          this.fileLength = data.length - 1;
          window.$("#add-participant-modal").modal("hide");
          if (
            data.length - 1 > 0 &&
            ((data[0][0] === "Participant email address" ||
              data[0][0] === " Participant email address") &&
              data[0][1] === "Site ID" &&
              data[0][2] === "Participant ID" &&
              data[0][3] === "Language" &&
              data[0][4] === "Country")
          ) {
            window.$("#batch-import-modal").modal("show");
          } else {
            this.$toastr.error(
              "Uploaded file is not in the expected format. Please use the batch upload template."
            );
          }
        }
      });
      this.$forceUpdate();
      window.document.getElementById("file_upload").value = null;
    },
    uploadAnotherCSV() {
      this.showDefaultImport = true;
      this.afterImporting = false;
      this.setImportValue = null;
    },
    importCSV(setImportValue) {
      this.fileName = this.uploadFileName;
      this.showDefaultImport = false;
      this.showImporting = true;
      this.closeImportModal();
      window.$("#uploading-modal").modal("show");
      this.value = 0;
      window.setInterval(() => {
        this.value = this.value + 10;
      }, 100);
      this.$forceUpdate();
      this.$api.importParticipantDataFact(this.studyId, setImportValue).then(
        response => {
          this.importPassed = true;
          this.showImporting = false;
          this.afterImporting = true;
          this.skippedParticipants = response.body.skippedParticipants;
          this.skippedParticipantsCount =
            response.body.skippedParticipantsCount;
          if (response.body.importParticipantsCount > 0) {
            this.$toastr.success(
              `${response.body.importParticipantsCount} Participant(s) loaded`
            );
          }
          this.downloadList = response.body;
          this.getAllParticipants(this.selectedShowOption, this.currentPage);
          this.searchTerm = "";
          this.filterTerm = "";
          this.sourcefilter ="",
          this.withdrawnOrFailedFilter = "",
          this.resetSortValues("");
          this.setImportValue = null;
          this.value = 100;
          window.clearInterval();
          window.$("#uploading-modal").modal("hide");
          window.$("#download-report-modal").modal("show");
          window.$('#download-report-modal').on('shown.bs.modal', function (e) {
            $('body').addClass('modal-open');
          })
        },
        error => {
          this.importPassed = false;
          window.clearInterval();
          window.$("#uploading-modal").modal("hide");
          window.$("#download-report-modal").modal("show");
          window.$('#download-report-modal').on('shown.bs.modal', function (e) {
            $('body').addClass('modal-open');
          })
          this.showImporting = false;
          this.afterImporting = true;
          this.setImportValue = null;
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while uploading participants csv."
          );
        }
      );
    },
    getDateStamp() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const year = now.getFullYear();
      const hours = now.getHours();
      const mins = `0${now.getMinutes()}`.slice(-2);
      return `${month}-${day}-${year}-${hours}-${mins}`;
    },
    download() {
      this.downloadStarted = true;
    },
    downloadAgain() {
      this.downloadStarted = false;
      this.userDetails.password = null;
      this.errors.clear();
    },
    exportCSV() {
      const fileName = `participants_${this.getDateStamp()}.csv`;
      const ua = navigator.userAgent.toLowerCase();
      let type = "";
      if (ua.indexOf("safari") !== -1) {
        if (!(ua.indexOf("chrome") > -1 || ua.indexOf("crios") > -1)) {
          type = "attachment/csv;charset=utf-8";
        }
      }
      type = "text/csv;charset=utf-8";
      const list = [];
      this.downloadList.skippedParticipants.forEach(element => {
        list.push({
          "Participant email address": element.email,
          "Site ID": element.siteId,
          "Participant ID": element.participantId,
          Status: "failed",
          "Failure reason": element.reason
        });
      });
      this.downloadList.importParticipants.forEach(element => {
        list.push({
          "Participant email address": element.email,
          "Site ID": element.siteId,
          "Participant ID": element.participantId,
          Status: "imported",
          "Failure reason": element.reason
        });
      });
      const csv = Papa.unparse(list);
      const blob = new Blob([csv], { type });
      FileSaver.saveAs(blob, fileName);
    },
    batchInvite() {
      this.getNotInvitedUserList(true);
      window.$("#invite-all-modal").modal("show");
    },
    inviteAll() {
      let batchInviteList = [];
      let self = this;
      this.notInvitedUsers.forEach(user => {
        var currentlanguage;
        self.currentParticipantsList.forEach(element => {
          if(element.id == user.id){
            currentlanguage = element.language;
          }
        });
        var par = new Object();
        par.participantId = user.id;
        par.languageKey = currentlanguage ? currentlanguage : user.language ;
        batchInviteList.push(par);
      });
      this.$api.batchInviteInfoFact(this.studyId, batchInviteList).then(
        response => {
          const keys = Object.keys(response.body);
          const invitedLength = this.notInvitedUsers.length - keys.length;
          if (invitedLength > 0) {
            this.$toastr.success(`${invitedLength} participant(s) invited.`);
          }else{
           this.$toastr.error(
            `${keys.length} participant(s) invitation failed.`
          );
          }
          this.getAllParticipants(this.selectedShowOption, this.currentPage);
          this.searchTerm = "";
          this.filterTerm = "";
          this.sourcefilter ="",
          this.withdrawnOrFailedFilter = "",
          this.resetSortValues("");
          window.$("#invite-all-modal").modal("hide");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting participants."
          );
        }
      );
    },
    getUniqueNotInvitedUser() {
      const result = [];
      const map = new Map();
      for (const item of this.notInvitedUsers) {
          if(!map.has(item.id)){
              map.set(item.id, true);    // set any value to Map
              result.push(item);
          }
      }
      this.notInvitedUsers = result;
    },
    cancelInvite() {
      window.$("#invite-all-modal").modal("hide");
    },
    clearImport() {
      this.showDefaultImport = true;
      window.$("#import-participant-modal").modal("hide");
      this.afterImporting = false;
      this.showImporting = false;
    },
    addNewLabel() {
        let maxIndex = Number(max(map(this.newLabelsList, "keyReference")));
      console.log("this.newLabelsList.length",this.newLabelsList.length);
      maxIndex = maxIndex || 1;
      if(this.newLabelsList.length > 0){
        if(this.newLabelsList[this.newLabelsList.length-1].id){
          this.newLabel = { keyReference: maxIndex + 1, key: "", value: "" };
          this.newLabelsList.push(this.newLabel);
        }else{
          this.$toastr.error("Custom label value should not be empty");
        }
      }else{
      this.newLabel = { keyReference: maxIndex + 1, key: "", value: "" };
      this.newLabelsList.push(this.newLabel);
      }
      this.addLabelDisable = true;
      this.updateLabelMode = false;
    },
    getCustomLabels() {
      this.$api.getLabelsFact(this.studyId).then(
        response => {
          this.newLabelsList = sortBy(response.body, "keyReference");
          response.body.forEach(element => {
            this.headersAscSortFlags[element.key] = "";
          });
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while adding label."
          );
        }
      );
    },
    createUpdateLabelCallback(index, response) {
      this.newLabelsList.splice(index, 1, response);
      this.newLabel = {};
      this.addLabelDisable = false;
      this.updateLabelMode = false;
    },
    createUpdateLabel(item, index) {
      if (item.keyReference) {
        if (this.updateLabelMode) {
          this.$api.updateNewLabelFact(this.studyId, item.id, item).then(
            response => {
              this.createUpdateLabelCallback(index, response.body);
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while adding label."
              );
            }
          );
        } else {
          this.$api.addNewLabelFact(this.studyId, item).then(
            response => {
              this.headersAscSortFlags[item.key] = "";
              this.createUpdateLabelCallback(index, response.body);
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : "Error while adding label."
              );
            }
          );
        }
      }
    },
    updateLabel(item) {
      this.newLabel = cloneDeep(item);
      this.addLabelDisable = true;
      this.updateLabelMode = true;
    },
    discardChanges() {
      this.newLabel = {};
      this.addLabelDisable = false;
      this.updateLabelMode = false;
    },
    deleteLabelCallback(index) {
      this.newLabelsList.splice(index, 1);
      this.newLabel = {};
      this.addLabelDisable = false;
      this.updateLabelMode = false;
    },
    deleteLabel(index, item) {
      this.$swal({
        title: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Delete"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          if (item.keyReference) {
            if (this.updateLabelMode) {
              this.$api.deleteNewLabelFact(this.studyId, item.id).then(
                () => {
                  this.deleteLabelCallback(index);
                  this.getAllParticipants(
                    this.selectedShowOption,
                    this.currentPage
                  );
                  this.searchTerm = "";
                  this.filterTerm = "";
                  this.sourcefilter ="",
                  this.withdrawnOrFailedFilter = "",
                  this.resetSortValues("");
                },
                error => {
                  this.$toastr.error(
                    error.body && error.body.message
                      ? error.body.message
                      : "Error while adding label."
                  );
                }
              );
            } else {
              this.deleteLabelCallback(index);
            }
          }
        }
      });
    },
    addLabelValue(participant, item) {
      this.newLabelValue = cloneDeep(item);
      this.newLabelValue[this.newLabelValue.key] = "";
      this.newLabelValue.participantId = participant.id;
      this.newLabelValue[item.key] = "";
    },
    createUpdateLabelValue(newLabelValue, participant) {
      const newLabel = cloneDeep(newLabelValue);
      this.updateLabelValueMode = false;
      if (newLabelValue[newLabelValue.key] !== "") {
        newLabel.email = participant.email;
        newLabel.id = newLabel.participantId;
        newLabel.sendInvite = false;
        const pData = {
          studyId: this.studyId,
          participantId: participant.id,
          data: newLabel
        };
        this.$api.addNewLabelValueFact(pData).then(
          () => {
            this.searchParticipantFilterStudies("label");
            this.newLabelValue = {};
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while adding label."
            );
          }
        );
      } else {
        this.$toastr.error("Please enter a value for the label.");
      }
    },
    discardLabelValueChanges() {
      this.newLabelValue = {};
      this.updateLabelValueMode = false;
    },
    updateLabelValue(newLabelValue, participant) {
      const newLabel = cloneDeep(newLabelValue);
      const value = participant[newLabel.key];
      newLabel[newLabel.key] = value;
      newLabel.participantId = participant.id;
      this.newLabelValue = newLabel;
    },
    getStatusText(participant) {
      return this.participantStatusesText[participant.status];
    },
    getSourceText(participant) {
      return this.participantSourcesText[participant.source];
    },
    getLanguageText(language) {
      return this.participantLanguageText[language];
    },
    canInviteParticipants() {
      let rolesNotInviteParticipants = [CRA, DM, QUALITY,SITEDATALOCK];
      return !_.includes(rolesNotInviteParticipants, this.user.userRole);
    },
    processParticipant(allParticipants) {
      if (allParticipants && allParticipants.length == 0) {
        return allParticipants;
      }
      allParticipants.map(participant => {
        if(participant != undefined) {
           if(participant.participantLanguage != undefined){
               participant.language = participant.participantLanguage.language_id;
           }
         }

        participant.disabled = true;
        if (
          participant.status == this.getStatuses.NOTINVITED ||
          participant.status == this.getStatuses.INVITED
        ) {
          participant.disabled = false;
        }
      });

      return allParticipants;
    },
    getNotInvitedUserList(flag) {
      this.notInvitedUsers = [];
      this.$api.getNotInvitedParticipantsFact(this.studyId).then(
        response => {
          response.body.forEach(part => {
            this.notInvitedUsers.push(part);
          });
          if(flag) {
            this.getUniqueNotInvitedUser();
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting not invited participants."
          );
        }
      );
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          let toggleFeatures = response.body.studyFeatures;
            toggleFeatures.forEach(feature => {
              if(feature.featureKey === "OLDPROFILEVIEW"){
                this.isOldProfileViewEnbaled = feature.enabled;
              }
            });
      });
    },
    populateCountryOptions(participantObj){
      let selectedSiteObj = filter(this.researchSites, {'id': participantObj.siteId});
      let siteCountries = selectedSiteObj[0].countryList;
      participantObj.countrySiteOptions = siteCountries;
      //If there is only one country associated to the site then set it as default selected country
      this.setDefaultCountry(participantObj, siteCountries);
    },
    getSiteDetailsFact() {
      this.$api.getSiteDetailsFact(this.studyId, this.user.siteIds[0]).then(
        response => {
          this.siteDetails = response.body;
          this.participantsList[0].countrySiteOptions = this.siteDetails.countryList;
          //If there is only one country associated to the site then set it as default selected country
          this.setDefaultCountry(this.participantsList[0], this.siteDetails.countryList);
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site details.',
          );
        }
      );
    },
    setDefaultCountry(participantObj, siteCountries){
      if(siteCountries.length==1){
        //If there is only one country associated to the site then set it as default selected country
        participantObj.countryId = siteCountries[0].countryId;
        participantObj.errorCountry = false;
      }else{
        participantObj.countryId = null;
        participantObj.errorCountry = true;
      }
    },
    hasErrorInParticipantList(){
      let emptyItems = filter(this.participantsList, participant => {
          return (participant.email.trim() == "" || participant.siteId == null || participant.language==null || participant.countryId==null || participant.emailError || participant.errorSite || participant.errorlanguage || participant.errorCountry)
      });
      if(emptyItems.length>0){
        return true;
      }else{
        return false;
      }
    },
    isNull(v){
      if(typeof v === 'string' || v instanceof String)
        return v?v:"";
      return "";
    },
    setFiltersData(pid) {
      let participantFilters = LocalStorageService.getItem("participants-filter-map");
      participantFilters = participantFilters ? new Map(JSON.parse(participantFilters)) : new Map();
      let filters = { "pageSize":Number(this.selectedShowOption), "search":this.isNull(this.searchTerm), "filter":this.isNull(this.filterTerm), "sortValue":this.isNull(this.sortValue), "sortOrder":this.isNull(this.sortOrder), "customKey":this.isNull(this.customKey), "sourcefilter":this.isNull(this.sourcefilter), "withdrawnOrFailedFilter":this.isNull(this.withdrawnOrFailedFilter)};
      participantFilters.set(this.studyId+"-"+pid, filters);
      LocalStorageService.setItem("participants-filter-map", [...participantFilters]);
    },
    backToComposeMessage(){
      
      if (LocalStorageService.getItem(this.composeMessageId) === null || LocalStorageService.getItem(this.composeMessageId) === undefined) {
        this.$toastr.error("Something went wrong, please start from the compose process again.");
      }else{
        let comMsgObj = LocalStorageService.getItem(this.composeMessageId);
        comMsgObj.participantList = this.composeParticipants;
        LocalStorageService.setItem(this.composeMessageId, comMsgObj);
        this.$router.push({
          name: "study-participant-compose-message",
          params: { composeMessageId: this.composeMessageId }
        });
      }
      
    }
  },
  mounted() {
    this.getAllParticipants(this.selectedShowOption, this.currentPage);
    this.getStudyDetails();
    this.getCustomLabels();
    this.getNotInvitedUserList(false);
    this.getToggledFeatures();

    //verify that the user has come to this page from compose message and the compose id exists in local storage
    if(this.composeMessageId){
      let comMsgObj = LocalStorageService.getItem(this.composeMessageId);
      if (comMsgObj === null || comMsgObj === undefined) {
        this.composeMessageId = null;
        this.$toastr.error("Something went wrong, please start from the compose process again.");
        this.$router.push({
          name: "study-participant-messages"
        });
      }else {
        //comMsgObj = JSON.parse(comMsgObj);
        if(Object.keys(comMsgObj).length!=0){
          this.composeParticipants = comMsgObj.participantList;
        }
      }
    }
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
  .mb-5 {
    margin-bottom: 5px !important;
  }
}
.question-answer-style-heading {
    height: 13px;
    font-family: RobotoRegular;
    font-size: 11px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
}
.question-answer-style {
    font-family: RobotoRegular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
}
.link {
  color: #1e8fe1 !important;
  cursor: pointer;
}
.link:hover {
  color: #1e8fe1;
  text-decoration-line: underline !important;
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

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.table-striped > tbody > tr[data-v-15e213e8]:nth-of-type(odd) {
  background-color: #fff !important;
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
.modal-content-style {
  padding: 15px;
  width: 477px;
  height: 207px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.gray-color {
  color: #4a4a4a !important;
}
.purple_color {
  color:#a569bd !important;
}
.invite-que-style {
  font-family: RobotoRegular;
  font-size: 14px;
  color: #666669;
}
.change-screening-status{
  margin: 5px 15px;
  width: auto;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.78;
  letter-spacing: normal;
  color: #666669;
}
.participant-ID {
  margin: 6px 0px 6px 0px;
  width: 76px;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  color: #b0bac9;
}
.participant-ID-field {
  margin: 6px 0px 6px 0px;
  width: 78px;
  height: 9px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #4a4a4a;
}
.thread-ID {
  margin: 6px 0px 6px 0px;
  width: 65px;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: bold;
  color: #b0bac9;
}
.thread-ID-field {
  margin: 6px 0px 6px 0px;
  font-family: RobotoRegular;
  font-size: 14px;
  color: #4a4a4a;
}

.cancel-modal-but {
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  width: 110px;
  height: 36px;
  background-color: #e0e0e0;

}
.cancel-modal-span {
  width: 78px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #000000;
}
.screening-failed-but {
  border: 1px solid #f16559;
  border-radius: 18px;
  width: 148px;
  height: 36px;
  background-color: #f16559;
}
.screening-failed-span {
  width: 116px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #ffffff;
}
.screening-passed-but {
  border: 1px solid #4c8ce4;
  border-radius: 18px;
  width: 147px;
  height: 36px;
  background-color: #4c8ce4;
}
.screening-passed-span {
  width: 115px;
  height: 20px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #ffffff;
}
.rectangle {
  display: flex;
  width: auto;
  min-height: 59px;
  background-color: #eaf0f4;
}
.header-rectangle {
  width: 100%;
  height: 44px;
  background-color: #f1f4f8;
}
.eligibility-heading-style {
  width: 100%;
  font-family: RobotoRegular;
  font-size: 16px;
  color: #000000;
  text-align: center;
  padding: 16px;
  border-bottom: 5px solid #f1f4f8;
}
.agreement-accepted-style {
  width: 90%;
  height: 16px;
  font-family: RobotoRegular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  text-align: end;
}
.eligibility-popup-icon{
  margin-left: 6px;
  margin-bottom: 6px;
  width: 19px;
  height: 19px;
  object-fit: contain;
}
.lang-slection-style {
    margin: 6px;
    font-family: RobotoRegular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    color: #4a4a4a;
    background-color: #f1f4f8;
    border: none;
    outline: 0;
}
.lang-slection-style :focus {
  border: none;
  outline: 0;
}
.close-btn {
    width: 28px;
    font-size: 18px;
    line-height: 1;
    color: #4a4a4a;
    font-weight: normal;
    border: 0;
    margin: 10px;
    background-color: #f1f4f8;
}

.loading-style {
  font-family: RobotoRegular;
  font-size: 25px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
  left: 20;
  width: 70px;
  height: 25px;
  position: absolute;
  left: 48%;
  top: 50%;
}
.question-wrapper::-webkit-scrollbar {
  width: 6px;               /* width of the entire scrollbar */
}
.question-wrapper::-webkit-scrollbar-track {
  background: transparent;        /* color of the tracking area */
}
.question-wrapper::-webkit-scrollbar-thumb {
  background-color: #e6e9ed;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 3px solid transparent;  /* creates padding around scroll thumb */
}
.question-wrapper {
    overflow-y: scroll;
    height: 485px;
    font-family: RobotoRegular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    scrollbar-width: thin;          /* "auto" or "thin"  */
    scrollbar-color: #e6e9ed transparent;   /* scroll thumb & track */ 
}
.field-wrapper {
  width: auto;
  padding: 5px 10px;
}
.check-withwrawn {
  vertical-align: middle;
  width: 16.7px;
  height: 16.7px;
}
.margin-style-1 {
  margin: 10px 30px 10px 40px !important;
  border-bottom: 1px solid #e5e5e5;
}
.margin-style-2 {
  margin: 10px 44px 10px 40px !important;
  border-bottom: 1px solid #e5e5e5;
}

.Show-Withdrawn-or-Failed-participants {
  margin-top: 11px;
  margin-bottom: 0;
  height: 14px;
  font-family: RobotoRegular;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  color: #000000;
  margin-left: 25px;
}

.search-field {
  padding: 8px !important;
  background-image: url("/static/img/search1.svg");
  background-repeat: no-repeat;
  background-position: 97% 50%;
  color: #2d3752;
  border: 1px solid #e4e8eb !important;
}

.select_section {
  select.form-control {
    height: 40px !important;
    line-height: 22px;
  }
}

.show_section {
  select.form-control {
    height: 36px !important;
    line-height: 22px;
  }
}

.modal-dialog {
  min-width: 31%;
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
    //max-width: inherit;
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
.trigger-day-btn {
  border-radius: 100px;
  &.cancel {
    background-color: #000;
    color: #fff;
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

.main-content {
  width: 100%;
}

.add-invite-btn {
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
}

.yes-btn {
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
  width: 100px !important;
}

.no-btn {
  color: #fff !important;
  background-color: #4a4a4a !important;
  border-color: #4a4a4a !important;
  width: 100px !important;
}
.cancel-btn {
  color: #fff !important;
  background-color: #4a4a4a !important;
  border-color: #4a4a4a !important;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
  padding-left: 0;
}
.invite-text {
  color: #666669 !important;
}
.send-invite {
  background-color: #f16559;
  color: #fff;
  font-size: 12px;
}
.ml-30 {
  margin-left: 30px;
}
.newBtn {
  height: 36px;
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
  cursor: pointer;
  font-weight: 400;
  padding: 0.375rem 15px;
}

.color_1e8fe1 {
  color: #1e8fe1;
}

.color_f16559 {
  color: #f16559;
}

.importBtn {
  // width: 85px;
  height: 30px;
  border-radius: 4px;
  border: solid 1px #1e8fe1;
  background-color: #ffffff;
  color: #1e8fe1;
  cursor: pointer;
  font-size: 14px;
}

.img-mr {
  margin-top: -2px;
}

.width-650 {
  width: 650px !important;
  min-width: 650px !important;
}

.width-1100 {
  width: 1100px !important;
  min-width: 1100px !important;
}
.width-850{
  width: 850px !important;
  min-width: 850px !important;
}

.width-700 {
  width: 700px !important;
  min-width: 700px !important;
}
.width-100 {
  width: 100px;
}

.height-250 {
  height: 250px;
}

.height-auto {
  height: auto !important;
}

.participant-bg {
  background: #f5f8fa !important;
  // height: 100%;
  // min-height: 100vh;
  color: #34537d;
  overflow: auto;

  h3 {
    color: #34537d;
  }
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f5f8fa !important;
}

.table {
  .heading-color {
    color: #9b9b9b !important;
    border-top: none;
    border-bottom: none;
    vertical-align: top;
  }

  th,
  td {
    padding: 10px;
    line-height: 30px;
    word-break: break-all;
  }
}
.table-border {
  border-bottom: 1px solid #e4e8eb !important;
}
.new-label-width {
  min-width: 300px !important;
}

.invite-width {
  min-width: 250px !important;
}

.table-content-color {
  color: #4a4a4a;
  height: 55px !important;
}
.azure-class {
  color: #1f95f2;
}
.modal-content {
  padding: 15px;
}
.table-column {
  width: 100%;
  background-color: #fff;
  height: 100%;
  padding: 18px 0px 0px 0px;
  color: #9b9b9b;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
.color_import {
  color: #34537d;
  padding-bottom: 30px;
}
.input-bg {
  background: #ffffff !important;
  color: #4a4a4a !important;
  border: 1px solid #e4e8eb !important;
}

.icon-bg {
  color: #ffffff;
}

.icon-color {
  color: #34537d;
}

.fs-14 {
  font-size: 14px !important;
}

.view-color {
  color: #00b1ff;
  cursor: pointer;
}
.close-style {
  position: relative;
  right: 8px;
  top: 5px;
  font-size: 28px;
}
.footer-close-style {
  color: #34537d;
  margin-bottom: 15px;
  text-align: center;
  cursor: pointer;
}

.lh-15 {
  line-height: 15px;
}

.download-style {
  color: #00baf9;
  text-align: center;
  font-size: 16px;
  padding-bottom: 20px;
}
.file-style {
  color: #2ecc71;
  text-align: center;
  font-size: 16px;
  padding-bottom: 20px;
}
.modal-title {
  color: #34537d;
  padding: 10px 0;
  font-size: 24px;
}
.number-color {
  color: #ffa5a8 !important;
}
.modal-style {
  padding: 0;
  font-size: 16px;
  padding-bottom: 30px;
}
.modal-w-h-style {
  width: 700px;
  height: 673px;
  border-radius: 2px;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -75% !important;
  margin-top: -60% !important;
}
.modal-info {
  color: #535456;
}

.color_2d3752 {
  color: #2d3752;
}

.color_4a4a4a {
  color: #4a4a4a;
}

.color_e74c3c {
  color: #e74c3c;
}

.bb-e4e8eb {
  border-bottom: 1px solid #e4e8eb;
}

.download-modal {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

.link-color {
  color: #1d7fee !important;
}

.participant_content modal-dialog {
  width: 500px;
}
.file-upload-participant {
  border: none;
  border-radius: 30px;
  height: 100%;
  background-color: #34537d !important;
  margin-bottom: 10px;
  display: block;
  width: 100% !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.select_control {
  background-repeat: no-repeat;
  border: none;
}

.label-icon {
  border-radius: 3px;
  font-size: 16px;
  background-color: #e2e8ee;
  padding: 2px 6px;
}

.table .trigger:hover {
  background-color: #e2e8ee;
  border-radius: 3px;
  .edit {
    display: inline;
    top: 8px;
    left: 15px;
  }
}

.table .trigger2:hover {
  background-color: #e2e8ee;
  border-radius: 3px;
  .edit {
    display: inline;
    top: 8px;
    left: 4px;
  }
}

.pb-90 {
  padding-bottom: 90px !important;
}

.edit {
  padding: 0px;
  display: none;
  font-size: 16px;
  cursor: pointer;
}

.first {
  position: absolute;
  width: 200px;
  left: 0;
  line-height: 20px !important;
  padding: 10px !important;
  max-width: 200px !important;
}

.wrapper {
  overflow-x: auto;
}

@media (max-width: 575px) {
  .xs-none {
    display: none;
  }
  .xs-pl-0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}
@media (max-width: 1024px) {
  .modal-w-h-style{
    margin-left: -100% !important;
    margin-top: -85% !important;
  }
}
@media (max-width: 1199px) {
  .has-sidemenu .container {
    padding-left: 30px !important;
    padding-right: 30px !important;
    width: auto;
    max-width: inherit;
  }
}

.modal-header,
.modal-title {
  padding: 0 !important;
}

.select_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #1f8fe1;
  right: 25px;
  top: 10px;
  height: 34px;
  padding: 0px 0px 0px 1px;
  /* border-left: 1px solid #0ebeff; */
  position: absolute;
  pointer-events: none;
}

.show_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #1e8fe1;
  right: 10px;
  top: 8px;
  height: 34px;
  padding: 0px 0px 0px 1px;
  position: absolute;
  pointer-events: none;
}

.show_section.siteId:after, .show_section.country:after, .show_section.langugage:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  right: 25px;
  top: 8px;
  position: absolute;
}


.lh-36 {
  line-height: 36px;
}

.width-80 {
  width: 80px !important;
}

.height-500 {
  min-height: 600px !important;
}

.sortDown {
  position: absolute;
  padding-left: 4px;
  padding-top: 3px;
}

.sortUp {
  position: absolute;
  margin-top: -3px;
  padding-left: 4px;
}

.position-relative {
  position: relative;
}

.dropdown-toggle::after {
  display: none;
}

.line-height {
  line-height: 1.5;
}

.pt-150 {
  padding-top: 150px;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 23px;
  line-height: 10px !important;
  color: #e4e8eb;
}

.pagination {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 11px !important;
}

.pagination2 {
  width: 40px;
  height: 32px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 6px !important;
}

.disabledPagination {
  pointer-events: none;
}

.display-inline-flex {
  display: inline-flex !important;
}

.position-absolute {
  position: absolute;
}

.position-relative {
  position: relative;
}

.bottom-0 {
  bottom: 0px;
}

#download-report-modal.modal.show {
    overflow-x: hidden;
    overflow-y: auto;
}
body.modal-open{
  overflow: hidden;
}

/* Hide the browser's default checkbox */
.Show-Withdrawn-or-Failed-participants input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.Show-Withdrawn-or-Failed-participants .checkmark {
  position: absolute;
  top: 10px;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 1px solid #dedede;
  border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.Show-Withdrawn-or-Failed-participants:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.Show-Withdrawn-or-Failed-participants input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.Show-Withdrawn-or-Failed-participants input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.Show-Withdrawn-or-Failed-participants .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.select-participant{
  /*checkbox data*/
  input[type="checkbox"] + span {
    display: block;
  }

  input[type="checkbox"] {
    display: none;
    height: 16px;
    width: 16px;
  }
  input[type="checkbox"] + span:before {
    content: "\f00c";
    border: 0.1em solid #d3dfe4;
    border-radius: 3px;
    width: 16px;
    height: 16px;
    padding: 3px 3px;
    vertical-align: middle;
    color: transparent;
    background-color: #fff;
    font-size: 10px;
    font: normal normal normal 10px/1 FontAwesome;
  }

  input[type="checkbox"]:checked + span:before {
    background-color: #4c8ce4;
    border: 0.1em solid #4c8ce4;
    color: #fff;
    font-size: 10px;
  }
}
.back-to-compose{
  button{
    font-weight: normal;
    width: auto;
    height: auto;
    padding: 7px 27px;
  }
}

.compose-part-sel-text{
  color: #979797;
  font-size: 14px;
  font-family: RobotoRegular;
  margin-left: 35px;
  font-weight: normal;
}

.participant-breadcrumb {
  height: auto;
  width: auto;
  background-color: transparent;
  .breadcrumb {
    padding: 17px 30px;
    padding-bottom: 9px;
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0;
    list-style: none;
    border-radius: 0.25rem;

    .breadcrumb-item {
        color: #4a4a4a;
        a {
        color: #4c8ce4;
        }
        &.current-label {
            color: #9b9b9b;
            cursor: text;
        }
    }

  }
}
</style>
