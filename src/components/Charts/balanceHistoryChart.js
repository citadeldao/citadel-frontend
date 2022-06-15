import { prettyNumber } from '@/helpers/prettyNumber';
import Chart from 'chart.js/auto';
import BigNumber from 'bignumber.js';

const maxTicksLimit = 12;
const defaultDayColor = '#000000';
const daysColorsDefault = Array(maxTicksLimit).fill(defaultDayColor);
const defaultMonthColor = '#AFBCCB';
const monthsColorsDefault = Array(maxTicksLimit).fill(defaultMonthColor);
const activeMonthColor = '#B7A8FF';
const balanceHistoryChart = {};

export const renderBalanceHistoryChart = (
  balanceHistory,
  currentTab,
  elementId
) => {
  if (!balanceHistory || !balanceHistory.list) {
    return;
  }

  if (balanceHistoryChart[elementId]) {
    balanceHistoryChart[elementId].destroy();
  }

  // eslint-disable-next-line no-unused-vars
  const getOrCreateBalanceHistoryTooltip = (chart) => {
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

  // Манипуляции с отображением дат
  const convertInDate = (date) => {
    const isDate = !isNaN(+new Date(date));

    return isDate
      ? new Date(date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })
      : date;
  };

  const days = Object.keys(balanceHistory.list);
  const labels = days.map(convertInDate);

  const createVisibleLabels = () => {
    const tickGap = Math.round(days.length / maxTicksLimit) || 1;
    const visibleLabels = [];

    for (let i = days.length - 1; i >= 0; i = i - tickGap) {
      visibleLabels.push(convertInDate(days[i]));
    }

    return visibleLabels;
  };

  const visibleLabels = createVisibleLabels();
  const renderDate = (index, key, value) => {
    return visibleLabels.includes(key) ? value : '';
  };

  // let lastLabelIndex = null
  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateBalanceHistoryTooltip(chart);
    // Подсветка текущей x-подписи
    // Индекс текущей подписи
    const monthTicks = chart.scales.xMonths.ticks;
    const currentPointIndex = tooltip.dataPoints[0].dataIndex;
    const currentLabelIndex = monthTicks.find(
      (tick) => tick.value === currentPointIndex
    )?.$context.index;

    // Установка цвета для подписей
    const monthsTicksConfig = chart.config._config.options.scales.xMonths.ticks;
    const updateChart = false;

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;

      if (monthsTicksConfig.color[currentLabelIndex] === activeMonthColor) {
        updateChart && chart.update();
      }

      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title;

      // title
      const tooltipHead = document.createElement('div');
      tooltipHead.appendChild(document.createTextNode('Balance:'));
      tooltipHead.classList.add('chart-tooltip__head');

      // date
      const tooltipDate = document.createElement('div');
      tooltipDate.classList.add('chart-tooltip__date');

      // amounts
      const usdDiv = document.createElement('div');
      usdDiv.classList.add('chart-tooltip__balance-usd');

      const btcDiv = document.createElement('div');
      btcDiv.classList.add('chart-tooltip__balance-btc');

      titleLines.forEach((title) => {
        const formattedDate = title.split('-').reverse().join('.');
        tooltipDate.appendChild(document.createTextNode(formattedDate));

        usdDiv.appendChild(
          document.createTextNode(prettyNumber(balanceHistory.list[title].usd))
        );
        const usdSign = document.createElement('span');
        usdSign.appendChild(document.createTextNode(' USD'));
        usdSign.classList.add('chart-tooltip__currency');
        usdDiv.appendChild(usdSign);

        btcDiv.appendChild(
          document.createTextNode(prettyNumber(balanceHistory.list[title].btc))
        );
        const btcSign = document.createElement('span');
        btcSign.appendChild(document.createTextNode(' BTC'));
        btcSign.classList.add('chart-tooltip__currency');
        btcDiv.appendChild(btcSign);
      });

      const tooltipBody = tooltipEl.querySelector('div');

      // Remove old children
      while (tooltipBody.firstChild) {
        tooltipBody.firstChild.remove();
      }

      // Add new children
      tooltipBody.appendChild(tooltipHead);
      tooltipBody.appendChild(tooltipDate);
      tooltipBody.appendChild(usdDiv);
      tooltipBody.appendChild(btcDiv);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    let verticalLine = document.querySelector(
      `#verticalLineBalance${elementId}`
    );

    if (!verticalLine) {
      verticalLine = document.createElement('span');
      verticalLine.id = `verticalLineBalance${elementId}`;
      tooltipEl.appendChild(verticalLine);
      verticalLine.classList.add('chart-tooltip__vertical-line');
    }

    const { top: canvasTop } = chart.canvas.getBoundingClientRect();
    const xAxePositionY =
      canvasTop + chart.chartArea.top + chart.chartArea.height;
    const pointPositionY = tooltip.caretY + canvasTop;
    verticalLine.style.height = `${xAxePositionY - pointPositionY + 27}px`;
    verticalLine.style.bottom = `-${xAxePositionY - pointPositionY + 33}px`;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
    tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
    tooltipEl.style.font = tooltip.options.bodyFont.string;

    // обновление графика и тултипа если необходимо
    updateChart && chart.update();
  };

  const data = {
    labels: Object.keys(balanceHistory.list),
    datasets: [
      {
        label: '',
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        borderColor: '#FF5722',
        data: Object.keys(balanceHistory.list).map(
          (key) => balanceHistory.list[key][currentTab?.toLowerCase()]
        ),
        fill: true,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointRadius: 0,
        hoverRadius: 9,
        pointHoverBorderWidth: 3,
      },
    ],
  };
  const config = {
    type: 'line',
    data,
    options: {
      maintainAspectRatio: false,
      scales: {
        xMonths: {
          grid: {
            color: 'transparent',
            tickLength: 21,
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            callback: (value, index) =>
              renderDate(index, labels[index], labels[index]?.split(' ')[1]),
            color: monthsColorsDefault,
            font: {
              lineHeight: 0.6,
              size: 14,
              weight: 'normal',
              family: "'Panton_Regular'",
            },
            backdropPadding: 100,
          },
        },
        xDays: {
          grid: {
            color: 'transparent',
            drawBorder: false,
          },
          ticks: {
            padding: 0,
            maxRotation: 0,
            autoSkip: false,
            callback: (value, index) =>
              renderDate(index, labels[index], labels[index]?.split(' ')[0]),
            color: daysColorsDefault,
            font: {
              lineHeight: 0.7,
              size: 14,
              family: 'Panton_Regular',
            },
          },
        },
        y: {
          grid: {
            borderColor: 'transparent',
            color: '#BCC2D8',
            borderDash: [3, 3],
            drawBorder: false,
            tickLength: 0,
          },
          ticks: {
            callback: function (index) {
              return BigNumber(index).toNumber();
            },
            color: '#AFBCCB',
            font: {
              lineHeight: 0.5,
              size: 14,
              family: 'Panton_Regular',
            },
            labelOffset: -10,
            z: 1,
            mirror: true,
            crossAlign: 'near',
          },
        },
      },
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipHandler,
        },
      },
      layout: {
        padding: {
          top: 20,
          bottom: 5,
        },
      },
    },
  };
  balanceHistoryChart[elementId] = new Chart(
    document.querySelector(`#${elementId}`),
    config
  );
};
