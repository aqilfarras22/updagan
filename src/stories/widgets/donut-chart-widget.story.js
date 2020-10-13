import { storiesOf } from '@storybook/vue';
import { withKnobs, text, object, color } from '@storybook/addon-knobs/vue';
import DonutChartWidget from '@/components/widgets/donut-chart-widget';

const story = storiesOf('Widgets/Charts', module);

story.addDecorator(withKnobs);

story.add('Donut Chart', () => ({
  components: { DonutChartWidget },
  data() {
    const title = text('Title', 'Test title');
    const titleColor = color('Title Color', '#2E62A1');
    const data1 = object('1st Item at "data" array', { value: 7, label: 'Open', color: '#2E62A1' });
    const data2 = object('2nd Item at "data" array', {
      value: 13,
      label: 'Closed',
      color: '#5BB7CC',
    });

    const sourcecode = `
    <b-row>
      <b-col cols="5">
        <DonutChartWidget
          :data="[${JSON.stringify(data1).replace(/[""]/g, '\'')}, ${JSON.stringify(data2).replace(/[""]/g, '\'')}]"
          :title="${title}"
          :titleColor="${titleColor}"
        />
      </b-col>
    </b-row>
    `;

    return {
      chartData: [data1, data2],
      title,
      titleColor,
      sourcecode,
    };
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
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="5">
          <DonutChartWidget
            :data="chartData"
            :title="title"
            :titleColor="titleColor"
          />
        </b-col>
      </b-row>
    </b-container>
  `,
}));
