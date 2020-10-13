<template>
  <div class="main-header" :class="{resizedHeader: getVideoCallStatus}">
    <div>
      <!-- Static navbar -->
      <nav class="navbar">
        <div class="dropdown added-margin dropdown-menu-hide-scroll">
          <div
            class="btn dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i v-if="!user.profileImage" class="fa fa-user-o user_icon mr-10" aria-hidden="true"></i>
            <img class="user-icon-image" v-if="user.profileImage" :src="user.profileImage">
            <span class="user-display">Welcome, {{user.firstName}}&nbsp;{{user.lastName}}</span>
            <span class="caret"></span>
          </div>
          <ul class="dropdown-menu">
            <router-link
              tag="li"
              class="drop_down_list_item"
              :to="{ name: 'profile', params: { id: user.id }}"
            >My Profile</router-link>
            <li class="drop_down_list_item border-none" @click="logout">Log Out</li>
          </ul>
        </div>
        <button
          type="button"
          class="navbar-toggler collapsed"
          data-toggle="collapse"
          data-target="#navbar"
          aria-expanded="false"
          aria-controls="navbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbar" class="navbar-right">
          <!-- <ul class="nav navbar-nav">
          </ul>-->
          <ul class="nav navbar-nav color_ff right_links">
            <!-- TODO: refactor role access -->
            <router-link
              tag="li"
              to="/clients"
              v-if="user && user.licenseType==='Thread' && user.userRole !== 'Pi' && user.userRole !== 'SubPi' && user.userRole !== 'StudyCoordinator' && user.userRole !== 'HomeHealth' && user.userRole !== 'SiteDataLock'"
            >Clients</router-link>
            <router-link tag="li" to="/studies">Studies</router-link>
            <router-link tag="li" to="/users" v-if="canSysAdminAccess || canStudyAdminAccess">Team</router-link>
          </ul>
        </div>
        <!--/.nav-collapse -->
      </nav>
    </div>
    <!-- /container -->
    <div class="border-line"></div>
  </div>
</template>

<script>
import { SYSTEM_ADMIN, STUDY_ADMIN } from "@/constants/authRoles";
import { mapGetters, mapActions } from "vuex";
import { AclRule } from "vue-acl";

export default {
  name: "MainHeader",
  computed: {
    ...mapGetters(["user", "getVideoCallStatus"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check('userAccess');
    },
  },
  methods: {
    ...mapActions(["userLogout"]),
    logout() {
      this.$api.logUserlogoutFact(this.user.id).then(response => {
        this.userLogout();  
      }, error => {
        this.userLogout();  
      });    
    }
  }
};
</script>

<style scoped lang="scss" src="./styles/main-header.scss" />
