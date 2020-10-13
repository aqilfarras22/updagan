<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-30 container-style">
      <b-row class="pb-20">
        <b-col cols="4" class="p-0">
          <input type="text" class="form-control input-lg mb-10 br-3 search-field" placeholder='Search' v-model="searchTerm1" @keyup.enter="searchAdmins(searchTerm1, true)">
        </b-col>
        <b-col cols="4">
       </b-col>
        <b-col cols="4" class="text-right pr-0">
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
          <b-col>
          </b-col>
      </b-row>
      <b-row class="admin-card pt-20 pb-20 mb-10" v-for="(admin,index) in admins" align-v="center" :key="index">
        <b-col cols="4">
          <img class="img-size" src="/static/img/profile.png" alt="user-img"/>
          <span class="name"> {{admin.firstName}} {{admin.lastName}} </span>
        </b-col>
        <b-col cols="4" class="p-0 details">
          {{admin.username}}
        </b-col>
        <b-col cols="3" class="details">
          <span v-if="admin.userRole === 'StudyAdmin'">Study Admin</span>
        </b-col>
        <b-col cols="1" class="text-right close" v-if="(user.userRole == 'StudyAdmin' || user.userRole == 'SystemAdmin')">
          <img class="remove-img" @click="deleteAdmin(admin)" src="/static/img/icn-remove.svg" alt="remove-img"/>
        </b-col>
      </b-row>
        <!-- Modal Component -->
      <b-modal id="addNewAdminModal" ref="addNewAdminModal" @hidden="onClose" hide-footer title="Add administrators">
        <p v-if="user.userRole === 'SystemAdmin' || canStudyAdminAccess" class="pl-16 pr-20">Select member(s) you want to manage this study. If you want to add more admins, 
          <router-link class="underline color-4c8ce4" :to="{ name: 'users'}">click here</router-link>.</p>
        <b-row class="pl-16 pr-20 pt-10">
          <b-col cols="4" class="p-0">
            <input type="text" class="form-control input-lg mb-10 br-3 search-field" placeholder='Search' v-model="searchTerm2" @keyup.enter="searchAdmins(searchTerm2, false)">
          </b-col>
          <b-col cols="4">
          </b-col>
          <b-col v-if="selected" cols="4" class="text-right">
            <b-btn
              variant="primary"
              class="br-30 pl-30 pr-30 fs-12 add-btn"
              @click="addAdmin()"
            >Add {{selected}} member<span v-if="selected > 1">s</span></b-btn>
          </b-col>
        </b-row>
        <div class="pl-20 pr-36">
          <b-row class="pt-20 pb-10 border-style">
            <b-col cols="1" class="p-0"> 
            </b-col>
            <b-col cols="4" class="p-0 header-text">
              NAME
            </b-col>
            <b-col cols="5" class="p-0 header-text">
              EMAIL
            </b-col>
            <b-col cols="2" class="header-text">
              ROLE
            </b-col>
          </b-row>
        </div>
        <div class="modal-style">
          <b-row class="admin-card modal-border pt-15 pb-15 mb-10" align-v="center" :class="{'admin-card-selected': (user.selected)}" v-for="(user,index) in users" :key="index">
            <b-col cols="1" class="p-0">
              <label class="switch">
                <input type="checkbox" :checked="user.selected" @click="selectedAdmin(user)" >
                <span class="slider"></span>
              </label>
            </b-col>
            <b-col cols="4" class="p-0">
              <img class="img-size" src="/static/img/profile.png" alt="user-img"/>
              <span class="name">{{user.firstName}} {{user.lastName}}</span>
            </b-col>
            <b-col cols="5" class="p-0 details">
              {{user.username}}
            </b-col>
            <b-col cols="2" class="details">
              <span v-if="user.userRole === 'StudyAdmin'">Study Admin</span>
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
  name: 'study-admins',
  components: {},
  props: {},
  data() {
    return {
      studyId: this.$route.params.studyId,
      searchTerm1: '',
      searchTerm2: '',
      users: [],
      allUsers: [],
      selected: 0,
      admins: [],
      selectedAdmins: [],
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.getAssociatedAdmins();
  },
  methods: {
    getUsers(associated) {
      const type = 'admin';
      this.$api.getStudyUsersFact(this.studyId, type, associated).then(
        response => {
          if (associated) {
            this.admins = response.body;
          } else {
            this.users = response.body;
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
              : 'Error while getting the admin details.',
          );
        });
    },
    getAssociatedAdmins() {
      this.getUsers(true);
    },
    getAllAdmins() {
      this.getUsers(false);
    },
    openAddModal() {
      this.getAllAdmins();
      this.$refs.addNewAdminModal.show();
    },
    searchAdmins(searchTerm, associated) {
      const type = 'admin';
      if (searchTerm.trim()) {
        this.$api.searchUserFact(this.studyId, type, associated, searchTerm).then(
          response => {
            if (associated) {
              this.admins = response.body;
            } else {
              const searchedUsers = response.body;
              searchedUsers.forEach(element => {
                const user = element;
                const userIndex = findIndex(this.allUsers, ['id', user.id]);
                user.selected = this.allUsers[userIndex].selected;
              });
              this.users = searchedUsers;
            }
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while getting the admin details.',
            );
          });
      } else {
        if (associated) {
          this.getAssociatedAdmins();
          return;
        }
        this.users = this.allUsers;
      }
    },
    selectedAdmin(user) {
      const selectedUser = user;
      const userIndex = findIndex(this.allUsers, ['id', selectedUser.id]);
      const alreadySelected = this.allUsers[userIndex].selected;
      selectedUser.selected = !selectedUser.selected;
      if (selectedUser.selected && !alreadySelected) {
        this.selectedAdmins.push(selectedUser);
      }
      if (!selectedUser.selected) {
        const index = findIndex(this.selectedAdmins, ['id', selectedUser.id]);
        this.selectedAdmins.splice(index, 1);
      }
      this.selected = this.selectedAdmins.length;
      this.allUsers[userIndex].selected = selectedUser.selected;
    },
    addAdmin() {
      const data = [];
      this.selectedAdmins.forEach(admin => {
        data.push(admin.id);
      });
      this.$api.userAssociateFact(this.studyId, data).then(
        () => {
          this.getAssociatedAdmins();
          this.$refs.addNewAdminModal.hide();
          this.$toastr.success(`${this.selected} study admin added`);
          this.selectedAdmins = [];
          this.selected = 0;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the admin details.',
          );
        });
    },
    onClose() {
      this.$refs.addNewAdminModal.hide();
      this.selectedAdmins = [];
      this.selected = 0;
      this.users.forEach(element => {
        const user = element;
        user.selected = false;
      });
      this.searchTerm2 = '';
    },
    deleteAdmin(admin) {
      const delAdmin = admin;
      const data = [];
      data.push(delAdmin.id);
      this.$api.userDisassociateFact(this.studyId, data).then(
        () => {
          if (admin.id === this.user.id) {
            this.$router.push({ name: 'studies' });
          } else {
            this.getAssociatedAdmins();
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the admin details.',
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
  },
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

.admin-card {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.modal-border {
  border: 1px solid #d3dfe4;
}

.admin-card-selected {
  border: 1px solid #4c8ce4;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: rgba(76, 140, 228, 0.1);
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

.color-4c8ce4{
  color: #4c8ce4 !important;
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
.close {
  color: #d3dfe4;
}
.remove-img{
  width: 18px;
  height: 20px;
}
</style>
