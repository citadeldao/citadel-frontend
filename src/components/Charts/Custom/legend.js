import { prettyNumber } from '@/helpers/prettyNumber';
import { shortNameCrypto } from '@/helpers';

const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexWrap = 'wrap';
    listContainer.style.flex = '1 45%';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  data: {},
  currency: 'usd',
  afterUpdate(chart, _, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    ul.classList.add('doughnut-chart-ul');
    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const currentCoin = this?.data[item.text];
      item.text = currentCoin?.name || item.text;
      item.percent = currentCoin?.percent;

      if (this.currency.toLowerCase() === 'usd') {
        item.price = `$ ${prettyNumber(currentCoin?.usd)}`;
      } else item.price = `${prettyNumber(currentCoin?.btc)} BTC`;

      const li = document.createElement('li');

      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.alignItems = 'flex-start';
      li.style.justifyContent = 'space-between';
      li.style.width = '100%';
      li.style.padding = '10px 0';
      li.style.border = '1px solid transparent';
      li.style.borderBottomColor = '#d1d8e0';
      li.style.marginBottom = '10px';
      li.style.opacity = item.hidden ? 0.5 : 1;

      li.onclick = () => {
        const { type } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');

      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.borderRadius = '50%';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.marginTop = '5px';
      boxSpan.style.marginRight = '15px';
      boxSpan.style.width = '15px';
      boxSpan.style.height = '15px';

      // Text
      const textContainer = document.createElement('div');
      textContainer.style.marginRight = 'auto';

      const displayText = document.createElement('p');
      const displayPrice = document.createElement('p');
      const displayPercent = document.createElement('p');

      displayText.style.color = item.fontColor;

      displayText.style.margin = 0;
      displayText.style.padding = 0;
      displayText.style.fontWeight = 700;
      displayText.style.fontFamily = 'Panton_SemiBold';
      displayText.style.textDecoration = item.hidden ? 'line-through' : '';

      displayPrice.style.margin = '5px 0 0';
      displayPrice.style.padding = 0;
      displayPrice.style.color = '#59779A';
      displayPrice.style.fontSize = '14px';
      displayPrice.style.fontFamily = 'Panton_SemiBold';
      displayPrice.style.textDecoration = item.hidden ? 'line-through' : '';

      displayPercent.style.margin = 0;
      displayPercent.style.padding = 0;
      displayPercent.style.color = '#6A4BFF';
      displayPercent.style.fontFamily = 'Panton_Bold';
      displayPercent.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(shortNameCrypto(item.text));

      const percentText = document.createTextNode(
        prettyNumber(item.percent) + '%'
      );

      const priceText = document.createTextNode(prettyNumber(item.price));

      displayText.appendChild(text);
      displayPercent.appendChild(percentText);
      displayPrice.appendChild(priceText);

      textContainer.appendChild(displayText);
      textContainer.appendChild(displayPrice);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      li.appendChild(displayPercent);

      li.onmouseover = () => {
        displayText.style.color = '#6A4BFF';
      };

      li.onmouseout = () => {
        displayText.style.color = '#000';
      };

      ul.appendChild(li);
    });

    if (ul.lastChild) {
      ul.lastChild.style.borderBottomColor = 'transparent';
      ul.lastChild.style.marginBottom = '0';
    }
  },
};
