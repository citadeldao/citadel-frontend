import Chart from 'chart.js/auto';

import { balanceStructureTooltipHandler } from './Custom/tooltips';
import { htmlLegendPlugin } from './Custom/legend';

let balanceStructureChart = null;

export const renderBalanceStructChart = (
  balanceStructure,
  currentCurrency = 'usd'
) => {
  if (balanceStructureChart) {
    balanceStructureChart.destroy();
  }
  const LABELS = [];
  const BACKGROUND_COLOR = [];
  const PERCENTS = [];

  for (const key in balanceStructure.value) {
    // if (balanceStructure.value[key].percent > 2) {
    BACKGROUND_COLOR.push(balanceStructure.value[key].color);
    LABELS.push(balanceStructure.value[key].net);
    PERCENTS.push(balanceStructure.value[key].percent);
    // }
  }

  const data = {
    labels: LABELS,
    datasets: [
      {
        backgroundColor: BACKGROUND_COLOR,
        data: PERCENTS,
      },
    ],
  };

  htmlLegendPlugin.data = balanceStructure.value;
  htmlLegendPlugin.currency = currentCurrency;

  const config = {
    type: 'doughnut',
    data,
    options: {
      cutout: '42%',
      borderWidth: 0,
      plugins: {
        htmlLegend: {
          containerID: 'legend-container',
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: (context) =>
            balanceStructureTooltipHandler(context, balanceStructure),
        },
      },
    },
    plugins: [htmlLegendPlugin],
  };

  balanceStructureChart = new Chart(
    document.querySelector('#balanceStructureChart'),
    config
  );
};
