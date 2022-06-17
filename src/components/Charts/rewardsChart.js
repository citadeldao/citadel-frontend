import BigNumber from 'bignumber.js';
import { prettyNumber } from '@/helpers/prettyNumber';
import Chart from 'chart.js/auto';
import { chartColors } from './config';

const getDateStr = (dt) => {
  const days = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${dt.getDate()} ${days[dt.getMonth()]}`;
};

export const createDatasetForRewardsChart = (
  rewardsChart,
  currentTab,
  showCount = undefined
) => {
  if (!rewardsChart || !rewardsChart.list) {
    return [];
  }

  const datasets = {};
  const netSet = new Set();

  for (const key in rewardsChart.list) {
    for (const net in rewardsChart.list[key]) {
      netSet.add(net);
    }
  }

  const netArray = Array.from(netSet);

  for (const key in rewardsChart.list) {
    for (const index in netArray) {
      const net = netArray[index];

      if (!datasets[net]) {
        datasets[net] = {
          net: net,
          data: [],
          backgroundColor: chartColors[index],
          barThickness: 6,
          tooltip: { net },
          pointBackgroundColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointRadius: 0,
          hoverRadius: 9,
          pointHoverBorderWidth: 3,
        };
      }

      datasets[net].data.push(
        Object.keys(rewardsChart.list[key]).includes(net)
          ? rewardsChart.list[key][net][currentTab === 'USD' ? 2 : 1]
          : 0
      );
    }
  }

  const nets = Object.values(datasets).sort((a, b) => {
    return (
      a.data.reduce((acc, i) => acc + i, 0) -
      b.data.reduce((acc, i) => acc + i, 0)
    );
  });

  const visible = nets.slice(-showCount);
  const others = nets.slice(0, -showCount);
  let othersData = [];

  for (let i = 0; i < others.length; i++) {
    if (!othersData.length) {
      othersData = others[i].data;
    } else {
      others[i].data.forEach((dataItem, index) => {
        othersData[index] = BigNumber(othersData[index])
          .plus(dataItem)
          .toNumber();
      });
    }
  }

  return showCount
    ? [
        {
          net: 'Others',
          data: othersData,
          backgroundColor: chartColors[11],
          barThickness: 6,
          tooltip: { net: 'Others' },
          pointBackgroundColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointRadius: 0,
          hoverRadius: 9,
          pointHoverBorderWidth: 3,
          nets: others.map((n) => n.net),
        },
        ...visible,
      ]
    : visible;
};

const rewardsChartElement = {};
export const renderRewardsChart = (
  rewardsChart,
  datasetsArray,
  currentTab,
  elementId,
  currency
) => {
  if (!rewardsChart || !rewardsChart.list) {
    return;
  }

  if (rewardsChartElement[elementId]) {
    rewardsChartElement[elementId].destroy();
  }

  const labels = Object.keys(rewardsChart.list);
  const getOrCreateRewardsChartTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('chart-tooltip');

      const div = document.createElement('div');
      div.classList.add('chart-tooltip__wrapper');
      tooltipEl.appendChild(div);

      const triangle = document.createElement('span');
      triangle.classList.add('chart-tooltip__triangle');
      tooltipEl.appendChild(triangle);

      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  function externalTooltipHandler(context) {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateRewardsChartTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;

      return;
    }

    const circle = document.createElement('span');
    circle.classList.add('chart-tooltip__circle');
    circle.style.borderColor = `${tooltip.labelColors[0].backgroundColor}`;

    tooltipEl.appendChild(circle);

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title;

      // title
      const tooltipHead = document.createElement('div');
      tooltipHead.appendChild(document.createTextNode('Rewards:'));
      tooltipHead.classList.add(
        'chart-tooltip__head',
        'chart-tooltip__head--rewards'
      );

      const nativeDiv = document.createElement('div');
      nativeDiv.classList.add('chart-tooltip__balance-native');

      const usdDiv = document.createElement('div');
      usdDiv.classList.add('chart-tooltip__balance-usd');

      const btcDiv = document.createElement('div');
      btcDiv.classList.add(
        'chart-tooltip__balance-btc',
        'chart-tooltip__balance-btc--rewards'
      );

      const lineDiv = document.createElement('div');
      lineDiv.classList.add('chart-tooltip__horizontal-line');

      const tooltipSecondHead = document.createElement('div');
      tooltipSecondHead.appendChild(document.createTextNode('Exchange rate:'));
      tooltipSecondHead.classList.add(
        'chart-tooltip__head',
        'chart-tooltip__head--rewards'
      );

      const usdRate = document.createElement('div');
      usdRate.classList.add('chart-tooltip__rate');

      const btcRate = document.createElement('div');
      btcRate.classList.add('chart-tooltip__rate');

      titleLines.forEach((title) => {
        const { net } = datasetsArray[tooltip.dataPoints[0].datasetIndex];
        const isOthers = net === 'Others';
        const others = datasetsArray.find((n) => n.net === 'Others');
        const dayIndex = Object.keys(rewardsChart.list).indexOf(title);

        const getRewards = () => {
          const getTotalOf = (name, data) => {
            return Object.entries(data)
              .filter(([key]) => others.nets.includes(key))
              .reduce(
                (acc, [, values]) =>
                  BigNumber(acc)
                    .plus(values[name === 'usd' ? 2 : 1])
                    .toNumber(),
                0
              );
          };

          const total = {
            usd: isOthers
              ? getTotalOf('usd', rewardsChart.list[title])
              : rewardsChart.list[title][net][2],
            btc: isOthers
              ? getTotalOf('btc', rewardsChart.list[title]).toFixed(8)
              : Number(rewardsChart.list[title][net][1]).toFixed(8),
          };
          const exchangeRate = {
            currency: isOthers ? null : currency[net].code,
            usd: isOthers
              ? null
              : BigNumber(rewardsChart.list[title][net][2])
                  .dividedBy(rewardsChart.list[title][net][0])
                  .toNumber(),
            btc: isOthers
              ? null
              : BigNumber(rewardsChart.list[title][net][1])
                  .dividedBy(rewardsChart.list[title][net][0])
                  .toNumber(),
          };

          return {
            amount: isOthers
              ? others.data[dayIndex]
              : rewardsChart.list[title][net][0],
            currency: isOthers ? null : currency[net].code,
            total,
            exchangeRate,
          };
        };

        const rewards = getRewards();

        if (!isOthers) {
          nativeDiv.appendChild(
            document.createTextNode(prettyNumber(rewards.amount))
          );
          const nativeSign = document.createElement('span');
          nativeSign.appendChild(document.createTextNode(rewards.currency));
          nativeSign.classList.add('chart-tooltip__currency');
          nativeDiv.appendChild(nativeSign);
        }

        usdDiv.appendChild(
          document.createTextNode(prettyNumber(rewards.total.usd))
        );
        const usdSign = document.createElement('span');
        usdSign.appendChild(document.createTextNode('USD'));
        usdSign.classList.add('chart-tooltip__currency');
        usdDiv.appendChild(usdSign);

        btcDiv.appendChild(document.createTextNode(rewards.total.btc));
        const btcSign = document.createElement('span');
        btcSign.appendChild(document.createTextNode('BTC'));
        btcSign.classList.add('chart-tooltip__currency');
        btcDiv.appendChild(btcSign);

        if (!isOthers) {
          const nativeRateSign = document.createElement('span');
          nativeRateSign.innerHTML = `
            <span class="chart-tooltip__currency">${rewards.currency}</span>
          `;
          const usdRateSign = document.createElement('span');
          usdRateSign.innerHTML = `
            <span class="chart-tooltip__currency">USD</span>
          `;
          usdRate.appendChild(document.createTextNode('1'));
          usdRate.appendChild(nativeRateSign);
          usdRate.appendChild(document.createTextNode(' = '));
          usdRate.appendChild(
            document.createTextNode(prettyNumber(rewards.exchangeRate.usd))
          );
          usdRate.appendChild(usdRateSign);

          const nativeRateSign2 = document.createElement('span');
          nativeRateSign2.innerHTML = `
            <span class="chart-tooltip__currency">${rewards.currency}</span>
          `;
          const btcRateSign = document.createElement('span');
          btcRateSign.innerHTML = `
            <span class="chart-tooltip__currency">BTC</span>
          `;
          btcRate.appendChild(document.createTextNode('1'));
          btcRate.appendChild(nativeRateSign2);
          btcRate.appendChild(document.createTextNode(' = '));
          btcRate.appendChild(
            document.createTextNode(prettyNumber(rewards.exchangeRate.btc))
          );
          btcRate.appendChild(btcRateSign);
        }
      });

      const tooltipBody = tooltipEl.querySelector('div');

      // Remove old children
      while (tooltipBody.firstChild) {
        tooltipBody.firstChild.remove();
      }

      // Add new children
      tooltipBody.appendChild(tooltipHead);
      tooltipBody.appendChild(nativeDiv);
      tooltipBody.appendChild(usdDiv);
      tooltipBody.appendChild(btcDiv);

      if (usdRate.childNodes.length || btcRate.childNodes.length) {
        tooltipBody.appendChild(lineDiv);
        tooltipBody.appendChild(tooltipSecondHead);
        tooltipBody.appendChild(usdRate);
        tooltipBody.appendChild(btcRate);
      }
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
    // tooltipEl.style.top = positionY + (tooltip.caretY + ((340 - tooltip.caretY) * 0.3)) + 'px';
    tooltipEl.style.top = `${
      positionY +
      tooltip.caretY +
      40 +
      tooltip.dataPoints[0].element.height * 0.3
    }px`;
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  }

  const data = {
    labels,
    datasets: datasetsArray,
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'point',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler,
          position: 'nearest',
          yAlign: 'center',
          usePointStyle: true,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            color: 'transparent',
          },
          ticks: {
            color: '#AFBCCB',
            // eslint-disable-next-line no-unused-vars
            callback: function (index) {
              return getDateStr(
                new Date(Object.keys(rewardsChart.list)[index])
              );
            },
          },
        },
        y: {
          stacked: true,
          grid: {
            borderColor: 'transparent',
            color: '#BCC2D8',
            borderDash: [3, 3],
          },
          ticks: {
            color: '#AFBCCB',
            callback: function (index) {
              return prettyNumber(index);
            },
          },
        },
      },
    },
  };
  rewardsChartElement[elementId] = new Chart(
    document.querySelector(`#${elementId}`),
    config
  );
};
