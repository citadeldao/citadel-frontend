import { prettyNumber } from '@/helpers/prettyNumber';
import Chart from 'chart.js/auto';

let balanceStructureChart = null;

export const renderBalanceStructChart = balanceStructure => {
  if (balanceStructureChart) {
    balanceStructureChart.destroy();
  }

  const data = {
    datasets: [{
      backgroundColor: Object.values(balanceStructure.value).map(c => c.color),
      data: Object.values(balanceStructure.value).map(c => c.percent > 2 ? c.percent : 2), // minimum 2% when displaying pie chart
    }],
    labels: Object.keys(balanceStructure.value),
  };
  const getOrCreateBalanceStructureTooltip = (chart) => {
    // tooltip root element
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('chart-tooltip', 'chart-tooltip--balanceStuct');

      const div = document.createElement('div');
      div.classList.add('chart-tooltip__wrapper');

      tooltipEl.appendChild(div);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };
  const externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateBalanceStructureTooltip(chart);

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;

      return;
    }

    if (tooltip.body) {
      const bodyLines = tooltip.body.map(b => b.lines);
      const tooltipDiv = document.createElement('div');
      tooltipDiv.classList.add('chart-tooltip__section');

      bodyLines.forEach(body => {
        // HERE BODY OF TOOLTIP <--------------------------------------------------------------------
        const tooltipTitle = document.createElement('div');
        tooltipTitle.classList.add('chart-tooltip__title');

        const tooltipLine1 = document.createElement('div');
        tooltipLine1.classList.add('chart-tooltip__balance-native', 'chart-tooltip__balance-native--balanceStruct');

        const tooltipLine1Code = document.createElement('span');
        tooltipLine1Code.classList.add('chart-tooltip__currency');

        const tooltipLine2 = document.createElement('div');
        tooltipLine2.classList.add('chart-tooltip__balance-usd', 'chart-tooltip__balance-usd--balanceStruct');

        const tooltipLine2Code = document.createElement('span');
        tooltipLine2Code.classList.add('chart-tooltip__currency');

        const tooltipLine3 = document.createElement('div');
        tooltipLine3.classList.add('chart-tooltip__balance-btc', 'chart-tooltip__balance-btc--balanceStruct');

        const tooltipLine3Code = document.createElement('span');
        tooltipLine3Code.classList.add('chart-tooltip__currency');

        const [net] = body[0].split(':');

        tooltipTitle.appendChild(document.createTextNode('Balance:'));

        // coin
        balanceStructure.value[net].balance && tooltipLine1Code.appendChild(document.createTextNode(` ${balanceStructure.value[net].code}`));
        balanceStructure.value[net].balance && tooltipLine1.appendChild(document.createTextNode(`${prettyNumber(balanceStructure.value[net].balance)}`));
        tooltipLine1.appendChild(tooltipLine1Code);

        // usd
        tooltipLine2Code.appendChild(document.createTextNode(` USD`)); // space is intentional
        tooltipLine2.appendChild(document.createTextNode(`${prettyNumber(balanceStructure.value[net].usd)}`));
        tooltipLine2.appendChild(tooltipLine2Code);

        // btc
        tooltipLine3Code.appendChild(document.createTextNode(` BTC`)); // space is intentional
        tooltipLine3.appendChild(document.createTextNode(`${prettyNumber(balanceStructure.value[net].btc)}`));
        tooltipLine3.appendChild(tooltipLine3Code);


        tooltipDiv.appendChild(tooltipTitle);
        tooltipDiv.appendChild(tooltipLine1);
        tooltipDiv.appendChild(tooltipLine2);

        if (balanceStructure.value[net].net !== 'btc') {
          tooltipDiv.appendChild(tooltipLine3);
        }
      });

      const rootDiv = tooltipEl.querySelector('div');

      while (rootDiv.firstChild) {
        rootDiv.firstChild.remove();
      }

      rootDiv.appendChild(tooltipDiv);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
    tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = `${tooltip.options.padding}px ${tooltip.options.padding}px`;
  };
  const config = {
    type: 'doughnut',
    data,
    options: {
      cutout: '42%',
      borderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler,
        },
      },
    },
  };
  balanceStructureChart = new Chart(
    document.querySelector('#balanceStructureChart'),
    config,
  );
};
