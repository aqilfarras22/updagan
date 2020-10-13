<template>
  <div>
    <FormQueriesHeader :title="`Query ID: ${shortQueryId}`" @back="back" class="header"/>
    <div class="margin-from-top" v-if="(canCraAccess || canDmAccess || canPiAccess)">
      <FormQueriesCommentForm
        v-if="replyQuery"
        @submit="createComment"
        @cancel="cancelComment" />
      <b-row v-else>
        <b-col class="pr-1">
          <button-cmp v-if="!closed" variant="outline-primary" @click="reply">Reply</button-cmp>
          <button-cmp v-if="!closed && (canCraAccess || canDmAccess)" variant="outline-primary" @click="close">Close Query</button-cmp>
          <button-cmp v-else-if="(canCraAccess || canDmAccess)" variant="outline-primary" @click="reopen">Reopen Query</button-cmp>
        </b-col>
        <!-- <b-col col md="auto"></b-col> -->
      </b-row>
    </div>
    <FormQueriesQueryComment class="margin-from-top" v-for="comment in query.comments" :comment="comment" :key="comment.createdOn" />
    <ConfirmationModal
      ref="closeConfirmation"
      text="Are you sure you want to close this query?"
      yesBtnTxt="Yes, close query"
      noBtnTxt="No, do not close query"
      @confirmed="closeConfirmed"
    />
    <ConfirmationModal
      ref="reopenConfirmation"
      text="Are you sure you want to reopen this query?"
      yesBtnTxt="Yes, reopen query"
      noBtnTxt="No, do not reopen query"
      @confirmed="reopenConfirmed"
    />
  </div>
</template>

<script>
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import FormQueriesQueryComment from '@/components/form/form-queries/form-queries-query-comment';
import FormQueriesHeader from '@/components/form/form-queries-header';
import FormQueriesCommentForm from '@/components/form/form-queries/form-queries-comment-form';
import ButtonCmp from '@/components/common/button';
import ConfirmationModal from '@/components/modals/confirmation-modal';

import { PI, CRA, DM } from '@/constants/authRoles';

export default {
  name: 'form-queries-query-details',
  components: {
    FormQueriesQueryComment,
    FormQueriesHeader,
    FormQueriesCommentForm,
    ConfirmationModal,
    ButtonCmp,
  },
  props: {
    query: Object,
    closed: Boolean,
  },
  data: () => ({
    replyQuery: null,
  }),
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check('userAccess');
    },
    shortQueryId() {
      if (this.query) {
        return this.query.queryId.slice(0, 5).toUpperCase();
      }
      return '';
    },
  },
  methods: {
    back() {
      this.$emit('back');
    },
    reply() {
      this.replyQuery = this.query.queryId;
    },
    reopen() {
      this.$refs.reopenConfirmation.show();
    },
    close() {
      this.$refs.closeConfirmation.show();
    },
    cancelComment() {
      this.replyQuery = null;
    },
    createComment({ comment }) {
      this.$emit('onQueryCommentCreate', {
        queryId: this.query.queryId,
        comment,
      });
      this.replyQuery = null;
    },
    closeConfirmed() {
      this.$emit('onQueryClosed', this.query);
    },
    reopenConfirmed() {
      this.$emit('onQueryReopened', this.query);
    },
  },
};
</script>

<style scoped>
.margin-from-top {
  margin-top: 20px;
}
</style>
