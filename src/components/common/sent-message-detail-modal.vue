<template>
  <b-modal
    id="message-detail-modal"
    scrollable
    ref="sentMessageDetailModal"
    size="lg"
    hide-footer
    @hidden="resetModalValues"
  >
    <div v-if="messageDetailObject">
      <div class="row">
        <div class="col-md-1 label-column">From</div>
        <div class="col-md-11">no-reply@threadresearch.com</div>
      </div>
      <div class="row">
        <div class="col-md-1 label-column">Subject</div>
        <div class="col-md-11">{{messageDetailObject.subject}}</div>
      </div>
      <div class="row">
        <div class="col-md-1 label-column">Body</div>
        <div class="col-md-11">
          <div class="body-container">{{messageDetailObject.body}}</div>
        </div>
      </div>
    </div>  
  </b-modal>
</template>

<script>
export default {
  name: "sent-message-detail-modal",
  props: ["messageDetailObject"],
  data() {
    return {
    };
  },
  methods: {
    show() {
      this.$refs.sentMessageDetailModal.show();
    },
    hide() {
      this.$refs.sentMessageDetailModal.hide();
    },
    resetModalValues(){
      this.$emit("resetMessageDetailObj");
    }
  },
};
</script>

<style lang="scss">

@media (min-width: 992px) {
  #message-detail-modal{
    .modal-dialog {
      min-width: 877px !important;
      /* vertical-align: top; */
      max-height: calc(100% - 1rem);
      margin: 3.125rem auto;
    }
  }
}
body{
  &.modal-open{
    #message-detail-modal{
      overflow-y: hidden;
    }
  }
}
#message-detail-modal{
  
  .modal-content{
    max-height: calc(100vh - 5.5rem);
    .modal-header{
      border-bottom: 0;
    }
  }
  .modal-body{
    padding-top: 0;
    padding-left: 30px;
    padding-right: 30px;
    overflow-y: hidden;
    margin-bottom: 19px;

    .row{
      padding-top: 12px;
      padding-bottom: 11px;
      border-bottom: 1px solid #e4e8eb;
      &:first-of-type {
        padding-top:0;
      }
      &:last-of-type{
        border-bottom: 0;
      }
      .col-md-1, .col-md-11 {
        padding-left: 0;
        padding-right:0;
        color: #000000;
      }

    }
    .label-column{
      color: #4a4a4a;
      opacity: 0.4;
    }
  }
  .body-container{
    white-space: pre-wrap;
    scroll-behavior: smooth;
    max-height: calc(100vh - 12.063rem);
    overflow-y: auto;

    //Scrollbar CSS for Mozilla
    scrollbar-color: #bfbfbf white; /* thumb and track color */
    scrollbar-width: thin;

    //Below is the scrollbar css for Chrome

    &::-webkit-scrollbar {
        width: 6px;
        background-color: #FFFFFF;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #bfbfbf;
        border-radius: 2px;
    }
    &::-webkit-scrollbar-track {
      //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      background-color: #FFFFFF;
    }
  }
}
</style>
