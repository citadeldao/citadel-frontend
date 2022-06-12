<template>
  <div class="chart__content">
    <canvas id="rateChart" />
  </div>
  <teleport to="body">
    <ExChartTooltip
      :data="tooltipData"
      :date="tooltipDate"
      :opacity="tooltipOpacity"
      :left="tooltipLeft"
      :top="tooltipTop"
      :line-height="tooltipLineHeight"
    />
  </teleport>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import ExChartTooltip from './ExChartTooltip';
import Chart from 'chart.js/auto';
import { prettyNumber } from '@/helpers/prettyNumber';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';

export default {
  name: 'RateHistoryChart',
  components: { ExChartTooltip },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const lineColor = '#FF5722';
    const lineAreaColor = 'rgb(255,87,34, 0.19)';
    // const activeMonthColor = '#B7A8FF'
    // const activeDayColor = '#1A53F0'
    const currencyColor = '#AFBCCB';
    const defaultMonthColor = '#AFBCCB';
    const defaultDayColor = '#000000';

    onMounted(() => {
      createChart();
      parentWrap = document.body.querySelector('#expand-rate-chart-wrap');
      // скрыть тултип при скроле
      parentWrap.addEventListener('scroll', () => (tooltipOpacity.value = 0));
    });
    // число подписей и массив цветов для подсветки дат
    const { width } = useWindowSize();
    const wSize = computed(() => {
      if (width.value < screenWidths.lg) {
        return 'md';
      }

      if (width.value < screenWidths.xl) {
        return 'lg';
      }

      return 'xl';
    });
    const maxTicksLimit = computed(() => (wSize.value === 'xl' ? 11 : 8));
    const daysColorsDefault = computed(() =>
      Array(maxTicksLimit.value).fill(defaultDayColor),
    );
    const monthsColorsDefault = computed(() =>
      Array(maxTicksLimit.value).fill(defaultMonthColor),
    );

    let parentWrap;
    let rateChart = null;
    const tooltipData = ref(null);
    const tooltipDate = ref('');
    const tooltipOpacity = ref(0);
    const tooltipLeft = ref(0);
    const tooltipTop = ref(0);
    const tooltipLineHeight = ref(null);

    const createChart = () => {
      const ctx = document.getElementById('rateChart').getContext('2d');
      rateChart = new Chart(ctx, {
        type: 'line',
        data: chartData.value,
        options: chartConfig,
      });
    };

    const labels = computed(
      () =>
        props.data &&
        Object.keys(props.data), /* .map((date) =>
          new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })
        )*/
    );

    const chartData = computed(
      () =>
        props.data && {
          labels: labels.value,
          datasets: [
            {
              label: null,
              data: Object.values(props.data),
            },
          ],
        },
    );

    // let lastLabelIndex = null
    const externalTooltipHandler = (context) => {
      const { chart, tooltip } = context;
      // текущее значение цены и даты
      tooltipData.value = tooltip?.dataPoints[0]?.raw;
      tooltipDate.value = tooltip?.dataPoints[0]?.label.split('-').reverse().join('.');

      nextTick(() => {
        // позиция тултипа с учетом его размеров
        const tooltipEl = document.body.querySelector('#tooltip-history-chart');
        const tooltipLift = 25;
        const {
          left: canvasLeft,
          top: canvasTop,
        } = chart.canvas.getBoundingClientRect();
        const {
          width: tooltipWidth,
          height: tooltipHeight,
        } = tooltipEl.getBoundingClientRect();

        tooltipLeft.value = tooltip.caretX + canvasLeft - tooltipWidth / 2;
        tooltipTop.value =
          tooltip.caretY + canvasTop - tooltipHeight - tooltipLift;

        // высота линии тултипа, с учетом что часть графика может быть не видна из-за скрола
        const xAxePositionY =
          canvasTop + chart.chartArea.top + chart.chartArea.height;
        const { bottom: parentWrapBottom } = parentWrap.getBoundingClientRect();
        let hiddenAreaHeight = xAxePositionY - parentWrapBottom;

        if (hiddenAreaHeight < 0) {
          hiddenAreaHeight = 0;
        }

        const pointPositionY = tooltip.caretY + canvasTop;
        tooltipLineHeight.value =
          `${xAxePositionY - pointPositionY - hiddenAreaHeight}px`;

        // Подсветка текущей x-подписи
        // Индекс текущей подписи
        // const monthTicks = chart.scales.xMonths.ticks
        // const currentPointIndex = tooltip.dataPoints[0].dataIndex
        // const currentLabelIndex = monthTicks.find(
        //   (tick) => tick.value === currentPointIndex
        // )?.$context.index

        // Установка цвета для подписей
        // const monthsTicksConfig =
        //   chart.config._config.options.scales.xMonths.ticks
        // const daysTicksConfig = chart.config._config.options.scales.xDays.ticks
        const updateChart = false;
        // const setMonthColor = (color) => {
        //   if (monthsTicksConfig.color[currentLabelIndex] !== color) {
        //     let colors = [...monthsColorsDefault.value]
        //     colors[currentLabelIndex] = color
        //     monthsTicksConfig.color = colors
        //     updateChart = true
        //   }
        // }
        // const setDaysColor = (color) => {
        //   if (daysTicksConfig.color[currentLabelIndex] !== color) {
        //     let colors = [...daysColorsDefault.value]
        //     colors[currentLabelIndex] = color
        //     daysTicksConfig.color = colors
        //     updateChart = true
        //   }
        // }
        // mouseIn/mouseOut для точки с подписью
        // if (
        //   (currentLabelIndex || currentLabelIndex === 0) &&
        //   ((!lastLabelIndex && lastLabelIndex !== 0) ||
        //     (+tooltipEl.style.opacity === 0 && tooltip.opacity === 1))
        // ) {
        //   //mouseIn
        //   // setMonthColor(activeMonthColor)
        //   // setDaysColor(activeDayColor)
        // } else if (
        //   (lastLabelIndex || lastLabelIndex === 0) &&
        //   (lastLabelIndex !== currentLabelIndex ||
        //     (+tooltipEl.style.opacity === 1 && tooltip.opacity === 0))
        // ) {
        //   //mouseOut
        //   // setMonthColor(defaultMonthColor)
        //   // setDaysColor(defaultDayColor)
        // }
        // обновление графика и тултипа если необходимо
        // lastLabelIndex = currentLabelIndex
        tooltipOpacity.value = +tooltip.opacity;
        updateChart && chart.update();
      });
    };

    const convertInDate = (date) => {
      const isDate = !isNaN(+(new Date(date)));

      return isDate
        ? new Date(date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })
        : date;
    };

    const visibleLabels = computed(() => {
      const days = Object.keys(props.data);
      const tickGap = Math.round((days.length / maxTicksLimit.value)) || 1;
      const visibleLabels = [];

      for (let i = days.length - 1; i >= 0; i = i - tickGap) {
        visibleLabels.push(days[i]);
      }

      return visibleLabels;
    });

    const renderDate = (index, key, value) => visibleLabels.value.includes(key)
      ? value
      : '';

    const chartConfig = {
      fill: true,
      pointRadius: 10,
      pointBorderWidth: 0,
      pointBackgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: lineColor,
      backgroundColor: lineAreaColor,
      pointHoverRadius: 10,
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: 'white',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          // left: 70,
          top: 20,
          right: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler,
        },
      },
      scales: {
        xMonths: {
          grid: {
            color: 'transparent',
            tickLength: 21,
          },
          ticks: {
            maxTicksLimit: maxTicksLimit.value,
            maxRotation: 0,
            autoSkip: false,
            callback: (value, index) => renderDate(
              index,
              labels.value[index],
              convertInDate(labels.value[index])?.split(' ')[1],
            ),
            color: monthsColorsDefault.value,
            font: {
              lineHeight: 0.6,
              size: 14,
              weight: 'normal',
              family: '\'Panton_Regular\'',
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
            maxTicksLimit: maxTicksLimit.value,
            maxRotation: 0,
            autoSkip: false,

            callback: (value, index) => renderDate(
              index,
              labels.value[index],
              convertInDate(labels.value[index])?.split(' ')[0],
            ),
            color: daysColorsDefault.value,
            font: {
              lineHeight: 0.5,
              size: 14,
              family: 'Panton_Regular',
            },
          },
        },
        y: {
          grid: {
            borderDash: [3, 3],
            drawBorder: false,
            tickLength: 0,
          },
          ticks: {
            callback: (value) => `$ ${prettyNumber(value)}`,
            color: currencyColor,
            font: {
              lineHeight: 0.5,
              size: 14,
              family: 'Panton_Regular',
            },
            crossAlign: 'near',
            // padding: -65,
            mirror: true,
            labelOffset: -10,
            z: 1,
          },
        },
      },
    };

    watch(
      () => wSize.value,
      () => {
        rateChart.config._config.options.scales.xMonths.ticks.maxTicksLimit = maxTicksLimit.value;
        rateChart.config._config.options.scales.xDays.ticks.maxTicksLimit = maxTicksLimit.value;
        rateChart.update();
      },
    );

    watch(
      () => chartData.value,
      () => {
        rateChart.data = chartData.value;
        rateChart.update();
      },
    );

    return {
      tooltipData,
      tooltipDate,
      tooltipOpacity,
      tooltipLeft,
      tooltipTop,
      tooltipLineHeight,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart__content {
  position: relative;
  width: 898px;
  height: 365px;
  @include lg {
    height: 335px;
    width: 723px;
  }
  @include md {
    height: 335px;
    width: 723px;
  }
}

#rateChart {
}
</style>
