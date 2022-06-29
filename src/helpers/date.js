import moment from 'moment';

export default function defaultDate(date) {
  return date ? moment(date).format('DD.MM.YYYY hh:mm') : '';
}
