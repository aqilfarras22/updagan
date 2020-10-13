import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/vue';
import ConfirmationModal from '@/components/modals/confirmation-modal';
import ButtonCmp from '@/components/common/button';

const story = storiesOf('Modals', module);

story.addDecorator(withKnobs);

story.add('Confirmation Modal', () => ({
  components: { ConfirmationModal, ButtonCmp },
  data() {
    const title = text('Confirmation text', 'Are you confirm?');
    const yesBtnTxt = text('"Yes" button text', 'Yes');
    const noBtnTxt = text('"No" button text', 'No');

    const sourcecode = `
    <button-cmp @click="() => this.$refs.modal.show()" variant="primary">Open confirm modal</button-cmp>
    <ConfirmationModal
      ref="modal"
      @confirmed="confirmedActionFunction"
      text="${title}"
      yesBtnTxt="${yesBtnTxt}"
      noBtnTxt="${noBtnTxt}"
    />
    `;

    return {
      text: title,
      yesBtnTxt,
      noBtnTxt,
      sourcecode,
    };
  },
  methods: {
    openModal() {
      this.$refs.modal.show();
    },
    confirmed: action('confirmedActionFunction'),
  },
  template: `
    <b-container fluid>
      <br />
      <b-row>
        <b-col>
          <h4>Code</h4>
          <hr />
          <pre v-highlightjs>
            <code class="html">{{ sourcecode }}</code>
          </pre>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h4>Example</h4>
          <hr />
          <button-cmp variant="primary" @click="openModal">Open confirm modal</button-cmp>
          <ConfirmationModal @confirmed="confirmed" ref="modal" v-bind="$data" />
        </b-col>
      </b-row>
    </b-container>
  `,
}));
