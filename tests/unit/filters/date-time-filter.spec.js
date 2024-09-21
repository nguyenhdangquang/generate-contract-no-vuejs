import { assert } from 'chai'
import sinon from 'sinon'
import { dateTimeFilter } from '@/filters/date-time-filter.js'
import moment from 'moment'

describe('date-time-filter', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('param is invalid', async () => {
    assert.isEmpty(dateTimeFilter(null))
  })

  it('date time filter successfully', async () => {
    const parseZoneReturn = {
      format: (format) => {
        return '2021-11-11 00:00:00'
      }
    }
    const stubParseZone = sinon.stub(moment, 'parseZone').returns(parseZoneReturn)
    const spyFormat = sinon.spy(parseZoneReturn, 'format')
    dateTimeFilter('2021/11/11 00:00:00')
    sinon.assert.calledOnce(stubParseZone)
    sinon.assert.calledWith(stubParseZone, '2021/11/11 00:00:00')
    sinon.assert.calledOnce(spyFormat)
    sinon.assert.calledWith(spyFormat, 'YYYY-MMM-DD HH:mm:ss')
  })
})
