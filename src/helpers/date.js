import moment from 'moment';

const MONTHS = [
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

export default function defaultDate(date) {
  return date ? moment(date).format('DD.MM.YYYY HH:mm:ss') : '';
}

export const getMonthName = (dateTime) => {
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

export const convertToLocalDate = (date) => {
  const isDate = !isNaN(+new Date(date));

  if (isDate) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  }

  return date;
};
