import { storiesOf } from '@storybook/vue';
import { withKnobs, number, object, boolean } from '@storybook/addon-knobs/vue';
import DonutChart from '@/components/charts/donut-chart';

const story = storiesOf('Charts', module);

story.addDecorator(withKnobs);

story.add('Donut', () => ({
  components: { DonutChart },
  data() {
    const notResponsive = boolean('Not Responsive', true);
    const wh = number('Width/Height (px)', 250);
    const data1 = object('1st Item at "data" array', {
      value: 7,
      color: '#2E62A1',
    });
    const data2 = object('2nd Item at "data" array', {
      value: 13,
      color: '#5BB7CC',
    });

    const cols = number('Cols', 2);

    return {
      width: wh,
      height: wh,
      chartData: [data1, data2],
      notResponsive,
      cols,
    };
  },
  computed: {
    sourcecode() {
      const donutData = [
        JSON.stringify(this.chartData[0]).replace(/[""]/g, "'"),
        JSON.stringify(this.chartData[1]).replace(/[""]/g, "'"),
      ];
      if (!this.notResponsive) {
        return `
    <b-col cols="${this.cols}">
      <DonutChart :data="chartData" />
    </b-col>
        `;
      }
      return `
    <DonutChart
      :data="[${donutData}]"
      :width="${this.width}"
      :height="${this.height}"
      notResponsive
    />
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
      <b-col v-if="notResponsive" key="chart">
        <DonutChart
          :data="chartData"
          :width="Number(width)"
          :height="Number(height)"
          notResponsive
        />
      </b-col>
      <b-col :cols="cols" v-else key="chart">
        <DonutChart :data="chartData" />
      </b-col>
    </b-row>
  </b-container>
  `,
}));
