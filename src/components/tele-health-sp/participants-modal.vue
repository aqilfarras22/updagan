<template>
  <b-modal
    id="participants-search-modal"
    hide-footer
    ref="participantSearchModal"
    @hidden="resetModal"
    size="lg"
    :no-close-on-esc="noCloseOnBackdrop"
    :no-close-on-backdrop="noCloseOnBackdrop"
  >
    <template slot="modal-title">Invite a participant</template>

    <div class="mb-25">
      <div class="autocomplete-search">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Enter email, THREAD ID, or Participant ID"
          required
          @input="searchParticipants()"
        >
        <div
          v-if="currentParticipantsList && currentParticipantsList.length>0"
          class="autocomplete-items"
        >
          <div
            v-for="(participant, index) in currentParticipantsList"
            :key="index"
            class="item-detail"
            @click="selectedParticipant(participant)"
          >
            <div
              v-if="(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)"
            >{{participant.email}}</div>
            <div
              v-if="(canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess)"
            >THREAD ID: {{participant.id}}</div>
            <div>Participant ID: {{participant.userDefinedParticipantId}}</div>
          </div>
        </div>
        <div
          v-if="searchTerm.trim()!='' && currentParticipantsList && currentParticipantsList.length==0"
          class="no-result"
        >No participant found</div>
        <div v-if="searching" class="searching">
          <strong>Searching...</strong>
        </div>
      </div>
    </div>
    <div class="mb-16 text-center">
      <button
        type="button"
        class="btn btn-primary"
        @click="InitateVideoCall"
        :disabled="selectedParticipantObj==null"
      >Invite to video call</button>
    </div>
  </b-modal>
</template>

<script>
import { AclRule } from "vue-acl";
import { mapGetters } from "vuex";
import {
  participantStatuses,
  participantStatusesText,
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  HOME_HEALTH 
} from "@/constants/authRoles";

export default {
  name: "participants-modal",
  data() {
    return {
      noCloseOnBackdrop: true,
      searchTerm: "",
      participantStatus: participantStatuses.ACTIVE,
      studyId: this.$route.params.studyId,
      currentParticipantsList: null,
      selectedShowOption: 99999,
      sortValue: "",
      sortOrder: "",
      customKey: "",
      selectedParticipantObj: null,
      searching: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
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
      return this.$acl.check("userAccess");
    },
     canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    }
  },
  methods: {
    InitateVideoCall() {
      //Emit an event to show/start the video call component
      //TODO get the PARTICIPANT ID TO  START THE CALL
      this.$root.$emit("videoCallingInitiated", {
        participantId: this.selectedParticipantObj.id,
        studyId: this.studyId,
        deviceRegistrationStatus: this.selectedParticipantObj.deviceRegistrationStatus
      });
      this.$refs.participantSearchModal.hide();
    },

    searchParticipants: _.debounce(function(e) {
      this.currentPage = 1;
      if (this.searchTerm.trim() != "")
        this.getAllParticipants(
          this.selectedShowOption,
          this.currentPage,
          this.searchTerm,
          this.participantStatus,
          this.sortValue,
          this.sortOrder,
          this.customKey
        );
    }, 1000),

    getAllParticipants(
      selectedShowOption,
      currentPage,
      search,
      filter,
      sortValue,
      sortOrder,
      customKey
    ) {
      //If researching then reset selectedobj
      this.searching = true;
      this.selectedParticipantObj = null;
      this.currentParticipantsList = null;
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
          "",//sourcefilter
          "",//withdrawnOrFailedFilter
          true,//includeVerified,
          true//isTelehealthSearch
        )
        .then(
          response => {
            this.searching = false;
            if (response.body.totalParticipants > 0) {
              this.currentParticipantsList = response.body.participants;
            } else {
              this.currentParticipantsList = [];
            }
          },
          error => {
            this.searching = false;
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : "Error while getting participants."
            );
          }
        );
    },
    selectedParticipant(participantSelected) {
      this.selectedParticipantObj = participantSelected;
      this.searchTerm = `${participantSelected.email}, THREAD ID: ${
        participantSelected.id
      }, Participant ID: ${participantSelected.userDefinedParticipantId}`;
      this.currentParticipantsList = null;
    },
    show() {
      this.$refs.participantSearchModal.show();
    },
    resetModal() {
      this.searchTerm = "";
    }
  },
  watch: {
    searchTerm(newVal, oldVal) {
      if (newVal.trim() == "") {
        this.selectedParticipantObj = null;
        this.currentParticipantsList = null;
      }
    }
  },
  mounted() {
    this.searchTerm = "";
  }
};
</script>

<style lang="scss">
@media (min-width: 1024px) {
  .modal-dialog {
    min-width: 600px;
  }
}
.modal-dialog {
  vertical-align: top;
}
.modal {
  color: #4a4a4a;
}

.modal-header {
  border: 0;
  padding-bottom: 0;
}
.btn-primary {
  background-color: #1e8fe1;
  border-color: #1e8fe1;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0069d9;
}

.btn-primary:hover {
  background-color: #1e8fe1;
  color: #fff;
}

.btn-primary {
  padding: 0.25rem 1.6rem;
}

.btn-outline-secondary {
  border-color: #b0bac9;
  padding: 0.25rem 1.6rem;
  color: #4a4a4a;
}

.btn-outline-secondary:hover {
  color: #ffffff;
}

#participants-search-modal label {
  display: block;
  font-weight: bold;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
}

.form-group label {
  margin-bottom: 0.625rem;
}

/*Autocomplete*/
.autocomplete-search {
  position: relative;
  display: inline-block;
  width: 100%;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #e4e8eb;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: scroll;
}

.autocomplete-items .item-detail {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #e4e8eb;
}
.autocomplete-items .item-detail:hover {
  background-color: #e4e8eb;
}

.no-result,
.searching {
  padding: 11px;
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
}
</style>
