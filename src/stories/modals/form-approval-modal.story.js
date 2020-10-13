import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/vue';
import FormApprovalModal from '@/components/modals/form-approval-modal';
import ButtonCmp from '@/components/common/button';

const story = storiesOf('Modals', module);

story.addDecorator(withKnobs);

const approvalAction = action('approvalActionFunction');

story.add('Form Approval Modal', () => ({
  components: { FormApprovalModal, ButtonCmp },
  data() {
    const formId = text('Form ID', '111-222-333-444');
    const approved = boolean('Approved', false);
    return {
      formId,
      approved,
    };
  },
  computed: {
    sourcecode() {
      const approvedText = this.approved ? 'Unapprove' : 'Approve';

      return `
      <button-cmp @click="() => this.$refs.modal.show()" variant="primary">${approvedText}</button-cmp>
      <FormApprovalModal
        ref="modal"
        formId="${this.formId}"
        approved="${this.approved}"
        @confirmed="confirmedActionFunction"
      />
      `;
    },
  },
  methods: {
    openModal() {
      this.$refs.modal.show();
    },
    confirmed({ approved }) {
      this.approved = approved;
      approvalAction({ approved });
    },
  },
  template: `
    <b-container fluid>
      <br />
      <b-row>
        <b-col>
          <h4>Code</h4>
          <hr />
          <pre v-highlightjs="sourcecode"><code class="html"></code></pre>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h4>Example</h4>
          <hr />
          <button-cmp variant="primary" @click="openModal">
          {{ approved ? 'Unapprove' : 'Approve' }}
          </button-cmp>
          <FormApprovalModal @confirmed="confirmed" ref="modal" v-bind="$data" />
        </b-col>
      </b-row>
    </b-container>
  `,
}));
