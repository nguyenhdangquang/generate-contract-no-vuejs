import sinon from 'sinon'
import * as createPoMappers from '@/views/create-po/mappers/create-po'
import { assert } from 'chai'

describe('toCreatePoData()', () => {
  it('should return correct data', () => {
    const convertAmountToNumberStub = sinon.stub().callsFake(function (numStr) {
      if (numStr === '30,000') {
        return 30000
      }

      if (numStr === '20,000') {
        return 20000
      }

      return 20000
    })
    const data = createPoMappers.toCreatePoData(
      {
        companyName: 'Company A',
        email: 'a@gmail.com',
        contactNumber: '11111111',
        areaCode: '+59',
        countryCode: 'SG',
        blList: [
          {
            number: 'abcd',
            currency: 'SGD',
            amount: '30,000',
            remark: 'Sample remark'
          },
          {
            number: '12345',
            currency: 'SGD',
            amount: '20,000',
            remark: 'Sample remark 1'
          }
        ]
      },
      {
        convertAmountToNumber: convertAmountToNumberStub
      }
    )

    assert.deepEqual(data, {
      companyName: 'Company A',
      emailAddress: 'a@gmail.com',
      contactNumber: '11111111',
      areaCode: '+59',
      countryCode: 'SG',
      blInvList: [
        {
          number: 'abcd',
          currency: 'SGD',
          amount: 30000,
          remark: 'Sample remark'
        },
        {
          number: '12345',
          currency: 'SGD',
          amount: 20000,
          remark: 'Sample remark 1'
        }
      ]
    })

    assert.isTrue(convertAmountToNumberStub.calledTwice)
  })

  it('should remove invalid bls', () => {
    const convertAmountToNumberStub = sinon.stub().callsFake(function (numStr) {
      if (numStr === '30,000') {
        return 30000
      }

      if (numStr === '20,000') {
        return 20000
      }

      return 20000
    })
    const data = createPoMappers.toCreatePoData(
      {
        companyName: 'Company A',
        email: 'a@gmail.com',
        contactNumber: '11111111',
        areaCode: '+59',
        countryCode: 'SG',
        blList: [
          {
            number: 'abcd',
            currency: 'SGD',
            amount: '30,000',
            remark: 'Sample remark'
          },
          {
            number: '12345',
            currency: 'SGD',
            amount: '20,000',
            remark: 'Sample remark 1'
          },
          {
            currency: 'SGD',
            amount: '20,000',
            remark: 'Sample remark 1'
          },
          {
            number: 'abcd',
            currency: 'SGD',
            remark: 'Sample remark'
          },
          {
            number: 'abcd',
            amount: '20,000',
            remark: 'Sample remark'
          }
        ]
      },
      {
        convertAmountToNumber: convertAmountToNumberStub
      }
    )

    assert.deepEqual(data, {
      companyName: 'Company A',
      emailAddress: 'a@gmail.com',
      contactNumber: '11111111',
      areaCode: '+59',
      countryCode: 'SG',
      blInvList: [
        {
          number: 'abcd',
          currency: 'SGD',
          amount: 30000,
          remark: 'Sample remark'
        },
        {
          number: '12345',
          currency: 'SGD',
          amount: 20000,
          remark: 'Sample remark 1'
        }
      ]
    })
  })
})
