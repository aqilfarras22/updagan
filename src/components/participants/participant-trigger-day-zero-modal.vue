<template>
  <div id="trigger-day-zero-popup" class="modal modal-position fade" role="dialog">
    <div class="modal-dialog" role="triggerDayZero">
      <div class="modal-content p-0">
        <div class="modal-body p-0">
          <div class="row">
            <div class="col-md-12 pl-80 pr-80 invite-text pt-40 text-center">
              <b>{{heading}}</b>
            </div>
            <div class="description">{{description}}</div>
          </div>
          <div class="row download-modal pt-30 pb-40 text-center">
            <button
              class="btn br-3 mr-15 pt-10 pb-10 pl-30 pr-30 trigger-day-btn cancel"
              :style="{backgroundColor: cancelBtnCss.backgroundColor, color: cancelBtnCss.color}"
              @click="triggerParticipantDay(false)">Cancel
            </button>
            <button class="btn add-invite-btn br-3 pt-10 pb-10 pl-45 pr-45 trigger-day-btn confirm" @click="triggerParticipantDay(true)">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	export default {
		name: "participant-trigger-day-zero-modal",
		components: {},
		props: {
      triggeredParticipant: {
        type: Object
      },
      showModal: {
        type: Boolean
      },
      studyId: {
        type: String
      },
      piId: {
        type: String
      },
      modalText: {
        type: Object
      }
		},
		data() {
			return {
        heading: this.modalText && this.modalText.heading ? this.modalText.heading : "Are you sure you want to start the study for this participant?",
        description: this.modalText && this.modalText.description ? this.modalText.description : null,
        cancelBtnCss: this.modalText && this.modalText.cancelBtnCss ? this.modalText.cancelBtnCss : {backgroundColor: "#000", color: "#fff"}
			}
		},
		mounted() {},
		watch: {
      showModal() {
        if(this.showModal) {
          window.$('#trigger-day-zero-popup').modal('show');
        } else {
          window.$('#trigger-day-zero-popup').modal('hide');
        }
      }
		},
		methods: {
      triggerParticipantDay(confirmationStatus) {
        if(!confirmationStatus) {
          this.$emit("resetParticipantDayZeroStatus", false);
          window.$('#trigger-day-zero-popup').modal('hide');
          return;
        }
        window.$('#trigger-day-zero-popup').modal('hide');
        let self = this;
        let data = {participantId: this.triggeredParticipant.id, studyId: this.studyId, triggeredBy: this.piId};
        this.$api.triggerParticipantDayZero(data, true).then(response => {
          self.$emit("resetParticipantDayZeroStatus", true);
          this.$toastr.success(response.bodyText);
        }, error => {
          self.$emit("resetParticipantDayZeroStatus", false);
          this.$toastr.error('Something went wrong while triggering day 0 for participant');
        });
      },
		}
	}
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
  #trigger-day-zero-popup {
    .modal-dialog {
      width: 500px;
      .modal-body {
        .invite-text {
          width: 100%;
          color: #666669;
          font-size: 18px;
        }
        .download-modal {
          width: 100%;
          display: inline-block;
        }
      }
    }
    .trigger-day-btn {
      border-radius: 100px;
      &.cancel:hover {
        box-shadow: none;
      }
      &.confirm {
        background-color: #1e8fe1!important;
        border-color: #1e8fe1!important;
        color: #fff;
      }
    }
    .description {
      font-size: 14px;
      padding: 15px 56px;
      text-align: center;
    }
  }
</style>
