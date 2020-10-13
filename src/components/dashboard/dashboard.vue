<template>
  <div class="dashboard">
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="content has-header">
      <div class="row launch_status_section" v-if="studyData.status !== 'Draft' || checkConfigurator === false">
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0">
          <div class="color_ff fs-28">
            <span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
              <img src="static/img/icn-sumitted.svg">
            </span>
            <span class="col-lg-10 col-md-10 col-sm-10 col-xs-10">Study Launch Status:
            <div>Submitted</div></span>
          </div>
        </div>
      </div>
      <div class="row launch_status_section draft-status-web" v-if="studyData.status === 'Draft' && studyData.web === true  && checkConfigurator === true">
        <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6">
          <div class="position_relative">
            <img class="desktop-icon-web" src="../../../public/static/img/participant-web-img/banner-desktop-icon.svg" />
            <img class="globe-icon-web" src="../../../public/static/img/participant-web-img/globe.svg" />
            <img class="nav-icon-web" src="../../../public/static/img/participant-web-img/nav.svg" />
          </div>
        </div>
        <div class="col-lg-7 col-md-6 col-sm-6 col-xs-6 participant-enrollment">
          <div class="fs-20 color_ff">Ready to set up your participant enrollment website?</div>
          <div
            class="fs-12 color_ff opacity-1 mt-0 process-font"
          >Customize your site with a self-guided step-by-step process.</div>
          <div class="mt-20">
            <button
              class="btn update-btn-web"
              v-on:click="changeRouteWeb('global-element')"
            >Build my website</button>
          </div>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-lg-6 col-md-5 col-sm-12 col-xs-12 p-0">
          <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 p-0" v-if="studyData.status==='Active'">
            <div class="status-strip">Status: Active
              <a v-if="canSysAdminAccess || canStudyAdminAccess || canStudyManagerAccess" v-on:click="editStudy()" class="edit-color cursor_pointer pl-10">Edit</a>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-4 col-xs-12 p-0" v-if="studyData.status==='Close'">
            <div class="status-strip-red text-center">Status: Complete </div>
          </div>
          <div class="col-lg-8 col-md-6 col-sm-8 col-xs-12 p-0">
            <div v-if="studyDuration > 0">
              <lineGraph :options="{type: 'single', data: remainingDaysData, color:'#48bf7a'}"></lineGraph>
            </div>
            <div class="remaining_days_section">
              <!--<div id="daysProgressGraph" class="remaining_days_graph"></div>-->
              <div v-if="studyData.status !== 'Close'" class="remaining_days_text">
                <span v-if="daysRemaining >= 0"><span class="fw-500">{{daysRemaining}}</span> days until end of study</span>
                <span v-if="daysRemainingStatus === 'notStarted'">Study has not yet begun</span>
                <span v-if="daysRemainingStatus === 'ended'">Study has ended</span>
              </div>
              <div class="" v-else>Study is closed</div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-7 col-sm-12 col-xs-12 text-right pr-0 pt-10-sm pt-10-xs pl-0-xs pl-0-sm" style="white-space: nowrap; min-width:300px;">
          <button class="btn export_btn br-25" :class="{'transfer-on' : transferEnabled }" v-on:click="openDataTransferModal()"  v-if="canSysAdminAccess || canStudyAdminAccess || canStudyManagerAccess">Data transfer:&nbsp; <span v-if="!transferEnabled">Off</span><span v-if="transferEnabled">On</span></button>
          <button class="btn export_btn br-25 ml-10" :class="{ 'disable-export': ((canSponserAccess() || canQualityAccess()) || !activeParticipants || activeParticipants.length <= 0) }"
            :disabled="(canSponserAccess() || canQualityAccess()) || (!activeParticipants || activeParticipants.length <= 0)" v-on:click="exportParticipantData()">Export data</button>
          <button v-if="canDownloadPrototype()" class="btn download_btn br-25 ml-10" v-on:click="downloadPrototypes()">Download prototype</button>
        </div>
        <!--<div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 text-center pr-0 pt-10-sm pt-10-xs">
          <button class="btn download_btn btn-block br-25" v-on:click="downloadPrototypes()">Download prototype</button>
        </div>-->
      </div>

      <div class="mt-20">
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="row justify-content-between pb-10">
              <span class="card_title">Study Overview</span>
              <a class="text-right float-right cursor_pointer" v-on:click="studyOverviewCollapse = !studyOverviewCollapse">
                <img v-if="!studyOverviewCollapse" src="static/img/icn-expand.svg" alt="">
                <img v-if="studyOverviewCollapse" src="static/img/icn-collapse.svg" alt="">
              </a>
            </div>
            <div v-if="studyOverviewCollapse">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 label_text pr-0">Countries:</div>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 label_value pl-0" v-if="studyData.countries">
                    <span v-for="(country, index) in dbData.studyMetaData.countryList" class="item_bg_color">
                      {{country.countryName}}
                      <span v-if="studyData.countries && studyData.countries.length === index"></span>
                    </span>
                  </div>
                </div>
                 <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 label_text pr-0">Language(s):</div>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 label_value pl-0">
                     <span v-for="(lang, index) in studyData.language" class="item_bg_color">
                      <span>{{lang.display_name}}</span>
                    <span v-if="studyData.language && studyData.language.length != (index + 1)"></span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="row pt-10">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 label_text pr-0">Condition(s):</div>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 pl-0">
                    <span v-for="(condition, index) in dbData.studyMetaData.patientConditions" class="item_bg_color">
                      <span>{{condition}}</span>
                    <span vif="dbData.patientConditions && dbData.patientConditions.length !== index"></span>
                    </span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 label_text pr-0">Study design:</div>
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 label_value pl-0">{{studyData.type}}</div>
                </div>
              </div>
              <div class="line"></div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Participants expected:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{studyData.expectedPatients}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <!--<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Participants expected:</div>-->
                <!--<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{studyData.expectedPatients}}</div>-->
              </div>
            </div>
            <div class="row pt-10">
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Study start date:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{new Date(studyData.studyStartDate) | dateFormat('MMM DD, YYYY')}}</div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Study end date:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{new Date(studyData.studyEndDate) | dateFormat('MMM DD, YYYY')}}</div>
              </div>
            </div>
            <div class="row pt-10">
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">First participant enrolled:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{new Date(studyData.firstPatientEnrollDate) | dateFormat('MMM DD, YYYY')}}</div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">First participant’s last day in study:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">{{new Date(studyData.firstPatientLastDate) | dateFormat('MMM DD, YYYY')}}</div>
              </div>
            </div>
            <div class="row pt-10">
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Last participant enrolled:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">
                  <span v-if="studyData.lastPatientEnrollDate">{{new Date(studyData.lastPatientEnrollDate) | dateFormat('MMM DD, YYYY')}}</span>
                  <span v-if="!studyData.lastPatientEnrollDate">-</span>
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_text">Last participant’s last day in study:</div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 label_value">
                  <span v-if="studyData.lastPatientLastDate">{{new Date(studyData.lastPatientLastDate) | dateFormat('MMM DD, YYYY')}}</span>
                  <span v-if="!studyData.lastPatientLastDate">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="dbData.isPinPointEnabled">
       <div class="mt-20">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col-md-6 col-sm-6 p-0">
                    <div class="card_title">Participant Status
                      <a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-info-circle help_icon cursor_pointer"></i></a>
                      <div class="dropdown-menu custom-popover fs-12">
                        <div class="arrow"></div>
                        <div class="">
                          <div class="overflow">
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="active_color_circle"></span>&nbsp;
                                <span>Active</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants are responding to the study and have initiated in at least one activity or task.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="verified_color_circle"></span>&nbsp;
                                <span>Verified</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have completed registration and verified their account.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="registered_color_circle"></span>&nbsp;
                                <span>Registered</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that completed registration but have not verifed their account.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="invited_color_circle"></span>&nbsp;
                                <span>Invited</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that were invited but have not activate their account using the code.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="not_invited_color_circle"></span>&nbsp;
                                <span>Not invited</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have been imported but have not been sent an invite.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="withdrawn_color_circle"></span>&nbsp;
                                <span>Withdrawn</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have withdrawn from the study.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="disqualified_color_circle"></span>&nbsp;
                                <span>Disqualified</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have been disqualified by an admin.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 col-xs-6 text-center">
                    <canvas id="participantStatusGraph" class="participant_status_graph" width="100%" height="100%"></canvas>
                  </div>
                  <div class="col-sm-6 col-xs-6 pt-30">
                    <div class="row">
                      <div class="col-sm-6 col-xs-6 p-0">
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator "></span>
                          <span class="active_color_circle"></span>&nbsp;
                          <span>Active</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="registered_color_circle"></span>&nbsp;
                          <span>Registered</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="withdrawn_color_circle"></span>&nbsp;
                          <span>Withdrawn</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="imported_color_circle"></span>&nbsp;
                          <span>Imported</span>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xs-6 p-0">
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="verified_color_circle"></span>&nbsp;
                          <span>Verified</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="invited_color_circle"></span>&nbsp;
                          <span>Invited</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="disqualified_color_circle"></span>&nbsp;
                          <span>Disqualified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="dbData.isPinPointEnabled" class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pl-0 pr-7">
             <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col">
                    <div class="card_title">In-App Eligibility</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center margin-responsive">
                    <canvas id="participantAppScreeningGraph" class="participant_web_screening_graph" width="100%" height="100%"></canvas>
                  </div>
                </div> 
                <div class="row">
                      <div class="col ml-35">
                        <div class="fs-12 pt-15">
                          <span class="dot_incdicator "></span>
                          <span class="screened_color_circle"></span>&nbsp;
                          <span>Screened</span>
                        </div>
                        <div class="fs-12 pt-15">
                          <span class="screen_faild_color_circle"></span>&nbsp;
                          <span>Screen failed</span>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
          </div>

            <div v-show="dbData.isPinPointEnabled && studyData.web === true" class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pr-0 pl-7">
             <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col">
                    <div class="card_title">Web Screening</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center margin-responsive">
                    <canvas id="participantWebScreeningGraph" class="participant_web_screening_graph" width="100%" height="100%"></canvas>
                  </div>
                </div> 
                <div class="row">
                      <div class="col ml-35">
                        <div class="fs-12 pt-15">
                          <span class="dot_incdicator "></span>
                          <span class="screened_color_circle"></span>&nbsp;
                          <span>Screened</span>
                        </div>
                        <div class="fs-12 pt-15">
                          <span class="screen_faild_color_circle"></span>&nbsp;
                          <span>Screen failed</span>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
          </div>



          <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pl-0" v-if="(dbData.studyMetaData.onboardingType !== 'ByInvitation')">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="card_title">Screening</div>
                <div class="text-center">
                  <canvas id="screeningGraph" class="screening_graph" width="100%" height="100%"></canvas>
                </div>
                <div class="fs-12 text-center pr-20">
                  <span class="dot_incdicator"></span>
                  <span class="active_color_circle"></span>&nbsp;
                  <span>Screened</span>
                </div>
                <div class="fs-12 text-center pt-10">
                  <span class="dot_incdicator"></span>
                  <span class="blue_color_circle"></span>&nbsp;
                  <span>Screen failed</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height_half">
                <div class="card_title">Device Usage</div>
                <div class="pt-10 row">
                  <div class="col-sm-6 text-center">
                    <span class="color_denim">
                      <i class="fa fa-apple color_denim fs-24" aria-hidden="true"></i>&nbsp;
                      <span v-if="deviceUsage[0] && deviceUsage[0].value">
                        <span>{{deviceUsage[0].value}}</span>
                    </span>
                    <span v-else>0</span>
                    </span>
                  </div>
                  <div class="col-sm-6 text-center">
                    <span class="color_green">
                      <i class="fa fa-android color_green fs-24" aria-hidden="true"></i>&nbsp;
                      <span v-if="deviceUsage[1] && deviceUsage[1].value">
                        <span>{{deviceUsage[1].value}}</span>
                    </span>
                    <span v-else>0</span>
                    </span>
                  </div>
                </div>
                <div v-if="deviceUsage && deviceUsage.length > 0">
                  <div class="device_usage_line_graph text-center">
                    <lineGraph :options="{type: 'double', data: deviceUsage}"></lineGraph>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-body panel_height_half">
                <div class="card_title">Avg. Session Duration
                  <span>
                    <i class="fa fa-info-circle help_icon cursor_pointer" aria-hidden="true" data-toggle="popover" data-placement="left" tabindex="0" data-trigger="focus"
                    data-content="Average time spent in the app each time a participant opens the app. " data-html="true"></i></span>
                </div>
                <div class="pt-20 row">
                  <div class="col-sm-6 p-0">
                    <span class="color_green">
                      <i class="fa fa-android color_green fs-24" aria-hidden="true"></i>&nbsp;
                      <span class="" v-if="avgSessionDuration && avgSessionDuration[0] && avgSessionDuration[0].value > 0">
                        <span>{{secondsToHms(avgSessionDuration[0].value)}}</span>
                    </span>
                    <span class="" v-else>0 m</span>
                    </span>
                  </div>
                  <div class="col-sm-6 pt-5 text-center p-0">
                    <span class="color_denim">
                      <i class="fa fa-apple color_denim fs-18" aria-hidden="true"></i>&nbsp;
                      <span class="relative_text_val" v-if="avgSessionDuration && avgSessionDuration[1] && avgSessionDuration[1].value > 0">
                        <span>{{secondsToHms(avgSessionDuration[1].value)}}</span>
                    </span>
                    <span class="relative_text_val" v-else>0 m</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>

       <div class="mt-10">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0 ">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="card_title">eConsent</div>
                <div class="row color_666669">
                  <div class="col-sm-4 p-0">
                    <div class="fs-24 fw-bold pt-20">
                      <span class="" v-if="dbData.eConsent && dbData.eConsent.averageTimeToConsent">{{dbData.eConsent.averageTimeToConsent}}</span>
                      <span class="" v-else>N/A</span>
                    </div>
                    <div>Avg. time to consent</div>
                    <div class="fs-24 fw-bold pt-20">
                      <span v-if="dbData.eConsent && dbData.eConsent.consentCompletionPercentage">{{dbData.eConsent.consentCompletionPercentage}}%</span>
                      <span v-else>N/A</span>
                    </div>
                    <div>Consent completion</div>
                  </div>
                  <div class="col-sm-4 pt-30 pl-0 pr-0 text-center">
                    <canvas id="eConsentGraph" class="e_consent_graph" width="100%" height="100%"></canvas>
                  </div>
                  <div class="col-sm-4 p-0">
                    <div class="color_666669">Comprehension quiz passed on: </div>
                    <div class="fs-12 pt-20">
                      <span class="dot_incdicator"></span>
                      <span class="active_color_circle"></span>&nbsp;
                      <span>First try
                        <span v-if="econsentTries.firstTry && econsentTries.firstTry.value">({{Math.round((econsentTries.firstTry.value / econsentTries.allTries) * 100)}}%)</span>
                      <span v-else>(0%)</span>
                      </span>
                    </div>
                    <div class="fs-12 pt-20">
                      <span class="dot_incdicator"></span>
                      <span class="withdrawn_color_circle"></span>&nbsp;
                      <span>Two or three tries
                        <span v-if="econsentTries.secondTry && econsentTries.secondTry.value">({{Math.round((econsentTries.secondTry.value / econsentTries.allTries) * 100)}}%)</span>
                      <span v-else>(0%)</span>
                      </span>
                    </div>
                    <div class="fs-12 pt-20">
                      <span class="dot_incdicator"></span>
                      <span class="disqualified_color_circle"></span>&nbsp;
                      <span>More than three tries
                        <span v-if="econsentTries.thirdTry && econsentTries.thirdTry.value">({{Math.round((econsentTries.thirdTry.value / econsentTries.allTries) * 100)}}%)</span>
                      <span v-else>(0%)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col-md-6">
                    <div class="card_title">Participants Enrolled</div>
                  </div>
                  <div class="col-md-6 text-right">
                    <div class="color_666669 fs-12">Goal: {{participantData.expectedParticipants}} participants</div>
                    <div class="color_666669 fs-12">Actual: {{participantData.actualEnrolled}} participants</div>
                  </div>
                </div>
                <div>
                  <canvas id="participantsGraph" class="participants_graph"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>
      </div>

      <div v-show="!dbData.isPinPointEnabled">
       <div class="mt-20">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pl-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col-md-6 col-sm-6 p-0">
                    <div class="card_title">Participant Status
                      <a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-info-circle help_icon cursor_pointer"></i></a>
                      <div class="dropdown-menu custom-popover fs-12">
                        <div class="arrow"></div>
                        <div class="">
                          <div class="overflow">
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="active_color_circle"></span>&nbsp;
                                <span>Active</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants are responding to the study and have initiated in at least one activity or task.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="verified_color_circle"></span>&nbsp;
                                <span>Verified</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have completed registration and verified their account.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="registered_color_circle"></span>&nbsp;
                                <span>Registered</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that completed registration but have not verifed their account.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="invited_color_circle"></span>&nbsp;
                                <span>Invited</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that were invited but have not activate their account using the code.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="not_invited_color_circle"></span>&nbsp;
                                <span>Not invited</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have been imported but have not been sent an invite.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="withdrawn_color_circle"></span>&nbsp;
                                <span>Withdrawn</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have withdrawn from the study.
                              </div>
                            </div>
                            <div class="row p-5">
                              <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 p-0">
                                <span class="disqualified_color_circle"></span>&nbsp;
                                <span>Disqualified</span>
                              </div>
                              <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                                Participants that have been disqualified by an admin.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6 col-xs-6 text-center">
                    <canvas id="participantStatusGraph1" class="participant_status_graph" width="100%" height="100%"></canvas>
                  </div>
                  <div class="col-sm-6 col-xs-6 pt-30">
                    <div class="row">
                      <div class="col-sm-6 col-xs-6 p-0">
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator "></span>
                          <span class="active_color_circle"></span>&nbsp;
                          <span>Active</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="registered_color_circle"></span>&nbsp;
                          <span>Registered</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="withdrawn_color_circle"></span>&nbsp;
                          <span>Withdrawn</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="imported_color_circle"></span>&nbsp;
                          <span>Imported</span>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xs-6 p-0">
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="verified_color_circle"></span>&nbsp;
                          <span>Verified</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="invited_color_circle"></span>&nbsp;
                          <span>Invited</span>
                        </div>
                        <div class="fs-12 pt-20">
                          <span class="dot_incdicator"></span>
                          <span class="disqualified_color_circle"></span>&nbsp;
                          <span>Disqualified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



         
        
            <div v-if="!dbData.isPinPointEnabled" class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pl-0 pr-7">
             <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col">
                    <div class="card_title">In-App Eligibility</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center margin-responsive">
                    <canvas id="participantAppScreeningGraph1" class="participant_web_screening_graph" width="100%" height="100%"></canvas>
                  </div>
                </div> 
                <div class="row">
                      <div class="col ml-35">
                        <div class="fs-12 pt-15">
                          <span class="dot_incdicator "></span>
                          <span class="screened_color_circle"></span>&nbsp;
                          <span>Screened</span>
                        </div>
                        <div class="fs-12 pt-15">
                          <span class="screen_faild_color_circle"></span>&nbsp;
                          <span>Screen failed</span>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
          </div>

            <div v-show="!dbData.isPinPointEnabled && studyData.web === true" class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pr-0 pl-7">
             <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col">
                    <div class="card_title">Web Screening</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col text-center margin-responsive">
                    <canvas id="participantWebScreeningGraph1" class="participant_web_screening_graph" width="100%" height="100%"></canvas>
                  </div>
                </div> 
                <div class="row">
                      <div class="col ml-35">
                        <div class="fs-12 pt-15">
                          <span class="dot_incdicator "></span>
                          <span class="screened_color_circle"></span>&nbsp;
                          <span>Screened</span>
                        </div>
                        <div class="fs-12 pt-15">
                          <span class="screen_faild_color_circle"></span>&nbsp;
                          <span>Screen failed</span>
                        </div>
                      </div>
                    </div>
              </div>
            </div>
          </div>
 </div>



          <div class="row">
           <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col-md-6">
                    <div class="card_title">Participants Enrolled</div>
                  </div>
                  <div class="col-md-6 text-right">
                    <div class="color_666669 fs-12">Goal: {{participantData.expectedParticipants}} participants</div>
                    <div class="color_666669 fs-12">Actual: {{participantData.actualEnrolled}} participants</div>
                  </div>
                </div>
                <div>
                  <canvas id="participantsGraph1" class="participants_graph"></canvas>
                </div>
              </div>
            </div>
          </div>
          </div>
       
       </div>
       <div class="mt-10">
        <div class="row">
           <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height_half">
                <div class="card_title">Device Usage</div>
                <div class="pt-10 row">
                  <div class="col-sm-6 text-center">
                    <span class="color_denim">
                      <i class="fa fa-apple color_denim fs-24" aria-hidden="true"></i>&nbsp;
                      <span v-if="deviceUsage[0] && deviceUsage[0].value">
                        <span>{{deviceUsage[0].value}}</span>
                    </span>
                    <span v-else>0</span>
                    </span>
                  </div>
                  <div class="col-sm-6 text-center">
                    <span class="color_green">
                      <i class="fa fa-android color_green fs-24" aria-hidden="true"></i>&nbsp;
                      <span v-if="deviceUsage[1] && deviceUsage[1].value">
                        <span>{{deviceUsage[1].value}}</span>
                    </span>
                    <span v-else>0</span>
                    </span>
                  </div>
                </div>
                <div v-if="deviceUsage && deviceUsage.length > 0">
                  <div class="device_usage_line_graph text-center">
                    <lineGraph :options="{type: 'double', data: deviceUsage}"></lineGraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>
      </div>
    

      <div class="mt-20 compliance_section">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pl-0">
            <div class="panel panel-default">
              <div class="panel-body panel_height">
                <div class="row">
                  <div class="col-md-10 p-0">
                    <div class="card_title">Compliance
                      <a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-info-circle help_icon cursor_pointer"></i></a>
                      <div class="dropdown-menu custom-popover2 fs-12">
                        <div class="arrow2"></div>
                        <div class="">
                          <div class="overflow">
                            <div class="row p-5">
                              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                View average compliance statistics or download a comprehensive compliance report to see a list of each participant’s compliance
                                throughout all tasks.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 p-0 text-right">
                    <select name="" class="form-control br-2" v-model="selectedSite.id" v-if="selectedSite" v-on:change="changeComplianceSite(selectedSite)">
                      <option :value="site.siteDetails.id" v-for="site in complianceData">{{site.siteDetails.name}}</option>
                    </select>
                  </div>
                </div>
                
                <div class="row pt-20" v-if="currentCompliance && currentCompliance.adherence">
                  <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 pl-0" v-if="currentCompliance.adherence">
                    <div class="adherence">
                      <div>All participant adherence</div>
                      <div class="row pt-20">
                        <div class="col-ld-3 col-md-3 col-sm-3 col-xs-6 pl-0" v-for="(item, index) in currentCompliance.adherence">
                          <div v-if="item.key != 'truclinic' ">
                          <div class="percentage">{{item.value}}%</div>
                          <div class="desc">for {{item.title}}</div>
                          <div class="pt-10">
                            <lineGraph :options="{type: 'single', data: item.value, color: ['#f4ab37', '#28b463', '#f4ab37', '#f16559', '#a569bd'][index]}"></lineGraph>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 p-0" v-if="currentCompliance.completedTasks">
                    <div class="tasks">
                      <div>Most & least completed tasks</div>
                      <div class="row pt-60">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 p-0 display-grid" v-for="(item, index) in currentCompliance.completedTasks">
                          <div class="fs-12 completed_title" :class="{'text-right':(index === 1)}" v-bind:title="item.title">{{item.title | capitalize}}</div>
                          <div class="row p-0">
                            <div class="col-sm-3 p-0 f-12" v-if="index === 0">{{item.value}}%</div>
                            <div class="col-sm-9 pr-0 pl-0 pb-0 pt-2">
                              <div :class="{'reverse':(index === 0)}">
                                <lineGraph :options="{type: 'single', data: item.value, color: ['#f16559', '#28b463'][index]}"></lineGraph>
                              </div>
                            </div>
                            <div class="col-sm-3 p-0 text-right fs-12" v-if="index === 1">{{item.value}}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pt-20 pb-10">
                    <b-btn variant="primary" class="p-10 primaryBgColor" size="sm" @click="downloadComplianceReport()">
                      <img src="static/img/icn-download.svg">
                      Download compliance report
                    </b-btn>
                  </div>
                </div>
                <div class="pt-60 text-center" v-else>No compliance data</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="activeModal" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header bb-none p-0">
            <span class="popup-status pt-10">Status:Active</span>
            <button type="button" class="close close-style" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body overflow">
            <div class="" v-if="beforeAlert">
              <div class="row pt-10">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
                  <p class="text-justify pop-color">Please confirm that you have received necessary organizational approval and IRB/EC approval to close this
                    study.
                  </p>
                </div>
              </div>
              <div class="row pt-10">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0">
                  <p class="color-azure text-justify">
                    <span class="">
                      <input type="checkbox" v-model="checkedAgreement">
                    </span> I have attained the proper approval from my IRB or EC board. </p>
                </div>
              </div>
              <div class="row pt-10">
                <div class="col-3">
                </div>
                <div class="col-6">
                  <button class="btn download_btn btn-block br-25" v-on:click="closeStudyAlert()" :disabled="!checkedAgreement">Close study</button>
                </div>
              </div>
            </div>
            <div class="" v-if="afterAlert">
              <div class="row p-10">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <p class="text-center pop-color">Are you sure you want to close this study? This will prevent any new participants from enrolling and end
                    all future participant data collection activities. This action will close your study.</p>
                  <p class="text-center pop-color">Your study data will still be available.</p>
                </div>
              </div>
              <div class="row p-10">
                <div class="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12">
                  <button class="btn close-btn btn-block br-25" v-on:click="closeStudy(studyData,'Close')">Close study</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
          <div class="modal fade" id="dataTransferModal" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content pt-15 pr-15 pl-40 pb-40">
            <div>
              <i class="fa fa-times cancel-image" aria-hidden="true" v-on:click="closeTransferModal()"></i>  
            </div>
            <div class="pt-15 pr-25">
              <div class="sftp-header1">
                Use SFTP to automate your raw data transfer
              </div>
              <div class="sftp-header2">
                Schedule your data tansfer to deliver at your preferred frequency
              </div>
              <div class="data-input-div pl-60 pr-60">
                <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="pt-10 survey_title">Host name</label>
                <div class="form-group">
                  <input type="text" class="form-control input-md input-color" v-model="sftp.host">
                </div>
                </div>
                   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <span class="fs-12">
                  *If no port is specified, port 22 will be used by default. To specify a port, use the following format: www.example.com:####
                  </span>
                   </div>
                    <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="pt-10 survey_title">Remote Location</label>
                <div class="form-group">
                  <input type="text" class="form-control input-md input-color" v-model="sftp.transferPath">
                </div>
                </div>
                <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="pt-10 survey_title">Username</label>
                <div class="form-group">
                  <input type="text" class="form-control input-md input-color" v-model="sftp.username">
                </div>
                </div>
                <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="pt-10 survey_title">Password</label>
                <div class="form-group">
                  <input type="password" class="form-control input-md input-color" v-model="sftp.password">
                </div>
                </div>
                <div  class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label class="pt-10 survey_title">Frequency</label>
                <div class="form-group">
                  <select class="form-control input-md input-color" v-model="frequencyCron">
                    <option value="0 0 9 * * *">Daily</option>
                    <option value="0 0 9 * * TUE">Weekly</option>
                    <option value="0 0 9 1 * *">Monthly</option>

                  </select>
                </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <span v-if="frequencyCron === '0 0 9 * * *'">
                  Data transfers will occur at 9:00 AM PST every day.
                  </span>
                  <span v-if="frequencyCron === '0 0 9 * * TUE'">
                  Data transfers will occur at 9:00 AM PST every Tuesday.
                  </span>
                  <span v-if="frequencyCron === '0 0 9 1 * *'">
                  Data transfers will occur at 9:00 AM PST on the 1st of the month.
                  </span>
                </div>
                <div class="clearfix"></div>
                <div>
                  <div class="continue-transfer">
                  <button class="btn download_btn br-25" v-on:click="continueTransfer()">Continue</button>
                  </div>
                </div>
              </div>
              </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="dataTransferConfirmModal" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content pt-15 pr-15 pl-50 pb-40">
              <div>
              <i class="fa fa-times cancel-image" aria-hidden="true" v-on:click="closeTransferConfirmModal()"></i>  
            </div>
            <div class="pt-25 pr-35">
              <div class="ml-20 mr-20 text-font">
                You are about to enable automatic transfer of raw study data.
              </div>
              <div class="pt-40 text-font">
                It is your reponsibility to ensure that the transfer location is correct
              </div>
              <div class="ml-60 mr-60 text-font">
                and that you are authorized to do this.
              </div>
                <div class="clearfix"></div>
                <div>
                  <div class="continue-button mt-40">
                  <button class="btn cancel_btn br-25" v-on:click="closeTransferConfirmModal()">Cancel</button>
                  <button class="btn download_btn br-25 ml-10" v-on:click="confirmTransfer()">Confirm</button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="dataTransferDetailsModal" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content pt-15 pr-15 pl-40 pb-40">
            <div>
              <i class="fa fa-times cancel-image" aria-hidden="true" v-on:click="closeTransferDetailsModal()"></i>  
            </div>
            <div class="pt-15 pr-25">
              <div class="sftp-header1">
                Use SFTP to automate your raw data transfer
              </div>
              <div class="sftp-header2">
                Schedule your data tansfer to deliver at your preferred frequency
              </div>
              <div class="data-input-div pl-30 pr-30 pt-30">
                <div class="details-div col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <ul>
                  <li class="connection-label"><span class="pull-right">Status:&nbsp;</span></li>
                  <li class="connection-content"><span :class="{'disconnect' : (connection.status === 'Failed' && ((connection.displayMessage.indexOf('Permission Error') !== -1) || (connection.displayMessage.indexOf('Failed') !== -1)))}">{{connection.displayMessage}}&nbsp;&nbsp;</span>
                  <span class="modify" v-if="connection.status === 'Failed' && ((connection.displayMessage.indexOf('Permission Error') !== -1) || (connection.displayMessage.indexOf('Failed') !== -1))" v-on:click="retry()">Retry</span></li>
                </ul>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 details-div">
                  <ul>
                  <li class="connection-label"><span class="pull-right">Frequency:&nbsp;</span></li>
                  <li class="connection-content"><span>{{connection.frequency}}&nbsp;</span>
                  <span v-if="connection.timezone === 'America/Los_Angeles'">PST</span></li>
                  </ul>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 details-div">
                  <ul>
                  <li class="connection-label"><span class="pull-right">Last transfer:&nbsp;</span></li>
                  <li class="connection-content" v-if="connection.lastTransfer"><span>{{connection.lastTransferTime | convertToPST}}&nbsp;</span>
                  <span v-if="connection.timezone === 'America/Los_Angeles'">PST</span></li>
                  <li class="connection-content" v-if="!connection.lastTransfer"><span>Scheduled - {<span>{{connection.scheduledAt | convertToPST}}</span>}&nbsp;</span>
                  <span v-if="connection.timezone === 'America/Los_Angeles'">PST</span></li>
                </ul>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 details-div" v-if="connection.status !== 'InProgress' || connection.status !== 'Started'" >
                  <ul>
                  <li class="connection-label">&nbsp;</li>
                  <li class="connection-content"><span class="modify" v-on:click="transferNow()">Transfer now</span></li>
                  </ul>
              </div>
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-30 details-div">
                 <ul>
                  <li class="disconnect connection-label" v-on:click="disconnectTransfer()"><span class="pull-right">Disconnect</span></li>
                  <li><span class="modify pl-40" v-on:click="modifyTransferLocation()">Modify transfer location</span></li>
                </ul>
                </div>
              </div>
              </div>
              </div>
            </div>
          </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import toastr from 'toastr';
import _ from 'lodash';
import { AclRule } from 'vue-acl';
import Chart from 'chart.js';
import { CRA, SPONSOR, PI, SYSTEM_ADMIN, STUDY_ADMIN, QUALITY, STUDY_MANAGER, participantStatusesText, SITEDATALOCK } from '@/constants/authRoles';
import mainHeader from '../common/main-header';
import sideMenu from '../common/side-menu';
import lineGraph from '../common/line-graph';
import swal from 'sweetalert2';

export default {
  name: 'Login',
  data() {
    return {
      allStatus:[],
      webCount: 0,
      appCount: 0,
      manualCount: 0,
      checkConfigurator: false,
      studyOverviewCollapse: true,
      studyId: null,
      activeParticipants: null,
      afterAlert: false,
      checkedAgreement: null,
      beforeAlert: true,
      totalParticipants: null,
      studyData: {},
      remainingDays: null,
      remainingDaysData: null,
      econsentTries: {
        firstTry: null,
        secondTry: null,
        thirdTry: null,
        allTries: null,
      },
      dbData: {
        studyMetaData: {
          name: null,
          status: null,
          statusDate: null,
          country: null,
          patientConditions: [],
          countries: [],
          type: null,
          participantsExpected: null,
          firstPatientEnrollDate: null,
          firstPatientLastDate: null,
          lastPatientEnrollDate: null,
          lastPatientLastDate: null,
          daysRemaining: null,
        },
        participantStatus: {
          total: null,
          active: null,
          verified: null,
          invited: null,
          notInvited: null,
          withDrawn: null,
          disqualified: null,
          engagement: null,
        },
      },
      deviceUsage: [],
      avgSessionDuration: [],
      participantData: {},
      participantGraphData: {},
      compliance: {},
      complianceData: null,
      currentCompliance: null,
      selectedSite: null,
      studyDuration: null,
      daysRemaining: null,
      daysRemainingStatus: null,
      colors: ['#48bf7a', '#a569bd', '#5dade2', '#2d3752', '#e67e22', '', '#e74c3c', '#f0c231'],
      transferEnabled : false,
      sftp : {},
      frequencyCron : '0 0 9 * * *',
      sftpId : '',
      sftpObject : {},
      connection : {}
    };
  },
  components: {
    sideMenu,
    mainHeader,
    lineGraph,
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
     canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check('userAccess');
    },    
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
    canStudyManagerAccess() {
      this.$acl.change(`${STUDY_MANAGER}`);
      return this.$acl.check('userAccess');
    },    
  },
  mounted() {
    window.setTimeout(() => {
      window.$('[data-toggle="popover"]').popover();
    }, 1);
    this.studyId = this.$route.params.studyId;
    this.getStudyDashboardData();
    this.getStudyDetails();
    this.getcheckConfigurator();
    //this.getStatusCounts();
  },
  methods: {
    setDataforAppChart() {
       
       let appCount = 0;
       let screenedCount = 0;
       let appScreening1 = [];
       let appScreening2 = [];
       
       this.allStatus.forEach((obj) => {
          if(obj.source === null || obj.source === "APP") {
             appCount = appCount + obj.status_count
             if(obj.status === "SCREENPASSED" || obj.status === "INVITED") {
               screenedCount = screenedCount + obj.status_count;
             }
             if(obj.status === "SCREENFAILED") {
               appScreening1.push(obj)
             }
          }
      });

       if(screenedCount > 0) {
        let obj = {
          source: "",
          status: "SCREENPASSED",
          status_count: screenedCount
        }
        appScreening1.push(obj);
      }

      appScreening1.forEach((o, index) => {
            if (o) {
              if(o.status === "SCREENPASSED") {
                appScreening2.push({
                value: o.status_count,
                label: participantStatusesText[o.status],
                color: '#48bf7a',
              }); 
              }
               if(o.status === "SCREENFAILED") {
                appScreening2.push({
                value: o.status_count,
                label: participantStatusesText[o.status],
                color: '#34537d',
              }); 
              }
              // eslint-disable-line
            }
          });
          if(this.dbData.isPinPointEnabled) {         
          this.renderDonutGraph(
            'participantAppScreeningGraph',
            appScreening2,
            'In-App Eligibility',
          );
          }
          else {
          this.renderDonutGraph(
            'participantAppScreeningGraph1',
            appScreening2,
            'In-App Eligibility',
          );
          }
    },
    setDataforWebChart() {
      let webCount = 0;
      let screenedCount = 0;
      let manualCount = 0;
     
      let webScreening1 = [];
       let webScreening2 = [];
       
      this.allStatus.forEach((obj) => {
          if(obj.source === "WEB") {
             webCount = webCount + obj.status_count
             if(obj.status === "SCREENPASSED" || obj.status === "INVITED") {
               screenedCount = screenedCount + obj.status_count;
             }
             if(obj.status === "SCREENFAILED") {
               webScreening1.push(obj)
             }
          }else if(obj.source === "MANUAL") {
            manualCount = manualCount + obj.status_count
          }
      });
      if(screenedCount > 0) {
        let obj = {
          source: "WEB",
          status: "SCREENPASSED",
          status_count: screenedCount
        }
        webScreening1.push(obj);
      }
      webScreening1.forEach((o, index) => {
            if (o) {
              if(o.status === "SCREENPASSED") {
                webScreening2.push({
                value: o.status_count,
                label: participantStatusesText[o.status],
                color: '#48bf7a',
              }); 
              }
               if(o.status === "SCREENFAILED") {
                webScreening2.push({
                value: o.status_count,
                label: participantStatusesText[o.status],
                color: '#34537d',
              }); 
              }
              // eslint-disable-line
            }
          });

           if(this.dbData.isPinPointEnabled) {            
          this.renderDonutGraph(
            'participantWebScreeningGraph',
            webScreening2,
            'Web Screening',
          );
          }
          else {
          this.renderDonutGraph(
            'participantWebScreeningGraph1',
            webScreening2,
            'Web Screening',
          ); 
          }
    },

    getStatusCounts() {
      this.$api
          .getStatusCount(this.$route.params.studyId)
          .then(response => {
            if (response.data.data) {
              this.allStatus = response.data.data;
              this.setDataforWebChart();
              this.setDataforAppChart();
            }
          })
          .catch(err => {
            (this.closeCarousel = true), console.log("err", err.statusCode);
            throw err;
          });
    },

    getcheckConfigurator() {
         if (this.$route.params.studyId) {
        this.$api
          .getParticipantWebcheckConfigurator(this.$route.params.studyId)
          .then(response => {
            if (response.data.data) {
              this.checkConfigurator = response.data.data.checkConfigurator; 
            }
          })
          .catch(err => {
            (this.closeCarousel = true), console.log("err", err.statusCode);
            throw err;
          });
      }
    },

    changeRoute(path) {
      if (this.user.userRole !== 'Pi' && this.user.userRole !== 'StudyManager' && this.user.userRole !== 'SiteDataLock') {
        this.$router.push({ name: path, params: { studyId: this.studyId } });
      } else {
        toastr.warning('Access restricted');
      }
    },

    changeRouteWeb(path) {
    this.$router.push({
        name: 'global',
        params: {
          studyId: this.studyId,
          isCarousel: true,
        }
      })
  
    },
    editStudy() {
      if (this.user.userRole !== 'Pi') {
        window.$('#activeModal').modal('show');
      } else {
        toastr.warning('Access restricted');
      }
    },
    secondsToHms(time) {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      let retval = null;
      retval = min > 0 ? min + 'm ' : ''; // eslint-disable-line
      retval += sec > 0 ? sec + 's' : ''; // eslint-disable-line
      return retval;
    },
    renderDonutGraph(id, data) {
      const ctx = window.document.getElementById(id);
      // eslint-disable-next-line
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: _.map(data, 'label'),
          datasets: [
            {
              data: _.map(data, 'value'),
              backgroundColor: _.map(data, 'color'),
              borderWidth: 0,
            },
          ],
        },
        options: {
          borderWidth: 1,
          cutoutPercentage: 90,
          legend: { display: false },
        },
      });
    },
    renderEconsentDonutGraph(id, data) {
      const ctx = window.document.getElementById(id);
      // eslint-disable-next-line
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: _.map(data, 'label'),
          datasets: [
            {
              data: _.map(data, 'value'),
              backgroundColor: _.map(data, 'color'),
              borderWidth: 0,
            },
          ],
        },
        options: {
          borderWidth: 1,
          cutoutPercentage: 90,
          legend: { display: false },
          tooltips: {
            displayColors: false,
            position: 'average',
            callbacks: {
              title: () => '',
              label: (tooltipItem, d) => d.datasets[tooltipItem.datasetIndex]
                .data[tooltipItem.index],
            },
          },
        },
      });
    },
    renderAreaLineGraph(id, data1, data2, range) {
      const ctx = window.document.getElementById(id);
      // eslint-disable-next-line
      const myChart = new Chart(ctx, {
        // eslint-disable-line
        type: 'line',
        data: {
          labels: Object.keys(range),
          datasets: [
            {
              backgroundColor: '#4c8ce4',
              borderColor: '#4c8ce4',
              data: _.values(data2),
              pointRadius: 0.5,
            },
            {
              backgroundColor: '#DAE8F8',
              borderColor: '#DAE8F8',
              data: _.values(data1),
              pointRadius: 0.5,
            },
          ],
        },
        options: {
          layout: {
            padding: {
              left: 10,
              right: 20,
              top: 20,
              bottom: 5,
            },
          },
          legend: { display: false },
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                  min: 0,
                  max: this.participantData.expectedParticipants || undefined,
                }, // eslint-disable-line
                gridLines: { display: false },
              },
            ],
            xAxes: [
              {
                ticks: { display: false },
                gridLines: { display: false },
              },
            ],
          },
          plugins: { filler: { propagate: true } },
        },
      });
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
      this.studyData = response.body;
      if(this.canSysAdminAccess || this.canStudyAdminAccess) {
      this.getTransferStatus();
      }
      });
    },
    exportParticipantData() {
      this.$api.exportParticipantDashboardFact(this.studyId).then(response => {
        toastr.success(response.data.message);
      });
    },
    closeStudyAlert() {
      this.beforeAlert = false;
      this.afterAlert = true;
    },
    closeStudy(studyData, studyStatus) {
      window.$('#activeModal').modal('hide');
      this.beforeAlert = true;
      this.afterAlert = false;
      this.$api.deleteStudyFact(studyData.studyId, studyStatus).then(
        response => {
          toastr.success(response.data.message);
          this.getStudyDetails();
        },
        error => {
          toastr.error(error.message);
        },
      );
    },
    getExactDayEpoch(day) {
      day = new Date(day); // eslint-disable-line
      return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0).getTime();
    },
    getRemainingDays() {
      const sd = this.getExactDayEpoch(this.dbData.studyMetaData.studyStartDate);
      const ed = this.getExactDayEpoch(this.dbData.studyMetaData.studyEndDate);
      const today = this.getExactDayEpoch(new Date());
      this.studyDuration = Math.ceil(Math.abs(ed - sd) / (1000 * 3600 * 24)); // eslint-disable-line
      if (sd > today) {
        this.daysRemaining = -1;
        this.daysRemainingStatus = 'notStarted';
        this.remainingDaysData = 0;
      } else if (today >= sd && today <= ed) {
        this.daysRemaining = Math.ceil(Math.abs(ed - today) / (1000 * 3600 * 24)); // eslint-disable-line
        this.remainingDaysData = 100 - this.daysRemaining / this.studyDuration * 100; // eslint-disable-line
        this.daysRemainingStatus = 'inProgress';
      } else if (today > sd && today > ed) {
        this.daysRemaining = -1;
        this.daysRemainingStatus = 'ended';
        this.remainingDaysData = 100;
      }
    },
    getTheDatesRange(sd, ed) {
      const datesDiff = Math.round((ed - sd) / (24 * 60 * 60 * 1000));
      const dates = [];
      let tempDate = null;
      let y = null;
      let m = null;
      let d = null;
      for (let i = 0; i <= datesDiff; i++) {
        const mult = i * 24 * 60 * 60 * 1000;
        tempDate = new Date(sd + mult);
        y = tempDate.getFullYear();
        m = tempDate.getMonth() + 1;
        m = m.toString().length < 2 ? `0${m}` : m;
        d = tempDate.getDate();
        d = d.toString().length < 2 ? `0${d}` : d;
        dates[`${y}-${m}-${d}`] = null;
      }
      return dates;
    },
    changeComplianceSite(siteObj) {
      if (siteObj && siteObj.id) {
        this.currentCompliance = _.filter(
          this.complianceData,
          o => o.siteDetails.id === siteObj.id,
        );
      } else if (!this.currentCompliance || this.currentCompliance.length === 0) {
        this.currentCompliance = _.filter(
          this.complianceData,
          o => o.siteDetails.id === 'allSites',
        );
      }
      if (this.currentCompliance && this.currentCompliance.length > 0) {
        this.currentCompliance = this.currentCompliance[0]; // eslint-disable-line
        this.currentCompliance.adherence = _.orderBy(this.currentCompliance.adherence, ['index']);
        this.currentCompliance.completedTasks = _.orderBy(this.currentCompliance.completedTasks, [
          'index',
        ]);
      }
      if (
        this.currentCompliance.adherence
        && this.currentCompliance.adherence.length > 0
        && (!this.currentCompliance.completedTasks
          || this.currentCompliance.completedTasks.length === 0)
      ) {
        // eslint-disable-line
        this.currentCompliance.completedTasks = [
          { title: 'No Data', value: 0 },
          { title: 'No Data', value: 0 },
        ];
      }
    },
    getStudyDashboardData() {
      this.$api.getStudyDashboardDataFact(this.studyId).then(response => {
        this.dbData = response.body;
        if (this.dbData.participantStatus) {
          this.activeParticipants = _.filter(
            this.dbData.participantStatus,
            o => o.key !== 'imported' && o.key !== 'invited' && o.value > 0,
          );
          this.totalParticipants = _.sumBy(this.dbData.participantStatus, o => Number(o.value));
          const participantStatusGraphData = [];
          _.forEach(this.dbData.participantStatus, o => {
            if (o) {
              participantStatusGraphData.push({
                value: o.value,
                label: o.title,
                color: this.colors[o.index],
              }); // eslint-disable-line
            }
          });
          if(this.dbData.isPinPointEnabled) {
          this.renderDonutGraph(
            'participantStatusGraph',
            participantStatusGraphData,
            'Participant Status',
          );
          }
          else {
          this.renderDonutGraph(
            'participantStatusGraph1',
            participantStatusGraphData,
            'Participant Status',
          );
          }
        }
        if (this.dbData.screening) {
          const screeningData = [];
          screeningData.push({
            value: this.dbData.screening[0].value,
            label: this.dbData.screening[0].title,
            color: '#48bf7a',
          });
          screeningData.push({
            value: this.dbData.screening[1].value,
            label: this.dbData.screening[1].title,
            color: '#34537d',
          });
          this.renderDonutGraph('screeningGraph', screeningData, 'Screening');
        } else {
          this.renderDonutGraph('screeningGraph', [], 'Screening');
        }
        if (this.dbData.avgSessionDuration) {
          this.avgSessionDuration[0] = _.find(this.dbData.avgSessionDuration, ['key', 'android']);
          this.avgSessionDuration[1] = _.find(this.dbData.avgSessionDuration, ['key', 'ios']);
        }
        if (this.dbData.deviceUsage) {
          this.deviceUsage[0] = _.find(this.dbData.deviceUsage, ['key', 'ios']);
          this.deviceUsage[1] = _.find(this.dbData.deviceUsage, ['key', 'android']);
          this.deviceUsage[0].color = '#34537d';
          this.deviceUsage[1].color = '#48bf7a';
        }
        if (this.dbData.eConsent) {
          if (this.dbData.eConsent.averageTimeToConsent) {
            const attc = this.dbData.eConsent.averageTimeToConsent;
            this.dbData.eConsent.averageTimeToConsent = `
              ${Math.floor(attc / 60)}m ${Math.floor(attc % 60)}s
              `;
          }
          if (this.dbData.eConsent.eConsentStatus) {
            const eConsentStatusData = [];
            this.econsentTries.firstTry = _.find(this.dbData.eConsent.eConsentStatus, [
              'key',
              'firstTry',
            ]);
            if (this.econsentTries.firstTry) {
              this.econsentTries.allTries += this.econsentTries.firstTry.value;
              eConsentStatusData.push({
                value: this.econsentTries.firstTry.value,
                label: this.econsentTries.firstTry.title,
                color: '#48bf7a',
              });
            }
            this.econsentTries.secondTry = _.find(this.dbData.eConsent.eConsentStatus, [
              'key',
              'twoOrThreeTries',
            ]);
            if (this.econsentTries.secondTry) {
              this.econsentTries.allTries += this.econsentTries.secondTry.value;
              eConsentStatusData.push({
                value: this.econsentTries.secondTry.value,
                label: this.econsentTries.secondTry.title,
                color: '#f6a623',
              });
            }
            this.econsentTries.thirdTry = _.find(this.dbData.eConsent.eConsentStatus, [
              'key',
              'threePlusTries',
            ]);
            if (this.econsentTries.thirdTry) {
              this.econsentTries.allTries += this.econsentTries.thirdTry.value;
              eConsentStatusData.push({
                value: this.econsentTries.thirdTry.value,
                label: this.econsentTries.thirdTry.title,
                color: '#f16559',
              });
            }
            this.renderEconsentDonutGraph('eConsentGraph', eConsentStatusData, 'eConsent');
          }
        }
        if (this.dbData.participantEnrolled) {
          this.participantData = this.dbData.participantEnrolled;
          if (this.dbData.participantEnrolled.participantsEnrolledGraphData) {
            this.participantGraphData = this.dbData.participantEnrolled.participantsEnrolledGraphData; // eslint-disable-line
          }
          const datesRange = this.getTheDatesRange(
            this.dbData.studyMetaData.studyStartDate,
            this.dbData.studyMetaData.studyEndDate,
          ); // eslint-disable-line
          const enrolledByData = _.extend.apply(null, this.participantGraphData.enrolledByDate); // eslint-disable-line
          const completedStudyByData = _.extend.apply(
            null,
            this.participantGraphData.completedStudyByDate,
          ); // eslint-disable-line
          let data1 = null;
          let data2 = null;
          let initVal = 0;
          data1 = Object.assign({}, datesRange, data1, enrolledByData);
          data2 = Object.assign({}, datesRange, data2, completedStudyByData);
          const tempDate2 = new Date();
          const y2 = tempDate2.getFullYear();
          let m2 = tempDate2.getMonth() + 1;
          m2 = m2.toString().length < 2 ? `0${m2}` : m2;
          let d2 = tempDate2.getDate();
          d2 = d2.toString().length < 2 ? `0${d2}` : d2;
          const today = `${y2}-${m2}-${d2}`;
          if (Object.keys(enrolledByData).length) {
            _.forOwn(data1, (value, key) => {
              // eslint-disable-line
              initVal = today >= key ? (!value ? initVal : value) : null; // eslint-disable-line
              data1[key] = initVal;
            });
          }
          if (Object.keys(completedStudyByData).length) {
            initVal = 0;
            _.forOwn(data2, (value, key) => {
              // eslint-disable-line
              initVal = today >= key ? (!value ? initVal : value) : null; // eslint-disable-line
              data2[key] = initVal;
            });
          }
          if(this.dbData.isPinPointEnabled) {
          this.renderAreaLineGraph('participantsGraph', data1, data2, datesRange);
          }
          else {
           this.renderAreaLineGraph('participantsGraph1', data1, data2, datesRange);
          } 
        }
        if (this.dbData.compliance) {
          this.complianceData = this.dbData.compliance;
          this.selectedSite = { id: 'allSites', name: 'All Sites' };
          if (this.user.userRole === 'Pi' || this.user.userRole === 'SubPi' || this.user.userRole === 'SiteDataLock' || (this.user.userRole === 'StudyCoordinator' || this.user.userRole === 'HomeHealth')) {
            this.selectedSite = this.dbData.compliance[0].siteDetails;
            this.changeComplianceSite(this.selectedSite);
          }
        }
        this.changeComplianceSite();
        this.getRemainingDays();
        this.getStatusCounts();
      })
      .catch(err => {
            this.getStatusCounts();
            throw err;
          });
    },
    downloadPrototypes() {
      this.$api.downloadPrototypesFact(this.studyId).then(response => {
        if (response.body.android) {
          window.open(response.body.android, '_blank');
        }
        if (response.body.ios) {
          window.open(response.body.ios, '_blank');
        }
        if (!response.body.android && !response.body.ios) {
          toastr.error('Prototype is not yet available. Please try again later.');
        } else if (response.body.android === null) {
          toastr.error('Android prototype is not yet available. Please try again later.');
        } else if (response.body.ios === null) {
          toastr.error('iOS prototype is not yet available. Please try again later.');
        }
      });
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canSponserAccess() {
      this.$acl.change(`${SPONSOR}`);
      return this.$acl.check('userAccess');
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check('userAccess');
    },
    downloadComplianceReport() {
      this.$api.exportComplianceData(this.studyId).then(response => {
        toastr.success(response.bodyText);
      });
    },
    getTransferStatus() {
      this.$api.getSftpTransferStatus(this.studyId).then(response => {
          if(response.body.length !== 0) {
            this.transferEnabled = response.body[0].enabled;
            this.sftpId = response.body[0].sftpId;
          }
          else {
            this.transferEnabled = false;
            this.sftpId = '';
          }
      },
      () => {
          toastr.error("Error while getting SFTP transfer status");
        },
      );
    },
    openDataTransferModal() {
     if(this.transferEnabled) {
        this.getConnectionDetails();
        window.$('#dataTransferDetailsModal').modal('show');
     }
     else {
        this.sftp = {};
        this.frequencyCron = '0 0 9 * * *';
        window.$('#dataTransferModal').modal('show');
     }
   },
   getConnectionDetails() {
   this.$api.getConnectionDetails(this.studyId,this.sftpId).then(response => {
      this.connection = response.body;
      if(this.connection.frequencyCron === '0 0 9 * * *' ) {
        this.connection.frequency = 'Daily, 9.00 AM';
      }
      else if(this.connection.frequencyCron === '0 0 9 * * TUE' ) {
        this.connection.frequency = 'Weekly, Tuesdays, 9.00 AM';
      }
      else if(this.connection.frequencyCron === '0 0 9 1 * *' ) {
        this.connection.frequency = 'Monthly,1st of every month, 9.00 AM';
      }
      if(this.connection.lastTransfer) {
      this.connection.lastTransferTime = new Date(this.connection.lastTransfer);
      }
      else if(this.connection.scheduledTransfer) {
      this.connection.scheduledAt = new Date(this.connection.scheduledTransfer);
      }
      },
      () => {
          toastr.error("Error while getting SFTP connection details");
        },
      );
   },
    continueTransfer() {
      if((!this.sftp.host || !this.sftp.username) || (!this.sftp.password || !this.sftp.transferPath)) {
        toastr.error('Please fill all the fields.');
      }
      else {
      if((this.sftp.host).indexOf(':') !== -1) {
        let hostArray = this.sftp.host.split(':');
        this.sftp.host = hostArray[0];
        this.sftp.port = hostArray[1];
      }
      else {
      this.sftp.port = 22;
      }
      this.sftpObject.timezone = 'America/Los_Angeles';
      this.sftpObject.frequencyCron = this.frequencyCron;
      this.sftpObject.sftpCred = this.sftp;
      if(this.transferEnabled) {
         swal({
        title: 'Are you sure you want to modify the scheduled data transfer?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
      this.$api.updateSftpTransferDetails(this.studyId,this.sftpId,this.sftpObject).then(() => {
        this.getTransferStatus();
        window.$('#dataTransferModal').modal('hide');
      },
      () => {
          toastr.error("Unable to connect. Please check your settings.");
        },
      );
        }
        else {
          window.$('#dataTransferModal').modal('hide');
        }
      })
      }
      else {
      this.$api.testSftpStatus(this.studyId,this.sftpObject).then(() => {
      window.$('#dataTransferModal').modal('hide');
      window.$('#dataTransferConfirmModal').modal('show')
      },
         () => {
          toastr.error('Unable to connect. Please check your settings.');
        },
      );
      }
      }
    },
    confirmTransfer() {
      if(this.sftpId) {
           this.$api.updateSftpTransferDetails(this.studyId,this.sftpId,this.sftpObject).then(() => {
        this.getTransferStatus();
        window.$('#dataTransferConfirmModal').modal('hide');
      },
      () => {
          toastr.error("Unable to connect. Please check your settings.");
        },
      );
      }
      else {
        this.$api.saveSftpTransferDetails(this.studyId,this.sftpObject).then(() => {
        this.getTransferStatus();
        window.$('#dataTransferConfirmModal').modal('hide');
      },
      () => {
          toastr.error("Unable to connect. Please check your settings.");
        },
      );
      }
    },
    disconnectTransfer() {
        swal({
        title: 'Are you sure you want to disconnect the scheduled data transfer?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$api.disconnectTransfer(this.studyId,this.sftpId).then(() => {
        this.getTransferStatus();
        window.$('#dataTransferDetailsModal').modal('hide');
      },
      () => {
          toastr.error("Error while disconnecting scheduled data transfer");
        },
        );
        }
        else {
          window.$('#dataTransferDetailsModal').modal('hide');
        }
      });
    },
    modifyTransferLocation() {
      this.$api.modifyTransfer(this.studyId,this.sftpId).then(response => {
        this.sftp.username = "";
        this.sftp.password = "";
        this.sftp.hostname = "";
        this.sftp.transferPath = response.body.transferPath;
        this.frequencyCron = response.body.frequencyCron;
        window.$('#dataTransferDetailsModal')
          .modal('hide')
          .on('hidden.bs.modal', function (e) {
            window.$('#dataTransferModal').modal('show');
        })
      },
      () => {
          toastr.error("Error while getting SFTP details");
        },
      );
    },
    transferNow() {
      this.$api.transferNow(this.studyId,this.sftpId).then(() => {
        window.$('#dataTransferDetailsModal').modal('hide');
      },
      () => {
          toastr.error("Error in data transfer");
        },
      );
    },
    closeTransferModal() {
      this.sftp = {};
      this.frequencyCron = '0 0 9 * * *';
      window.$('#dataTransferModal').modal('hide');
    },
    closeTransferConfirmModal() {
      this.sftp = {};
      this.frequencyCron = '0 0 9 * * *';
      window.$('#dataTransferConfirmModal').modal('hide');
    },
    closeTransferDetailsModal() {
      window.$('#dataTransferDetailsModal').modal('hide');
    },
    retry() {
      this.$api.retryConnection(this.studyId,this.sftpId).then(() => {
        this.getConnectionDetails();
        toastr.success('Connection established successfully.');
      },
      () => {
          toastr.error('Unable to connect. Please check your settings.');
        },
      );
    },
    canDownloadPrototype(){
      return ( this.canSysAdminAccess || this.canStudyAdminAccess || this.canStudyManagerAccess) ? true : false;
    }
   }
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body,
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
  flex: none;
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
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
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
    flex: none;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
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
  .col-md-12 {
    width: 100%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-6 {
    width: 50%;
  }
  .col-md-4 {
    width: 33.33333333%;
  }
  .col-md-8 {
    width: 66.66666667%;
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
    flex: none;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.row {
  clear: both;
}
.launch_status_section {
  background-color: #2d3752;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  /*background-image: linear-gradient(97deg, #698eff, #15befd 49%, #8efbce);*/
  padding: 21px;
  margin-bottom: 20px;
  font-size: 18px;
}
// .launch-status-section-web {
//   width: 1000px;
//   height: 150px;
//   border-radius: 3px;
//   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
//   background-color: #668bbd;
// }
.draft-status {
  background-color: #48bf7a;
}
.draft-status-web {
  background-color: #668bbd;
}
.mobile-icon {
  position: absolute;
  top: -17px;
  left: 112px;
}
.consent-icon {
  position: absolute;
  top: 33px;
  left: 220px;
  width: 110px;
  height: 88px;
}
.like-icon {
  position: absolute;
  top: 85px;
  left: 69px;
}
.desktop-icon-web {
  position: absolute;
  top: 0px;
  left: 112px;
  width: 131px;
  height: 78px;
  object-fit: contain;
}
.nav-icon-web {
  position: absolute;
  top: 50px;
  left: 254px;
  width: 69px;
  height: 59px;
  object-fit: contain;
}
.globe-icon-web {
  position: absolute;
  top: 71px;
  left: 55px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.opacity-1 {
  opacity: 0.75 !important;
}
.provide-btn {
  background-color: #fff;
  color: #48bf7a;
}
.update-btn {
  background-color: #48bf7a;
  color: #fff;
  border-radius: 3px;
  border: solid 1px #ffffff;
}
.process-font{
  font-size:14px !important;
}
.update-btn-web {
    width: 180px;
    height: 36px;
    background-color: #668BBD;
    color: #fff;
    border-radius: 3px;
    padding: 5px 25px;
    border: solid 2px #ffffff;
}

.fa-apple,
.fa-android,
.fa-cloud {
  color: #f16559;
  font-size: 24px;
  position: relative;
  top: 4px;
}

.status-strip {
  width: 80%;
  background: #fff;
  padding: 10px 0 10px 10px;
  color: #2d3752;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}
.completed_title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  max-width: 90%;
  cursor: pointer;
}
.status-strip-red {
  width: 80%;
  background: #f16559;
  padding: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 5px;
}

.edit-color {
  color: #4c8ce4 !important;
  font-weight: normal;
}

.edit-color-white {
  color: #fff !important;
  font-weight: normal;
}

.contact_btn {
  border-radius: 100px;
  background-color: #34537d;
  color: #ffffff;
}
.export_btn {
  border-radius: 25px;
  background-color: #34537d !important;
  color: #ffffff;
  cursor: pointer;
}
.disable-export {
  background-color: #b8c7ce !important;
}

.download_btn {
  background-color: #4c8ce4;
  color: #ffffff;
  cursor: pointer;
}

.pop-color {
  color: #666669 !important;
}

.close-btn {
  background: #d3dfe4;
  color: #666669;
}

.padding_top_10px {
  padding-top: 10px;
}

.padding_top_20px {
  padding-top: 20px;
}

.donut_graph_panel {
  height: 184px;
}

.dashboard {
  display: flex;
  background-color: #f5f8fa;
}
.graph_val {
  position: relative;
  top: 2px;
}
.remaining_days_text {
  font-size: 12px;
  color: #666769;
}
.reverse {
  transform: rotate(180deg);
}
.content {
  width: 100%;
  padding: 20px;
}
.remaining_days_graph {
  width: 200px;
  height: 80px;
}
.item_bg_color {
  border-radius: 3px;
  background-color: #eaf0f4;
  color: #707c81;
  padding: 4px 10px;
  font-size: 12px;
  margin: 0 4px 4px 0;
  display: inline-block;
}
.arrow {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 74px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}
.panel {
  border-radius: 2px;
  margin-bottom: 10px;
}

.panel_height {
  height: 100%;
  min-height: 260px;
  position: relative;
}
.panel_height_half {
  height: 100%;
  min-height: 130px;
  position: relative;
}
.panel-body {
  padding: 16px;
}

.card_heading {
  font-size: 12px;
  padding-bottom: 8px;
}

.card_count {
  font-size: 16px;
}

.card_change {
  font-size: 12px;
}

.card_title {
  font-weight: bold;
  padding: 0 0 8px 0;

  .dropdown-toggle::after {
    display: none;
  }
}

.bar_graph_styles {
  background-color: #48bf7a;
  height: 150px;
  width: 60px;
  position: absolute;
  bottom: 0px;
  left: 45%;
}

.days_progress {
  display: block;
  background-color: #48bf7a;
  height: 5px;
  border-radius: 5px;
}
.participant_status_graph {
  margin: 25px auto;
  width: 100% !important;
  height: 100% !important;
  min-height: 150px !important;
  max-width: 150px !important;
  max-height: 150px !important;
}

.participant_web_screening_graph {
    width: 100% !important;
    height: 100% !important;
    min-height: 115px !important;
    max-width: 115px !important;
    max-height: 115px !important;
    margin: 5px !important;
}

.participant_web_screening_graph,
.screening_graph,
.e_consent_graph {
  background: radial-gradient(
    circle at center,
    transparent 0,
    transparent 63%,
    rgba(0, 0, 0, 0.2) 55%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.2) 65%,
    transparent 65%,
    transparent 100%
  );
}

.screening_graph {
  margin: 10px auto;
  width: 100% !important;
  height: 100% !important;
  min-height: 150px !important;
  max-width: 150px !important;
  max-height: 150px !important;
}
.e_consent_graph {
  margin: auto;
  width: 100% !important;
  height: 100% !important;
  min-height: 120px !important;
  max-width: 120px !important;
  max-height: 120px !important;
}
.participants_graph {
  margin: auto;
  width: 100%;
  height: 100%;
  min-height: 195px;
  max-width: 100% !important;
  max-height: 195px !important;
}
.participant_status_graph,
.screening_graph,
.e_consent_graph {
  background: radial-gradient(
    circle at center,
    transparent 0,
    transparent 63%,
    rgba(0, 0, 0, 0.2) 55%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.2) 65%,
    transparent 65%,
    transparent 100%
  );
}
.margin-responsive {
  margin-left: 30px;
  margin-right: 30px;
}
.device_usage_line_graph {
  padding: 15px 10px 0px 10px;
}
.days_progress_graph {
  width: 200px;
  height: 70px;
}
.relative_text_val {
  position: relative;
  top: 2px;
}
.circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50px;
  position: relative;
  top: 0px;
}
.dot_incdicator {
  position: relative;
}
.blue_color_circle {
  background-color: #34537d;
  @extend .circle;
}

.active_color_circle {
  background-color: #48bf7a;
  @extend .circle;
}

.screened_color_circle {
  background-color: #48bf7a;
  @extend .circle;
}

.screen_faild_color_circle {
  background-color: #34537d;
  @extend .circle;
}

.not_invited_color_circle {
  background-color: #f7e07e;
  @extend .circle;
}

.verified_color_circle {
  background-color: #a569bd;
  @extend .circle;
}

.registered_color_circle {
  background-color: #f0c231;
  @extend .circle;
}

.withdrawn_color_circle {
  background-color: #e67e22;
  @extend .circle;
}

.invited_color_circle {
  background-color: #5dade2;
  @extend .circle;
}

.disqualified_color_circle {
  background-color: #e74c3c;
  @extend .circle;
}

.imported_color_circle {
  background-color: #2d3752;
  @extend .circle;
}
.close-style {
  padding-right: 30px !important;
  padding-top: 25px !important;
}
.text-justify {
  text-align: justify !important;
}
.overflow {
  // overflow: auto;
}

.color-azure {
  color: #1f95f2 !important;
}

.line {
  margin-top: 20px;
  margin-bottom: 20px;
  height: 1px;
  background-color: #d3dfe4;
}

.label_text {
  color: #959fa4;
  font-size: 12px;
  padding-left: 0;
}
.label_value {
  color: #666669;
  font-size: 12px;
}
.popup-status {
  color: #2d3752;
  font-weight: bold;
  position: fixed;
  top: 10px;
  left: 20px;
}

.donut_section {
  margin: auto;
  width: 100%;
  max-width: 200px;
}

.bg_app_blue {
  background-color: #00baf9;
  color: #fefefe;
}

.help_bg {
  background-color: #d3dfe4;
  padding: 0 6px;
  border-radius: 99px;
  display: inline-block;
}
.arrow2 {
  position: absolute;
  border-color: transparent;
  border-style: solid;
  top: 17px;
  left: -17px;
  border-top: 14px solid transparent;
  border-right: 14px solid #fff;
  border-bottom: 14px solid transparent;
  width: 0;
  height: 0;
  -webkit-filter: drop-shadow(0 0 0.7px #000000);
}

.custom-popover2 {
  position: absolute;
  width: 490px;
  border-radius: 3px;
  padding: 10px;
  left: 27px !important;
  top: -42px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.custom-popover {
  position: absolute;
  width: 669px;
  border-radius: 3px;
  padding: 10px;
  left: 28px !important;
  top: -99px !important;
  color: #666669;
  font-weight: normal;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d3dfe4;
}
.compliance_section {
  .adherence {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
    .percentage {
      color: #666669;
      font-size: 28px;
      font-weight: bold;
    }
    .desc {
      color: #666669;
      font-size: 12px;
    }
  }
  .tasks {
    border: 1px solid #d3dfe4;
    padding: 10px;
    min-height: 150px;
  }
}
.help_icon {
  color: #b8c7ce;
  border: none !important;
  outline: none !important;
}
.primaryBgColor {
    background-color: #4c8ce4;
  }
@media (max-width: 575px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .graph_padding {
    padding-top: 0px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .graph_padding {
    padding-top: 0px;
  }
  .graph_legend_padding {
    padding-top: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .graph_padding {
    padding-top: 50px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}

@media (min-width: 1200px) {
  .graph_padding {
    padding-top: 80px;
  }
  .graph_legend_padding {
    padding-top: 40px;
  }
}

.data-input-div {
  margin: 0 auto;
}

.input-color {
  background-color: #f7f7f7;
  border: 1px solid #cccccc;
  border-radius: 3px;
}

.cancel-image {
  float: right;
  cursor: pointer;
}
;
.sftp-header1 {
  font-size: 16px;
  font-family: 'RobotoMedium';
  color: '#4a4a4a';
}

.sftp-header2 {
  font-size: 14px;
  font-family: 'RobotoRegular';
  color: '#666669';
}

.modal-dialog {
  max-width: 600px !important;
}

.continue-button {
  width: 60%;
  margin: 0 auto !important;
}

.continue-button button {
  width: 48%;
  margin-top: 30px;
  cursor: pointer;
}

.continue-transfer {
  width: 40%;
  margin: 0 auto !important;
}

.continue-transfer button {
  width: 100%;
  margin-top: 50px;
  cursor: pointer;
}
.disconnect {
  color: #f16559!important;
  font-family: 'RobotoRegular'!important;
  cursor: pointer;
}

.modify {
  color: #4c8ce4;
  cursor: pointer;
}

.connection-label {
  font-family: 'RobotoBold';
  float: left;
  width: 33%;
}

.connection-content {
  width: 66%;
  float: left;
}

.transfer-on {
  background-color: #48bf7a!important;
}

.cancel_btn {
  background-color: #959fa4;
  color: #ffffff;
}

.text-font {
  font-size: 16px;
  font-family: 'RobotoMedium';
}

.details-div ul {
  list-style-type: none;
  padding: 0;
}

@media (max-width: 1024px) {
  .margin-responsive {
    margin-left: 0px;
    margin-right: 0px;
  }
}

@media (min-width:1024px) and (max-width:1200px){
.participant-enrollment{
  margin-left: 60px;
}
}
</style>
