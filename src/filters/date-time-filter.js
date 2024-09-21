import moment from 'moment'

export function dateTimeFilter (value) {
  if (!value) {
    return ''
  }

  return moment.parseZone(value).format('YYYY-MMM-DD HH:mm:ss')
}
