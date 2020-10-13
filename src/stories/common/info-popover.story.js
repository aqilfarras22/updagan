import { storiesOf } from '@storybook/vue';
import { withKnobs, text } from '@storybook/addon-knobs/vue';
import InfoPopover from '@/components/common/info-popover';

const story = storiesOf('Common/Popover', module);

story.addDecorator(withKnobs);

story.add('Info', () => ({
  components: { InfoPopover },
  data() {
    return {
      info: text('Popover text', 'Lorem ipsum!!!'),
    };
  },
  computed: {
    sourcecode() {
      return `
    Hover on this: <InfoPopover :info="${this.info}" />
    Example with text element: <strong v-b-popover.hover="'Popover text'">hover me</strong>
      `;
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
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        Hover on this: <InfoPopover :info="info" /><br />
        Example with text element: <strong v-b-popover.hover="'Popover text'">hover me</strong>
      </b-col>
    </b-row>
  </b-container>
  `,
}));
