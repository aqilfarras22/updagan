<template>
  <b-form @submit.prevent="submit" class="component">
    <b-form-row>
      <b-form-group
        class="group"
        :invalid-feedback="errors.first('comment')"
        :state="veeFields.comment && (veeFields.comment.dirty || submited) ? !errors.has('comment') : null"
      >
        <b-form-textarea
          id="comment"
          name="comment"
          placeholder="Enter your comment"
          :rows="6"
          :state="veeFields.comment && (veeFields.comment.dirty || submited) ? !errors.has('comment') : null"
          v-model="comment"
          v-validate="'required'"
        ></b-form-textarea>
        <span class="note">Max allowed limit {{ limit }} chars</span>
      </b-form-group>
      <b-form-row>
        <b-col>
          <button-cmp type="submit" variant="primary">{{ saveBtnText }}</button-cmp>
          <button-cmp variant="outline-primary" @click="cancel" class="ml-2 cancelBtn">Cancel</button-cmp>
        </b-col>
      </b-form-row>
    </b-form-row>
  </b-form>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'form-queries-comment-form',
  components: {
    ButtonCmp,
  },
  props: {
    saveBtnText: {
      type: String,
      default: 'Create Query',
    },
  },
  data() {
    return {
      comment: '',
      limit: 500,
      submited: false,
    };
  },
  watch: {
    comment(val) {
      if (val && val.length > this.limit) {
        this.comment = val.slice(0, this.limit);
      }
    },
  },
  methods: {
    submit() {
      this.submited = true;
      return this.$validator.validateAll().then(valid => {
        if (valid) {
          this.$emit('submit', { comment: this.comment });
        } else {
          throw new Error('Invalid comment data');
        }
      });
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.component {
  padding: 20px;
}
.note {
  color: grey;
  font-size: 0.8rem;
}
.group {
  width: 100%;
}
</style>
