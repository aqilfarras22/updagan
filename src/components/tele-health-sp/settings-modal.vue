<template>
  <b-modal
    id="settingsModal"
    hide-footer
    ref="settingModal"
    size="md"
    @show="setDefaultvalues"
    :no-close-on-esc="noCloseOnBackdrop"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :hide-header-close="noCloseOnBackdrop"
  >
    <template slot="modal-title">Settings</template>

    <div class="modal-body-cntr">
      <div class="form-group">
        <label>Appointment duration</label>
        <select v-model="appointmentDuration" class="form-control">
          <option
            v-for="option in durationOptions"
            :key="option.value"
            :value="option.value"
          >{{ option.text }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>
          Phone number your participants can call if no appointment slots are available within their
          completion
          window.
        </label>
        <vue-tel-input class="p-0" @onInput="onInputTelephone" v-model="phoneNumber"></vue-tel-input>
        <span v-if="phoneError" class="text-danger">{{phoneError}}</span>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="cancelChanges"
        :disabled="disablebutton"
      >Cancel</button>
      <button
        type="button"
        class="btn btn-primary"
        @click="saveSettings"
        :disabled="disablebutton"
      >Save</button>
    </div>
  </b-modal>
</template>

<script>
import swal from "sweetalert2";
import toastr from "toastr";
import { mapGetters } from "vuex";
import { duration } from "moment";
export default {
  name: "settings-modal",
  data() {
    return {
      settingsData: null,
      noCloseOnBackdrop: true,
      appointmentDuration: 30,
      phoneNumber: "",
      phoneError: false,
      disablebutton: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    durationOptions() {
      var times = [];
      for (var i = 15; i < 495; i += 15) {
        times.push({
          value: i,
          text: i >= 60 ? this.timeConvert(i) : i + "m"
        });
      }

      return times;
    }
  },
  methods: {
    timeConvert(n) {
      var hours = n / 60;
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      return rminutes > 0 ? rhours + "h " + rminutes + "m" : rhours + "h";
    },
    show() {
      this.$refs.settingModal.show();
    },
    hide() {
      this.$refs.settingModal.hide();
    },
    onInputTelephone({ number, isValid, country }) {
      if (!isValid) {
        this.phoneError = "Please enter a valid phone number.";
      } else {
        this.phoneError = false;
      }
    },
    cancelChanges() {
      var self = this;
      swal({
        title: "Are you sure you want to cancel the changes?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "No",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.setDefaultvalues();
          this.hide();
        }
      });
    },
    setDefaultvalues() {
      if (this.settingsData) {
        this.appointmentDuration = this.settingsData.duration;
        this.phoneNumber = this.settingsData.phoneNumber;
      } else {
        this.getSettings();
      }
    },
    saveSettings() {
      var self = this;
      self.disablebutton = true;
      if (this.appointmentDuration == "") {
        toastr.error("Please select duration");
        self.disablebutton = false;
        return;
      }

      if (this.phoneNumber == "") {
        toastr.error("Please enter phone number");
        self.disablebutton = false;
        return;
      }

      if (this.phoneError != false) {
        toastr.error("Please enter a valid phone number");
        self.disablebutton = false;
        return;
      }

      let settingsParams = {
        duration: this.appointmentDuration,
        id:
          this.settingsData && this.settingsData.id
            ? this.settingsData.id
            : null,
        phoneNumber: this.phoneNumber.replace(/ /g, ""),
        piId: this.user.id,
        siteId: this.user.siteIds ? this.user.siteIds[0] : null
      };

      this.$api.saveTelehealthSettings(settingsParams).then(
        response => {
          self.$store.dispatch(
            "setTelehealthAppointmentDuration",
            self.appointmentDuration
          );
          self.settingsData = settingsParams;
          this.hide();
          toastr.success("Setting saved succesfully");
          self.disablebutton = false;
        },
        error => {
          self.disablebutton = false;
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while saving the settings!"
          );
        }
      );
    },
    getSettings() {
      var self = this;
      let getSettingParam = {
        pId: this.user.id,
        siteId: this.user.siteIds ? this.user.siteIds[0] : null
      };
      this.$api.getTelehealthSettings(getSettingParam).then(
        response => {
          let responseObj = response.body;
          if (responseObj.id) {
            self.settingsData = responseObj;
            self.setDefaultvalues();
          }
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting the settings!"
          );
        }
      );
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
/* @media (min-width: 992) {
  .modal-dialog {
    max-width: 600px;
  }
} */

.modal {
  color: #4a4a4a;
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

#settingsModal label {
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
</style>
