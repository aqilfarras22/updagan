import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(
      {
        // maintainAspectRatio: false,
        // responsive: false,
        labels: [''],
        datasets: [
          {
            label: '',
            backgroundColor: '#51dd75',
            data: [100],
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false },
    );
  },
};
