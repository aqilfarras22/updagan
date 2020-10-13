<template>
	<div class="row pl-15 padding-left">
    <div>
      <nav v-if="navigationOptions" class="participant-breadcrumb" aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" v-for="(options, index) in sortBreadcrumbOptions" :key="index">
            <span class="page" v-if="!options.isLink">{{options.name}}</span>
            <a class="h-link" v-else @click="changeState(options)">{{options.name}}</a>
          </li>
        </ol>
      </nav>
    </div>
    <div class="dropdown-wrapper" :style="{width: navigationWidth}">
      <div v-if="selectedParticipant.id" class="pid-text">PID: </div>
      <div v-if="selectedParticipant.id" class="change-caret-icon">
        <div class="btn btn-primary dropdown-toggle" @click.stop="listToggle()" data-toggle="dropdown"><span>{{selectedParticipant.pId ? selectedParticipant.pId : selectedParticipant.id}}</span>
        <span class="caret"></span></div>
        <ul v-on:scroll.passive="onScroll()" id="drop-down" :class="{'scrollbar': scrollNeeded, 'list-expanded': isExpanded, 'list-collapsed': !isExpanded}" class="dropdown-menu">
          <li v-bind:id="p.id" :class="{'active': selectedParticipant.id==p.id}" v-for="p in participants" @click="toggleParticipant($event, p)"><a href="#">{{p.userDefinedParticipantId ? p.userDefinedParticipantId : p.id}}</a></li>
          <span class="loader" v-if="isParticipantLoading">Loading...</span>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
	import _ from 'lodash';
  import siteTeamActionTableVue from '../record-table/site-team-action-table.vue';
  import LocalStorageService from "../../services/localStorage";

	export default {
		name: "navigation-breadcrumb",
		components: {},
		props: {
			navigationOptions: {
				type: Array
      },
      redirectToProfile: {
        type: Boolean,
        default: true
      },
      navigationWidth: {
        type: String
      }
		},
		data() {
			return {
        selectedParticipant: {pId: null, id: null},
        currentPage: 1,
        studyId: this.$route.params.studyId,
        totalRecords: [],
        participants: [],
        totalPages: 0,
        isParticipantLoading: false,
        isExpanded: false,
        scrollNeeded: false,
        participantId: this.$route.params.participantId,
			}
		},
		mounted() {
      this.getAllParticipants();
      let _this = this;
      $(document).click(function() {
        _this.isExpanded = false;
      });
      this.$root.$on("updateUserDefinedPaticipantId", data => {
        if ( data && data.participantId ) {
          this.selectedParticipant.pId = data.userDefinedParticipantId ? data.userDefinedParticipantId : null;
          let curParticipant = this.participants.find(p => p.id === data.participantId);
          let index = this.participants.indexOf(curParticipant);
          this.participants[index].userDefinedParticipantId = data.userDefinedParticipantId;
        }
      });
    },
		computed: {
			sortBreadcrumbOptions() {
				return  _.orderBy(this.navigationOptions, ['displayOrder'], ['asc']);
			}
		},
		methods: {
			changeState(routeOptions) {
				this.$router.push({
					name: routeOptions.route,
					params: routeOptions.params
				});
      },
      getAllParticipants() {
        let f = this.getDropdownFilterData();
        this.$api.getParticipantsListFact(this.studyId, f.pageSize, this.currentPage, f.search, f.filter, f.sortValue, f.sortOrder, f.customKey).then(response => {
          this.participants = this.participants.concat(response.body.participants);
          this.totalRecords = response.body.totalParticipants;
          this.totalPages = response.body.totalPages;
          this.currentPage = response.body.currentPage;
          let p = _.find(this.participants, ['id', this.$route.params.participantId]);
          if(p == undefined) {
            if(this.currentPage == this.totalPages) {
              return;
            } else {
              this.currentPage += 1;
              this.getAllParticipants();
              return;
            }
            return;
          }
          this.scrollNeeded = this.totalRecords > 9;
          this.selectedParticipant.id = p.id;
          this.selectedParticipant.pId = p.userDefinedParticipantId;
          this.isParticipantLoading = false;
        }, error => {
          this.$toastr.error(error.body && error.body.message ? error.body.message : "Error while getting participants.");
          this.isParticipantLoading = false;
        })
      },
      toggleParticipant(event, p) {
        event.preventDefault();
        let participant = _.find(this.participants, ['id', p.id]);
        if(this.redirectToProfile) {
          this.$router.push({
            name: 'participant-profile',
            params: {studyId: this.$route.params.studyId, participantId: participant.id}
          });
          return;
        }
        this.selectedParticipant.id = participant.id;
        this.selectedParticipant.pId = participant.userDefinedParticipantId;
        this.$emit('toggleParticipant', this.selectedParticipant);
      },
      onScroll() {
        if(this.isParticipantLoading || this.currentPage == this.totalPages) {
          return;
        }
        let dropdownEle = document.getElementById('drop-down');
        if((dropdownEle.clientHeight + dropdownEle.scrollTop) >= (dropdownEle.scrollHeight - 5)) {
          // dont call pagination api if all records are called
          if(this.totalRecords == this.participants.length) {
            return;
          } else if(this.totalRecords != this.participants.length) {
            this.currentPage += 1;
            this.isParticipantLoading = true;
            this.getAllParticipants()
          }
        }
      },
      listToggle() {
         this.isExpanded = !this.isExpanded;
         this.$nextTick(()=>{
           this.scrollElement();
         })
      },
      scrollElement() {
        var container = $('#drop-down'),
        scrollTo = $('#'+this.selectedParticipant.id);
        container.animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        });
      },
      getDropdownFilterData() {
        let participantsFilter = LocalStorageService.getItem("participants-filter-map");
        let emptyObj = {"pageSize":15,"search":"", "filter":"", "sortValue":"", "sortOrder":"", "customKey":""};
        if(!participantsFilter || _.isEmpty(participantsFilter))
          return emptyObj;
        let filters = new Map(JSON.parse(participantsFilter)).get(this.studyId+"-"+this.participantId);
        if(!filters)
          return emptyObj;
        return filters;
      },
    },
    beforeDestroy() {
      LocalStorageService.removeItem("participants-filter-map");
    }
	}
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss" src="@/assets/dropdown-css.scss"></style>
<style scoped lang ="scss">
nav {
  &.participant-breadcrumb {
    margin-left: -10px;
    float: left;
    .breadcrumb {
      height: 24px;
      padding: 5px 10px;
      background-color: #ffffff;
      .breadcrumb-item + .breadcrumb-item::before {
        content: "/";
        color: #b0bac9;
        padding-right: 0.2rem;
        padding-left: 0.2rem !important;
      }
      .breadcrumb-item + .breadcrumb-item {
        padding-left: 0px !important;
      }
      .breadcrumb-item {
        color: #4a4a4a;
        li {
          margin: 0px 0px;
        }
        .h-link {
          color: #4c8ce4;
          cursor: pointer;
        }
        .page {
          color: #A8A8A8;
        }
      }
    }
  }
}
.change-caret-icon {
  position: relative;
  display: inline-block;
  .caret {
    cursor: pointer;
  }
  .dropdown-menu {
    max-height: 325px;
    left: -3px !important;
    display: block;
    width: auto;
    top: 77% !important;
    left: 1% !important;
    &.list-expanded {
      max-height: 326px;
      -moz-transition:    all 400ms ease-out;
      -webkit-transition: all 400ms ease-out;
      -o-transition:      all 400ms ease-out;
      -ms-transition:     all 400ms ease-out;
      transition: all 400ms ease-out;
      display: block;
    }
    &.list-collapsed {
      max-height: 0;
      transition: all 400ms ease-in;
      -moz-transition:    all 400ms ease-in;
      -webkit-transition: all 400ms ease-in;
      -o-transition:      all 400ms ease-in;
      -ms-transition:     all 400ms ease-in;
      overflow: hidden;
      display: none;
    }
    &.hidden {
      overflow: hidden !important;
    }
    li {
      white-space: nowrap;
      padding-right: 14px;
      a {
        font-size: 14px;
      }
    }
  }
  .btn.btn-primary {
    width: auto;
    padding-bottom: 5px;
  }
  .dropdown-toggle::after {
    right: -20px;
    top: 13px;
  }
  .dropdown-toggle {
    font-size: 20px;
    display: inline-block;
    span {
      white-space: nowrap;
    }
  }
}
.dropdown-wrapper {
  text-align: center;
  position: relative;
}
.pid-text {
  display: inline-block;
}
.max-width-40 {
  max-width: 40% !important;
}
.padding-left {
  padding-left: 20px !important;
}
.telehealth-call {
  .participant-breadcrumb {
    font-size: 11px;
  }
  .dropdown-wrapper {
    font-size: 11px;
  }
  .change-caret-icon .dropdown-toggle {
    font-size: 16px;
  }
  .change-caret-icon .dropdown-toggle::after {
    top: 10px;
  }
}

</style>
