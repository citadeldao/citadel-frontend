import { prettyNumber, prettyNumberTooltip } from '@/helpers/prettyNumber';

const insertHtml = (el, args, tooltipStyle) => {
  const value = typeof args === 'object'
    ? args?.value
    : args;
  const currency = typeof args === 'object' && args?.currency;
  const currencyHtml = currency
    ? `<span class="pretty-number__currency">${currency}</span>`
    : '';

  el.innerHTML = `
    <span class="pretty-number">
      ${args?.noPretty ? value : prettyNumber(value)}
      <span
        class="pretty-number__tooltip"
        style="${tooltipStyle}"
      >
        ${args?.noPretty ? value : prettyNumberTooltip(value)}
        ${currencyHtml}
        </span>
    </span>
  `;

  el.style.fontFamily = 'inherit';

  const tooltip = el.querySelector('.pretty-number__tooltip');
  const setTooltipStyles = (tooltip, target) => {
    const { top, left, width, height } = target.getBoundingClientRect();
    let translateX = -10;
    let offsetX = 0;

    switch (true) {
      case el.getBoundingClientRect().left < 100:
        break;
      case (el.ownerDocument.activeElement.clientWidth - el.getBoundingClientRect().left) < 100:
        offsetX = width;
        translateX = -100;
        break;
      default:
        offsetX = width / 2;
        translateX = -50;
        break;
    }

    const tooltipStyle = {
      top: top + height,
      left: left + offsetX,
    };

    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    tooltip.style.top = `${tooltipStyle.top}px`;
    tooltip.style.left = `${tooltipStyle.left}px`;
    tooltip.style.transform = `translateX(${translateX}%)`;
  };

  // tooltip target events
  el.addEventListener('mouseover', () => {
    setTooltipStyles(tooltip, el);
  });

  el.addEventListener('mouseout', () => {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
  });

  // tooltip events
  tooltip.addEventListener('mouseover', () => {
    setTooltipStyles(tooltip, el);
  });

  tooltip.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
};

export default {
  mounted(el, binding) {
    insertHtml(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      insertHtml(el, binding.value);
    }
  },
};
