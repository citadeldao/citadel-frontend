import BigNumber from 'bignumber.js';

import { prettyNumber } from '@/helpers/prettyNumber';
import { getNetworkDataByKey } from '@/helpers/networkConfig';

const balanceHistoryTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add('chart-tooltip');

    const div = document.createElement('div');
    div.classList.add('chart-tooltip__wrapper');

    tooltipEl.appendChild(div);

    const triangle = document.createElement('span');
    triangle.classList.add('chart-tooltip__triangle');
    chart.canvas.parentNode.appendChild(tooltipEl);

    tooltipEl.appendChild(triangle);
  }

  return tooltipEl;
};

export const balanceHistoryTooltipHandler = (context, id, data, active) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = balanceHistoryTooltip(chart);

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

    if (monthsTicksConfig.color[currentLabelIndex] === active) {
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
        document.createTextNode(prettyNumber(data[title].usd))
      );
      const usdSign = document.createElement('span');
      usdSign.appendChild(document.createTextNode(' USD'));
      usdSign.classList.add('chart-tooltip__currency');
      usdDiv.appendChild(usdSign);

      btcDiv.appendChild(
        document.createTextNode(prettyNumber(data[title].btc))
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

  let verticalLine = document.querySelector(`#verticalLineBalance${id}`);

  if (!verticalLine) {
    verticalLine = document.createElement('span');
    verticalLine.id = `verticalLineBalance${id}`;
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

const getOrCreateRewardsChartTooltip = () => {
  let tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';

    const div = document.createElement('div');
    div.classList.add('chart-tooltip__wrapper');
    tooltipEl.appendChild(div);

    const triangle = document.createElement('span');
    triangle.classList.add('chart-tooltip__triangle');
    tooltipEl.appendChild(triangle);

    document.body.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export function rewardsTooltipHandler(context, data, labels, config) {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateRewardsChartTooltip();

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  tooltipEl.classList.remove('above', 'below', 'no-transform');

  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
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
      const { net } = labels[tooltip.dataPoints[0].datasetIndex];
      const isOthers = net === 'Others';

      const others = labels.find((n) => n.net === 'Others');
      const dayIndex = Object.keys(data).indexOf(title);

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
          usd: isOthers ? getTotalOf('usd', data[title]) : data[title][net][2],
          btc: isOthers
            ? getTotalOf('btc', data[title]).toFixed(8)
            : Number(data[title][net][1]).toFixed(8),
        };

        const exchangeRate = {
          currency: getNetworkDataByKey({
            config,
            network: net,
            key: 'code',
          }),
          usd: isOthers
            ? null
            : BigNumber(data[title][net][2])
                .dividedBy(data[title][net][0])
                .toNumber(),
          btc: isOthers
            ? null
            : BigNumber(data[title][net][1])
                .dividedBy(data[title][net][0])
                .toNumber(),
        };

        return {
          amount: isOthers ? others.data[dayIndex] : data[title][net][0],
          currency: getNetworkDataByKey({
            config,
            network: net,
            key: 'code',
          }),
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

  const position = chart.canvas.getBoundingClientRect();

  tooltipEl.style.opacity = 1;
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.zIndex = '9999';

  tooltipEl.style.left =
    position.left +
    window.pageXOffset +
    tooltip.caretX -
    tooltipEl.clientWidth / 2 +
    'px';

  tooltipEl.style.top =
    position.top +
    window.pageYOffset +
    tooltip.caretY -
    tooltipEl.clientHeight +
    'px';

  tooltipEl.style.pointerEvents = 'none';
}
