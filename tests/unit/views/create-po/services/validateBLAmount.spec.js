import { assert } from 'chai'
import sinon from 'sinon'
import { validateBLAmount } from '@/views/create-po/services/validateBLAmount'
import * as globalMixin from '@/mixins/global-mixin'
import errors from '@/views/create-po/utils/errors'

describe('Validation BL amount', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('Success - comma thousand - float', async () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('25.68')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('25.68')

    const { error, amount } = validateBLAmount('12.56', ',', 2, '.')
    assert.isNull(error)
    assert.equal(amount, '25.68')
  })

  it('Success - comma thousand - is not float', async () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('2568')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('2,568.00')

    const { error, amount } = validateBLAmount('1256', ',', 2, '.')
    assert.isNull(error)
    assert.equal(amount, '2,568.00')
  })

  it('Success - dot thousand - float', async () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('25,68')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('25,68')

    const { error, amount } = validateBLAmount('12,5', '.', 1, ',')
    assert.isNull(error)
    assert.equal(amount, '25,68')
  })

  it('Success - dot thousand - is not float', async () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('2568')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('2.568')

    const { error, amount } = validateBLAmount('1256', '.', 1, ',')
    assert.isNull(error)
    assert.equal(amount, '2.568')
  })

  it('Error - Amount is empty', async () => {
    const { error, amount } = validateBLAmount('', '.', 1, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.Required)
    assert.equal(amount, '')
  })

  it('Error - Amount is zero', async () => {
    const { error, amount } = validateBLAmount(0, '.', 1, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '0,0')
  })

  it('Error - Amount is less zero', async () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('-1000.12')

    const { error, amount } = validateBLAmount(-1000.12, ',', 2, '.', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '-1,000.12')
  })

  it('Error - Amount string that leads to NaN', () => {
    const { error, amount } = validateBLAmount('aaa.aaa', ',', 2, '.', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.Required)
    assert.equal(amount, '')
  })

  it('Error - Amount is random string', () => {
    const { error, amount } = validateBLAmount('aaaasdasdasdaaa', ',', 2, '.', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.Required)
    assert.equal(amount, '')
  })

  it('Error - Amount is exceed max allowed bank amount', () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('200000.01')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('200.000,01')
    const { error, amount } = validateBLAmount('200000.01', ',', 2, '.', 100000, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.AmountExceedsPaymentLimit)
    assert.equal(amount, '200.000,01')
  })

  it('Thailand - Error - Amount is exceed max allowed bank amount', () => {
    sinon.stub(globalMixin.globalMixin.methods, 'numberUnFormatter').returns('10000000000.99')
    sinon.stub(globalMixin.globalMixin.methods, 'numberFormatter').returns('10,000,000,000.99')
    const { error, amount } = validateBLAmount('10000000000.99', ',', 2, '.', 9999999999.99, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.AmountExceedsPaymentLimit)
    assert.equal(amount, '10,000,000,000.99')
  })

  it('Error - Amount is 0', async () => {
    const { error, amount } = validateBLAmount(0, '.', 2, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '0,00')
  })

  it('Error - Amount is 0.0', async () => {
    const { error, amount } = validateBLAmount(0.0, '.', 2, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '0,00')
  })

  it('Error - Amount is 0.00', async () => {
    const { error, amount } = validateBLAmount(0.00, '.', 2, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '0,00')
  })

  it('Correct format amount is 345,456', async () => {
    const { amount } = validateBLAmount('345,456', '.', 2, ',', 0, errors)
    assert.equal(amount, '345,45')
  })

  it('Correct format amount is 123,3', async () => {
    const { amount } = validateBLAmount('123,3', '.', 2, ',', 0, errors)
    assert.equal(amount, '123,30')
  })

  it('Correct format amount is -0,1', async () => {
    const { error, amount } = validateBLAmount('-0,1', '.', 2, ',', 0, errors)
    assert.equal(error, errors.BL_AMOUNT_ERRORS.GreaterThan0)
    assert.equal(amount, '-0,10')
  })
})
