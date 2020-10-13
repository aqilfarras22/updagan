<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-30 container-style">
      <b-row class="pb-20">
        <b-col cols="4" class="p-0">
          <input type="text" class="form-control input-lg mb-10 br-3 search-field" placeholder='Search' v-model="searchTerm1" @keyup.enter="searchTeam(searchTerm1, true)">
        </b-col>
        <b-col cols="4">
       </b-col>
        <b-col cols="4" class="text-right p-0">
          <b-btn @click="openAddModal" class="add-btn2 fs-12" variant="primary" v-if="user.userRole !== 'Quality'">Add new</b-btn>
        </b-col>
      </b-row>
      <b-row class="pb-20">
          <b-col cols="4" class="header-text">
            NAME
          </b-col>
          <b-col cols="4" class="p-0 header-text">
            EMAIL
          </b-col>
          <b-col cols="3" class="header-text">
            ROLE
          </b-col>
          <b-col cols="1">
          </b-col>
      </b-row>
      <b-row class="member-card pt-20 pb-20 mb-10" align-v="center" v-for="(member,index) in team" :key="index">
        <b-col cols="4">
          <img class="img-size" src="/static/img/profile.png" alt="user-img"/>
          <span class="name"> {{member.firstName}} {{member.lastName}} </span>
        </b-col>
        <b-col cols="4" class="details p-0">
          {{member.username}}
        </b-col>
        <b-col cols="3" class="details">
          <span v-if="member.userRole === 'Cra'">Clinical Research Associate</span>
          <span v-if="member.userRole === 'Dm'">Data Management</span>
          <span v-if="member.userRole === 'Quality'">Quality</span>
        </b-col>
        <b-col cols="1" class="text-right close" v-if="(user.userRole == 'StudyAdmin' || user.userRole == 'SystemAdmin')">
          <img class="remove-img" @click="deleteMember(member)" src="/static/img/icn-remove.svg" alt="remove-img"/>
          
        </b-col>
      </b-row>
        <!-- Modal Component -->
      <b-modal id="addNewTeamMember" ref="addNewTeamMember" @hidden="onClose" hide-footer title="Add study team members">
        <p v-if="user.userRole === 'SystemAdmin' || canStudyAdminAccess" class="pl-16 pr-20">Select member(s) you want to associate to this study. To add more team members, 
          <router-link class="underline color-4c8ce4" :to="{ name: 'users'}">click here</router-link>.
        </p>
        <b-row class="pl-16 pr-20 pt-10">
          <b-col cols="4" class="p-0">
            <input type="text" class="form-control input-lg mb-10 br-3 search-field" placeholder='Search' v-model="searchTerm2" @keyup.enter="searchTeam(searchTerm2, false)">
          </b-col>
          <b-col cols="4">
          </b-col>
          <b-col v-if="selected" cols="4" class="text-right">
            <b-btn
              variant="primary"
              class="br-30 fs-12 pl-30 pr-30 add-btn"
              @click="addMember()"
            >Add {{selected}} member<span v-if="selected > 1">s</span></b-btn>
          </b-col>
        </b-row>
        <div class="pl-20 pr-35">
          <b-row class="pt-20 pb-10 border-style">
            <b-col cols="1"> 
            </b-col>
            <b-col cols="4" class="header-text">
              NAME
            </b-col>
            <b-col cols="4" class="header-text p-0">
              EMAIL
            </b-col>
            <b-col cols="3" class="header-text">
              ROLE
            </b-col>
          </b-row>
        </div>
        <div class="modal-style">
          <b-row class="member-card modal-border pt-15 pb-15 mb-10" align-v="center" :class="{'member-card-selected': (member.selected)}" v-for="(member,index) in members" :key="index">
            <b-col cols="1" class="p-0">
              <label class="switch">
                <input type="checkbox" :checked="member.selected" @click="selectedMember(member)" >
                <span class="slider"></span>
              </label>
            </b-col>
            <b-col cols="4" class="p-0">
              <img class="img-size" src="/static/img/profile.png" alt="member-img"/>
              <span class="name">{{member.firstName}} {{member.lastName}}</span>
            </b-col>
            <b-col cols="4" class="details p-0">
              {{member.username}}
            </b-col>
            <b-col cols="3" class="details">
              <span v-if="member.userRole === 'Cra'">Clinical Research Associate</span>
              <span v-if="member.userRole === 'Dm'">Data Management</span>
              <span v-if="member.userRole === 'Quality'">Quality</span>
            </b-col>
          </b-row>
        </div>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import findIndex from 'lodash/findIndex';
import { AclRule } from 'vue-acl';
import { CRA, SPONSOR, PI, SYSTEM_ADMIN, STUDY_ADMIN, QUALITY } from '@/constants/authRoles';

export default {
  name: 'study-team',
  components: {},
  props: {},
  data() {
    return {
      studyId: this.$route.params.studyId,
      searchTerm1: '',
      searchTerm2: '',
      members: [],
      selected: 0,
      team: [],
      selectedTeam: [],
      allUsers: [],
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.getAssociatedTeam();
  },
  methods: {
    getUsers(associated) {
      const type = 'studyteam';
      this.$api.getStudyUsersFact(this.studyId, type, associated).then(
        response => {
          if (associated) {
            this.team = response.body;
          } else {
            this.members = response.body;
            this.allUsers = response.body;
            this.allUsers.forEach(element => {
              const user = element;
              user.selected = false;
            });
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the study team details.',
          );
        });
    },
    getAssociatedTeam() {
      this.getUsers(true);
    },
    getAllTeam() {
      this.getUsers(false);
    },
    openAddModal() {
      this.getAllTeam();
      this.$refs.addNewTeamMember.show();
    },
    searchTeam(searchTerm, associated) {
      const type = 'studyteam';
      if (searchTerm) {
        this.$api.searchUserFact(this.studyId, type, associated, searchTerm).then(
          response => {
            if (associated) {
              this.team = response.body;
            } else {
              const searchedUsers = response.body;
              searchedUsers.forEach(element => {
                const user = element;
                const userIndex = findIndex(this.allUsers, ['id', user.id]);
                user.selected = this.allUsers[userIndex].selected;
              });
              this.members = searchedUsers;
            }
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while getting the study team details.',
            );
          });
      } else {
        if (associated) {
          this.getAssociatedTeam();
          return;
        }
        this.members = this.allUsers;
      }
    },
    selectedMember(member) {
      const selectedMember = member;
      const userIndex = findIndex(this.allUsers, ['id', selectedMember.id]);
      const alreadySelected = this.allUsers[userIndex].selected;
      selectedMember.selected = !selectedMember.selected;
      if (selectedMember.selected && !alreadySelected) {
        this.selectedTeam.push(selectedMember);
      }
      if (!selectedMember.selected) {
        const index = findIndex(this.selectedTeam, ['id', selectedMember.id]);
        this.selectedTeam.splice(index, 1);
      }
      this.selected = this.selectedTeam.length;
      this.allUsers[userIndex].selected = selectedMember.selected;
    },
    addMember() {
      const data = [];
      this.selectedTeam.forEach(admin => {
        data.push(admin.id);
      });
      this.$api.userAssociateFact(this.studyId, data).then(
        () => {
          this.getAssociatedTeam();
          this.$refs.addNewTeamMember.hide();
          this.$toastr.success(`${this.selected} study team members added`);
          this.selectedTeam = [];
          this.selected = 0;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the study team details.',
          );
        });
    },
    onClose() {
      this.$refs.addNewTeamMember.hide();
      this.selectedTeam = [];
      this.selected = 0;
      this.members.forEach(element => {
        const user = element;
        user.selected = false;
      });
      this.searchTerm2 = '';
    },
    deleteMember(member) {
      const delMem = member;
      const data = [];
      data.push(delMem.id);
      this.$api.userDisassociateFact(this.studyId, data).then(
        () => {
          this.getAssociatedTeam();
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the site team details.',
          );
        });
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check('userAccess');
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canSystemAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
  }
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.container-style {
  padding-right: 280px !important;
  padding-left: 30px !important;
}

.component {
  background-color: $color_content_background;
}

.search-field{
  padding: 10px !important;
  background-image: url('/static/img/search.svg');
  background-repeat: no-repeat;
  background-position: 97% 50%;
}

.member-card {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.modal-border {
  border: 1px solid #d3dfe4;
}

.member-card-selected {
  border: 1px solid #4c8ce4;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: rgba(76, 140, 228, 0.1);
}

.color-4c8ce4{
  color: #4c8ce4 !important;
}
.name {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  color: #666669;
  word-wrap: break-word;
}

.details {
  font-size: 14px;
  text-align: left;
  color: #666669;
  word-wrap: break-word;
}

.header-text {
  font-weight: bold;
  color: #666669 !important;
  opacity: 0.5;
  font-size: 12px;
}

.img-size {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.remove-img{
  width: 18px;
  height: 20px;
}

/deep/ .modal-dialog {
  width: 100% !important;
  min-width: 50% !important;
}

/deep/ .modal-title {
  color: #2d3752;
  font-size: 20px;
  font-weight: bold;
}

/deep/ .modal-header {
  padding-bottom: 0px !important;
  border-bottom: none !important;
}
/deep/ .modal-body {
  padding: 0px !important;
}

.modal-style {
  border-radius: 3px;
  background-color: #f5f8fa;
  padding: 20px 20px 80px 20px !important;
  height: 420px;
  overflow-y: auto;
}

.add-btn {
  background-color: #4c8ce4;
  width: 170px;
  height: 40px;
}

.add-btn2 {
  background-color: #4c8ce4;
  width: 100px;
}

.sponsor-btn {
  background-color: #d3dfe4 !important;
  border: none !important;
  border-radius: 30px !important;
  color: #666669 !important;
  padding: 2px 12px 2px 8px !important;
  font-weight: bold;
  font-size: 14px;
  width: 92px;
}

.star {
  color: #ffa200 !important;
  font-size: 16px !important;
}

.close {
  color: #d3dfe4;
}

.switch {
  position: relative;
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
}
/* Hide default HTML checkbox */
.switch input {
  display: none;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  margin-top: 2px;
  margin-left: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 25px;
  width: 25px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #d3dfe4;
}
input:checked + .slider:before {
  position: absolute;
  content: url('/static/img/checkbox-on.svg');
  top: -7px;
  left: 2px;
  height: 25px;
  width: 25px;
  bottom: 0;
  font-size: 27px;
}
input:checked + .slider {
  border: none;
  background: none;
}
</style>
