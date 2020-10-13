<template>
    <div id="right-sidebar">
        <div class="row">
            <div class="col-md-12 col-lg-12 pr-0"><span @click="close()">&times;</span></div>
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-6 col-lg-6 my-auto">{{recipientParticipantList.length}} participants</div>
            <div class="col-md-6 col-lg-6 show_section text-right pr-0">
                <select class="input-bg select_control mb-4 fs-12" v-model="selectedShowOption" @change="showNumberOfRecords">
                    <option
                    :value="option.value"
                    v-for="option in listOptions"
                    :key="option.value"
                    >{{option.text}}</option>
                </select>
            </div>
        </div>
        <div class="row justify-content-md-center">
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Participant Id</th>
                    </tr>
                </thead>
                <tbody v-if="recipientParticipantList && recipientParticipantList.length">
                    <tr v-for="(participant, index) in recipientParticipantList" :key="index">
                        <td :title="participant.email">{{participant.email}}</td>
                        <td :title="participant.participantId">{{participant.participantId}}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2">
                            <div class="snippet" data-title=".dot-stretching">
                                <div class="stage">
                                <div class="dot-stretching"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
            <div class="row pagination-conatiner display-inline-flex" v-if="recipientParticipantList && recipientParticipantList.length">
              <div @click="prevPage()" class="arrow-icon"
              :class="{ 'disabledPagination': currentPage <= 1}">
                <i class="fa fa-angle-left fs-23 pt-3"></i>
              </div>
              <div class="pagination pt-3">{{currentPage}}</div>
              <div class="pagination2 pt-3">of {{totalPages}}</div>
              <div
              @click="nextPage()"
              class="arrow-icon pt-3"
              :class="{ 'disabledPagination': currentPage >= totalPages}">
              <i class="fa fa-angle-right fs-23"></i>
              </div>
        </div>
    </div>
</template>
<script>
import nprogress from "nprogress";
import "nprogress/nprogress.css";
export default {
    name: "messageSentToParticipantList",
    props: {
        notificationId: String,
    },
    watch: {
        notificationId: function(id) {
            this.recipientParticipantList = [];
            if(!id) {
                return;
            }
            this.currentNotificationId = id;
            this.resetVariables();
            this.getRecipientParticipantList();
        }
    },
    data() {
        return {
            currentPage: 1,
            totalPages: 1,
            selectedShowOption: 15,
            listOptions: [
                {
                value: 15,
                text: "Show 15 items"
                },
                {
                value: 50,
                text: "Show 50 items"
                },
                {
                value: 100,
                text: "Show 100 items"
                }
            ],
            currentNotificationId: this.notificationId  ? this.notificationId : null,
            recipientParticipantList: []
        }
    },
    methods: {
        showNumberOfRecords() {
            this.currentPage = 1
            this.getRecipientParticipantList();
        },
        prevPage() {
        if (this.currentPage <= this.totalPages) {
            this.currentPage -= 1;
            this.getRecipientParticipantList();
        }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage += 1;
                this.getRecipientParticipantList();
            }
        },
        close() {
            this.$emit("closeParticipantRightSidebar");
            this.resetVariables();
        },
        getRecipientParticipantList() {
            nprogress.start();   
            let pathParams = {
                notificationId: this.currentNotificationId
            };
            let queryParams = {
                pageSize: this.selectedShowOption,
                pageNum: this.currentPage
            }
            
            this.$api.getNotificationRecipientList(pathParams, queryParams).then( response => {
                this.recipientParticipantList = response.body.participantList;
                this.totalPages = response.body.totalPages;
                nprogress.done();
            },
            error => {
                nprogress.done();
                this.$toastr.error(
                error.body && error.body.message
                    ? error.body.message
                    : "Error while getting participant list"
                );
            }
            );
        },
        resetVariables(){
            this.currentPage = 1;
            this.totalPages = 1;
            this.selectedShowOption = 15;
            this.recipientParticipantList = [];
        }
    }
}
</script>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
<style lang="scss" scoped>
    #right-sidebar {
        --main-padding: 13%;
        font-family: "Roboto-Regular", sans-serif;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        background: #fff;
        padding: 21px;
        padding-top: 16px;
        .row {
            &:first-child {
                div[class*='col'] {
                    text-align: right;
                    font-size: 26px;
                    cursor: pointer;
                }
            }
            &:nth-child(2) {
                padding-top: 12px;
                font-weight: 600;
                div[class*='col'] {
                    &:first-child {
                        padding-left: 0;
                        color: #072249; 
                        font-weight: normal;
                    }
                    &:nth-child(2) {
                        font-size: 12px;
                        text-align: right;
                    }
                }
            }
            &:nth-child(3) {
                padding-top: 25px;
            }
        }
        table {
            width: 100%;
            table-layout: fixed;
            thead{
                tr{
                    th{
                        &:last-child{
                            padding: 0 0 0 14px;
                        }
                        &:first-child{
                            padding: 0;
                        }
                    }
                }
            }
            th {
                font-size: 12px;
                color: #9b9b9b;
                font-weight: normal;
                /* text-align: left;
                width: 25%;
                padding: 0.5% 0% 1% var(--main-padding); */

            }
            tr {
                &:first-of-type {
                    /* height: 29px; */
                    td{
                        padding-top: 7px !important;
                    }
                }
            }
            tr td {
                /* text-align: left; */
                font-size: 14px;
                /* width: 25%; */
                word-break: break-all;
                white-space: nowrap;
                text-overflow:ellipsis;
                overflow: hidden;
                &:first-child {
                    color: #1e8fe1;
                    /* padding: 0.5% 0% 3.5% var(--main-padding); */
                    padding: 14px 0 0 0;
                }
                &:last-child {
                    color: #4a4a4a;
                    /* padding: 0.5% var(--main-padding) 3.5% var(--main-padding); */
                    padding: 14px 0 0 14px;
                }
            }
        }
        .select_control {
            border-radius: 4px;
            border: solid 1px #e4e8eb;
            background-color: #ffffff;
            background-image: none;
        }
        .show_section {
            margin-top: 5px;
            padding: 0% 5% 0% 0%;
            select{
                color: #4a4a4a;
                background-image: none;
                padding: 8px;
                padding-right: 35px;
                padding-left: 13px;
            }
        }
        .show_section:after {
            content: "\F107";
            font: normal normal normal 20px/1 FontAwesome;
            color: #4a4a4a;
            right: 11px;
            top: 7px;
            padding: 0px 0px 0px 1px;
            position: absolute;
            pointer-events: none;
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
            cursor: pointer;
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
           width: 100%;
        }
        .pagination-conatiner{
            background-color: #fff;
            padding: 58px 0px 40px 0;
        }

         .stage {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 2rem 0;
            margin: 0 -5%;
            overflow: hidden;
        }
    }
</style>