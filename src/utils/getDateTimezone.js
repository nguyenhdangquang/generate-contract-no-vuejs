import momentTimezone from 'moment-timezone'
import moment from 'moment'
import { COUNTRY_TIMEZONE } from './constants'

export const getDateTimezone = (date, countryCode) => {
  const countryTimezone = COUNTRY_TIMEZONE[countryCode]
  const dateTimezone = momentTimezone(date).tz(countryTimezone.timezone).format()
  return `${moment.parseZone(dateTimezone).format('YYYY-MMM-DD HH:mm:ss')} (GMT+${countryTimezone.gmt})`
}
