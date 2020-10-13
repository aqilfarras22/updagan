<template>
  <div id="milestone-carousel-list">
    <!-- Progress Bar appears when there are no milestones in the study -->
    <div
      v-if="milestonesList==null"
      class="all-milestone-progress-bar">
      <div class="participant-current-day">
        <div class="text-left float-left pl-10">
          <span v-if="triggerDay.currentDayTextVisiblity">
            <span v-if="isParticipantInActive">Participant was {{participantStatusInLowerCase}} on</span>
            <span v-if="isParticipantActive">Participant is on</span>
            <span v-if="isParticipantActive">
              <b> Day {{participantData.participantCurrentDay}}</b>
            </span>
            <span v-if="isParticipantInActive">
              <b> Day {{participantData.participantInActiveDay}}</b>
            </span>
            <span class="color-grey pl-10" v-if="triggerDay.triggeredDate">{{triggerDay.confirmationText}}</span>
            <span class="color-grey" v-if="triggerDay.triggeredDate">{{new Date(triggerDay.triggeredDate) | formatUTCDate}}</span>
          </span>
          <div v-if="triggerDay.triggeredBtnVisiblity" class="pb-25">
            <button class="btn- btn-primary trigger-btn" @click="triggerParticipantDay()">Start Study</button>
            <span>Click this button to start study activities for this participant.</span>
          </div>
          <div v-if="triggerDay.confirmationText && triggerDay.triggeredDate==null">
            <span>{{triggerDay.confirmationText}}</span>
          </div>
        </div>
        <div class="text-right float-right pr-20">
          <span class="pr-35">
            <b>{{participantData.participantCompliancePercentage ? participantData.participantCompliancePercentage : 0}}%</b> Compliance
            <span class="color_blue cursor_pointer"  id="complianceInfo">
              <i class="fa fa-info-circle color-grey" aria-hidden="true"></i>
            </span>
            <b-popover placement="bottom"  target="complianceInfo" triggers="click blur">
              <template v-slot:content>
                <div class="popover-content">
                 <div class="ml-15" style="color:#000">Compliance is calculated by the number of activities completed by the participant to date divided by the total number of activities available to complete by the participant to date.</div>
                </div>
              </template>
            </b-popover>
          </span>
          <span><b>{{participantData.participantStudyCompletionPercentage ? participantData.participantStudyCompletionPercentage : 0}}%</b> Completion</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="d-inline-block block-height">
        <div class="starting-point" :class="{'started': allProgressPercent>0, inActiveParticiapnt: allProgressPercent <= 4}">
          <div class="start" :class="{'inActive': !triggerDay.currentMilestoneVisiblity}"></div>
          <span class="year" :class="{'inActive': !triggerDay.currentMilestoneVisiblity, inActiveParticiapnt: allProgressPercent <= 4 && isParticipantInActive}">
            <span v-if="(isParticipantActive || isParticipantInActive) && triggerDay.dateVisiblity">
              <strong>{{ participantData.participant.registrationDate ? new Date(participantData.participant.registrationDate) : new Date(participantData.studyStartDate) | dateFormat('MMM DD') }},
              {{ participantData.participant.registrationDate ? new Date(participantData.participant.registrationDate) : new Date(participantData.studyStartDate) | dateFormat('YYYY') }}
              </strong>
            </span>
            </br><span class="max-day"><strong>Day 0</strong></span>
          </span>
        </div>
      </div>
      <div class="milestone-progress">
        <div class="progress" style="height:3px">
          <div class="progress-bar" :style="{width: `${allProgressPercent}%`}">
            <span v-if="isParticipantInActive" class="inActiveParticipant" :style="{left: `${allProgressPercent}%`}"></span>
            <div v-if="isParticipantInActive" class="inActiveText" :class="{inActiveParticiapnt: allProgressPercent <= 4}" :style="{left: `${allProgressPercent - 2}%`}">
              <strong>{{ new Date(participantData.inActiveDate) | dateFormat('MMM DD')}}, {{ new Date(participantData.inActiveDate) | dateFormat('YYYY') }}</strong>
              </br><span class="max-day"><strong>Day {{participantData.participantInActiveDay}}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-inline-block block-height">
        <div class="ending-point" :class="{'ended': allProgressPercent==100}">
          <div class="end"></div>
          <span class="year ml-13 color-shade mt-8">
            <span v-if="(isParticipantActive || isParticipantInActive) && triggerDay.dateVisiblity">
              <strong>
              {{ new Date(participantData.studyEndDate) | dateFormat('MMM DD')}},
              {{ new Date(participantData.studyEndDate) | dateFormat('YYYY') }}
            </strong>
            </span>
            </br><span class="max-day color-shade"><strong>Day {{participantData.maxDay}}</strong></span>
          </span>
        </div>
      </div>
    </div>
    <!-- Progress Bar ends here -->
    <!-- Milestone Carousel Starts Here -->
    <div
      v-else-if="milestonesList && totalMilestone>0"
      class="milestone-carousel"
      :class="{'no-milestone-carousel': actualMilestones.length <= 0}">
      <div class="participant-current-day pb-35">
        <div class="text-left float-left pl-10">
           <span v-if="triggerDay.currentDayTextVisiblity">
            <span v-if="isParticipantInActive">Participant was {{participantStatusInLowerCase}} on</span>
            <span v-if="isParticipantActive">Participant is on</span>
            <span v-if="isParticipantActive">
              <b> Day {{participantData.participantCurrentDay}}</b>
            </span>
            <span v-if="isParticipantInActive">
              <b> Day {{participantData.participantInActiveDay}}</b>
            </span>
            <span class="color-grey pl-10" v-if="triggerDay.triggeredDate">{{triggerDay.confirmationText}}</span>
            <span class="color-grey" v-if="triggerDay.triggeredDate">{{new Date(triggerDay.triggeredDate) | formatUTCDate}}</span>
          </span>
          <div v-if="triggerDay.triggeredBtnVisiblity" class="pb-25">
            <button class="btn- btn-primary trigger-btn" @click="triggerParticipantDay()">Start Study</button>
            <span>Click this button to start study activities for this participant.</span>
          </div>
          <div v-if="triggerDay.confirmationText && triggerDay.triggeredDate==null">
            <span>{{triggerDay.confirmationText}}</span>
          </div>
        </div>
        <div class="text-right float-right pr-20">
          <span class="pr-35">
            <b>{{participantData.participantCompliancePercentage ? participantData.participantCompliancePercentage : 0}}%</b> Compliance
            <span class="color_blue cursor_pointer"  id="complianceInfo">
              <i class="fa fa-info-circle color-grey" aria-hidden="true"></i>
            </span>
            <b-popover placement="bottom"  target="complianceInfo" triggers="click blur">
              <template v-slot:content>
                <div class="popover-content">
                 <div class="ml-15" style="color:#000">Compliance is calculated by the number of activities completed by the participant to date divided by the total number of activities available to complete by the participant to date.</div>
                </div>
              </template>
            </b-popover>
          </span>
          <span><b>{{participantData.participantStudyCompletionPercentage ? participantData.participantStudyCompletionPercentage : 0}}%</b> Completion</span>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="slick-slider slick-initialized">
        <button v-if="totalMilestone>9" @click="moveCarousel(-1)" :disabled="atHeadOfList" type="button" class="slick-arrow slick-prev" :class="{'slick-disabled': atHeadOfList}" style="display: block;" >Previous</button>
        <div class="slick-list">
            <div class="slick-track" :style="{ width: trackWidth + 'px', opacity: 1, transform: 'translateX('+currentOffset+'px)' }">
              <div v-for="(milestone, mileIndex) in milestonesList" :key="mileIndex" class="slick-slide" :class="{'active-slide' : mileIndex==activeMilestoneIndex,'current-day-milestone': milestone.milestoneSelected,'milestone-completed' : mileIndex<=currentMilestoneIndex}">
              <div :class="{
                'activeMilestone' : mileIndex==activeMilestoneIndex,
                'stepsCompleted' : triggerDay.currentMilestoneVisiblity && mileIndex<=currentMilestoneIndex,
                /* 'currentMilestone': milestone.milestoneSelected, */
                'milestone': actualMilestones.length>0,
                'no-milestone': actualMilestones.length<=0,
                }" @click= "showMilestoneDetail(milestone, mileIndex); activeMilestoneIndex=mileIndex" :style="{width: singleMileStoneWidth + 'px'}">
                <div class="name">{{milestone.milestoneName}}</div>
                <div class="day" v-if="milestone.milestoneDay!=undefined">Day {{milestone.milestoneDay}}</div>
                <div class="percent" :class="{'green':milestone.completionPercentage>=95, 'red':milestone.completionPercentage<95}" v-if="milestone.completionPercentage!=undefined">{{milestone.completionPercentage}}%</div>
              </div>
            </div>
          </div>
        </div>
        <button v-if="totalMilestone>9" @click="moveCarousel(1)" :disabled="atEndOfList" type="button" class="slick-arrow slick-next" :class="{'slick-disabled': atEndOfList}" style="display: block;">Next</button>
      </div>
    </div>
    <!-- Milestone Carousel Ends Here -->
    <ParticipantTriggerDayZeroModal
      :triggeredParticipant="participantData.participant"
      @resetParticipantDayZeroStatus="resetParticipantDayZeroStatus"
      :showModal="modalStatus"
      :studyId="participantData.studyId"
      :piId="participantData.piId"
      :modalText="modalText"
    ></ParticipantTriggerDayZeroModal>
  </div>
</template>

<script>
import ParticipantTriggerDayZeroModal from "@/components/participants/participant-trigger-day-zero-modal";
import {participantStatusesText} from "@/constants/authRoles";

export default {
  name: "study-participant-milestone-carousel-progress",
  components: {ParticipantTriggerDayZeroModal},
  props: {
    participantData: {
      type: Object,
      required: true,
      default: () => null
    },
    milestonesList:{},
    selectedMilestone:{
      default: () => null
    },
    participantDetails: {
      type: Object
    },
    istelehealthCallInitiated: {
      type: Boolean
    },
    triggerDay: {
      type: Object,
      default: () => {}
    },
    outsideClickStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actualMilestones : [],
      activeMilestoneIndex: null,
      currentMilestoneIndex: null,
      slidesToScroll: 4,
      currentOffset: 0,
      windowSize: 9,
      trackWidth: null,
      singleMileStoneWidth: null,
      paginationFactor: null,

      oneSlideWidth: null,
      totalMilestone: null,
      milestonesLeft: null,
      afterWindowWidth: null,
      oddItems: null,
      modalStatus: false,
      modalText: {
        heading: "Are you sure you want to start the study for this participant ?",
        description: "Clicking Yes will make study activities available to the participant as soon as they confirm this request.",
        cancelBtnCss: {backgroundColor: "#ECEDF0", color: "#000"}
      },
      participantStatusesText
    };
  },
  computed: {
    atEndOfList() {
      if(this.totalMilestone<=this.windowSize){
        return true;
      }else{
        return this.trackWidth - (this.singleMileStoneWidth * this.windowSize) == (this.currentOffset*-1);
      }
    },
    atHeadOfList() {
      return this.currentOffset === 0;
    },
    allProgressPercent() {
      if(this.participantData.fakeParticipantCurrentDay == null) {
        if((this.participantData.participantCurrentDay/this.participantData.maxDay)*100 <=4 && this.isParticipantInActive) {
          return 4;
        }
        return (this.participantData.participantCurrentDay/this.participantData.maxDay)*100;
      }
      if((this.participantData.fakeParticipantCurrentDay/this.participantData.maxDay)*100 <= 4 && this.isParticipantInActive) {
        return 4;
      }
      return (this.participantData.fakeParticipantCurrentDay/this.participantData.maxDay)*100;
    },
    calculatePopoverPosition() {
      let defaultPosition = 10;
      let progressBarWidth = this.allProgressPercent;
      return progressBarWidth - defaultPosition;
    },
    participantStatusInLowerCase() {
      return this.participantStatusesText[this.participantData.participantStatus].toLowerCase();
    },
    isParticipantInActive() {
      return this.participantData.participantStatus == 'DISQUALIFIED' ||
        this.participantData.participantStatus == 'WITHDRAWSTUDY';
    },
    isParticipantActive() {
      return this.participantData.participantStatus == 'VERIFIED' ||
      this.participantData.participantStatus == 'REGISTERED' ||
      this.participantData.participantStatus == 'ACTIVE';
    }
  },
  watch: {
    outsideClickStatus(v){
      if(v) {
        this.modalStatus = false;
      }
    },
    milestonesList(v){
      v!=null? this.initCarousel():'';
    },
    istelehealthCallInitiated(v) {
      this.milestonesList ? this.initCarousel() : '';
      this.actualMilestones = this.participantData.participantMileStoneList;
    },
    selectedMilestone(v){
      this.activeMilestoneIndex = v;
      if(this.activeMilestoneIndex == v && this.totalMilestone<=this.windowSize){return}
      //This code is going to execute when the milestone value get changed fromt the milestone drop down
      //So we need to make the selected milestone active in the carousel.
      //Slide the carousel if needed
      if(v>=this.windowSize && this.currentOffset == 0) {
        this.initialCurrentOffset(this.activeMilestoneIndex);
      }else if(this.currentOffset != 0 && v>=this.windowSize){
        this.moveCarousel(1);
      }else{
        this.moveCarousel(-1);
      }
    }
  },
  methods: {
    moveCarousel(direction) {
      if (direction === 1 &&  !this.atEndOfList) {

        if((this.milestonesLeft < this.slidesToScroll)){
          //Last Slide
          this.currentOffset -= (this.singleMileStoneWidth*this.milestonesLeft);
        }
        else if(this.afterWindowWidth + this.currentOffset >= this.paginationFactor){
          this.currentOffset -= this.oneSlideWidth;
        }else{
          this.currentOffset -= (this.singleMileStoneWidth*this.oddItems);
        }

      } else if (direction === -1 && !this.atHeadOfList) {
        if(this.milestonesLeft < this.slidesToScroll){
          this.currentOffset = 0;
        }
        else if((this.currentOffset*-1) > this.paginationFactor){
          this.currentOffset += this.paginationFactor;
        }else{
          this.currentOffset = 0;
        }
      }
    },
    initCarousel(){
      this.resetCarouselProperties();

      this.totalMilestone = this.milestonesList.length;
      let pw = this.$parent.$refs.profile.offsetWidth - 20;//Width of the section in which carousel & other informations are displaying.
      this.singleMileStoneWidth = Math.ceil(pw/this.windowSize);
      this.trackWidth = this.singleMileStoneWidth * this.totalMilestone;
      if(this.totalMilestone < this.windowSize && this.trackWidth+(this.singleMileStoneWidth*2)<pw){
        this.singleMileStoneWidth = Math.ceil(pw/this.totalMilestone);
        this.trackWidth = pw + this.totalMilestone;
      }

      this.paginationFactor = this.singleMileStoneWidth * this.slidesToScroll;

      //Calculations Need for Previous and Next handler
      this.oneSlideWidth =  this.singleMileStoneWidth * this.slidesToScroll;
      this.milestonesLeft = this.totalMilestone - this.windowSize;
      this.afterWindowWidth = this.trackWidth - (this.singleMileStoneWidth * this.windowSize);
      //Find out are there any odd items

      this.oddItems = (this.totalMilestone - this.windowSize) % this.slidesToScroll;

      //Get the index of the current day milestones to default the carousel to that milestone
      let currentDayIndex = _.findIndex(this.milestonesList, 'milestoneSelected');
      if(currentDayIndex>=0)
      {
        this.activeMilestoneIndex = currentDayIndex;
        this.currentMilestoneIndex = currentDayIndex;
        this.initialCurrentOffset(this.currentMilestoneIndex);
      }

    },
    showMilestoneDetail(milestone, mileIndex){
      if(this.activeMilestoneIndex == mileIndex){
        return;
      }
      let view = 'all';
      let type = 'all';
      let isUserClickOnStartOrEndDay = false;
      //Since carousel milestone is clicked change the view to milestone
      let actualMilestoneLength = this.actualMilestones.length;
      if(actualMilestoneLength == 0) {
        view = 'all';
      }
      if(actualMilestoneLength>0){
        if(milestone.milestoneName.toLowerCase() == 'start' || milestone.milestoneName.toLowerCase() == 'end'){
            isUserClickOnStartOrEndDay = true;
        }
      }

      let startDay = null;
      let endDay = null;
      let milestoneIndex = actualMilestoneLength==1 ? 0: mileIndex;
      if(actualMilestoneLength == 0 || actualMilestoneLength == undefined) {
        type = milestone.type;
      }
      if(milestone.startDay !=undefined && milestone.endDay !=undefined){
        startDay = milestone.startDay;
        endDay = milestone.endDay;
      } else {
        //This code means user has clicked on the Start or End, we need to display the all milestone details.
        startDay = this.milestonesList[1].startDay;
        endDay = this.milestonesList[1].endDay;
      }
      this.$emit('getMilestoneDetails', startDay, endDay, milestoneIndex, isUserClickOnStartOrEndDay, milestone);
    },
    resetCarouselProperties(){
      this.activeMilestoneIndex = null;
      this.currentMilestoneIndex = null;
      this.currentOffset = 0;
      this.trackWidth = null;
      this.singleMileStoneWidth = null;
      this.paginationFactor = null;
      this.oneSlideWidth = null;
      this.totalMilestone = null;
      this.milestonesLeft = null;
      this.afterWindowWidth = null;
      this.oddItems = null;
    },
    initialCurrentOffset(dayIndex){
      if(dayIndex>=this.windowSize){
        let currentDay = dayIndex + 1 ;
        let findSlideNo = Math.ceil((currentDay-this.windowSize)/this.slidesToScroll);
        let leftTransform = findSlideNo * this.oneSlideWidth;
        if(leftTransform < this.afterWindowWidth){
          this.currentOffset = leftTransform*-1;
        }
        else{
          this.currentOffset = this.afterWindowWidth*-1;
        }
      }
    },
    resetParticipantDayZeroStatus(dayZeroStatus) {
      if(!dayZeroStatus) {
        this.modalStatus = false;
        return;
      }
      this.modalStatus = false;
      this.$emit("resetParticipant", true);
    },
    triggerParticipantDay() {
      this.modalStatus = true;
    }
  },
  mounted() {
    this.milestonesList ? this.initCarousel():'';
    this.actualMilestones = this.participantData.participantMileStoneList;
  }
};
</script>
<style scoped lang="scss" src="@/assets/participant-profile-milestone-carousel.scss"></style>
